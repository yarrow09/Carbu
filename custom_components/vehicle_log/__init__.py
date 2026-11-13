"""Intégration Vehicle Log : carnet de bord véhicule pour Home Assistant."""

from __future__ import annotations

from dataclasses import dataclass

from homeassistant.config_entries import ConfigEntry
from homeassistant.const import Platform
from homeassistant.core import HomeAssistant

from .const import SUBENTRY_TYPE_VEHICLE
from .core.models import Vehicle
from .storage import VehicleLogStorage

PLATFORMS: list[Platform] = []


@dataclass(slots=True)
class VehicleLogRuntime:
    """Données d'exécution de l'entrée."""

    storage: VehicleLogStorage
    vehicles: dict[str, Vehicle]


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

    entry.runtime_data = VehicleLogRuntime(storage=storage, vehicles=vehicles)
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
