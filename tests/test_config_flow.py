"""Tests d'intégration : config flow, subentries véhicule et options."""

import datetime as dt
from typing import Any

from homeassistant.config_entries import (
    SOURCE_RECONFIGURE,
    SOURCE_USER,
    ConfigSubentryData,
)
from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResultType, InvalidData
from homeassistant.util.unit_system import US_CUSTOMARY_SYSTEM
import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.vehicle_log.const import DOMAIN, SUBENTRY_TYPE_VEHICLE
from custom_components.vehicle_log.core.models import Expense, FuelType

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


@pytest.fixture(autouse=True)
def _custom_integrations(enable_custom_integrations: None) -> None:
    """Autoriser le chargement de l'intégration personnalisée."""


async def _setup(
    hass: HomeAssistant, vehicles: list[dict[str, Any]] | None = None
) -> MockConfigEntry:
    subentries = [
        ConfigSubentryData(
            data=v,
            subentry_type=SUBENTRY_TYPE_VEHICLE,
            title=v["name"],
            unique_id=None,
        )
        for v in vehicles or []
    ]
    entry = MockConfigEntry(
        domain=DOMAIN, title="Carnet de bord", data={}, subentries_data=subentries
    )
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    return entry


async def _start_vehicle_flow(
    hass: HomeAssistant, entry: MockConfigEntry, source: str = SOURCE_USER, **ctx: Any
) -> Any:
    return await hass.config_entries.subentries.async_init(
        (entry.entry_id, SUBENTRY_TYPE_VEHICLE), context={"source": source, **ctx}
    )


async def _configure(hass: HomeAssistant, flow_id: str, data: dict[str, Any]) -> Any:
    return await hass.config_entries.subentries.async_configure(flow_id, data)


# --- Entrée principale ------------------------------------------------------


async def test_user_flow_creates_single_entry(hass: HomeAssistant) -> None:
    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": SOURCE_USER}
    )
    assert result["type"] is FlowResultType.FORM
    result = await hass.config_entries.flow.async_configure(result["flow_id"], {})
    assert result["type"] is FlowResultType.CREATE_ENTRY
    assert result["title"] == "Carnet de bord"
    await hass.async_block_till_done()

    again = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": SOURCE_USER}
    )
    assert again["type"] is FlowResultType.ABORT
    assert again["reason"] == "single_instance_allowed"


# --- Assistant véhicule -----------------------------------------------------


async def test_add_vehicle_multistep(hass: HomeAssistant) -> None:
    entry = await _setup(hass)
    result = await _start_vehicle_flow(hass, entry)
    assert result["step_id"] == "identity"
    result = await _configure(
        hass,
        result["flow_id"],
        {
            "name": " Clio ",
            "make": "Renault",
            "model": "Clio IV",
            "acquisition_date": "2020-05-01",
        },
    )
    assert result["step_id"] == "units"
    result = await _configure(
        hass,
        result["flow_id"],
        {"distance_unit": "km", "volume_unit": "L", "consumption_unit": "l_100km"},
    )
    assert result["step_id"] == "fuel"
    result = await _configure(
        hass,
        result["flow_id"],
        {"fuel_type": "gasoline", "tank_capacity": 45, "bifuel": False},
    )
    assert result["step_id"] == "consumption"
    result = await _configure(
        hass, result["flow_id"], {"consumption_min": 3, "consumption_max": 20}
    )
    assert result["type"] is FlowResultType.CREATE_ENTRY
    assert result["title"] == "Clio"
    assert result["data"] == CLIO
    await hass.async_block_till_done()

    # L'entrée a été rechargée et connaît le véhicule.
    (vehicle,) = entry.runtime_data.vehicles.values()
    assert vehicle.name == "Clio"
    assert vehicle.acquisition_date == dt.date(2020, 5, 1)


