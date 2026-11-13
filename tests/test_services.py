"""Services publics, appelés directement et depuis une automatisation."""

import csv
import datetime as dt
from pathlib import Path
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ServiceValidationError
from homeassistant.helpers import device_registry as dr, entity_registry as er
from homeassistant.setup import async_setup_component
import pytest

from custom_components.carbu.const import DOMAIN
from custom_components.carbu.core.repository import LogData

from .common import CLIO, REFERENCE, setup_integration, store_data
from .core import reference_dataset as ref

pytestmark = pytest.mark.freeze_time("2026-03-25 20:00:00+00:00")


@pytest.fixture(autouse=True)
def _custom_integrations(enable_custom_integrations: None) -> None:
    """Autoriser le chargement de l'intégration personnalisée."""


@pytest.fixture
async def entry(hass: HomeAssistant, hass_storage: dict[str, Any]) -> Any:
    data = LogData()
    for fill in ref.FUEL:
        data.records("ref").fuel.add(fill)
    for expense in ref.EXPENSES:
        data.add_expense("ref", expense)
    store_data(hass_storage, data)
    return await setup_integration(
        hass, {"ref": REFERENCE, "us": {**CLIO, "distance_unit": "mi"}}
    )


def _device(hass: HomeAssistant, vehicle_id: str) -> str:
    entry_id = hass.config_entries.async_entries(DOMAIN)[0].entry_id
    device = dr.async_get(hass).async_get_device_by_identifier(
        (DOMAIN, vehicle_id), entry_id
    )
    assert device is not None
    return device.id


def _sensor(hass: HomeAssistant, unique_id: str) -> float:
    entity_id = er.async_get(hass).async_get_entity_id("sensor", DOMAIN, unique_id)
    assert entity_id
    state = hass.states.get(entity_id)
    assert state
    return float(state.state)


async def test_all_services_from_an_automation(hass: HomeAssistant, entry: Any) -> None:
    """Critère d'acceptation : les services fonctionnent depuis une automatisation."""
    device = _device(hass, "ref")
    assert await async_setup_component(
        hass,
        "automation",
        {
            "automation": {
                "alias": "Test Carbu",
                "triggers": {"trigger": "event", "event_type": "carbu_test"},
                "actions": [
                    {
                        "action": "carbu.add_fuel",
                        "data": {
                            "vehicle": device,
                            "odometer": 12900,
                            "volume": 40,
                            "total_cost": 74,
                        },
                    },
                    {
                        "action": "carbu.add_expense",
                        "data": {
                            "vehicle": device,
                            "amount": 25,
                            "category": "Toll",  # libellé traduit accepté
                        },
                    },
                    {
                        "action": "carbu.update_odometer",
                        "data": {"vehicle": device, "odometer": 13000},
                    },
                    {
                        "action": "carbu.export_data",
                        "response_variable": "export",
                    },
                    {
                        "event": "carbu_exported",
                        "event_data": {"folder": "{{ export.folder }}"},
                    },
                ],
            }
        },
    )
    exported: list[str] = []
    hass.bus.async_listen(
        "carbu_exported", lambda event: exported.append(event.data["folder"])
    )

    hass.bus.async_fire("carbu_test")
    await hass.async_block_till_done()

    records = entry.runtime_data.storage.data.records("ref")
    assert len(records.fuel) == len(ref.FUEL) + 1
    assert records.expenses.items[-1].category_id == "toll"
    assert records.odometer.items[-1].odometer == 13000
    assert _sensor(hass, "ref_odometer") == 13000
    # (20 + 40) L / (12 900 − 12 000) km sur le nouveau segment
    assert _sensor(hass, "ref_consumption") == pytest.approx(175.5 / 2900 * 100)

    (folder,) = exported
    files = await hass.async_add_executor_job(
        lambda: sorted(p.name for p in Path(folder).iterdir())
    )
    assert files == [
        "categories.csv",
        "depenses.csv",
        "pleins.csv",
        "rappels.csv",
        "releves.csv",
    ]


