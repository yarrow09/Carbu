"""Conversions d'unités."""

import pytest

from custom_components.carbu.core import units
from custom_components.carbu.core.models import (
    ConsumptionUnit,
    DistanceUnit,
    VolumeUnit,
)


def test_distance() -> None:
    assert units.km_to_distance(1.609344, DistanceUnit.MILES) == pytest.approx(1)
    assert units.km_to_distance(100, DistanceUnit.KILOMETERS) == 100
    assert units.distance_to_km(100, DistanceUnit.MILES) == pytest.approx(160.9344)


def test_volume() -> None:
    assert units.volume_to_liters(1, VolumeUnit.GALLONS_US) == 3.785411784
    assert units.volume_to_liters(1, VolumeUnit.GALLONS_UK) == 4.54609
    assert units.liters_to_volume(4.54609, VolumeUnit.GALLONS_UK) == pytest.approx(1)
    assert units.liters_to_volume(10, VolumeUnit.LITERS) == 10


@pytest.mark.parametrize(
    ("unit", "expected"),
    [
        (ConsumptionUnit.L_PER_100KM, 5.0),
        (ConsumptionUnit.KM_PER_L, 20.0),
        (ConsumptionUnit.MPG_US, 47.043),
        (ConsumptionUnit.MPG_UK, 56.4962),
    ],
)
def test_consumption_roundtrip(unit: ConsumptionUnit, expected: float) -> None:
    value = units.l100_to_consumption(5.0, unit)
    assert value == pytest.approx(expected)
    assert units.consumption_to_l100(value, unit) == pytest.approx(5.0)


@pytest.mark.parametrize("unit", list(ConsumptionUnit))
def test_consumption_none_and_zero(unit: ConsumptionUnit) -> None:
    assert units.l100_to_consumption(None, unit) is None
    assert units.consumption_to_l100(None, unit) is None
    if unit is not ConsumptionUnit.L_PER_100KM:
        assert units.l100_to_consumption(0, unit) is None
        assert units.consumption_to_l100(0, unit) is None
