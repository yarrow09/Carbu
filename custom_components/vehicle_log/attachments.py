"""Pièces jointes des dépenses (fichiers locaux).

Fichiers : ``<config>/vehicle_log/attachments/<vehicle_id>/<expense_id>.<ext>``.
Vue HTTP authentifiée :

* ``POST   /api/vehicle_log/attachment/{vehicle_id}/{expense_id}`` (multipart,
  champ ``file``) : ajoute ou remplace la pièce jointe ;
* ``GET``  : télécharge (utiliser un chemin signé ``auth/sign_path`` côté carte) ;
* ``DELETE`` : supprime.
"""

from __future__ import annotations

from http import HTTPStatus
from pathlib import Path
import re
import shutil
from typing import TYPE_CHECKING, Any

from aiohttp import BodyPartReader, web
from homeassistant.core import HomeAssistant
from homeassistant.helpers.http import KEY_HASS, HomeAssistantView

from .const import DOMAIN

if TYPE_CHECKING:
    from .coordinator import VehicleLogCoordinator

MAX_SIZE = 10 * 1024 * 1024
_SAFE_ID = re.compile(r"^[A-Za-z0-9_-]{1,64}$")

# Type MIME → (extension, signature des premiers octets)
ALLOWED_TYPES: dict[str, tuple[str, tuple[bytes, ...]]] = {
    "image/jpeg": (".jpg", (b"\xff\xd8\xff",)),
    "image/png": (".png", (b"\x89PNG\r\n\x1a\n",)),
    "image/webp": (".webp", (b"RIFF",)),
    "application/pdf": (".pdf", (b"%PDF",)),
}
CONTENT_TYPES = {ext: mime for mime, (ext, _sig) in ALLOWED_TYPES.items()}


class AttachmentError(ValueError):
    """Fichier refusé."""


def detect_type(content: bytes) -> str | None:
    """Type MIME déduit du contenu (et non du nom ou de l'en-tête)."""
    for mime, (_ext, signatures) in ALLOWED_TYPES.items():
        if any(content.startswith(sig) for sig in signatures):
            if mime == "image/webp" and content[8:12] != b"WEBP":
                continue
            return mime
    return None


class AttachmentStore:
    """Lecture / écriture des fichiers (toujours hors de la boucle d'événements)."""

    def __init__(self, hass: HomeAssistant) -> None:
        """Initialiser."""
        self.hass = hass
        self.root = Path(hass.config.path(DOMAIN, "attachments"))

    def path(self, vehicle_id: str, filename: str) -> Path:
        """Chemin d'un fichier, après contrôle des identifiants."""
        stem, _, ext = filename.partition(".")
        if not _SAFE_ID.match(vehicle_id) or not _SAFE_ID.match(stem):
            raise AttachmentError("invalid_id")
        if f".{ext}" not in CONTENT_TYPES:
            raise AttachmentError("invalid_type")
        return self.root / vehicle_id / filename

    async def async_save(self, vehicle_id: str, expense_id: str, content: bytes) -> str:
        """Enregistrer un fichier ; retourne son nom."""
        if not content:
            raise AttachmentError("empty")
        if len(content) > MAX_SIZE:
            raise AttachmentError("too_large")
        mime = detect_type(content)
        if mime is None:
            raise AttachmentError("invalid_type")
        filename = f"{expense_id}{ALLOWED_TYPES[mime][0]}"
        target = self.path(vehicle_id, filename)

        def _write() -> None:
            target.parent.mkdir(parents=True, exist_ok=True)
            for old in target.parent.glob(f"{expense_id}.*"):
                old.unlink(missing_ok=True)
            target.write_bytes(content)

        await self.hass.async_add_executor_job(_write)
        return filename

    async def async_delete(self, vehicle_id: str, filename: str) -> None:
        """Supprimer un fichier (sans erreur s'il n'existe plus)."""
        target = self.path(vehicle_id, filename)
        await self.hass.async_add_executor_job(target.unlink, True)

    async def async_delete_vehicle(self, vehicle_id: str) -> None:
        """Supprimer toutes les pièces jointes d'un véhicule."""
        if not _SAFE_ID.match(vehicle_id):
            raise AttachmentError("invalid_id")
        await self.hass.async_add_executor_job(
            shutil.rmtree, self.root / vehicle_id, True
        )

    async def async_delete_all(self) -> None:
        """Supprimer le dossier des pièces jointes."""
        await self.hass.async_add_executor_job(shutil.rmtree, self.root.parent, True)


