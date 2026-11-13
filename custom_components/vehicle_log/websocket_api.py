"""API websocket interne utilisée par les cartes Lovelace.

Ces commandes ne sont pas une API publique (les services publics arrivent en
phase 2). Toutes les valeurs échangées sont dans les unités du véhicule.
"""

from __future__ import annotations

from collections.abc import Callable
import datetime as dt
from typing import Any

from homeassistant.components.websocket_api import async_register_command
from homeassistant.components.websocket_api.connection import ActiveConnection
from homeassistant.components.websocket_api.const import WebSocketCommandHandler
from homeassistant.components.websocket_api.decorators import (
    async_response,
    websocket_command,
)
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import config_validation as cv
import probatio as vol

from .const import DOMAIN
from .coordinator import VehicleLogCoordinator, VehicleNotFoundError, local_now
from .core.aggregation import filter_expenses, latest, monthly_costs_by_category
from .core.models import Expense, FuelEntry, FuelType, new_id
from .core.presenter import VehicleUnits
from .core.repository import CategoryError, RecordNotFoundError
from .core.validation import complete_fill_amounts

ERR_NOT_LOADED = "not_loaded"
ERR_NOT_FOUND = "not_found"
ERR_INVALID = "invalid_format"

_POSITIVE = vol.All(vol.Coerce(float), vol.Range(min=0))
_VEHICLE: dict[Any, Any] = {vol.Required("vehicle_id"): str}
_PAGING: dict[Any, Any] = {
    vol.Optional("limit", default=50): vol.All(int, vol.Range(min=1, max=1000)),
    vol.Optional("offset", default=0): vol.All(int, vol.Range(min=0)),
}


def _coordinator(hass: HomeAssistant) -> VehicleLogCoordinator | None:
    entries = hass.config_entries.async_loaded_entries(DOMAIN)
    if not entries:
        return None
    coordinator: VehicleLogCoordinator = entries[0].runtime_data.coordinator
    return coordinator


type _Handler = Callable[
    [HomeAssistant, ActiveConnection, dict[str, Any], VehicleLogCoordinator], None
]


def _guarded(func: _Handler) -> WebSocketCommandHandler:
    """Résoudre le coordinator et traduire les erreurs métier."""

    @callback
    def wrapper(
        hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]
    ) -> None:
        if (coordinator := _coordinator(hass)) is None:
            connection.send_error(msg["id"], ERR_NOT_LOADED, "Vehicle Log not loaded")
            return
        try:
            func(hass, connection, msg, coordinator)
        except (VehicleNotFoundError, RecordNotFoundError) as err:
            connection.send_error(msg["id"], ERR_NOT_FOUND, f"Not found: {err}")
        except (CategoryError, ValueError) as err:
            connection.send_error(msg["id"], ERR_INVALID, str(err))

    wrapper.__name__ = func.__name__
    return wrapper


@callback
def async_register_websocket_commands(hass: HomeAssistant) -> None:
    """Enregistrer les commandes."""
    for handler in (
        ws_vehicles,
        ws_dashboard,
        ws_categories,
        ws_fuel_defaults,
        ws_fuel_list,
        ws_fuel_save,
        ws_fuel_delete,
        ws_expense_list,
        ws_expense_save,
        ws_expense_delete,
    ):
        async_register_command(hass, handler)


def _category_views(
    coordinator: VehicleLogCoordinator, labels: dict[str, str]
) -> list[dict[str, Any]]:
    return [
        {
            **cat.to_dict(),
            "label": cat.name or labels.get(cat.id, cat.id),
        }
        for cat in coordinator.storage.data.categories.values()
    ]


