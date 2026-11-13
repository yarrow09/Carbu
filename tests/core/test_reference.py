"""Vérification des calculs sur le jeu de référence calculé à la main."""

import datetime as dt

import pytest

from custom_components.carbu.core import aggregation, costs, distance, units
from custom_components.carbu.core.consumption import (
    average_consumption,
    consumption_segments,
)
from custom_components.carbu.core.models import ConsumptionUnit
from custom_components.carbu.core.periods import Period, period_bounds

from . import reference_dataset as ref

APPROX = {"abs": 1e-6}


def test_segments_match_manual_calculation() -> None:
    segments = consumption_segments(ref.FUEL)
    got = [
        (s.start_id, s.end_id, s.distance, s.volume, s.l_per_100km, s.cost)
        for s in segments
    ]
    assert len(got) == len(ref.EXPECTED_SEGMENTS)
    for actual, expected in zip(got, ref.EXPECTED_SEGMENTS, strict=True):
        assert actual[:2] == expected[:2]
        assert actual[2:] == pytest.approx(expected[2:], **APPROX)


def test_average_and_conversions() -> None:
    average = average_consumption(consumption_segments(ref.FUEL))
    assert average == pytest.approx(ref.EXPECTED_AVERAGE_L100, **APPROX)
    assert units.l100_to_consumption(
        average, ConsumptionUnit.KM_PER_L
    ) == pytest.approx(ref.EXPECTED_KM_PER_L, **APPROX)
    assert units.l100_to_consumption(average, ConsumptionUnit.MPG_US) == pytest.approx(
        ref.EXPECTED_MPG_US, **APPROX
    )
    assert units.l100_to_consumption(average, ConsumptionUnit.MPG_UK) == pytest.approx(
        ref.EXPECTED_MPG_UK, **APPROX
    )


def test_odometer_and_distances() -> None:
    readings = distance.collect_readings(ref.FUEL, ref.EXPENSES)
    assert distance.current_odometer(readings) == ref.EXPECTED_CURRENT_ODOMETER
    assert distance.total_distance(readings) == ref.EXPECTED_TOTAL_DISTANCE
    expected = {
        1: ref.EXPECTED_DISTANCE_JAN,
        2: ref.EXPECTED_DISTANCE_FEB,
        3: ref.EXPECTED_DISTANCE_MAR,
    }
    for month, value in expected.items():
        start, end = period_bounds(Period.MONTH, dt.date(2026, month, 1))
        assert distance.distance_between(readings, start, end) == pytest.approx(
            value, **APPROX
        )


def test_costs_and_cost_per_km() -> None:
    fuel = costs.fuel_cost(ref.FUEL)
    expenses = costs.expense_cost(ref.EXPENSES)
    assert fuel == pytest.approx(ref.EXPECTED_FUEL_COST)
    assert expenses == pytest.approx(ref.EXPECTED_EXPENSE_COST)
    assert costs.cost_per_distance(
        fuel + expenses, ref.EXPECTED_TOTAL_DISTANCE
    ) == pytest.approx(ref.EXPECTED_COST_PER_KM, **APPROX)


def test_monthly_grouping_by_category() -> None:
    monthly = aggregation.monthly_costs_by_category(
        ref.FUEL, ref.EXPENSES, dt.date(2026, 3, 1), months=12
    )
    assert next(iter(monthly)) == "2025-04"
    assert list(monthly)[-1] == "2026-03"
    for month, categories in ref.EXPECTED_MONTHLY.items():
        assert monthly[month] == pytest.approx(categories)
    assert all(not monthly[m] for m in list(monthly)[:9])
