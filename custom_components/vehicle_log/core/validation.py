"""Saisie d'un plein : montants et contrôles de cohérence (Python pur).

Les contrôles produisent des avertissements, jamais des refus : l'interface
demande confirmation puis enregistre.
"""

from __future__ import annotations

from collections.abc import Iterable
from dataclasses import dataclass, field
import datetime as dt
from enum import StrEnum

from .consumption import consumption_segments
from .distance import Reading
from .models import FuelEntry, Vehicle

PRICE_DECIMALS = 3
AMOUNT_DECIMALS = 2
VOLUME_DECIMALS = 2
# Écart toléré entre volume × prix et montant quand les trois sont saisis.
AMOUNT_TOLERANCE = 0.05


class WarningCode(StrEnum):
    """Type d'avertissement de cohérence."""

    ODOMETER_BELOW_PREVIOUS = "odometer_below_previous"
    ODOMETER_ABOVE_NEXT = "odometer_above_next"
    CONSUMPTION_OUT_OF_RANGE = "consumption_out_of_range"
    VOLUME_EXCEEDS_TANK = "volume_exceeds_tank"
    FUEL_NOT_SUPPORTED = "fuel_not_supported"
    AMOUNT_MISMATCH = "amount_mismatch"


@dataclass(frozen=True, slots=True)
class CoherenceWarning:
    """Avertissement avec ses valeurs (pour le message traduit)."""

    code: WarningCode
    details: dict[str, float | str] = field(default_factory=dict)


def complete_fill_amounts(
    volume: float | None, unit_price: float | None, total: float | None
) -> tuple[float, float, float]:
    """Compléter (volume, prix unitaire, montant) à partir de deux valeurs.

    Si les trois sont fournies, elles sont conservées telles quelles (voir
    ``check_amounts`` pour l'écart éventuel).
    """
    provided = sum(v is not None for v in (volume, unit_price, total))
    if provided < 2:
        raise ValueError("Deux valeurs parmi volume, prix et montant sont requises")
    if volume is not None and unit_price is not None and total is not None:
        result = (volume, unit_price, total)
    elif volume is not None and total is not None:
        if volume <= 0:
            raise ValueError("Le volume doit être positif")
        result = (volume, round(total / volume, PRICE_DECIMALS), total)
    elif volume is not None and unit_price is not None:
        result = (volume, unit_price, round(volume * unit_price, AMOUNT_DECIMALS))
    else:
        assert unit_price is not None
        assert total is not None
        if unit_price <= 0:
            raise ValueError("Le prix unitaire doit être positif")
        result = (round(total / unit_price, VOLUME_DECIMALS), unit_price, total)
    if result[0] <= 0:
        raise ValueError("Le volume doit être positif")
    if result[1] < 0 or result[2] < 0:
        raise ValueError("Les montants ne peuvent pas être négatifs")
    return result


def check_amounts(entry: FuelEntry) -> list[CoherenceWarning]:
    """Signaler un montant incohérent avec volume × prix unitaire."""
    expected = entry.volume * entry.unit_price
    if abs(expected - entry.total_cost) > AMOUNT_TOLERANCE:
        return [
            CoherenceWarning(
                WarningCode.AMOUNT_MISMATCH,
                {"expected": round(expected, AMOUNT_DECIMALS)},
            )
        ]
    return []


def check_odometer(
    at: dt.datetime, odometer: float, readings: Iterable[Reading]
) -> list[CoherenceWarning]:
    """Comparer un kilométrage aux relevés qui l'encadrent.

    ``readings`` ne doit pas contenir le relevé contrôlé lui-même.
    """
    previous: Reading | None = None
    following: Reading | None = None
    for reading in sorted(readings):
        if reading.at <= at:
            previous = reading
        elif following is None:
            following = reading
    warnings: list[CoherenceWarning] = []
    if previous is not None and odometer < previous.odometer:
        warnings.append(
            CoherenceWarning(
                WarningCode.ODOMETER_BELOW_PREVIOUS, {"previous": previous.odometer}
            )
        )
    if following is not None and odometer > following.odometer:
        warnings.append(
            CoherenceWarning(
                WarningCode.ODOMETER_ABOVE_NEXT, {"next": following.odometer}
            )
        )
    return warnings


def check_fuel_entry(
    vehicle: Vehicle,
    entry: FuelEntry,
    fuel_entries: Iterable[FuelEntry],
    other_readings: Iterable[Reading] = (),
) -> list[CoherenceWarning]:
    """Contrôler un plein (nouveau ou modifié) avant enregistrement.

    ``fuel_entries`` : pleins existants (l'entrée elle-même est ignorée si elle
    y figure déjà) ; ``other_readings`` : relevés hors pleins.
    """
    others = [e for e in fuel_entries if e.id != entry.id]
    warnings: list[CoherenceWarning] = []

    if entry.fuel_type not in vehicle.fuel_types:
        warnings.append(
            CoherenceWarning(WarningCode.FUEL_NOT_SUPPORTED, {"fuel": entry.fuel_type})
        )

    capacity = vehicle.tank_capacity_for(entry.fuel_type)
    if capacity is not None and entry.volume > capacity:
        warnings.append(
            CoherenceWarning(WarningCode.VOLUME_EXCEEDS_TANK, {"capacity": capacity})
        )

    at = dt.datetime.combine(entry.date, entry.time or dt.time.min)
    readings = [
        Reading(dt.datetime.combine(e.date, e.time or dt.time.min), e.odometer)
        for e in others
    ]
    readings += list(other_readings)
    warnings += check_odometer(at, entry.odometer, readings)
    warnings += check_amounts(entry)

    if entry.full_tank:
        series = sorted([*others, entry], key=FuelEntry.sort_key)
        for segment in consumption_segments(series, entry.fuel_type):
            if segment.end_id != entry.id:
                continue
            value = segment.l_per_100km
            if not vehicle.consumption_min <= value <= vehicle.consumption_max:
                warnings.append(
                    CoherenceWarning(
                        WarningCode.CONSUMPTION_OUT_OF_RANGE,
                        {
                            "value": round(value, 2),
                            "min": vehicle.consumption_min,
                            "max": vehicle.consumption_max,
                        },
                    )
                )
    return warnings
