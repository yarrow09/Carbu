"""Commandes des pleins : valeurs par défaut, liste, enregistrement, suppression."""

from __future__ import annotations

import datetime as dt
from typing import Any

from homeassistant.components.websocket_api.connection import ActiveConnection
from homeassistant.components.websocket_api.decorators import websocket_command
from homeassistant.core import HomeAssistant
from homeassistant.helpers import config_validation as cv
import probatio as vol

from ..coordinator import VehicleLogCoordinator, local_now
from ..core.consumption import fill_metrics
from ..core.models import FuelGrade, FuelType
from ..core.presenter import VehicleUnits
from .common import LONG, PAGING, POSITIVE, SHORT, VEHICLE, command, guarded


@websocket_command({vol.Required("type"): command("fuel/defaults"), **VEHICLE})
@guarded
def ws_fuel_defaults(
    hass: HomeAssistant,
    connection: ActiveConnection,
    msg: dict[str, Any],
    coord: VehicleLogCoordinator,
) -> None:
    """Valeurs pré-remplies du formulaire de plein."""
    vehicle_id = msg["vehicle_id"]
    vehicle = coord.vehicle(vehicle_id)
    units = VehicleUnits(vehicle)
    readings = coord.readings(vehicle_id)
    fuel = coord.records(vehicle_id).fuel.items
    last = fuel[-1] if fuel else None
    fuel_type = last.fuel_type if last else vehicle.fuel_type
    now = local_now()
    connection.send_result(
        msg["id"],
        {
            "date": now.date().isoformat(),
            "time": now.time().isoformat(timespec="minutes"),
            "odometer": units.distance_out(readings[-1].odometer) if readings else None,
            "fuel_type": fuel_type.value,
            # Dernière qualité d'essence utilisée, proposée par défaut.
            "grade": next(
                (e.grade.value for e in reversed(fuel) if e.grade is not None), None
            ),
            "unit_price": {
                f.value: next(
                    (
                        units.unit_price_out(e.unit_price, f)
                        for e in reversed(fuel)
                        if e.fuel_type is f
                    ),
                    None,
                )
                for f in vehicle.fuel_types
            },
        },
    )


@websocket_command(
    {
        vol.Required("type"): command("fuel/list"),
        **VEHICLE,
        vol.Optional("start"): cv.date,
        vol.Optional("end"): cv.date,
        **PAGING,
    }
)
@guarded
def ws_fuel_list(
    hass: HomeAssistant,
    connection: ActiveConnection,
    msg: dict[str, Any],
    coord: VehicleLogCoordinator,
) -> None:
    """Pleins, du plus récent au plus ancien, filtrés par période ``[start, end]``."""
    vehicle_id = msg["vehicle_id"]
    units = VehicleUnits(coord.vehicle(vehicle_id))
    start: dt.date | None = msg.get("start")
    end: dt.date | None = msg.get("end")
    all_fuel = coord.records(vehicle_id).fuel.items
    metrics = fill_metrics(all_fuel)
    items = [
        e
        for e in reversed(all_fuel)
        if (start is None or e.date >= start) and (end is None or e.date <= end)
    ]
    page = items[msg["offset"] : msg["offset"] + msg["limit"]]
    connection.send_result(
        msg["id"],
        {
            "total": len(items),
            "items": [units.fuel_entry_view(e, metrics.get(e.id)) for e in page],
        },
    )


@websocket_command(
    {
        vol.Required("type"): command("fuel/save"),
        **VEHICLE,
        vol.Optional("entry_id"): str,
        vol.Optional("date"): cv.date,
        vol.Optional("time"): vol.Any(None, cv.time),
        vol.Required("odometer"): POSITIVE,
        vol.Optional("volume"): vol.Any(None, POSITIVE),
        vol.Optional("unit_price"): vol.Any(None, POSITIVE),
        vol.Optional("total_cost"): vol.Any(None, POSITIVE),
        vol.Optional("fuel_type"): vol.In([f.value for f in FuelType]),
        vol.Optional("grade"): vol.Any(None, vol.In([g.value for g in FuelGrade])),
        vol.Optional("full_tank", default=True): bool,
        vol.Optional("station"): vol.Any(None, SHORT),
        vol.Optional("notes", default=""): LONG,
        vol.Optional("confirm", default=False): bool,
    }
)
@guarded
def ws_fuel_save(
    hass: HomeAssistant,
    connection: ActiveConnection,
    msg: dict[str, Any],
    coord: VehicleLogCoordinator,
) -> None:
    """Ajouter ou modifier un plein.

    Deux valeurs parmi volume, prix unitaire et montant suffisent. Si des
    avertissements de cohérence existent et que ``confirm`` est faux, rien
    n'est enregistré et les avertissements sont renvoyés.
    """
    vehicle_id = msg["vehicle_id"]
    units = coord.units(vehicle_id)
    outcome = coord.async_save_fuel(
        vehicle_id,
        msg,
        entry_id=msg.get("entry_id"),
        save_with_warnings=msg["confirm"],
    )
    fuel = outcome.record.fuel_type
    result: dict[str, Any] = {
        "warnings": [units.warning_view(w, fuel) for w in outcome.warnings],
        "saved": outcome.saved,
    }
    if outcome.saved:
        result["entry"] = units.fuel_entry_view(outcome.record)
    connection.send_result(msg["id"], result)


@websocket_command(
    {
        vol.Required("type"): command("fuel/delete"),
        **VEHICLE,
        vol.Required("entry_id"): str,
    }
)
@guarded
def ws_fuel_delete(
    hass: HomeAssistant,
    connection: ActiveConnection,
    msg: dict[str, Any],
    coord: VehicleLogCoordinator,
) -> None:
    """Supprimer un plein."""
    coord.async_delete_fuel(msg["vehicle_id"], msg["entry_id"])
    connection.send_result(msg["id"])


COMMANDS = (ws_fuel_defaults, ws_fuel_list, ws_fuel_save, ws_fuel_delete)
