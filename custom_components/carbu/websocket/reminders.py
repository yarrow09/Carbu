"""Commandes des rappels : liste avec état, enregistrement, suppression, « fait »."""

from __future__ import annotations

from typing import Any

from homeassistant.components.websocket_api.connection import ActiveConnection
from homeassistant.components.websocket_api.decorators import websocket_command
from homeassistant.core import HomeAssistant
from homeassistant.helpers import config_validation as cv
import probatio as vol

from ..coordinator import VehicleLogCoordinator
from ..core.models import ReminderKind
from .common import POSITIVE, SHORT, VEHICLE, command, guarded

_OPT_POSITIVE_INT = vol.Any(None, vol.All(vol.Coerce(int), vol.Range(min=0)))


def _reminders_view(
    coord: VehicleLogCoordinator, vehicle_id: str
) -> list[dict[str, Any]]:
    units = coord.units(vehicle_id)
    return [
        units.reminder_view(r, coord.reminder_status(vehicle_id, r))
        for r in coord.records(vehicle_id).reminders
    ]


@websocket_command({vol.Required("type"): command("reminders"), **VEHICLE})
@guarded
def ws_reminders(
    hass: HomeAssistant,
    connection: ActiveConnection,
    msg: dict[str, Any],
    coord: VehicleLogCoordinator,
) -> None:
    """Rappels d'un véhicule avec leur état."""
    connection.send_result(msg["id"], _reminders_view(coord, msg["vehicle_id"]))


@websocket_command(
    {
        vol.Required("type"): command("reminder/save"),
        **VEHICLE,
        vol.Optional("reminder_id"): str,
        vol.Required("label"): SHORT,
        vol.Required("kind"): vol.In([k.value for k in ReminderKind]),
        vol.Optional("due_date"): vol.Any(None, cv.date),
        vol.Optional("due_odometer"): vol.Any(None, POSITIVE),
        vol.Optional("alert_days"): _OPT_POSITIVE_INT,
        vol.Optional("alert_distance"): vol.Any(None, POSITIVE),
        vol.Optional("interval_days"): _OPT_POSITIVE_INT,
        vol.Optional("interval_distance"): vol.Any(None, POSITIVE),
    }
)
@guarded
def ws_reminder_save(
    hass: HomeAssistant,
    connection: ActiveConnection,
    msg: dict[str, Any],
    coord: VehicleLogCoordinator,
) -> None:
    """Créer ou modifier un rappel."""
    vehicle_id = msg["vehicle_id"]
    reminder = coord.async_save_reminder(
        vehicle_id, msg, reminder_id=msg.get("reminder_id")
    )
    connection.send_result(
        msg["id"],
        coord.units(vehicle_id).reminder_view(
            reminder, coord.reminder_status(vehicle_id, reminder)
        ),
    )


@websocket_command(
    {
        vol.Required("type"): command("reminder/delete"),
        **VEHICLE,
        vol.Required("reminder_id"): str,
    }
)
@guarded
def ws_reminder_delete(
    hass: HomeAssistant,
    connection: ActiveConnection,
    msg: dict[str, Any],
    coord: VehicleLogCoordinator,
) -> None:
    """Supprimer un rappel."""
    coord.async_delete_reminder(msg["vehicle_id"], msg["reminder_id"])
    connection.send_result(msg["id"])


@websocket_command(
    {
        vol.Required("type"): command("reminder/done"),
        **VEHICLE,
        vol.Required("reminder_id"): str,
        vol.Optional("date"): cv.date,
        vol.Optional("odometer"): POSITIVE,
    }
)
@guarded
def ws_reminder_done(
    hass: HomeAssistant,
    connection: ActiveConnection,
    msg: dict[str, Any],
    coord: VehicleLogCoordinator,
) -> None:
    """Marquer un rappel comme fait (échéance suivante si récurrent)."""
    vehicle_id = msg["vehicle_id"]
    reminder = coord.async_mark_reminder_done(
        vehicle_id, msg["reminder_id"], msg.get("date"), msg.get("odometer")
    )
    connection.send_result(
        msg["id"],
        coord.units(vehicle_id).reminder_view(
            reminder, coord.reminder_status(vehicle_id, reminder)
        ),
    )


COMMANDS = (ws_reminders, ws_reminder_save, ws_reminder_delete, ws_reminder_done)
