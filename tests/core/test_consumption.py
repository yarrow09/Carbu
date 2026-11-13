"""Consommation : cas limites."""

import datetime as dt

import pytest

from custom_components.vehicle_log.core.consumption import (
    average_consumption,
    consumption_segments,
)
from custom_components.vehicle_log.core.models import FuelEntry, FuelType

G = FuelType.GASOLINE
LPG = FuelType.LPG


def _f(
    day: int, km: float, liters: float, full: bool = True, fuel: FuelType = G
) -> FuelEntry:
    return FuelEntry(
        id=f"{fuel}-{day}",
        date=dt.date(2026, 1, day),
        odometer=km,
        volume=liters,
        unit_price=2,
        total_cost=liters * 2,
        fuel_type=fuel,
        full_tank=full,
    )


def test_no_entries_or_single_entry() -> None:
    assert consumption_segments([]) == []
    assert average_consumption([]) is None
    assert consumption_segments([_f(1, 1000, 40)]) == []


def test_zero_distance_is_ignored() -> None:
    segments = consumption_segments([_f(1, 1000, 40), _f(2, 1000, 5)])
    assert segments == []
    assert average_consumption(segments) is None


def test_partial_first_and_last_are_ignored() -> None:
    entries = [
        _f(1, 900, 10, full=False),
        _f(2, 1000, 40),
        _f(3, 1500, 30),
        _f(4, 1700, 12, full=False),
    ]
    segments = consumption_segments(entries)
    assert len(segments) == 1
    assert segments[0].volume == 30
    assert segments[0].l_per_100km == pytest.approx(6.0)


def test_several_partials_accumulate() -> None:
    entries = [
        _f(1, 1000, 40),
        _f(2, 1200, 10, full=False),
        _f(3, 1400, 10, full=False),
        _f(4, 1500, 10),
    ]
    (segment,) = consumption_segments(entries)
    assert segment.volume == 30
    assert segment.distance == 500
    assert segment.cost == 60


def test_decreasing_odometer_breaks_series() -> None:
    entries = [
        _f(1, 1000, 40),
        _f(2, 1500, 30),  # segment 1 : 6 l/100
        _f(3, 1400, 20, full=False),  # kilométrage décroissant : rupture
        _f(4, 1900, 30),  # pas de segment (pas de départ après rupture)
        _f(5, 2400, 35),  # segment 2 : 7 l/100
    ]
    segments = consumption_segments(entries)
    assert [round(s.l_per_100km, 3) for s in segments] == [6.0, 7.0]


def test_decreasing_full_entry_restarts_series() -> None:
    entries = [_f(1, 5000, 40), _f(2, 100, 40), _f(3, 600, 30)]
    (segment,) = consumption_segments(entries)
    assert segment.start_id == f"{G}-2"
    assert segment.l_per_100km == pytest.approx(6.0)


def test_bifuel_series_are_separate() -> None:
    entries = [
        _f(1, 1000, 40),
        _f(2, 1100, 30, fuel=LPG),
        _f(3, 1500, 30),
        _f(4, 1600, 40, fuel=LPG),
    ]
    by_fuel = {s.fuel_type: s for s in consumption_segments(entries)}
    assert by_fuel[G].l_per_100km == pytest.approx(6.0)
    assert by_fuel[LPG].l_per_100km == pytest.approx(8.0)
    assert len(consumption_segments(entries, LPG)) == 1


def test_average_is_weighted() -> None:
    entries = [_f(1, 0, 10), _f(2, 100, 10), _f(3, 1100, 50)]
    # Segments : 10 l/100 sur 100 km et 5 l/100 sur 1000 km.
    assert average_consumption(consumption_segments(entries)) == pytest.approx(
        60 / 1100 * 100
    )
