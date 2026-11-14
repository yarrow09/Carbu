"""Commande d'export CSV d'un véhicule, téléchargé par le navigateur."""

from __future__ import annotations

import csv
import io
from typing import Any

from homeassistant.components.websocket_api.connection import ActiveConnection
from homeassistant.components.websocket_api.decorators import (
    async_response,
    websocket_command,
)
from homeassistant.core import HomeAssistant
import probatio as vol

from ..coordinator import VehicleLogCoordinator
from ..core.export import DELIMITER, build_export
from ..labels import async_category_labels
from .common import VEHICLE, command, guarded


@websocket_command({vol.Required("type"): command("export"), **VEHICLE})
@async_response
async def ws_export(
    hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]
) -> None:
    """Fichiers CSV d'un véhicule, à télécharger depuis le navigateur.

    Rien n'est écrit sur le disque du serveur : le contenu est renvoyé à
    l'utilisateur, qui voit déjà ces données dans les cartes.
    """
    labels = await async_category_labels(hass)
    guarded(_export)(hass, connection, {**msg, "labels": labels})


def _export(
    hass: HomeAssistant,
    connection: ActiveConnection,
    msg: dict[str, Any],
    coord: VehicleLogCoordinator,
) -> None:
    vehicle = coord.vehicle(msg["vehicle_id"])
    files = build_export(coord.storage.data, {vehicle.id: vehicle}, msg["labels"])
    files.pop("categories.csv", None)
    rows = {
        name: sum(1 for _ in csv.reader(io.StringIO(text), delimiter=DELIMITER)) - 1
        for name, text in files.items()
    }
    connection.send_result(msg["id"], {"files": files, "rows": rows})


COMMANDS = (ws_export,)
