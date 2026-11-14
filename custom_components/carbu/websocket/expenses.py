"""Commandes des dépenses : liste filtrée, enregistrement, suppression."""

from __future__ import annotations

import datetime as dt
from typing import Any

from homeassistant.components.websocket_api.connection import ActiveConnection
from homeassistant.components.websocket_api.decorators import websocket_command
from homeassistant.core import HomeAssistant
from homeassistant.helpers import config_validation as cv
import probatio as vol

from ..coordinator import VehicleLogCoordinator
from ..core.aggregation import filter_expenses
from ..core.presenter import VehicleUnits
from .common import LONG, PAGING, POSITIVE, VEHICLE, command, guarded


@websocket_command(
    {
        vol.Required("type"): command("expense/list"),
        **VEHICLE,
        vol.Optional("start"): cv.date,
        vol.Optional("end"): cv.date,
        vol.Optional("category_ids"): [str],
        vol.Optional("min_amount"): vol.Coerce(float),
        vol.Optional("max_amount"): vol.Coerce(float),
        **PAGING,
    }
)
@guarded
def ws_expense_list(
    hass: HomeAssistant,
    connection: ActiveConnection,
    msg: dict[str, Any],
    coord: VehicleLogCoordinator,
) -> None:
    """Dépenses filtrées (période ``[start, end]``, catégories, montant)."""
    vehicle_id = msg["vehicle_id"]
    units = VehicleUnits(coord.vehicle(vehicle_id))
    end: dt.date | None = msg.get("end")
    items = filter_expenses(
        coord.records(vehicle_id).expenses,
        start=msg.get("start"),
        end=end + dt.timedelta(days=1) if end else None,
        category_ids=set(msg["category_ids"]) if "category_ids" in msg else None,
        min_amount=msg.get("min_amount"),
        max_amount=msg.get("max_amount"),
    )
    items.reverse()
    page = items[msg["offset"] : msg["offset"] + msg["limit"]]
    connection.send_result(
        msg["id"],
        {
            "total": len(items),
            "sum": sum(e.amount for e in items),
            "items": [units.expense_view(e) for e in page],
        },
    )


@websocket_command(
    {
        vol.Required("type"): command("expense/save"),
        **VEHICLE,
        vol.Optional("expense_id"): str,
        vol.Optional("date"): cv.date,
        vol.Optional("odometer"): vol.Any(None, POSITIVE),
        vol.Required("amount"): POSITIVE,
        vol.Required("category_id"): str,
        vol.Optional("description", default=""): LONG,
    }
)
@guarded
def ws_expense_save(
    hass: HomeAssistant,
    connection: ActiveConnection,
    msg: dict[str, Any],
    coord: VehicleLogCoordinator,
) -> None:
    """Ajouter ou modifier une dépense."""
    vehicle_id = msg["vehicle_id"]
    expense = coord.async_save_expense(
        vehicle_id, msg, expense_id=msg.get("expense_id")
    )
    connection.send_result(msg["id"], coord.units(vehicle_id).expense_view(expense))


@websocket_command(
    {
        vol.Required("type"): command("expense/delete"),
        **VEHICLE,
        vol.Required("expense_id"): str,
    }
)
@guarded
def ws_expense_delete(
    hass: HomeAssistant,
    connection: ActiveConnection,
    msg: dict[str, Any],
    coord: VehicleLogCoordinator,
) -> None:
    """Supprimer une dépense."""
    coord.async_delete_expense(msg["vehicle_id"], msg["expense_id"])
    connection.send_result(msg["id"])


COMMANDS = (ws_expense_list, ws_expense_save, ws_expense_delete)