def _coordinator(hass: HomeAssistant) -> VehicleLogCoordinator | None:
    entries = hass.config_entries.async_loaded_entries(DOMAIN)
    if not entries:
        return None
    coordinator: VehicleLogCoordinator = entries[0].runtime_data.coordinator
    return coordinator


def _error(code: str, status: HTTPStatus) -> web.Response:
    return web.json_response({"code": code}, status=status)


class AttachmentView(HomeAssistantView):
    """Envoi, téléchargement et suppression d'une pièce jointe."""

    url = "/api/vehicle_log/attachment/{vehicle_id}/{expense_id}"
    name = "api:vehicle_log:attachment"

    def _resolve(
        self, request: web.Request, vehicle_id: str, expense_id: str
    ) -> tuple[VehicleLogCoordinator, Any] | web.Response:
        hass = request.app[KEY_HASS]
        if (coordinator := _coordinator(hass)) is None:
            return _error("not_loaded", HTTPStatus.SERVICE_UNAVAILABLE)
        if vehicle_id not in coordinator.vehicles:
            return _error("not_found", HTTPStatus.NOT_FOUND)
        expenses = coordinator.records(vehicle_id).expenses
        try:
            expense = expenses.get(expense_id)
        except LookupError:
            return _error("not_found", HTTPStatus.NOT_FOUND)
        return coordinator, expense

    async def post(
        self, request: web.Request, vehicle_id: str, expense_id: str
    ) -> web.Response:
        """Ajouter ou remplacer la pièce jointe."""
        resolved = self._resolve(request, vehicle_id, expense_id)
        if isinstance(resolved, web.Response):
            return resolved
        coordinator, expense = resolved

        if not request.content_type.startswith("multipart/"):
            return _error("missing_file", HTTPStatus.BAD_REQUEST)
        reader = await request.multipart()
        content: bytes | None = None
        while (part := await reader.next()) is not None:
            if isinstance(part, BodyPartReader) and part.name == "file":
                buffer = bytearray()
                while chunk := await part.read_chunk():
                    buffer.extend(chunk)
                    if len(buffer) > MAX_SIZE:
                        return _error("too_large", HTTPStatus.REQUEST_ENTITY_TOO_LARGE)
                content = bytes(buffer)
                break
        if content is None:
            return _error("missing_file", HTTPStatus.BAD_REQUEST)
        try:
            filename = await coordinator.attachments.async_save(
                vehicle_id, expense_id, content
            )
        except AttachmentError as err:
            status = (
                HTTPStatus.REQUEST_ENTITY_TOO_LARGE
                if str(err) == "too_large"
                else HTTPStatus.BAD_REQUEST
            )
            return _error(str(err), status)
        expense.attachment = filename
        coordinator.async_commit()
        return self.json({"attachment": filename})

    async def get(
        self, request: web.Request, vehicle_id: str, expense_id: str
    ) -> web.StreamResponse:
        """Télécharger la pièce jointe."""
        resolved = self._resolve(request, vehicle_id, expense_id)
        if isinstance(resolved, web.Response):
            return resolved
        coordinator, expense = resolved
        if not expense.attachment:
            return _error("not_found", HTTPStatus.NOT_FOUND)
        path = coordinator.attachments.path(vehicle_id, expense.attachment)
        hass = request.app[KEY_HASS]
        if not await hass.async_add_executor_job(path.is_file):
            return _error("not_found", HTTPStatus.NOT_FOUND)
        return web.FileResponse(
            path,
            headers={
                "Content-Type": CONTENT_TYPES[path.suffix],
                "Content-Disposition": f'inline; filename="{path.name}"',
                "X-Content-Type-Options": "nosniff",
            },
        )

    async def delete(
        self, request: web.Request, vehicle_id: str, expense_id: str
    ) -> web.Response:
        """Supprimer la pièce jointe."""
        resolved = self._resolve(request, vehicle_id, expense_id)
        if isinstance(resolved, web.Response):
            return resolved
        coordinator, expense = resolved
        if expense.attachment:
            await coordinator.attachments.async_delete(vehicle_id, expense.attachment)
            expense.attachment = None
            coordinator.async_commit()
        return self.json({"attachment": None})
