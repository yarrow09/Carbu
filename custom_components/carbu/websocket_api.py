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
from homeassistant.components.websocket_api.messages import event_message
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.dispatcher import async_dispatcher_connect
import probatio as vol

from .const import DOMAIN, SIGNAL_UPDATED
from .coordinator import VehicleLogCoordinator, VehicleNotFoundError, local_now
from .core.aggregation import filter_expenses, latest, monthly_costs_by_category
from .core.models import FuelType, ReminderKind
from .core.presenter import VehicleUnits
from .core.repository import CategoryError, RecordNotFoundError
from .core.statistics import StatsPeriod, consumption_series, period_stats

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
            connection.send_error(msg["id"], ERR_NOT_LOADED, "Carbu not loaded")
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
        ws_subscribe,
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
        ws_reminders,
        ws_reminder_save,
        ws_reminder_delete,
        ws_reminder_done,
        ws_stats,
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


@websocket_command({vol.Required("type"): f"{DOMAIN}/subscribe"})
@callback
def ws_subscribe(
    hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]
) -> None:
    """Être notifié de chaque modification (les cartes rechargent leurs données).

    L'abonnement survit au rechargement de l'intégration.
    """

    @callback
    def _forward() -> None:
        connection.send_message(event_message(msg["id"], {"updated": True}))

    connection.subscriptions[msg["id"]] = async_dispatcher_connect(
        hass, SIGNAL_UPDATED, _forward
    )
    connection.send_result(msg["id"])


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
        connection.send_error(msg["id"], ERR_NOT_LOADED, "Carbu not loaded")
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
    units = coordinator.units(vehicle_id)
    outcome = coordinator.async_save_fuel(
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
    expense = coordinator.async_save_expense(
        vehicle_id, msg, expense_id=msg.get("expense_id")
    )
    units = coordinator.units(vehicle_id)
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


# --- Rappels -------------------------------------------------------------------


def _reminders_view(
    coordinator: VehicleLogCoordinator, vehicle_id: str
) -> list[dict[str, Any]]:
    units = coordinator.units(vehicle_id)
    return [
        units.reminder_view(r, coordinator.reminder_status(vehicle_id, r))
        for r in coordinator.records(vehicle_id).reminders
    ]


@websocket_command({vol.Required("type"): f"{DOMAIN}/reminders", **_VEHICLE})
@_guarded
def ws_reminders(
    hass: HomeAssistant,
    connection: ActiveConnection,
    msg: dict[str, Any],
    coordinator: VehicleLogCoordinator,
) -> None:
    """Rappels d'un véhicule avec leur état."""
    connection.send_result(msg["id"], _reminders_view(coordinator, msg["vehicle_id"]))


_OPT_POSITIVE_INT = vol.Any(None, vol.All(vol.Coerce(int), vol.Range(min=0)))


@websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/reminder/save",
        **_VEHICLE,
        vol.Optional("reminder_id"): str,
        vol.Required("label"): str,
        vol.Required("kind"): vol.In([k.value for k in ReminderKind]),
        vol.Optional("due_date"): vol.Any(None, cv.date),
        vol.Optional("due_odometer"): vol.Any(None, _POSITIVE),
        vol.Optional("alert_days"): _OPT_POSITIVE_INT,
        vol.Optional("alert_distance"): vol.Any(None, _POSITIVE),
        vol.Optional("interval_days"): _OPT_POSITIVE_INT,
        vol.Optional("interval_distance"): vol.Any(None, _POSITIVE),
    }
)
@_guarded
def ws_reminder_save(
    hass: HomeAssistant,
    connection: ActiveConnection,
    msg: dict[str, Any],
    coordinator: VehicleLogCoordinator,
) -> None:
    """Créer ou modifier un rappel."""
    vehicle_id = msg["vehicle_id"]
    reminder = coordinator.async_save_reminder(
        vehicle_id, msg, reminder_id=msg.get("reminder_id")
    )
    connection.send_result(
        msg["id"],
        coordinator.units(vehicle_id).reminder_view(
            reminder, coordinator.reminder_status(vehicle_id, reminder)
        ),
    )


@websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/reminder/delete",
        **_VEHICLE,
        vol.Required("reminder_id"): str,
    }
)
@_guarded
def ws_reminder_delete(
    hass: HomeAssistant,
    connection: ActiveConnection,
    msg: dict[str, Any],
    coordinator: VehicleLogCoordinator,
) -> None:
    """Supprimer un rappel."""
    coordinator.async_delete_reminder(msg["vehicle_id"], msg["reminder_id"])
    connection.send_result(msg["id"])


@websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/reminder/done",
        **_VEHICLE,
        vol.Required("reminder_id"): str,
        vol.Optional("date"): cv.date,
        vol.Optional("odometer"): _POSITIVE,
    }
)
@_guarded
def ws_reminder_done(
    hass: HomeAssistant,
    connection: ActiveConnection,
    msg: dict[str, Any],
    coordinator: VehicleLogCoordinator,
) -> None:
    """Marquer un rappel comme fait (échéance suivante si récurrent)."""
    vehicle_id = msg["vehicle_id"]
    reminder = coordinator.async_mark_reminder_done(
        vehicle_id, msg["reminder_id"], msg.get("date"), msg.get("odometer")
    )
    connection.send_result(
        msg["id"],
        coordinator.units(vehicle_id).reminder_view(
            reminder, coordinator.reminder_status(vehicle_id, reminder)
        ),
    )


# --- Statistiques ---------------------------------------------------------------


@websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/stats",
        **_VEHICLE,
        vol.Optional("period", default=StatsPeriod.MONTHS_12.value): vol.In(
            [p.value for p in StatsPeriod]
        ),
    }
)
@_guarded
def ws_stats(
    hass: HomeAssistant,
    connection: ActiveConnection,
    msg: dict[str, Any],
    coordinator: VehicleLogCoordinator,
) -> None:
    """Statistiques d'une période et courbe de consommation par plein."""
    vehicle_id = msg["vehicle_id"]
    vehicle = coordinator.vehicle(vehicle_id)
    units = coordinator.units(vehicle_id)
    records = coordinator.records(vehicle_id)
    stats = period_stats(
        vehicle, records, StatsPeriod(msg["period"]), local_now().date()
    )
    window = coordinator.moving_average_window
    connection.send_result(
        msg["id"],
        {
            **units.stats_view(stats),
            "moving_average_window": window,
            "series": {
                fuel.value: [
                    units.consumption_point_view(point, fuel)
                    for point in consumption_series(
                        records.fuel.items, fuel, window, stats.start
                    )
                ]
                for fuel in vehicle.fuel_types
            },
        },
    )
