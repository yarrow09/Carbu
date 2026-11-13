"""Intégration Vehicle Log : carnet de bord véhicule pour Home Assistant."""

from __future__ import annotations

from dataclasses import dataclass

from homeassistant.config_entries import ConfigEntry
from homeassistant.const import Platform
from homeassistant.core import HomeAssistant
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.typing import ConfigType

from .const import DOMAIN, SUBENTRY_TYPE_VEHICLE
from .coordinator import VehicleLogCoordinator
from .core.models import Vehicle
from .storage import VehicleLogStorage
from .websocket_api import async_register_websocket_commands

PLATFORMS: list[Platform] = [Platform.NUMBER, Platform.SENSOR]
CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Enregistrer l'API websocket utilisée par les cartes."""
    async_register_websocket_commands(hass)
    return True


@dataclass(slots=True)
class VehicleLogRuntime:
    """Données d'exécution de l'entrée."""

    storage: VehicleLogStorage
    vehicles: dict[str, Vehicle]
    coordinator: VehicleLogCoordinator


type VehicleLogConfigEntry = ConfigEntry[VehicleLogRuntime]


def vehicles_from_entry(entry: ConfigEntry) -> dict[str, Vehicle]:
    """Construire les véhicules à partir des subentries."""
    return {
        sub_id: Vehicle.from_dict(sub_id, dict(sub.data))
        for sub_id, sub in entry.subentries.items()
        if sub.subentry_type == SUBENTRY_TYPE_VEHICLE
    }


async def async_setup_entry(hass: HomeAssistant, entry: VehicleLogConfigEntry) -> bool:
    """Charger l'entrée de configuration."""
    storage = VehicleLogStorage(hass)
    await storage.async_load()
    vehicles = vehicles_from_entry(entry)

    # Un véhicule supprimé dans l'interface : ses données sont effacées.
    orphans = set(storage.data.vehicles) - set(vehicles)
    for vehicle_id in orphans:
        storage.data.remove_vehicle(vehicle_id)
    if orphans:
        storage.async_schedule_save()

    coordinator = VehicleLogCoordinator(hass, entry, storage, vehicles)
    await coordinator.async_config_entry_first_refresh()
    entry.runtime_data = VehicleLogRuntime(
        storage=storage, vehicles=vehicles, coordinator=coordinator
    )
    entry.async_on_unload(entry.add_update_listener(_async_reload_entry))
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    return True


async def _async_reload_entry(
    hass: HomeAssistant, entry: VehicleLogConfigEntry
) -> None:
    """Recharger après l'ajout, la modification ou la suppression d'un véhicule."""
    await hass.config_entries.async_reload(entry.entry_id)


async def async_unload_entry(hass: HomeAssistant, entry: VehicleLogConfigEntry) -> bool:
    """Décharger l'entrée en écrivant immédiatement les données en attente."""
    unloaded = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    if unloaded:
        await entry.runtime_data.storage.async_save()
    return unloaded


async def async_remove_entry(hass: HomeAssistant, entry: VehicleLogConfigEntry) -> None:
    """Supprimer le fichier de données à la suppression de l'intégration."""
    await VehicleLogStorage(hass).async_remove()
