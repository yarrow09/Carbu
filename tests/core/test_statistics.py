"""Statistiques par période et courbe de consommation (jeu de référence)."""

import datetime as dt

import pytest

from custom_components.vehicle_log.core.models import FuelType
from custom_components.vehicle_log.core.repository import LogData
from custom_components.vehicle_log.core.statistics import (
    StatsPeriod,
    consumption_series,
    period_start,
    period_stats,
)

from . import reference_dataset as ref

TODAY = dt.date(2026, 3, 25)
G = FuelType.GASOLINE


def _records() -> LogData:
    data = LogData()
    for entry in ref.FUEL:
        data.records("ref").fuel.add(entry)
    for expense in ref.EXPENSES:
        data.add_expense("ref", expense)
    return data


def test_period_starts() -> None:
    acquisition = dt.date(2026, 1, 1)
    first = dt.date(2026, 1, 5)
    assert period_start(StatsPeriod.DAYS_30, TODAY, None, None) == dt.date(2026, 2, 24)
    assert period_start(StatsPeriod.MONTHS_3, TODAY, None, None) == dt.date(
        2025, 12, 26
    )
    assert period_start(StatsPeriod.MONTHS_12, TODAY, None, None) == dt.date(
        2025, 3, 26
    )
    # 31 mai − 3 mois : 28/29 février borné, + 1 jour
    assert period_start(
        StatsPeriod.MONTHS_3, dt.date(2026, 5, 31), None, None
    ) == dt.date(2026, 3, 1)
    assert period_start(StatsPeriod.SINCE_ACQUISITION, TODAY, acquisition, first) == (
        acquisition
    )
    assert period_start(StatsPeriod.SINCE_ACQUISITION, TODAY, None, first) == first
    assert period_start(StatsPeriod.SINCE_ACQUISITION, TODAY, None, None) == TODAY


def test_last_30_days_matches_manual_calculation() -> None:
    """Calcul manuel détaillé dans docs/calculs.md (« Statistiques »)."""
    stats = period_stats(
        ref.VEHICLE, _records().records("ref"), StatsPeriod.DAYS_30, TODAY
    )
    assert stats.start == dt.date(2026, 2, 24)
    assert stats.days == 30
    assert stats.fuel_cost == pytest.approx(109.50)  # f5 + f6
    assert stats.expense_cost == pytest.approx(312.60)  # e3 + e4 + e5
    assert stats.fuel_volume[G] == pytest.approx(62.0)
    assert stats.consumption[G] == pytest.approx(7.0)  # segment C seul
    # f4→f5 : 600 km sur 14 j dont 5 dans la période ; f5→f6 : 300 km
    assert stats.distance == pytest.approx(600 * 5 / 14 + 300)
    assert stats.expenses_by_category == pytest.approx(
        {"parking": 4.60, "insurance": 300.00, "toll": 8.00}
    )
    assert (stats.fill_count, stats.expense_count) == (2, 3)
    assert stats.cost_per_km == pytest.approx(422.10 / (600 * 5 / 14 + 300))


@pytest.mark.parametrize(
    "period",
    [StatsPeriod.MONTHS_3, StatsPeriod.MONTHS_12, StatsPeriod.SINCE_ACQUISITION],
)
def test_long_periods_cover_whole_dataset(period: StatsPeriod) -> None:
    stats = period_stats(ref.VEHICLE, _records().records("ref"), period, TODAY)
    assert stats.distance == pytest.approx(ref.EXPECTED_TOTAL_DISTANCE)
    assert stats.consumption[G] == pytest.approx(ref.EXPECTED_AVERAGE_L100)
    assert stats.total_cost == pytest.approx(765.10)
    assert stats.cost_per_km == pytest.approx(ref.EXPECTED_COST_PER_KM, abs=1e-6)


def test_since_acquisition_start() -> None:
    stats = period_stats(
        ref.VEHICLE, _records().records("ref"), StatsPeriod.SINCE_ACQUISITION, TODAY
    )
    assert stats.start == dt.date(2026, 1, 1)


def test_empty_period() -> None:
    stats = period_stats(
        ref.VEHICLE, LogData().records("x"), StatsPeriod.DAYS_30, TODAY
    )
    assert stats.distance == 0
    assert stats.consumption[G] is None
    assert stats.cost_per_km is None


def test_consumption_series_with_weighted_moving_average() -> None:
    points = consumption_series(ref.FUEL, G, window=2)
    assert [p.entry_id for p in points] == ["f2", "f4", "f5"]
    assert [p.l_per_100km for p in points] == pytest.approx([6.0, 4.6875, 7.0])
    # Fenêtre de 2 segments, pondérée : Σ litres ÷ Σ km
    assert [p.moving_average for p in points] == pytest.approx(
        [6.0, 73.5 / 1400 * 100, 79.5 / 1400 * 100]
    )


def test_consumption_series_start_keeps_history() -> None:
    points = consumption_series(ref.FUEL, G, window=2, start=dt.date(2026, 2, 1))
    assert [p.entry_id for p in points] == ["f4", "f5"]
    assert points[0].moving_average == pytest.approx(73.5 / 1400 * 100)
    assert consumption_series([], G) == []
    assert consumption_series(ref.FUEL, G, window=0)[1].moving_average == (
        pytest.approx(4.6875)
    )
