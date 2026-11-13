"""Kilométrage et distance par période (Python pur).

Les relevés proviennent des pleins, des dépenses portant un kilométrage et des
relevés manuels. La distance d'une période est la somme des progressions
positives entre relevés consécutifs, répartie au prorata du temps quand deux
relevés encadrent une borne de période (interpolation linéaire). Une baisse du
compteur (erreur de saisie ou compteur remplacé) ne compte jamais comme une
distance négative.
"""

from __future__ import annotations

from collections.abc import Iterable
from dataclasses import dataclass
import datetime as dt
import itertools

from .models import Expense, FuelEntry, OdometerReading


@dataclass(frozen=True, slots=True, order=True)
class Reading:
    """Relevé de compteur horodaté (km)."""

    at: dt.datetime
    odometer: float


def _at(day: dt.date, time: dt.time | None) -> dt.datetime:
    return dt.datetime.combine(day, time or dt.time.min)


def collect_readings(
    fuel: Iterable[FuelEntry],
    expenses: Iterable[Expense] = (),
    manual: Iterable[OdometerReading] = (),
) -> list[Reading]:
    """Fusionner et trier tous les relevés de compteur connus."""
    readings = [Reading(_at(e.date, e.time), e.odometer) for e in fuel]
    readings += [
        Reading(_at(e.date, None), e.odometer)
        for e in expenses
        if e.odometer is not None
    ]
    readings += [Reading(_at(r.date, r.time), r.odometer) for r in manual]
    readings.sort()
    return readings


def current_odometer(readings: list[Reading]) -> float | None:
    """Dernier kilométrage connu (relevé le plus récent)."""
    return readings[-1].odometer if readings else None


def total_distance(readings: list[Reading]) -> float:
    """Distance totale parcourue sur l'ensemble des relevés."""
    return sum(
        max(0.0, b.odometer - a.odometer) for a, b in itertools.pairwise(readings)
    )


def distance_between(
    readings: list[Reading], start: dt.datetime, end: dt.datetime
) -> float:
    """Distance parcourue dans l'intervalle ``[start, end[``."""
    if end <= start:
        return 0.0
    distance = 0.0
    for a, b in itertools.pairwise(readings):
        delta = b.odometer - a.odometer
        if delta <= 0:
            continue
        if a.at == b.at:  # deux relevés au même instant
            if start <= a.at < end:
                distance += delta
            continue
        if b.at <= start or a.at >= end:
            continue
        span = (b.at - a.at).total_seconds()
        overlap = (min(b.at, end) - max(a.at, start)).total_seconds()
        distance += delta * overlap / span
    return distance
