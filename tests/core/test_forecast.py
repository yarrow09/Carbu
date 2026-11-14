"""Estimation du prochain plein."""

import datetime as dt

import pytest

from custom_components.carbu.core.distance import Reading
from custom_components.carbu.core.forecast import driving_rate, estimate_next_fill
from custom_components.carbu.core.models import FuelEntry, FuelType, OdometerReading
from custom_components.carbu.core.repository import VehicleRecords

START = dt.date(2026, 1, 1)


def _records(
    intervals: list[float], days: int = 10, liters: float = 30
) -> VehicleRecords:
    records = VehicleRecords()
    km = 10000.0
    for i, step in enumerate([0.0, *intervals]):
        km += step
        records.fuel.add(
            FuelEntry(
                id=f"f{i}",
                date=START + dt.timedelta(days=i * days),
                odometer=km,
                volume=liters,
                unit_price=2.0,
                total_cost=liters * 2,
                fuel_type=FuelType.GASOLINE,
            )
        )
    return records


def test_estimate_from_habits() -> None:
    # 500 km tous les 10 jours (50 km/j), 30 L par plein → 6 L/100 km.
    records = _records([500, 500, 500, 500])
    today = START + dt.timedelta(days=42)
    estimate = estimate_next_fill(records, FuelType.GASOLINE, today)
    assert estimate is not None
    assert estimate.interval == 500
    assert estimate.km_per_day == pytest.approx(50)
    assert estimate.odometer == 12500
    assert estimate.date == START + dt.timedelta(days=50)
    assert estimate.days_left == 8
    # 2 jours depuis le dernier plein au rythme de 50 km/j.
    assert estimate.distance_left == pytest.approx(400)
    assert estimate.volume == pytest.approx(30)
    assert estimate.cost == pytest.approx(60)
    assert not estimate.overdue


def test_median_ignores_outlier_and_overdue() -> None:
    records = _records([500, 120, 500, 2000, 500])
    late = START + dt.timedelta(days=80)
    estimate = estimate_next_fill(records, FuelType.GASOLINE, late)
    assert estimate is not None
    assert estimate.interval == 500
    assert estimate.overdue
    assert estimate.distance_left == 0


def test_manual_reading_moves_estimate() -> None:
    records = _records([500, 500, 500, 500])
    records.odometer.add(
        OdometerReading(id="o", date=START + dt.timedelta(days=45), odometer=12300)
    )
    estimate = estimate_next_fill(
        records, FuelType.GASOLINE, START + dt.timedelta(days=45)
    )
    assert estimate is not None
    assert estimate.distance_left == pytest.approx(200)
    assert estimate.date == START + dt.timedelta(days=45 + 4)


def test_not_enough_history() -> None:
    assert estimate_next_fill(_records([500]), FuelType.GASOLINE, START) is None
    assert estimate_next_fill(_records([500] * 4), FuelType.DIESEL, START) is None
    same_day = _records([500, 500, 500], days=0)
    assert estimate_next_fill(same_day, FuelType.GASOLINE, START) is None


def test_driving_rate_window() -> None:
    at = dt.datetime(2026, 1, 1)
    readings = [
        Reading(at, 0),
        Reading(at + dt.timedelta(days=300), 3000),
        Reading(at + dt.timedelta(days=400), 8000),
    ]
    # Seuls les relevés des 120 derniers jours comptent… s'il y en a deux.
    assert driving_rate(readings, dt.date(2027, 2, 5)) == pytest.approx(50)
    assert driving_rate(readings[:1], dt.date(2026, 1, 2)) is None