def _vehicle_view(
    coordinator: VehicleLogCoordinator, vehicle_id: str
) -> dict[str, Any]:
    vehicle = coordinator.vehicle(vehicle_id)
    units = VehicleUnits(vehicle)
    summary = coordinator.data.get(vehicle_id) if coordinator.data else None
    return {
        "id": vehicle.id,
        "name": vehicle.name,
        "make": vehicle.make,
        "model": vehicle.model,
        "fuel_types": [f.value for f in vehicle.fuel_types],
        "tank_capacity": {
            f.value: units.volume_out(vehicle.tank_capacity_for(f), f)
            for f in vehicle.fuel_types
        },
        "units": units.units_view(),
        "summary": units.summary_view(summary) if summary else None,
    }


# --- Lecture ---------------------------------------------------------------


@websocket_command({vol.Required("type"): f"{DOMAIN}/vehicles"})
@_guarded
def ws_vehicles(
    hass: HomeAssistant,
    connection: ActiveConnection,
    msg: dict[str, Any],
    coordinator: VehicleLogCoordinator,
) -> None:
    """Liste des véhicules avec leurs indicateurs."""
    connection.send_result(
        msg["id"],
        {
            "currency": hass.config.currency,
            "vehicles": [
                _vehicle_view(coordinator, vid) for vid in coordinator.vehicles
            ],
        },
    )


@websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/dashboard",
        **_VEHICLE,
        vol.Optional("months", default=12): vol.All(int, vol.Range(min=1, max=120)),
        vol.Optional("recent", default=5): vol.All(int, vol.Range(min=0, max=50)),
    }
)
@async_response
async def ws_dashboard(
    hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]
) -> None:
    """Données du tableau de bord d'un véhicule, en un seul aller-retour."""
    from .config_flow import async_category_labels  # noqa: PLC0415

    labels = await async_category_labels(hass)
    _dashboard(hass, connection, msg, labels)


@callback
def _dashboard(
    hass: HomeAssistant,
    connection: ActiveConnection,
    msg: dict[str, Any],
    labels: dict[str, str],
) -> None:
    @_guarded
    def run(
        hass: HomeAssistant,
        connection: ActiveConnection,
        msg: dict[str, Any],
        coordinator: VehicleLogCoordinator,
    ) -> None:
        vehicle_id = msg["vehicle_id"]
        view = _vehicle_view(coordinator, vehicle_id)
        units = VehicleUnits(coordinator.vehicle(vehicle_id))
        rec = coordinator.records(vehicle_id)
        monthly = monthly_costs_by_category(
            rec.fuel, rec.expenses, local_now().date(), msg["months"]
        )
        connection.send_result(
            msg["id"],
            {
                **view,
                "currency": hass.config.currency,
                "recent_fuel": [
                    units.fuel_entry_view(e)
                    for e in latest(rec.fuel.items, msg["recent"])
                ],
                "recent_expenses": [
                    units.expense_view(e)
                    for e in latest(rec.expenses.items, msg["recent"])
                ],
                "monthly": [
                    {"month": month, "values": values}
                    for month, values in monthly.items()
                ],
                "categories": _category_views(coordinator, labels),
            },
        )

    run(hass, connection, msg)


@websocket_command({vol.Required("type"): f"{DOMAIN}/categories"})
@async_response
async def ws_categories(
    hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]
) -> None:
    """Catégories avec libellés traduits."""
    from .config_flow import async_category_labels  # noqa: PLC0415

    if (coordinator := _coordinator(hass)) is None:
        connection.send_error(msg["id"], ERR_NOT_LOADED, "Vehicle Log not loaded")
        return
    labels = await async_category_labels(hass)
    connection.send_result(msg["id"], _category_views(coordinator, labels))