async def test_bifuel_and_imperial_units(hass: HomeAssistant) -> None:
    hass.config.units = US_CUSTOMARY_SYSTEM
    entry = await _setup(hass)
    result = await _start_vehicle_flow(hass, entry)
    result = await _configure(hass, result["flow_id"], {"name": "Pickup"})
    # Unités par défaut issues du système d'unités de Home Assistant.
    result = await _configure(
        hass,
        result["flow_id"],
        {"distance_unit": "mi", "volume_unit": "gal_us", "consumption_unit": "mpg_us"},
    )
    result = await _configure(
        hass,
        result["flow_id"],
        {"fuel_type": "gasoline", "tank_capacity": 10, "bifuel": True},
    )
    assert result["step_id"] == "secondary_fuel"
    # Le carburant principal n'est pas proposé comme second carburant.
    with pytest.raises(InvalidData):
        await _configure(hass, result["flow_id"], {"secondary_fuel_type": "gasoline"})
    result = await _configure(
        hass,
        result["flow_id"],
        {"secondary_fuel_type": "lpg", "secondary_tank_capacity": 5},
    )
    assert result["step_id"] == "consumption"
    # 47,043 MPG US ≈ 5 l/100 km ; 11,761 MPG US ≈ 20 l/100 km (ordre inversé).
    result = await _configure(
        hass,
        result["flow_id"],
        {"consumption_min": 47.043, "consumption_max": 11.76075},
    )
    assert result["type"] is FlowResultType.CREATE_ENTRY
    data = result["data"]
    assert data["tank_capacity"] == pytest.approx(37.854118)
    assert data["secondary_fuel_type"] == FuelType.LPG
    assert data["secondary_tank_capacity"] == pytest.approx(18.92706)
    assert data["consumption_min"] == pytest.approx(5.0, abs=1e-4)
    assert data["consumption_max"] == pytest.approx(20.0, abs=1e-4)


async def test_identity_errors(hass: HomeAssistant) -> None:
    entry = await _setup(hass, [CLIO])
    result = await _start_vehicle_flow(hass, entry)
    result = await _configure(hass, result["flow_id"], {"name": "clio"})
    assert result["errors"] == {"name": "name_exists"}
    result = await _configure(hass, result["flow_id"], {"name": "   "})
    assert result["errors"] == {"name": "name_required"}


async def test_invalid_consumption_range(hass: HomeAssistant) -> None:
    entry = await _setup(hass)
    result = await _start_vehicle_flow(hass, entry)
    result = await _configure(hass, result["flow_id"], {"name": "Twingo"})
    result = await _configure(
        hass,
        result["flow_id"],
        {"distance_unit": "km", "volume_unit": "L", "consumption_unit": "km_l"},
    )
    result = await _configure(
        hass, result["flow_id"], {"fuel_type": "diesel", "bifuel": False}
    )
    result = await _configure(
        hass, result["flow_id"], {"consumption_min": 0, "consumption_max": 20}
    )
    assert result["errors"] == {"base": "invalid_range"}


async def test_reconfigure_vehicle(hass: HomeAssistant) -> None:
    entry = await _setup(hass, [CLIO])
    subentry_id = next(iter(entry.subentries))
    result = await _start_vehicle_flow(
        hass, entry, SOURCE_RECONFIGURE, subentry_id=subentry_id
    )
    assert result["step_id"] == "identity"
    # Le même nom est autorisé pour le véhicule modifié lui-même.
    result = await _configure(
        hass, result["flow_id"], {"name": "Clio", "plate": "AB-123-CD"}
    )
    result = await _configure(
        hass,
        result["flow_id"],
        {"distance_unit": "km", "volume_unit": "L", "consumption_unit": "l_100km"},
    )
    result = await _configure(
        hass,
        result["flow_id"],
        {"fuel_type": "diesel", "tank_capacity": 50, "bifuel": False},
    )
    result = await _configure(
        hass, result["flow_id"], {"consumption_min": 4, "consumption_max": 12}
    )
    assert result["type"] is FlowResultType.ABORT
    assert result["reason"] == "reconfigure_successful"
    await hass.async_block_till_done()

    data = entry.subentries[subentry_id].data
    assert data["plate"] == "AB-123-CD"
    assert data["fuel_type"] == "diesel"
    assert data["make"] == ""  # champ vidé par l'utilisateur
    vehicle = entry.runtime_data.vehicles[subentry_id]
    assert vehicle.consumption_max == 12


