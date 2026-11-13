"""Entités par véhicule : sensors et number."""

from typing import Any

from homeassistant.components.number import (
    ATTR_VALUE,
    DOMAIN as NUMBER_DOMAIN,
    SERVICE_SET_VALUE,
)
from homeassistant.const import ATTR_ENTITY_ID, ATTR_UNIT_OF_MEASUREMENT
from homeassistant.core import HomeAssistant, State
from homeassistant.exceptions import ServiceValidationError
from homeassistant.helpers import device_registry as dr, entity_registry as er
import pytest

from custom_components.vehicle_log.const import DOMAIN
from custom_components.vehicle_log.core.repository import LogData

from .common import CLIO, REFERENCE, setup_integration, store_data
from .core import reference_dataset as ref

# 25/03/2026 13:00 à Los Angeles (fuseau par défaut des tests HA)
pytestmark = pytest.mark.freeze_time("2026-03-25 20:00:00+00:00")


@pytest.fixture(autouse=True)
def _custom_integrations(enable_custom_integrations: None) -> None:
    """Autoriser le chargement de l'intégration personnalisée."""


@pytest.fixture
def reference_storage(hass_storage: dict[str, Any]) -> None:
    """Fichier de stockage contenant le jeu de référence."""
    data = LogData()
    for entry in ref.FUEL:
        data.records("ref").fuel.add(entry)
    for expense in ref.EXPENSES:
        data.add_expense("ref", expense)
    store_data(hass_storage, data)


def _state(hass: HomeAssistant, platform: str, unique_id: str) -> State:
    entity_id = er.async_get(hass).async_get_entity_id(platform, DOMAIN, unique_id)
    assert entity_id is not None, unique_id
    state = hass.states.get(entity_id)
    assert state is not None
    return state


@pytest.mark.usefixtures("reference_storage")
async def test_sensors_match_reference(hass: HomeAssistant) -> None:
    await setup_integration(hass, {"ref": REFERENCE})

    consumption = _state(hass, "sensor", "ref_consumption")
    assert float(consumption.state) == pytest.approx(5.775)
    assert consumption.attributes[ATTR_UNIT_OF_MEASUREMENT] == "L/100 km"

    month = _state(hass, "sensor", "ref_month_cost")
    assert float(month.state) == pytest.approx(417.50)
    assert month.attributes[ATTR_UNIT_OF_MEASUREMENT] == hass.config.currency
    assert month.attributes["fuel"] == pytest.approx(109.50)
    assert month.attributes["last_reset"].startswith("2026-03-01T00:00:00")

    cost = _state(hass, "sensor", "ref_cost_per_distance")
    assert float(cost.state) == pytest.approx(ref.EXPECTED_COST_PER_KM, abs=1e-6)
    assert cost.attributes[ATTR_UNIT_OF_MEASUREMENT] == f"{hass.config.currency}/km"

    odometer = _state(hass, "sensor", "ref_odometer")
    assert float(odometer.state) == 12300
    assert odometer.attributes[ATTR_UNIT_OF_MEASUREMENT] == "km"
    assert float(_state(hass, "sensor", "ref_distance_month").state) == 300
    assert float(_state(hass, "sensor", "ref_distance_week").state) == 0
    assert float(_state(hass, "sensor", "ref_distance_year").state) == 2300
    assert float(_state(hass, "number", "ref_current_odometer").state) == 12300


async def test_device_per_vehicle(hass: HomeAssistant) -> None:
    entry = await setup_integration(hass, {"a": CLIO, "b": {**CLIO, "name": "Zoé"}})
    devices = dr.async_entries_for_config_entry(dr.async_get(hass), entry.entry_id)
    assert {d.name for d in devices} == {"Clio", "Zoé"}
    clio = next(d for d in devices if d.name == "Clio")
    assert clio.manufacturer == "Renault"
    assert clio.config_subentry_id == "a"
    # Sans donnée : pas de valeur, mais l'entité existe.
    assert _state(hass, "sensor", "a_consumption").state == "unknown"


async def test_miles_vehicle_and_bifuel(hass: HomeAssistant) -> None:
    await setup_integration(
        hass,
        {
            "us": {
                **CLIO,
                "distance_unit": "mi",
                "consumption_unit": "mpg_us",
                "secondary_fuel_type": "lpg",
            }
        },
    )
    odometer = _state(hass, "sensor", "us_odometer")
    assert odometer.attributes[ATTR_UNIT_OF_MEASUREMENT] == "mi"
    secondary = _state(hass, "sensor", "us_consumption_secondary")
    assert secondary.attributes[ATTR_UNIT_OF_MEASUREMENT] == "mpg"


@pytest.mark.usefixtures("reference_storage")
async def test_number_sets_odometer(hass: HomeAssistant) -> None:
    entry = await setup_integration(hass, {"ref": REFERENCE})
    number = _state(hass, "number", "ref_current_odometer")

    await hass.services.async_call(
        NUMBER_DOMAIN,
        SERVICE_SET_VALUE,
        {ATTR_ENTITY_ID: number.entity_id, ATTR_VALUE: 12450},
        blocking=True,
    )
    await hass.async_block_till_done()
    assert float(_state(hass, "number", "ref_current_odometer").state) == 12450
    assert float(_state(hass, "sensor", "ref_odometer").state) == 12450
    (reading,) = entry.runtime_data.storage.data.records("ref").odometer
    assert reading.odometer == 12450

    with pytest.raises(ServiceValidationError) as err:
        await hass.services.async_call(
            NUMBER_DOMAIN,
            SERVICE_SET_VALUE,
            {ATTR_ENTITY_ID: number.entity_id, ATTR_VALUE: 100},
            blocking=True,
        )
    assert err.value.translation_key == "odometer_decrease"
