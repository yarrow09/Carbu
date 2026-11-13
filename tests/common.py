"""Outils communs aux tests d'intégration."""

from typing import Any

from homeassistant.config_entries import ConfigSubentryDataWithId
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.vehicle_log.const import (
    DOMAIN,
    STORAGE_KEY,
    STORAGE_MINOR_VERSION,
    STORAGE_VERSION,
    SUBENTRY_TYPE_VEHICLE,
)
from custom_components.vehicle_log.core.repository import LogData

CLIO: dict[str, Any] = {
    "name": "Clio",
    "make": "Renault",
    "model": "Clio IV",
    "plate": None,
    "fuel_type": "gasoline",
    "secondary_fuel_type": None,
    "tank_capacity": 45.0,
    "secondary_tank_capacity": None,
    "distance_unit": "km",
    "volume_unit": "L",
    "consumption_unit": "l_100km",
    "acquisition_date": "2020-05-01",
    "consumption_min": 3.0,
    "consumption_max": 20.0,
}

# Véhicule du jeu de référence (tests/core/reference_dataset.py)
REFERENCE: dict[str, Any] = {
    **CLIO,
    "name": "Référence",
    "make": "",
    "model": "",
    "tank_capacity": 50.0,
    "acquisition_date": "2026-01-01",
}


def store_data(hass_storage: dict[str, Any], data: LogData) -> None:
    """Pré-remplir le fichier de stockage."""
    hass_storage[STORAGE_KEY] = {
        "version": STORAGE_VERSION,
        "minor_version": STORAGE_MINOR_VERSION,
        "key": STORAGE_KEY,
        "data": data.to_dict(),
    }


async def setup_integration(
    hass: HomeAssistant, vehicles: dict[str, dict[str, Any]] | None = None
) -> MockConfigEntry:
    """Installer l'intégration avec des véhicules ``{subentry_id: data}``."""
    subentries = [
        ConfigSubentryDataWithId(
            data=data,
            subentry_id=subentry_id,
            subentry_type=SUBENTRY_TYPE_VEHICLE,
            title=data["name"],
            unique_id=None,
        )
        for subentry_id, data in (vehicles or {}).items()
    ]
    entry = MockConfigEntry(
        domain=DOMAIN, title="Carnet de bord", data={}, subentries_data=subentries
    )
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    return entry
