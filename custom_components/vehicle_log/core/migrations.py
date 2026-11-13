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
    # Version 1.1 = version initiale : aucune migration à appliquer.
    return data
