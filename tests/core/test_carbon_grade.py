"""Qualité d'essence, bilan carbone et évolution du prix."""

import datetime as dt

import pytest

from custom_components.carbu.core.carbon import (
    EMISSION_FACTORS,
    fill_emissions,
    total_emissions,
)
from custom_components.carbu.core.csv_import import decode, preview_import
from custom_components.carbu.core.inputs import fuel_entry_from_input
from custom_components.carbu.core.models import (
    FuelEntry,
    FuelGrade,
    FuelType,
    Vehicle,
    parse_grade,
)
from custom_components.carbu.core.presenter import VehicleUnits
from custom_components.carbu.core.repository import LogData, VehicleRecords
from custom_components.carbu.core.statistics import (
    StatsPeriod,
    period_stats,
    price_series,
)

NOW = dt.datetime(2026, 3, 31, 12, 0)


def _fill(
    fid: str,
    day: int,
    km: float,
    liters: float,
    price: float,
    fuel: FuelType = FuelType.GASOLINE,
    grade: FuelGrade | None = None,
) -> FuelEntry:
    return FuelEntry(
        id=fid,
        date=dt.date(2026, 3, day),
        odometer=km,
        volume=liters,
        unit_price=price,
        total_cost=round(liters * price, 2),
        fuel_type=fuel,
        grade=grade,
    )


@pytest.mark.parametrize(
    ("text", "grade"),
    [
        ("e10", FuelGrade.E10),
        ("SP95-E10", FuelGrade.E10),
        ("SP95 E10", FuelGrade.E10),
        ("sp95", FuelGrade.SP95),
        ("95", FuelGrade.SP95),
        ("SP98", FuelGrade.SP98),
        ("98", FuelGrade.SP98),
        ("", None),
        ("E85", None),
        (None, None),
    ],
)
def test_parse_grade(text: str | None, grade: FuelGrade | None) -> None:
    assert parse_grade(text) is grade


def test_grade_roundtrip_and_legacy_storage() -> None:
    fill = _fill("a", 1, 1000, 40, 1.8, grade=FuelGrade.SP98)
    assert FuelEntry.from_dict(fill.to_dict()) == fill
    legacy = fill.to_dict()
    del legacy["grade"]  # données enregistrées avant la 1.0.0-alpha.1
    assert FuelEntry.from_dict(legacy).grade is None


def test_grade_input_rules() -> None:
    bifuel = Vehicle(id="v", name="V", secondary_fuel_type=FuelType.LPG)
    units = VehicleUnits(bifuel)
    base = {"odometer": 1000, "volume": 40, "unit_price": 1.8}
    entry = fuel_entry_from_input(units, {**base, "grade": "e10"}, None, NOW)
    assert entry.grade is FuelGrade.E10
    # Modification sans le champ : la qualité est conservée.
    kept = fuel_entry_from_input(units, {**base, "volume": 41}, entry, NOW)
    assert kept.grade is FuelGrade.E10
    cleared = fuel_entry_from_input(units, {**base, "grade": None}, entry, NOW)
    assert cleared.grade is None
    # La qualité ne concerne que l'essence.
    lpg = fuel_entry_from_input(
        units, {**base, "grade": "sp98", "fuel_type": "lpg"}, None, NOW
    )
    assert lpg.grade is None


def test_emission_factors() -> None:
    assert EMISSION_FACTORS == {
        FuelType.GASOLINE: 2.69,
        FuelType.DIESEL: 3.10,
        FuelType.LPG: 1.86,
        FuelType.CNG: 2.96,
    }
    assert fill_emissions(_fill("a", 1, 0, 40, 1.8)) == pytest.approx(107.6)
    assert fill_emissions(_fill("b", 1, 0, 50, 1.7, FuelType.DIESEL)) == pytest.approx(
        155.0
    )
    assert total_emissions([]) == 0


def test_period_carbon_and_price_series() -> None:
    vehicle = Vehicle(
        id="v",
        name="V",
        secondary_fuel_type=FuelType.LPG,
        acquisition_date=dt.date(2026, 1, 1),
    )
    records = VehicleRecords()
    for fill in (
        _fill("f1", 1, 10000, 40, 1.80, grade=FuelGrade.SP95),
        _fill("f2", 10, 10500, 30, 1.00, FuelType.LPG),
        _fill("f3", 20, 11000, 35, 1.90, grade=FuelGrade.E10),
    ):
        records.fuel.add(fill)
    stats = period_stats(vehicle, records, StatsPeriod.MONTHS_3, NOW.date())
    expected = 40 * 2.69 + 30 * 1.86 + 35 * 2.69
    assert stats.co2_kg == pytest.approx(expected)
    assert stats.co2_g_per_km == pytest.approx(expected * 1000 / 1000)

    prices = price_series(records.fuel.items, FuelType.GASOLINE)
    assert [(p.entry_id, p.unit_price, p.grade) for p in prices] == [
        ("f1", 1.80, FuelGrade.SP95),
        ("f3", 1.90, FuelGrade.E10),
    ]
    later = price_series(records.fuel.items, FuelType.GASOLINE, dt.date(2026, 3, 15))
    assert [p.entry_id for p in later] == ["f3"]


def test_import_reads_grade_column() -> None:
    text = decode(
        b"date;odometer_km;volume;total_cost;fuel_type;grade\n"
        b"2026-03-01;1000;40;72;gasoline;SP95-E10\n"
        b"2026-03-02;1500;40;72;gasoline;98\n"
        b"2026-03-03;2000;40;72;diesel;sp98\n"
    )
    preview = preview_import(
        text,
        VehicleRecords(),
        LogData().categories,
        default_fuel=FuelType.GASOLINE,
    )
    assert [line.record.grade for line in preview.lines] == [
        FuelGrade.E10,
        FuelGrade.SP98,
        None,
    ]
