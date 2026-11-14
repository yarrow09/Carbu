"""Commandes des dépenses récurrentes : liste, enregistrement, suppression."""

from __future__ import annotations

from typing import Any

from homeassistant.components.websocket_api.connection import ActiveConnection
from homeassistant.components.websocket_api.decorators import websocket_command
from homeassistant.core import HomeAssistant
from homeassistant.helpers import config_validation as cv
import probatio as vol

from ..coordinator import VehicleLogCoordinator
from ..core.models import RECURRING_INTERVALS
from ..core.presenter import VehicleUnits
from .common import POSITIVE, SHORT, VEHICLE, command, guarded


@websocket_command({vol.Required("type"): command("recurring"), **VEHICLE})
@guarded
def ws_recurring_list(
    hass: HomeAssistant,
    connection: ActiveConnection,
    msg: dict[str, Any],
    coord: VehicleLogCoordinator,
) -> None:
    """Dépenses récurrentes d'un véhicule, avec leur prochaine échéance."""
    coord.vehicle(msg["vehicle_id"])
    connection.send_result(
        msg["id"],
        [
            VehicleUnits.recurring_view(item)
            for item in coord.records(msg["vehicle_id"]).recurring
        ],
    )


@websocket_command(
    {
        vol.Required("type"): command("recurring/save"),
        **VEHICLE,
        vol.Optional("recurring_id"): str,
        vol.Required("label"): SHORT,
        vol.Required("amount"): POSITIVE,
        vol.Required("category_id"): str,
        vol.Optional("interval_months", default=1): vol.In(RECURRING_INTERVALS),
        vol.Optional("start_date"): cv.date,
        vol.Optional("end_date"): vol.Any(None, cv.date),
        vol.Optional("active", default=True): bool,
    }
)
@guarded
def ws_recurring_save(
    hass: HomeAssistant,
    connection: ActiveConnection,
    msg: dict[str, Any],
    coord: VehicleLogCoordinator,
) -> None:
    """Créer ou modifier une dépense récurrente."""
    item = coord.async_save_recurring(msg["vehicle_id"], msg, msg.get("recurring_id"))
    connection.send_result(msg["id"], VehicleUnits.recurring_view(item))


@websocket_command(
    {
        vol.Required("type"): command("recurring/delete"),
        **VEHICLE,
        vol.Required("recurring_id"): str,
    }
)
@guarded
def ws_recurring_delete(
    hass: HomeAssistant,
    connection: ActiveConnection,
    msg: dict[str, Any],
    coord: VehicleLogCoordinator,
) -> None:
    """Supprimer une dépense récurrente."""
    coord.async_delete_recurring(msg["vehicle_id"], msg["recurring_id"])
    connection.send_result(msg["id"])


COMMANDS = (ws_recurring_list, ws_recurring_save, ws_recurring_delete)
