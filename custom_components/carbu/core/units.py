"""Conversions d'unités (Python pur).

Les valeurs internes sont en km, litres et l/100 km. Les fonctions de
consommation retournent ``None`` quand la conversion n'a pas de sens
(valeur nulle ou négative), pour éviter toute division par zéro.
"""

from __future__ import annotations

from .models import ConsumptionUnit, DistanceUnit, VolumeUnit

KM_PER_MILE = 1.609344
LITERS_PER_GALLON_US = 3.785411784
LITERS_PER_GALLON_UK = 4.54609
MPG_US_FACTOR = 235.215
MPG_UK_FACTOR = 282.481

_LITERS_PER_UNIT: dict[VolumeUnit, float] = {
    VolumeUnit.LITERS: 1.0,
    VolumeUnit.GALLONS_US: LITERS_PER_GALLON_US,
    VolumeUnit.GALLONS_UK: LITERS_PER_GALLON_UK,
}

# Unités « inverses » : valeur = facteur ÷ (l/100 km)
_INVERSE_FACTORS: dict[ConsumptionUnit, float] = {
    ConsumptionUnit.KM_PER_L: 100.0,
    ConsumptionUnit.MPG_US: MPG_US_FACTOR,
    ConsumptionUnit.MPG_UK: MPG_UK_FACTOR,
}


def km_to_distance(km: float, unit: DistanceUnit) -> float:
    """Convertir des kilomètres vers l'unité d'affichage."""
    return km / KM_PER_MILE if unit is DistanceUnit.MILES else km


def distance_to_km(value: float, unit: DistanceUnit) -> float:
    """Convertir une distance saisie vers des kilomètres."""
    return value * KM_PER_MILE if unit is DistanceUnit.MILES else value


def liters_to_volume(liters: float, unit: VolumeUnit) -> float:
    """Convertir des litres vers l'unité d'affichage."""
    return liters / _LITERS_PER_UNIT[unit]


def volume_to_liters(value: float, unit: VolumeUnit) -> float:
    """Convertir un volume saisi vers des litres."""
    return value * _LITERS_PER_UNIT[unit]


def l100_to_consumption(l100: float | None, unit: ConsumptionUnit) -> float | None:
    """Convertir une consommation en l/100 km vers l'unité d'affichage."""
    if l100 is None:
        return None
    if unit is ConsumptionUnit.L_PER_100KM:
        return l100
    if l100 <= 0:
        return None
    return _INVERSE_FACTORS[unit] / l100


def consumption_to_l100(value: float | None, unit: ConsumptionUnit) -> float | None:
    """Convertir une consommation exprimée dans ``unit`` vers l/100 km."""
    if value is None:
        return None
    if unit is ConsumptionUnit.L_PER_100KM:
        return value
    if value <= 0:
        return None
    # La relation est involutive : l/100 km = facteur ÷ valeur.
    return _INVERSE_FACTORS[unit] / value
