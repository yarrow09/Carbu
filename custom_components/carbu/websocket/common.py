"""Éléments partagés par les commandes websocket : schémas, garde, vues."""

from __future__ import annotations

from collections.abc import Callable
from typing import Any

from homeassistant.components.websocket_api.connection import ActiveConnection
from homeassistant.components.websocket_api.const import WebSocketCommandHandler
from homeassistant.core import HomeAssistant, callback
import probatio as vol

from ..const import DOMAIN, MAX_LONG_TEXT, MAX_SHORT_TEXT
from ..coordinator import VehicleLogCoordinator, VehicleNotFoundError
from ..core.presenter import VehicleUnits
from ..core.repository import CategoryError, RecordNotFoundError

ERR_NOT_LOADED = "not_loaded"
ERR_NOT_FOUND = "not_found"
ERR_INVALID = "invalid_format"

POSITIVE = vol.All(vol.Coerce(float), vol.Range(min=0))
VEHICLE: dict[Any, Any] = {vol.Required("vehicle_id"): str}
SHORT = vol.All(str, vol.Length(max=MAX_SHORT_TEXT))
LONG = vol.All(str, vol.Length(max=MAX_LONG_TEXT))
PAGING: dict[Any, Any] = {
    vol.Optional("limit", default=50): vol.All(int, vol.Range(min=1, max=1000)),
    vol.Optional("offset", default=0): vol.All(int, vol.Range(min=0)),
}


def command(name: str) -> str:
    """Type d'une commande du domaine (``carbu/<nom>``)."""
    return f"{DOMAIN}/{name}"


def coordinator(hass: HomeAssistant) -> VehicleLogCoordinator | None:
    """Coordinator de l'entrée chargée, ou ``None``."""
    entries = hass.config_entries.async_loaded_entries(DOMAIN)
    if not entries:
        return None
    result: VehicleLogCoordinator = entries[0].runtime_data.coordinator
    return result


type Handler = Callable[
    [HomeAssistant, ActiveConnection, dict[str, Any], VehicleLogCoordinator], None
]


def guarded(func: Handler) -> WebSocketCommandHandler:
    """Résoudre le coordinator et traduire les erreurs métier."""

    @callback
    def wrapper(
        hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]
    ) -> None:
        if (coord := coordinator(hass)) is None:
            connection.send_error(msg["id"], ERR_NOT_LOADED, "Carbu not loaded")
            return
        try:
            func(hass, connection, msg, coord)
        except (VehicleNotFoundError, RecordNotFoundError) as err:
            connection.send_error(msg["id"], ERR_NOT_FOUND, f"Not found: {err}")
        except (CategoryError, ValueError) as err:
            connection.send_error(msg["id"], ERR_INVALID, str(err))

    wrapper.__name__ = func.__name__
    return wrapper


def category_views(
    coord: VehicleLogCoordinator, labels: dict[str, str]
) -> list[dict[str, Any]]:
    """Catégories avec leur libellé affiché."""
    return [
        {
            **cat.to_dict(),
            "label": cat.name or labels.get(cat.id, cat.id),
        }
        for cat in coord.storage.data.categories.values()
    ]


def vehicle_view(coord: VehicleLogCoordinator, vehicle_id: str) -> dict[str, Any]:
    """Véhicule, unités et indicateurs courants."""
    vehicle = coord.vehicle(vehicle_id)
    units = VehicleUnits(vehicle)
    summary = coord.data.get(vehicle_id) if coord.data else None
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
