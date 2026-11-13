"""Migrations du format de stockage (Python pur).

Chaque évolution de schéma incrémente :

* la version mineure si l'ancien code peut encore lire les données
  (ajout d'un champ facultatif) ;
* la version majeure sinon.

Ajouter ici une étape par version, de la plus ancienne à la plus récente.
"""

from __future__ import annotations

from typing import Any


class UnsupportedStorageVersionError(Exception):
    """Version de stockage inconnue."""


def migrate(old_major: int, old_minor: int, data: dict[str, Any]) -> dict[str, Any]:
    """Migrer ``data`` depuis (old_major, old_minor) vers la version courante."""
    if old_major != 1:
        raise UnsupportedStorageVersionError(f"{old_major}.{old_minor}")
    if old_minor < 2:
        data = _to_1_2(data)
    return data


def _to_1_2(data: dict[str, Any]) -> dict[str, Any]:
    """1.1 → 1.2 : récurrence et suivi des notifications des rappels."""
    defaults: dict[str, Any] = {
        "interval_days": None,
        "interval_distance": None,
        "active": True,
        "last_done_date": None,
        "last_done_odometer": None,
        "notified": [],
    }
    for records in data.get("vehicles", {}).values():
        records["reminders"] = [
            {**defaults, **reminder} for reminder in records.get("reminders", [])
        ]
    return data
