"""Commande des statistiques d'une période et de ses courbes."""

from __future__ import annotations

from typing import Any

from homeassistant.components.websocket_api.connection import ActiveConnection
from homeassistant.components.websocket_api.decorators import websocket_command
from homeassistant.core import HomeAssistant
import probatio as vol

from ..coordinator import VehicleLogCoordinator, local_now
from ..core.statistics import (
    StatsPeriod,
    consumption_series,
    cost_per_km_series,
    odometer_series,
    period_stats,
    price_series,
)
from .common import VEHICLE, command, guarded


@websocket_command(
    {
        vol.Required("type"): command("stats"),
        **VEHICLE,
        vol.Optional("period", default=StatsPeriod.MONTHS_12.value): vol.In(
            [p.value for p in StatsPeriod]
        ),
    }
)
@guarded
def ws_stats(
    hass: HomeAssistant,
    connection: ActiveConnection,
    msg: dict[str, Any],
    coord: VehicleLogCoordinator,
) -> None:
    """Statistiques d'une période et courbes (consommation, prix, coût, compteur)."""
    vehicle_id = msg["vehicle_id"]
    vehicle = coord.vehicle(vehicle_id)
    units = coord.units(vehicle_id)
    records = coord.records(vehicle_id)
    stats = period_stats(
        vehicle, records, StatsPeriod(msg["period"]), local_now().date()
    )
    window = coord.moving_average_window
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
            "prices": {
                fuel.value: [
                    units.price_point_view(point, fuel)
                    for point in price_series(records.fuel.items, fuel, stats.start)
                ]
                for fuel in vehicle.fuel_types
            },
            "cost_curve": [
                units.cost_point_view(point)
                for point in cost_per_km_series(records, stats.end, stats.start)
            ],
            "odometer_curve": [
                units.odometer_point_view(point)
                for point in odometer_series(records, stats.start)
            ],
        },
    )


COMMANDS = (ws_stats,)
