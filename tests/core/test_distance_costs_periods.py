"""Distances, coûts, périodes et agrégations : cas limites."""

import datetime as dt

import pytest

from custom_components.vehicle_log.core import aggregation, costs, distance
from custom_components.vehicle_log.core.distance import Reading
from custom_components.vehicle_log.core.models import Expense, OdometerReading
from custom_components.vehicle_log.core.periods import (
    Period,
    add_months,
    month_keys,
    period_bounds,
)


def _r(day: int, km: float, hour: int = 0) -> Reading:
    return Reading(dt.datetime(2026, 1, day, hour), km)


def test_empty_readings() -> None:
    assert distance.current_odometer([]) is None
    assert distance.total_distance([]) == 0
    assert (
        distance.distance_between([], dt.datetime(2026, 1, 1), dt.datetime(2026, 2, 1))
        == 0
    )


def test_decreasing_odometer_never_negative() -> None:
    readings = [_r(1, 1000), _r(2, 900), _r(3, 1100)]
    assert distance.total_distance(readings) == 200
    assert distance.current_odometer(readings) == 1100


def test_same_instant_readings_and_empty_window() -> None:
    readings = [_r(5, 1000), _r(5, 1050)]
    start, end = dt.datetime(2026, 1, 1), dt.datetime(2026, 2, 1)
    assert distance.distance_between(readings, start, end) == 50
    assert distance.distance_between(readings, end, start) == 0


def test_interpolation_with_hours() -> None:
    readings = [_r(1, 0, 12), _r(2, 100, 12)]
    window = (dt.datetime(2026, 1, 2), dt.datetime(2026, 1, 3))
    assert distance.distance_between(readings, *window) == pytest.approx(50)


def test_collect_readings_merges_sources() -> None:
    readings = distance.collect_readings(
        [],
        [
            Expense(date=dt.date(2026, 1, 2), amount=1, category_id="other"),
            Expense(
                date=dt.date(2026, 1, 3), amount=1, category_id="other", odometer=500
            ),
        ],
        [OdometerReading(date=dt.date(2026, 1, 1), odometer=400)],
    )
    assert [r.odometer for r in readings] == [400, 500]


def test_cost_per_distance_zero() -> None:
    assert costs.cost_per_distance(100, 0) is None
    assert costs.cost_per_distance(100, 50) == 2


def test_costs_filtered_by_period() -> None:
    expenses = [
        Expense(date=dt.date(2026, 1, 31), amount=10, category_id="other"),
        Expense(date=dt.date(2026, 2, 1), amount=20, category_id="other"),
    ]
    assert costs.expense_cost(expenses, dt.date(2026, 2, 1), dt.date(2026, 3, 1)) == 20


def test_tco_edge_cases() -> None:
    assert costs.depreciation(None, 1000) == 0
    assert costs.tco(100, 0, 0, 0) == (None, None)
    assert costs.months_between(dt.date(2026, 2, 1), dt.date(2026, 1, 1)) == 0


def test_period_bounds() -> None:
    # Le 14/01/2026 est un mercredi.
    assert period_bounds(Period.WEEK, dt.date(2026, 1, 14)) == (
        dt.datetime(2026, 1, 12),
        dt.datetime(2026, 1, 19),
    )
    assert period_bounds(Period.MONTH, dt.date(2026, 12, 25)) == (
        dt.datetime(2026, 12, 1),
        dt.datetime(2027, 1, 1),
    )
    assert period_bounds(Period.YEAR, dt.date(2026, 6, 1)) == (
        dt.datetime(2026, 1, 1),
        dt.datetime(2027, 1, 1),
    )
    assert add_months(dt.date(2026, 1, 31), -1) == dt.date(2025, 12, 1)
    assert month_keys(dt.date(2026, 2, 10), 3) == ["2025-12", "2026-01", "2026-02"]


def test_filter_expenses_and_latest() -> None:
    expenses = [
        Expense(id=str(i), date=dt.date(2026, 1, i), amount=i * 10, category_id=cat)
        for i, cat in [(1, "toll"), (2, "parking"), (3, "toll"), (4, "other")]
    ]
    filtered = aggregation.filter_expenses(
        expenses,
        start=dt.date(2026, 1, 2),
        category_ids={"toll", "parking"},
        min_amount=25,
    )
    assert [e.id for e in filtered] == ["3"]
    assert aggregation.filter_expenses(expenses, max_amount=10)[0].id == "1"
    assert [e.id for e in aggregation.latest(expenses, 2)] == ["4", "3"]
    assert aggregation.latest(expenses, 0) == []
