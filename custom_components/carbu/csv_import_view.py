"""API d'import CSV utilisée par la carte journal.

``POST /api/carbu/import/{vehicle_id}`` (multipart, champ ``file``) :

* sans paramètre : aperçu, rien n'est modifié ;
* ``?apply=1`` : le même fichier est analysé à nouveau puis importé.

Le client renvoie le fichier pour l'application : aucun état n'est conservé
côté serveur entre l'aperçu et la confirmation.
"""

from __future__ import annotations

from http import HTTPStatus
from typing import TYPE_CHECKING, Any

from aiohttp import BodyPartReader, web
from homeassistant.helpers.http import KEY_HASS, HomeAssistantView

from .const import DOMAIN
from .core.csv_import import (
    ImportFileError,
    ImportKind,
    ImportPreview,
    LineStatus,
    apply_import,
    decode,
    preview_import,
)
from .core.presenter import VehicleUnits
from .labels import async_category_labels

if TYPE_CHECKING:
    from .coordinator import VehicleLogCoordinator

MAX_SIZE = 5 * 1024 * 1024
MAX_PREVIEW_LINES = 200


def _error(code: str, status: HTTPStatus = HTTPStatus.BAD_REQUEST) -> web.Response:
    return web.json_response({"code": code}, status=status)


def _line_view(kind: ImportKind, record: Any, units: VehicleUnits) -> dict[str, Any]:
    """Valeurs principales d'une ligne, dans les unités du véhicule."""
    if kind is ImportKind.FUEL:
        return units.fuel_entry_view(record)
    if kind is ImportKind.EXPENSES:
        return units.expense_view(record)
    if kind is ImportKind.ODOMETER:
        return {
            "date": record.date.isoformat(),
            "odometer": units.distance_out(record.odometer),
        }
    return {
        "label": record.label,
        "kind": record.kind.value,
        "due_date": record.due_date.isoformat() if record.due_date else None,
        "due_odometer": units.distance_out(record.due_odometer),
    }


def preview_view(preview: ImportPreview, units: VehicleUnits) -> dict[str, Any]:
    """Aperçu renvoyé à la carte (lignes limitées, erreurs en premier)."""
    ordered = sorted(
        preview.lines,
        key=lambda line: (
            {LineStatus.ERROR: 0, LineStatus.NEW: 1, LineStatus.DUPLICATE: 2}[
                line.status
            ],
            line.line,
        ),
    )
    return {
        "kind": preview.kind.value,
        "counts": {status.value: preview.count(status) for status in LineStatus},
        "new_categories": sorted(c.name or "" for c in preview.new_categories.values()),
        "lines": [
            {
                "line": line.line,
                "status": line.status.value,
                "message": line.message,
                "values": (
                    _line_view(preview.kind, line.record, units)
                    if line.record
                    else None
                ),
            }
            for line in ordered[:MAX_PREVIEW_LINES]
        ],
        "truncated": len(ordered) > MAX_PREVIEW_LINES,
    }


class CsvImportView(HomeAssistantView):
    """Aperçu et import d'un fichier CSV dans un véhicule."""

    url = "/api/carbu/import/{vehicle_id}"
    name = "api:carbu:import"

    async def post(self, request: web.Request, vehicle_id: str) -> web.Response:
        """Analyser (et éventuellement importer) le fichier envoyé."""
        hass = request.app[KEY_HASS]
        entries = hass.config_entries.async_loaded_entries(DOMAIN)
        if not entries:
            return _error("not_loaded", HTTPStatus.SERVICE_UNAVAILABLE)
        coordinator: VehicleLogCoordinator = entries[0].runtime_data.coordinator
        if vehicle_id not in coordinator.vehicles:
            return _error("not_found", HTTPStatus.NOT_FOUND)
        if not request.content_type.startswith("multipart/"):
            return _error("missing_file")

        raw: bytes | None = None
        reader = await request.multipart()
        while (part := await reader.next()) is not None:
            if isinstance(part, BodyPartReader) and part.name == "file":
                buffer = bytearray()
                while chunk := await part.read_chunk():
                    buffer.extend(chunk)
                    if len(buffer) > MAX_SIZE:
                        return _error("too_large", HTTPStatus.REQUEST_ENTITY_TOO_LARGE)
                raw = bytes(buffer)
                break
        if raw is None:
            return _error("missing_file")

        vehicle = coordinator.vehicle(vehicle_id)
        data = coordinator.storage.data
        try:
            preview = preview_import(
                decode(raw),
                coordinator.records(vehicle_id),
                data.categories,
                default_fuel=vehicle.fuel_type,
                category_labels=await async_category_labels(hass),
            )
        except ImportFileError as err:
            return _error(str(err))

        units = coordinator.units(vehicle_id)
        if request.query.get("apply") != "1":
            return self.json(preview_view(preview, units))
        added = apply_import(preview, data, vehicle_id)
        coordinator.async_commit()
        return self.json(
            {
                "added": added,
                "counts": {
                    status.value: preview.count(status) for status in LineStatus
                },
            }
        )