async def test_add_fuel_response_and_warnings(hass: HomeAssistant, entry: Any) -> None:
    response = await hass.services.async_call(
        DOMAIN,
        "add_fuel",
        {
            "vehicle": _device(hass, "ref"),
            "odometer": 12000,  # inférieur au dernier relevé
            "volume": 30,
            "unit_price": 1.9,
            "full_tank": False,
        },
        blocking=True,
        return_response=True,
    )
    assert response is not None
    assert response["saved"] is True
    assert [w["code"] for w in response["warnings"]] == ["odometer_below_previous"]
    assert response["entry"]["total_cost"] == pytest.approx(57.0)

    with pytest.raises(ServiceValidationError) as err:
        await hass.services.async_call(
            DOMAIN,
            "add_fuel",
            {
                "vehicle": _device(hass, "ref"),
                "odometer": 100,
                "volume": 30,
                "total_cost": 50,
                "strict": True,
            },
            blocking=True,
        )
    assert err.value.translation_key == "coherence_warnings"
    assert len(entry.runtime_data.storage.data.records("ref").fuel) == len(ref.FUEL) + 1


async def test_services_use_vehicle_units(hass: HomeAssistant, entry: Any) -> None:
    await hass.services.async_call(
        DOMAIN,
        "update_odometer",
        {"vehicle": _device(hass, "us"), "odometer": 100},
        blocking=True,
    )
    reading = entry.runtime_data.storage.data.records("us").odometer.items[-1]
    assert reading.odometer == pytest.approx(160.9344)  # stocké en km
    assert reading.date == dt.date(2026, 3, 25)


async def test_service_errors(hass: HomeAssistant, entry: Any) -> None:
    device = _device(hass, "ref")
    cases = [
        ("add_fuel", {"vehicle": "nope", "odometer": 1, "volume": 1, "total_cost": 1},
         "vehicle_not_found"),
        ("add_fuel", {"vehicle": device, "odometer": 1, "volume": 1}, "invalid_input"),
        ("add_expense", {"vehicle": device, "amount": 1, "category": "Lavage"},
         "unknown_category"),
        ("update_odometer", {"vehicle": device, "odometer": 5, "strict": True},
         "coherence_warnings"),
    ]  # fmt: skip
    for service, data, key in cases:
        with pytest.raises(ServiceValidationError) as err:
            await hass.services.async_call(DOMAIN, service, data, blocking=True)
        assert err.value.translation_key == key, service


async def test_export_content(hass: HomeAssistant, entry: Any) -> None:
    """Critère d'acceptation : l'export CSV contient toutes les données."""
    response = await hass.services.async_call(
        DOMAIN, "export_data", {}, blocking=True, return_response=True
    )
    assert response is not None
    folder = Path(str(response["folder"]))

    def _read(name: str) -> tuple[bytes, list[dict[str, str]]]:
        raw = (folder / name).read_bytes()
        text = raw.decode("utf-8-sig")
        return raw, list(csv.DictReader(text.splitlines(), delimiter=";"))

    raw, fuel = await hass.async_add_executor_job(_read, "pleins.csv")
    assert raw.startswith(b"\xef\xbb\xbf")  # BOM UTF-8
    assert [r["id"] for r in fuel] == [e.id for e in ref.FUEL]
    _, expenses = await hass.async_add_executor_job(_read, "depenses.csv")
    assert {r["id"] for r in expenses} == {e.id for e in ref.EXPENSES}
    assert {r["category_name"] for r in expenses} >= {"Toll", "Maintenance"}


async def test_services_require_loaded_integration(hass: HomeAssistant) -> None:
    entry = await setup_integration(hass, {})
    await hass.config_entries.async_unload(entry.entry_id)
    with pytest.raises(ServiceValidationError) as err:
        await hass.services.async_call(DOMAIN, "export_data", {}, blocking=True)
    assert err.value.translation_key == "not_loaded"
