"""Saisie d'un plein ou de frais depuis « Configurer » (sans carte)."""

import datetime as dt
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResultType
from homeassistant.util import dt as dt_util
import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.carbu.core.models import CATEGORY_OTHER, FuelGrade, FuelType

from .common import CLIO, setup_integration


@pytest.fixture(autouse=True)
def _custom_integrations(enable_custom_integrations: None) -> None:
    """Autoriser le chargement de l'intégration personnalisée."""


async def _menu(hass: HomeAssistant, entry: MockConfigEntry, step: str) -> Any:
    result = await hass.config_entries.options.async_init(entry.entry_id)
    assert result["type"] is FlowResultType.MENU
    assert step in result["menu_options"]
    return await hass.config_entries.options.async_configure(
        result["flow_id"], {"next_step_id": step}
    )


async def _submit(hass: HomeAssistant, result: Any, data: dict[str, Any]) -> Any:
    return await hass.config_entries.options.async_configure(result["flow_id"], data)


def _fuel(**extra: Any) -> dict[str, Any]:
    return {
        "date": "2026-03-01",
        "odometer": 10000,
        "volume": 40,
        "total_cost": 70,
        "full_tank": True,
        **extra,
    }


async def test_add_fuel_single_vehicle(hass: HomeAssistant) -> None:
    entry = await setup_integration(hass, {"v1": CLIO})
    result = await _menu(hass, entry, "add_fuel")
    # Un seul véhicule : pas d'étape de choix.
    assert result["step_id"] == "add_fuel_form"
    assert result["description_placeholders"]["vehicle"] == "Clio"

    result = await _submit(hass, result, _fuel(station="Total", notes=" ok "))
    assert result["type"] is FlowResultType.ABORT
    assert result["reason"] == "fuel_saved"

    records = entry.runtime_data.coordinator.records("v1")
    (fill,) = records.fuel
    assert fill.date == dt.date(2026, 3, 1)
    assert fill.time is None
    assert fill.odometer == 10000
    assert fill.unit_price == pytest.approx(1.75)
    assert fill.station == "Total"
    assert fill.notes == "ok"
    # Les options de l'entrée ne sont pas touchées.
    assert dict(entry.options) == {}


async def test_add_fuel_today_keeps_time(hass: HomeAssistant) -> None:
    entry = await setup_integration(hass, {"v1": CLIO})
    result = await _menu(hass, entry, "add_fuel")
    today = dt_util.now().date().isoformat()
    result = await _submit(hass, result, _fuel(date=today))
    assert result["reason"] == "fuel_saved"
    (fill,) = entry.runtime_data.coordinator.records("v1").fuel
    assert fill.time is not None


async def test_add_fuel_missing_amounts(hass: HomeAssistant) -> None:
    entry = await setup_integration(hass, {"v1": CLIO})
    result = await _menu(hass, entry, "add_fuel")
    data = _fuel()
    del data["total_cost"]
    result = await _submit(hass, result, data)
    assert result["type"] is FlowResultType.FORM
    assert result["errors"] == {"base": "fuel_amounts"}
    assert not entry.runtime_data.coordinator.records("v1").fuel


async def test_add_fuel_warning_needs_confirmation(hass: HomeAssistant) -> None:
    entry = await setup_integration(hass, {"v1": CLIO})
    result = await _menu(hass, entry, "add_fuel")
    # 80 L dépasse le réservoir de 45 L.
    result = await _submit(hass, result, _fuel(volume=80, total_cost=140))
    assert result["type"] is FlowResultType.FORM
    assert result["errors"] == {"base": "coherence"}
    assert "capacity" in result["description_placeholders"]["warnings"]
    assert not entry.runtime_data.coordinator.records("v1").fuel

    result = await _submit(hass, result, _fuel(volume=80, total_cost=140, confirm=True))
    assert result["reason"] == "fuel_saved"
    assert len(entry.runtime_data.coordinator.records("v1").fuel) == 1


async def test_add_fuel_choose_vehicle_and_bifuel(hass: HomeAssistant) -> None:
    lpg = {**CLIO, "name": "Dacia", "secondary_fuel_type": "lpg"}
    entry = await setup_integration(hass, {"v1": CLIO, "v2": lpg})
    result = await _menu(hass, entry, "add_fuel")
    assert result["step_id"] == "choose_vehicle"
    result = await _submit(hass, result, {"vehicle": "v2"})
    assert result["step_id"] == "add_fuel_form"
    fields = {str(key) for key in result["data_schema"].schema}
    assert "fuel_type" in fields

    result = await _submit(hass, result, _fuel(fuel_type="lpg"))
    assert result["reason"] == "fuel_saved"
    (fill,) = entry.runtime_data.coordinator.records("v2").fuel
    assert fill.fuel_type is FuelType.LPG
    assert not entry.runtime_data.coordinator.records("v1").fuel


async def test_add_expense(hass: HomeAssistant) -> None:
    entry = await setup_integration(hass, {"v1": CLIO})
    result = await _menu(hass, entry, "add_expense")
    assert result["step_id"] == "add_expense_form"
    result = await _submit(
        hass,
        result,
        {
            "date": "2026-02-10",
            "category": CATEGORY_OTHER,
            "amount": 25.5,
            "description": " Lavage ",
        },
    )
    assert result["type"] is FlowResultType.ABORT
    assert result["reason"] == "expense_saved"
    (expense,) = entry.runtime_data.coordinator.records("v1").expenses
    assert expense.amount == 25.5
    assert expense.date == dt.date(2026, 2, 10)
    assert expense.category_id == CATEGORY_OTHER
    assert expense.description == "Lavage"
    assert expense.odometer is None


async def test_entry_without_vehicle(hass: HomeAssistant) -> None:
    entry = await setup_integration(hass)
    result = await _menu(hass, entry, "add_expense")
    assert result["type"] is FlowResultType.ABORT
    assert result["reason"] == "no_vehicle"


async def test_add_fuel_with_grade(hass: HomeAssistant) -> None:
    entry = await setup_integration(hass, {"v1": CLIO})
    result = await _menu(hass, entry, "add_fuel")
    assert "grade" in {str(key) for key in result["data_schema"].schema}
    result = await _submit(hass, result, _fuel(grade="e10"))
    assert result["reason"] == "fuel_saved"
    (fill,) = entry.runtime_data.coordinator.records("v1").fuel
    assert fill.grade is FuelGrade.E10
