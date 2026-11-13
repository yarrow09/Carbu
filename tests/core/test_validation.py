"""Saisie d'un plein et contrôles de cohérence."""

import datetime as dt

import pytest

from custom_components.carbu.core.distance import Reading
from custom_components.carbu.core.models import FuelEntry, FuelType, Vehicle
from custom_components.carbu.core.validation import (
    WarningCode,
    check_fuel_entry,
    complete_fill_amounts,
)

VEHICLE = Vehicle(id="v", name="Test", fuel_type=FuelType.DIESEL, tank_capacity=50)


def _f(
    day: int, km: float, liters: float, fid: str | None = None, full: bool = True
) -> FuelEntry:
    return FuelEntry(
        id=fid or f"f{day}",
        date=dt.date(2026, 1, day),
        odometer=km,
        volume=liters,
        unit_price=2,
        total_cost=liters * 2,
        fuel_type=FuelType.DIESEL,
        full_tank=full,
    )


def _codes(warnings: list) -> set[WarningCode]:
    return {w.code for w in warnings}


def test_complete_amounts_all_directions() -> None:
    assert complete_fill_amounts(40, None, 72) == (40, 1.8, 72)
    assert complete_fill_amounts(40, 1.799, None) == (40, 1.799, 71.96)
    assert complete_fill_amounts(None, 1.8, 72) == (40, 1.8, 72)
    assert complete_fill_amounts(40, 1.8, 80) == (40, 1.8, 80)


@pytest.mark.parametrize(
    "args",
    [(40, None, None), (0, None, 10), (None, 0, 10), (-5, 2, None), (10, -1, None)],
)
def test_complete_amounts_invalid(args: tuple) -> None:
    with pytest.raises(ValueError):  # noqa: PT011
        complete_fill_amounts(*args)


def test_clean_entry_has_no_warning() -> None:
    existing = [_f(1, 1000, 40)]
    assert check_fuel_entry(VEHICLE, _f(2, 1600, 36), existing) == []


def test_odometer_below_previous_and_above_next() -> None:
    existing = [_f(1, 1000, 40), _f(10, 2000, 40)]
    warnings = check_fuel_entry(VEHICLE, _f(5, 900, 20, full=False), existing)
    assert WarningCode.ODOMETER_BELOW_PREVIOUS in _codes(warnings)
    warnings = check_fuel_entry(VEHICLE, _f(5, 2100, 20, full=False), existing)
    assert _codes(warnings) == {WarningCode.ODOMETER_ABOVE_NEXT}


def test_manual_readings_are_considered() -> None:
    readings = [Reading(dt.datetime(2026, 1, 3), 5000)]
    warnings = check_fuel_entry(VEHICLE, _f(4, 4000, 20, full=False), [], readings)
    assert _codes(warnings) == {WarningCode.ODOMETER_BELOW_PREVIOUS}
    assert warnings[0].details == {"previous": 5000}


def test_volume_exceeds_tank_and_fuel_not_supported() -> None:
    entry = _f(1, 1000, 60)
    entry.fuel_type = FuelType.GASOLINE
    entry.total_cost = 120
    warnings = check_fuel_entry(VEHICLE, entry, [])
    # Capacité inconnue pour un carburant non déclaré : seul ce dernier est signalé.
    assert _codes(warnings) == {WarningCode.FUEL_NOT_SUPPORTED}
    assert _codes(check_fuel_entry(VEHICLE, _f(1, 1000, 60), [])) == {
        WarningCode.VOLUME_EXCEEDS_TANK
    }


def test_consumption_out_of_range() -> None:
    existing = [_f(1, 1000, 40)]
    warnings = check_fuel_entry(VEHICLE, _f(2, 1100, 45), existing)  # 45 l/100
    assert _codes(warnings) == {WarningCode.CONSUMPTION_OUT_OF_RANGE}
    assert warnings[0].details["value"] == 45


def test_editing_entry_ignores_its_previous_version() -> None:
    existing = [_f(1, 1000, 40), _f(2, 1600, 36, fid="edit")]
    edited = _f(2, 1650, 36, fid="edit")
    assert check_fuel_entry(VEHICLE, edited, existing) == []


def test_amount_mismatch() -> None:
    entry = _f(2, 1600, 36)
    entry.total_cost = 80
    existing = [_f(1, 1000, 40)]
    assert _codes(check_fuel_entry(VEHICLE, entry, existing)) == {
        WarningCode.AMOUNT_MISMATCH
    }
