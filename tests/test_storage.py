"""Persistance via ``Store`` : écriture différée et survie au redémarrage."""

from datetime import date, timedelta
from typing import Any

from freezegun.api import FrozenDateTimeFactory
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import async_fire_time_changed

from custom_components.vehicle_log.const import (
    STORAGE_KEY,
    STORAGE_SAVE_DELAY,
    STORAGE_VERSION,
)
from custom_components.vehicle_log.core.models import Expense, FuelEntry, FuelType
from custom_components.vehicle_log.storage import VehicleLogStorage


async def test_empty_load_creates_defaults(
    hass: HomeAssistant, hass_storage: dict[str, Any]
) -> None:
    storage = VehicleLogStorage(hass)
    await storage.async_load()
    assert "other" in storage.data.categories
    assert storage.data.vehicles == {}


async def test_delayed_save_then_reload(
    hass: HomeAssistant,
    hass_storage: dict[str, Any],
    freezer: FrozenDateTimeFactory,
) -> None:
    storage = VehicleLogStorage(hass)
    await storage.async_load()
    storage.data.records("v1").fuel.add(
        FuelEntry(
            date=date(2026, 1, 1),
            odometer=1000,
            volume=40,
            unit_price=1.8,
            total_cost=72,
            fuel_type=FuelType.DIESEL,
        )
    )
    storage.data.add_expense(
        "v1", Expense(date=date(2026, 1, 2), amount=15, category_id="parking")
    )
    storage.async_schedule_save()
    assert STORAGE_KEY not in hass_storage  # écriture pas encore effectuée

    freezer.tick(timedelta(seconds=STORAGE_SAVE_DELAY + 1))
    async_fire_time_changed(hass)
    await hass.async_block_till_done()

    saved = hass_storage[STORAGE_KEY]
    assert saved["version"] == STORAGE_VERSION
    assert len(saved["data"]["vehicles"]["v1"]["fuel"]) == 1

    # « Redémarrage » : une nouvelle instance relit le même fichier.
    reloaded = VehicleLogStorage(hass)
    await reloaded.async_load()
    assert reloaded.data.to_dict() == storage.data.to_dict()


async def test_load_existing_file(
    hass: HomeAssistant, hass_storage: dict[str, Any]
) -> None:
    hass_storage[STORAGE_KEY] = {
        "version": 1,
        "minor_version": 1,
        "key": STORAGE_KEY,
        "data": {
            "categories": [{"id": "other", "builtin": True}],
            "vehicles": {
                "v1": {
                    "fuel": [],
                    "expenses": [
                        {
                            "id": "e1",
                            "date": "2026-02-01",
                            "amount": 50,
                            "category_id": "other",
                        }
                    ],
                }
            },
        },
    }
    storage = VehicleLogStorage(hass)
    await storage.async_load()
    assert storage.data.records("v1").expenses.get("e1").amount == 50
    assert set(storage.data.categories) == {"other"}