@websocket_command({vol.Required("type"): f"{DOMAIN}/fuel/defaults", **_VEHICLE})
@_guarded
def ws_fuel_defaults(
    hass: HomeAssistant,
    connection: ActiveConnection,
    msg: dict[str, Any],
    coordinator: VehicleLogCoordinator,
) -> None:
    """Valeurs pré-remplies du formulaire de plein."""
    vehicle_id = msg["vehicle_id"]
    vehicle = coordinator.vehicle(vehicle_id)
    units = VehicleUnits(vehicle)
    readings = coordinator.readings(vehicle_id)
    fuel = coordinator.records(vehicle_id).fuel.items
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
        vol.Required("type"): f"{DOMAIN}/fuel/list",
        **_VEHICLE,
        vol.Optional("start"): cv.date,
        vol.Optional("end"): cv.date,
        **_PAGING,
    }
)
@_guarded
def ws_fuel_list(
    hass: HomeAssistant,
    connection: ActiveConnection,
    msg: dict[str, Any],
    coordinator: VehicleLogCoordinator,
) -> None:
    """Pleins, du plus récent au plus ancien, filtrés par période ``[start, end]``."""
    vehicle_id = msg["vehicle_id"]
    units = VehicleUnits(coordinator.vehicle(vehicle_id))
    start: dt.date | None = msg.get("start")
    end: dt.date | None = msg.get("end")
    items = [
        e
        for e in reversed(coordinator.records(vehicle_id).fuel.items)
        if (start is None or e.date >= start) and (end is None or e.date <= end)
    ]
    page = items[msg["offset"] : msg["offset"] + msg["limit"]]
    connection.send_result(
        msg["id"],
        {"total": len(items), "items": [units.fuel_entry_view(e) for e in page]},
    )


@websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/expense/list",
        **_VEHICLE,
        vol.Optional("start"): cv.date,
        vol.Optional("end"): cv.date,
        vol.Optional("category_ids"): [str],
        vol.Optional("min_amount"): vol.Coerce(float),
        vol.Optional("max_amount"): vol.Coerce(float),
        **_PAGING,
    }
)
@_guarded
def ws_expense_list(
    hass: HomeAssistant,
    connection: ActiveConnection,
    msg: dict[str, Any],
    coordinator: VehicleLogCoordinator,
) -> None:
    """Dépenses filtrées (période ``[start, end]``, catégories, montant)."""
    vehicle_id = msg["vehicle_id"]
    units = VehicleUnits(coordinator.vehicle(vehicle_id))
    end: dt.date | None = msg.get("end")
    items = filter_expenses(
        coordinator.records(vehicle_id).expenses,
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


# --- Écriture ----------------------------------------------------------------


@websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/fuel/save",
        **_VEHICLE,
        vol.Optional("entry_id"): str,
        vol.Optional("date"): cv.date,
        vol.Optional("time"): vol.Any(None, cv.time),
        vol.Required("odometer"): _POSITIVE,
        vol.Optional("volume"): vol.Any(None, _POSITIVE),
        vol.Optional("unit_price"): vol.Any(None, _POSITIVE),
        vol.Optional("total_cost"): vol.Any(None, _POSITIVE),
        vol.Optional("fuel_type"): vol.In([f.value for f in FuelType]),
        vol.Optional("full_tank", default=True): bool,
        vol.Optional("station"): vol.Any(None, str),
        vol.Optional("notes", default=""): str,
        vol.Optional("confirm", default=False): bool,
    }
)
@_guarded
def ws_fuel_save(
    hass: HomeAssistant,
    connection: ActiveConnection,
    msg: dict[str, Any],
    coordinator: VehicleLogCoordinator,
) -> None:
    """Ajouter ou modifier un plein.

    Deux valeurs parmi volume, prix unitaire et montant suffisent. Si des
    avertissements de cohérence existent et que ``confirm`` est faux, rien
    n'est enregistré et les avertissements sont renvoyés.
    """
    vehicle_id = msg["vehicle_id"]
    vehicle = coordinator.vehicle(vehicle_id)
    units = VehicleUnits(vehicle)
    rec = coordinator.records(vehicle_id)
    existing = rec.fuel.get(msg["entry_id"]) if "entry_id" in msg else None

    fuel = FuelType(
        msg.get("fuel_type") or (existing.fuel_type if existing else vehicle.fuel_type)
    )
    volume, price, total = complete_fill_amounts(
        msg.get("volume"), msg.get("unit_price"), msg.get("total_cost")
    )
    now = local_now()
    day: dt.date = msg.get("date") or (existing.date if existing else now.date())
    if "time" in msg:
        at: dt.time | None = msg["time"]
    elif existing:
        at = existing.time
    else:
        at = now.time().replace(second=0, microsecond=0) if "date" not in msg else None
    entry = FuelEntry(
        id=existing.id if existing else new_id(),
        date=day,
        time=at,
        odometer=units.distance_in(msg["odometer"]),
        volume=units.volume_in(volume, fuel),
        unit_price=units.unit_price_in(price, fuel),
        total_cost=total,
        fuel_type=fuel,
        full_tank=msg["full_tank"],
        station=(msg.get("station") or "").strip() or None,
        notes=msg["notes"],
    )
    warnings = coordinator.check_fuel(vehicle_id, entry)
    result: dict[str, Any] = {
        "warnings": [units.warning_view(w, fuel) for w in warnings],
        "saved": False,
    }
    if not warnings or msg["confirm"]:
        if existing:
            coordinator.async_update_fuel(vehicle_id, entry)
        else:
            coordinator.async_add_fuel(vehicle_id, entry)
        result.update(saved=True, entry=units.fuel_entry_view(entry))
    connection.send_result(msg["id"], result)


@websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/fuel/delete",
        **_VEHICLE,
        vol.Required("entry_id"): str,
    }
)
@_guarded
def ws_fuel_delete(
    hass: HomeAssistant,
    connection: ActiveConnection,
    msg: dict[str, Any],
    coordinator: VehicleLogCoordinator,
) -> None:
    """Supprimer un plein."""
    coordinator.async_delete_fuel(msg["vehicle_id"], msg["entry_id"])
    connection.send_result(msg["id"])


@websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/expense/save",
        **_VEHICLE,
        vol.Optional("expense_id"): str,
        vol.Optional("date"): cv.date,
        vol.Optional("odometer"): vol.Any(None, _POSITIVE),
        vol.Required("amount"): _POSITIVE,
        vol.Required("category_id"): str,
        vol.Optional("description", default=""): str,
    }
)
@_guarded
def ws_expense_save(
    hass: HomeAssistant,
    connection: ActiveConnection,
    msg: dict[str, Any],
    coordinator: VehicleLogCoordinator,
) -> None:
    """Ajouter ou modifier une dépense."""
    vehicle_id = msg["vehicle_id"]
    units = VehicleUnits(coordinator.vehicle(vehicle_id))
    rec = coordinator.records(vehicle_id)
    existing = rec.expenses.get(msg["expense_id"]) if "expense_id" in msg else None
    odometer = msg.get("odometer")
    expense = Expense(
        id=existing.id if existing else new_id(),
        date=msg.get("date") or (existing.date if existing else local_now().date()),
        odometer=units.distance_in(odometer) if odometer is not None else None,
        amount=msg["amount"],
        category_id=msg["category_id"],
        description=msg["description"].strip(),
        attachment=existing.attachment if existing else None,
    )
    if existing:
        coordinator.async_update_expense(vehicle_id, expense)
    else:
        coordinator.async_add_expense(vehicle_id, expense)
    connection.send_result(msg["id"], units.expense_view(expense))


@websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/expense/delete",
        **_VEHICLE,
        vol.Required("expense_id"): str,
    }
)
@_guarded
def ws_expense_delete(
    hass: HomeAssistant,
    connection: ActiveConnection,
    msg: dict[str, Any],
    coordinator: VehicleLogCoordinator,
) -> None:
    """Supprimer une dépense."""
    coordinator.async_delete_expense(msg["vehicle_id"], msg["expense_id"])
    connection.send_result(msg["id"])