async def test_removing_vehicle_purges_its_data(hass: HomeAssistant) -> None:
    entry = await _setup(hass, [CLIO, {**CLIO, "name": "Zoé"}])
    clio_id, zoe_id = list(entry.subentries)
    storage = entry.runtime_data.storage
    for vid in (clio_id, zoe_id):
        storage.data.add_expense(
            vid, Expense(date=dt.date(2026, 1, 1), amount=10, category_id="toll")
        )

    assert hass.config_entries.async_remove_subentry(entry, clio_id)
    await hass.async_block_till_done()

    storage = entry.runtime_data.storage
    assert clio_id not in storage.data.vehicles
    assert len(storage.data.records(zoe_id).expenses) == 1


async def test_data_survives_reload(hass: HomeAssistant) -> None:
    entry = await _setup(hass, [CLIO])
    vid = next(iter(entry.subentries))
    entry.runtime_data.storage.data.add_expense(
        vid, Expense(id="e1", date=dt.date(2026, 1, 1), amount=42, category_id="toll")
    )
    entry.runtime_data.storage.async_schedule_save()

    assert await hass.config_entries.async_reload(entry.entry_id)
    await hass.async_block_till_done()
    assert entry.runtime_data.storage.data.records(vid).expenses.get("e1").amount == 42


# --- Page globale : catégories ---------------------------------------------


async def _options(hass: HomeAssistant, entry: MockConfigEntry, step: str) -> Any:
    result = await hass.config_entries.options.async_init(entry.entry_id)
    assert result["type"] is FlowResultType.MENU
    return await hass.config_entries.options.async_configure(
        result["flow_id"], {"next_step_id": step}
    )


async def test_options_add_edit_delete_category(hass: HomeAssistant) -> None:
    entry = await _setup(hass, [CLIO])
    data = entry.runtime_data.storage.data
    vid = next(iter(entry.subentries))

    # Création
    result = await _options(hass, entry, "add_category")
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {"name": "Lavage", "color": [0, 170, 255], "icon": "mdi:car-wash"},
    )
    assert result["type"] is FlowResultType.CREATE_ENTRY
    (wash,) = [c for c in data.categories.values() if c.name == "Lavage"]
    assert wash.color == "#00aaff"

    # Doublon (insensible à la casse, y compris libellés traduits)
    result = await _options(hass, entry, "add_category")
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"name": "lavage"}
    )
    assert result["errors"] == {"name": "category_exists"}

    # Renommage
    result = await _options(hass, entry, "edit_category")
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"category": wash.id}
    )
    assert result["step_id"] == "edit_category_details"
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"name": "Lavage auto", "icon": "mdi:water"}
    )
    assert result["type"] is FlowResultType.CREATE_ENTRY
    assert wash.name == "Lavage auto"
    assert wash.icon == "mdi:water"

    # Suppression avec confirmation et réassignation
    data.add_expense(
        vid, Expense(id="e1", date=dt.date(2026, 1, 1), amount=8, category_id=wash.id)
    )
    result = await _options(hass, entry, "delete_category")
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"category": wash.id}
    )
    assert result["step_id"] == "confirm_delete"
    assert result["description_placeholders"]["count"] == "1"
    result = await hass.config_entries.options.async_configure(result["flow_id"], {})
    assert result["type"] is FlowResultType.CREATE_ENTRY
    assert wash.id not in data.categories
    assert data.records(vid).expenses.get("e1").category_id == "other"


async def test_options_other_category_not_deletable(hass: HomeAssistant) -> None:
    entry = await _setup(hass)
    result = await _options(hass, entry, "delete_category")
    schema = result["data_schema"].schema
    options = next(iter(schema.values())).config["options"]
    assert "other" not in {o["value"] for o in options}
    assert any(o["label"] == "Péage" or o["label"] == "Toll" for o in options)
