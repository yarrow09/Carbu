"""Format de sauvegarde complète (Python pur).

Une sauvegarde est une archive ZIP contenant :

* ``backup.json`` : configuration des véhicules, options de l'intégration et
  toutes les données (format de stockage, versionné) ;
* ``attachments/<vehicle_id>/<fichier>`` : les pièces jointes.

Voir ``docs/format-sauvegarde.md``. Ce module ne manipule que le contenu de
``backup.json`` ; l'archive est lue et écrite par ``backup_archive.py``.
"""

from __future__ import annotations

from collections.abc import Mapping
from dataclasses import dataclass, field
import datetime as dt
from typing import Any

from .migrations import UnsupportedStorageVersionError, migrate
from .models import Vehicle
from .repository import LogData

BACKUP_FORMAT = "carbu_backup"
BACKUP_FORMAT_VERSION = 1
BACKUP_JSON = "backup.json"
ATTACHMENTS_DIR = "attachments"


class InvalidBackupError(ValueError):
    """Sauvegarde illisible ou incompatible."""


@dataclass(slots=True)
class BackupVehicle:
    """Véhicule sauvegardé (subentry Home Assistant)."""

    id: str
    title: str
    data: dict[str, Any]


@dataclass(slots=True)
class BackupContent:
    """Contenu validé d'une sauvegarde."""

    created_at: str
    integration_version: str
    vehicles: list[BackupVehicle]
    options: dict[str, Any]
    data: LogData
    attachments: list[str] = field(default_factory=list)


def build_backup(
    *,
    vehicles: Mapping[str, tuple[str, Mapping[str, Any]]],
    options: Mapping[str, Any],
    data: LogData,
    storage_version: tuple[int, int],
    created_at: dt.datetime,
    integration_version: str,
) -> dict[str, Any]:
    """Contenu de ``backup.json``.

    ``vehicles`` : ``{subentry_id: (titre, données du subentry)}``. Seules les
    données des véhicules existants sont incluses.
    """
    payload = data.to_dict()
    payload["vehicles"] = {
        vid: records for vid, records in payload["vehicles"].items() if vid in vehicles
    }
    return {
        "format": BACKUP_FORMAT,
        "format_version": BACKUP_FORMAT_VERSION,
        "created_at": created_at.isoformat(),
        "integration_version": integration_version,
        "storage_version": list(storage_version),
        "vehicles": [
            {"id": vid, "title": title, "data": dict(vehicle_data)}
            for vid, (title, vehicle_data) in vehicles.items()
        ],
        "options": dict(options),
        "data": payload,
    }


def parse_backup(obj: Any, attachments: list[str] | None = None) -> BackupContent:
    """Valider le contenu de ``backup.json`` (avec migration des données)."""
    if not isinstance(obj, dict) or obj.get("format") != BACKUP_FORMAT:
        raise InvalidBackupError("not_a_backup")
    if obj.get("format_version") != BACKUP_FORMAT_VERSION:
        raise InvalidBackupError("unsupported_version")
    try:
        major, minor = (int(v) for v in obj["storage_version"])
        raw_data = migrate(major, minor, obj["data"])
        data = LogData.from_dict(raw_data)
        vehicles = []
        for item in obj["vehicles"]:
            vehicle_id = str(item["id"])
            # Contrôle : la configuration doit être lisible.
            Vehicle.from_dict(vehicle_id, item["data"])
            vehicles.append(
                BackupVehicle(
                    id=vehicle_id, title=str(item["title"]), data=item["data"]
                )
            )
    except UnsupportedStorageVersionError as err:
        raise InvalidBackupError("unsupported_version") from err
    except (KeyError, TypeError, ValueError) as err:
        raise InvalidBackupError("corrupted") from err

    known = {v.id for v in vehicles}
    orphans = set(data.vehicles) - known
    for vehicle_id in orphans:
        data.remove_vehicle(vehicle_id)
    attached = [
        path
        for path in attachments or []
        if path.count("/") == 2 and path.split("/")[1] in known
    ]
    return BackupContent(
        created_at=str(obj.get("created_at", "")),
        integration_version=str(obj.get("integration_version", "")),
        vehicles=vehicles,
        options=dict(obj.get("options") or {}),
        data=data,
        attachments=attached,
    )


def summarize(content: BackupContent) -> dict[str, Any]:
    """Résumé affiché avant restauration."""
    vehicles = []
    for vehicle in content.vehicles:
        records = content.data.records(vehicle.id)
        vehicles.append(
            {
                "id": vehicle.id,
                "name": vehicle.title,
                "fuel": len(records.fuel),
                "expenses": len(records.expenses),
                "odometer": len(records.odometer),
                "reminders": len(records.reminders),
                "attachments": sum(
                    1 for p in content.attachments if p.split("/")[1] == vehicle.id
                ),
            }
        )
    return {
        "created_at": content.created_at,
        "integration_version": content.integration_version,
        "vehicles": vehicles,
        "categories": len(content.data.categories),
    }
