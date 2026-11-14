"""Commandes de lecture globales : abonnement, véhicules, tableau de bord."""

from __future__ import annotations

from typing import Any

from homeassistant.components.websocket_api.connection import ActiveConnection
from homeassistant.components.websocket_api.decorators import (
    async_response,
    websocket_command,
)
from homeassistant.components.websocket_api.messages import event_message
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.loader import async_get_loaded_integration
import probatio as vol

from ..const import DOMAIN, SIGNAL_UPDATED
from ..coordinator import VehicleLogCoordinator, local_now
from ..core.aggregation import latest, monthly_costs_by_category
from ..core.consumption import fill_metrics
from ..core.presenter import VehicleUnits
from ..labels import async_category_labels
from .common import (
    ERR_NOT_LOADED,
    VEHICLE,
    category_views,
    command,
    coordinator,
    guarded,
    vehicle_view,
)


@websocket_command({vol.Required("type"): command("subscribe")})
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


@websocket_command({vol.Required("type"): command("vehicles")})
@guarded
def ws_vehicles(
    hass: HomeAssistant,
    connection: ActiveConnection,
    msg: dict[str, Any],
    coord: VehicleLogCoordinator,
) -> None:
    """Liste des véhicules avec leurs indicateurs."""
    connection.send_result(
        msg["id"],
        {
            "currency": hass.config.currency,
            # Version installée côté serveur : la page la compare à la sienne
            # pour signaler un navigateur resté sur l'ancienne version.
            "version": str(async_get_loaded_integration(hass, DOMAIN).version),
            "vehicles": [vehicle_view(coord, vid) for vid in coord.vehicles],
        },
    )


@websocket_command(
    {
        vol.Required("type"): command("dashboard"),
        **VEHICLE,
        vol.Optional("months", default=12): vol.All(int, vol.Range(min=1, max=120)),
        vol.Optional("recent", default=5): vol.All(int, vol.Range(min=0, max=50)),
    }
)
@async_response
async def ws_dashboard(
    hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]
) -> None:
    """Données du tableau de bord d'un véhicule, en un seul aller-retour."""
    labels = await async_category_labels(hass)
    _dashboard(hass, connection, msg, labels)


@callback
def _dashboard(
    hass: HomeAssistant,
    connection: ActiveConnection,
    msg: dict[str, Any],
    labels: dict[str, str],
) -> None:
    @guarded
    def run(
        hass: HomeAssistant,
        connection: ActiveConnection,
        msg: dict[str, Any],
        coord: VehicleLogCoordinator,
    ) -> None:
        vehicle_id = msg["vehicle_id"]
        view = vehicle_view(coord, vehicle_id)
        units = VehicleUnits(coord.vehicle(vehicle_id))
        rec = coord.records(vehicle_id)
        metrics = fill_metrics(rec.fuel.items)
        recent_fuel = latest(rec.fuel.items, max(msg["recent"], 1))
        monthly = monthly_costs_by_category(
            rec.fuel, rec.expenses, local_now().date(), msg["months"]
        )
        connection.send_result(
            msg["id"],
            {
                **view,
                "currency": hass.config.currency,
                "recent_fuel": [
                    units.fuel_entry_view(e, metrics.get(e.id))
                    for e in recent_fuel[: msg["recent"]]
                ],
                "last_fuel": (
                    units.fuel_entry_view(
                        recent_fuel[0], metrics.get(recent_fuel[0].id)
                    )
                    if recent_fuel
                    else None
                ),
                "recent_expenses": [
                    units.expense_view(e)
                    for e in latest(rec.expenses.items, msg["recent"])
                ],
                "monthly": [
                    {"month": month, "values": values}
                    for month, values in monthly.items()
                ],
                "categories": category_views(coord, labels),
            },
        )

    run(hass, connection, msg)


@websocket_command({vol.Required("type"): command("categories")})
@async_response
async def ws_categories(
    hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]
) -> None:
    """Catégories avec libellés traduits."""
    if (coord := coordinator(hass)) is None:
        connection.send_error(msg["id"], ERR_NOT_LOADED, "Carbu not loaded")
        return
    labels = await async_category_labels(hass)
    connection.send_result(msg["id"], category_views(coord, labels))


COMMANDS = (ws_subscribe, ws_vehicles, ws_dashboard, ws_categories)
