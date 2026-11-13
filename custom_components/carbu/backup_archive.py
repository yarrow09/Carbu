"""Sauvegarde et restauration complètes (archive ZIP).

Les archives sont rangées dans ``<config>/carbu/backups/`` : elles sont
donc aussi incluses dans les sauvegardes de Home Assistant. Toutes les
lectures et écritures de fichiers ont lieu hors de la boucle d'événements.
"""

from __future__ import annotations

import json
from pathlib import Path, PurePosixPath
import re
import shutil
from types import MappingProxyType
from typing import TYPE_CHECKING, Any
import zipfile

from homeassistant.config_entries import ConfigSubentry
from homeassistant.core import HomeAssistant
from homeassistant.loader import async_get_integration

from .const import DOMAIN, STORAGE_MINOR_VERSION, STORAGE_VERSION, SUBENTRY_TYPE_VEHICLE
from .coordinator import local_now
from .core.backup import (
    ATTACHMENTS_DIR,
    BACKUP_JSON,
    BackupContent,
    InvalidBackupError,
    build_backup,
    parse_backup,
)

if TYPE_CHECKING:
    from . import VehicleLogConfigEntry

BACKUP_PREFIX = "carbu_backup_"
# Limite de sécurité à la lecture (archive malveillante très compressée).
MAX_UNCOMPRESSED = 1024 * 1024 * 1024
_ATTACHMENT_PATH = re.compile(
    rf"^{ATTACHMENTS_DIR}/[A-Za-z0-9_-]{{1,64}}/[A-Za-z0-9_-]{{1,64}}\.(jpg|png|webp|pdf)$"
)


def backup_dir(hass: HomeAssistant) -> Path:
    """Dossier des sauvegardes."""
    return Path(hass.config.path(DOMAIN, "backups"))


def list_backups(hass: HomeAssistant) -> list[str]:
    """Noms des archives disponibles, de la plus récente à la plus ancienne."""
    folder = backup_dir(hass)
    if not folder.is_dir():
        return []
    return sorted((p.name for p in folder.glob(f"{BACKUP_PREFIX}*.zip")), reverse=True)


async def async_create_backup(
    hass: HomeAssistant, entry: VehicleLogConfigEntry
) -> Path:
    """Créer une archive complète ; retourne son chemin."""
    runtime = entry.runtime_data
    integration = await async_get_integration(hass, DOMAIN)
    now = local_now()
    content = build_backup(
        vehicles={
            sub_id: (sub.title, dict(sub.data))
            for sub_id, sub in entry.subentries.items()
            if sub.subentry_type == SUBENTRY_TYPE_VEHICLE
        },
        options=dict(entry.options),
        data=runtime.storage.data,
        storage_version=(STORAGE_VERSION, STORAGE_MINOR_VERSION),
        created_at=now,
        integration_version=str(integration.version),
    )
    text = json.dumps(content, ensure_ascii=False, indent=1)
    attachments_root = runtime.coordinator.attachments.root
    vehicle_ids = set(runtime.vehicles)
    target = backup_dir(hass) / f"{BACKUP_PREFIX}{now.strftime('%Y%m%d-%H%M%S')}.zip"

    def _write() -> None:
        target.parent.mkdir(parents=True, exist_ok=True)
        tmp = target.with_suffix(".tmp")
        with zipfile.ZipFile(tmp, "w", compression=zipfile.ZIP_DEFLATED) as archive:
            archive.writestr(BACKUP_JSON, text)
            for vehicle_id in sorted(vehicle_ids):
                folder = attachments_root / vehicle_id
                if not folder.is_dir():
                    continue
                for file in sorted(folder.iterdir()):
                    if file.is_file():
                        archive.write(
                            file, f"{ATTACHMENTS_DIR}/{vehicle_id}/{file.name}"
                        )
        tmp.replace(target)

    await hass.async_add_executor_job(_write)
    return target


def _read(path: Path) -> tuple[Any, dict[str, bytes]]:
    try:
        with zipfile.ZipFile(path) as archive:
            infos = archive.infolist()
            if sum(info.file_size for info in infos) > MAX_UNCOMPRESSED:
                raise InvalidBackupError("too_large")
            names = {info.filename for info in infos}
            if BACKUP_JSON not in names:
                raise InvalidBackupError("not_a_backup")
            obj = json.loads(archive.read(BACKUP_JSON).decode("utf-8"))
            files = {
                name: archive.read(name)
                for name in names
                if _ATTACHMENT_PATH.match(name)
            }
    except (zipfile.BadZipFile, UnicodeDecodeError, json.JSONDecodeError) as err:
        raise InvalidBackupError("corrupted") from err
    return obj, files


async def async_read_backup(
    hass: HomeAssistant, path: Path
) -> tuple[BackupContent, dict[str, bytes]]:
    """Lire et valider une archive (sans rien modifier)."""
    obj, files = await hass.async_add_executor_job(_read, path)
    content = parse_backup(obj, sorted(files))
    kept = set(content.attachments)
    return content, {name: data for name, data in files.items() if name in kept}


async def async_restore_backup(
    hass: HomeAssistant,
    entry: VehicleLogConfigEntry,
    content: BackupContent,
    files: dict[str, bytes],
) -> None:
    """Remplacer toutes les données par celles de la sauvegarde.

    Les véhicules (subentries) sont recréés avec leurs identifiants d'origine,
    ce qui préserve le lien avec les données et les pièces jointes.
    """
    runtime = entry.runtime_data
    runtime.restoring = True  # pas de rechargement à chaque changement

    # 1. Données, écrites immédiatement sur disque.
    runtime.storage.data = content.data
    await runtime.storage.async_save()

    # 2. Pièces jointes.
    root = runtime.coordinator.attachments.root

    def _write_files() -> None:
        shutil.rmtree(root, ignore_errors=True)
        for name, data in files.items():
            target = root / PurePosixPath(name).relative_to(ATTACHMENTS_DIR)
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_bytes(data)

    await hass.async_add_executor_job(_write_files)

    # 3. Véhicules : ajout ou mise à jour, puis suppression des autres.
    wanted = {vehicle.id: vehicle for vehicle in content.vehicles}
    for vehicle in content.vehicles:
        current = entry.subentries.get(vehicle.id)
        if current is None:
            hass.config_entries.async_add_subentry(
                entry,
                ConfigSubentry(
                    data=MappingProxyType(vehicle.data),
                    subentry_id=vehicle.id,
                    subentry_type=SUBENTRY_TYPE_VEHICLE,
                    title=vehicle.title,
                    unique_id=None,
                ),
            )
        else:
            hass.config_entries.async_update_subentry(
                entry, current, data=vehicle.data, title=vehicle.title
            )
    for subentry_id, subentry in list(entry.subentries.items()):
        if (
            subentry.subentry_type == SUBENTRY_TYPE_VEHICLE
            and subentry_id not in wanted
        ):
            hass.config_entries.async_remove_subentry(entry, subentry_id)

    # 4. Options, puis un seul rechargement.
    hass.config_entries.async_update_entry(entry, options=content.options)
    await hass.config_entries.async_reload(entry.entry_id)
