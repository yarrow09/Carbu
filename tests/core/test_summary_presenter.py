"""Résumé par véhicule et conversion d'affichage, sur le jeu de référence."""

import datetime as dt

import pytest

from custom_components.carbu.core.models import (
    ConsumptionUnit,
    DistanceUnit,
    FuelType,
    Vehicle,
    VolumeUnit,
)
from custom_components.carbu.core.presenter import VehicleUnits
from custom_components.carbu.core.repository import LogData
from custom_components.carbu.core.summary import compute_summary
from custom_components.carbu.core.validation import (
    CoherenceWarning,
    WarningCode,
)

from . import reference_dataset as ref

NOW = dt.datetime(2026, 3, 25, 12, 0)  # mercredi


def _records() -> LogData:
    data = LogData()
    for entry in ref.FUEL:
        data.records("ref").fuel.add(entry)
    for expense in ref.EXPENSES:
        data.add_expense("ref", expense)
    return data


def test_summary_on_reference_dataset() -> None:
    summary = compute_summary(ref.VEHICLE, _records().records("ref"), NOW)
    assert summary.consumption[FuelType.GASOLINE] == pytest.approx(5.775)
    assert summary.last_consumption[FuelType.GASOLINE] == pytest.approx(7.0)
    assert summary.current_odometer == 12300
    assert summary.total_distance == 2300
    assert summary.distance_week == 0
    assert summary.distance_month == pytest.approx(300)
    assert summary.distance_year == pytest.approx(2300)
    # Mars : carburant 73,50 + 36,00 ; dépenses 300 + 8
    assert summary.month_fuel_cost == pytest.approx(109.50)
    assert summary.month_expense_cost == pytest.approx(308.00)
    assert summary.month_cost == pytest.approx(417.50)
    assert summary.cost_per_km == pytest.approx(ref.EXPECTED_COST_PER_KM, abs=1e-6)
    assert summary.fuel_cost_per_km == pytest.approx(317.10 / 2300)
    assert (summary.fill_count, summary.expense_count) == (6, 5)


def test_summary_empty_vehicle() -> None:
    summary = compute_summary(ref.VEHICLE, LogData().records("x"), NOW)
    assert summary.consumption == {FuelType.GASOLINE: None}
    assert summary.current_odometer is None
    assert summary.cost_per_km is None
    assert summary.month_cost == 0


IMPERIAL = Vehicle(
    id="us",
    name="Pickup",
    fuel_type=FuelType.GASOLINE,
    secondary_fuel_type=FuelType.CNG,
    distance_unit=DistanceUnit.MILES,
    volume_unit=VolumeUnit.GALLONS_US,
    consumption_unit=ConsumptionUnit.MPG_US,
)


def test_presenter_imperial_and_cng() -> None:
    units = VehicleUnits(IMPERIAL)
    assert units.distance_out(160.9344) == pytest.approx(100)
    assert units.distance_in(100) == pytest.approx(160.9344)
    assert units.volume_out(3.785411784, FuelType.GASOLINE) == pytest.approx(1)
    assert units.volume_out(10, FuelType.CNG) == 10  # kg
    # 1 €/L = 3,785 €/gal
    assert units.unit_price_out(1.0, FuelType.GASOLINE) == pytest.approx(3.785411784)
    assert units.unit_price_in(3.785411784, FuelType.GASOLINE) == pytest.approx(1.0)
    assert units.consumption_label(FuelType.GASOLINE) == "mpg"
    # MPG n'a pas de sens pour le GNV : kg/100 km
    assert units.consumption_label(FuelType.CNG) == "kg/100 km"
    assert units.consumption_out(5.0, FuelType.CNG) == 5.0
    assert units.units_view() == {
        "distance": "mi",
        "volume": {"gasoline": "gal", "cng": "kg"},
        "consumption": {"gasoline": "mpg", "cng": "kg/100 km"},
    }


def test_warning_view_converts_values() -> None:
    units = VehicleUnits(IMPERIAL)
    view = units.warning_view(
        CoherenceWarning(WarningCode.ODOMETER_BELOW_PREVIOUS, {"previous": 160.9344}),
        FuelType.GASOLINE,
    )
    assert view["code"] == "odometer_below_previous"
    assert view["details"]["previous"] == pytest.approx(100)
    view = units.warning_view(
        CoherenceWarning(WarningCode.VOLUME_EXCEEDS_TANK, {"capacity": 37.85411784}),
        FuelType.GASOLINE,
    )
    assert view["details"]["capacity"] == pytest.approx(10)


def test_summary_view_cost_per_mile() -> None:
    summary = compute_summary(ref.VEHICLE, _records().records("ref"), NOW)
    view = VehicleUnits(IMPERIAL).summary_view(summary)
    assert view["total_distance"] == pytest.approx(2300 / 1.609344)
    assert view["cost_per_distance"] == pytest.approx(
        ref.EXPECTED_COST_PER_KM * 1.609344, abs=1e-5
    )
