"""Statistiques par période et courbe de consommation (Python pur).

Périodes : 30 derniers jours, 3 derniers mois, 12 derniers mois, depuis
l'acquisition (ou, à défaut, depuis la première donnée). Les fenêtres glissantes
se terminent aujourd'hui inclus.
"""

from __future__ import annotations

from bisect import bisect_left
from collections.abc import Iterable
from dataclasses import dataclass
import datetime as dt
from enum import StrEnum
from itertools import pairwise

from . import carbon, costs, distance
from .consumption import ConsumptionSegment, average_consumption, consumption_segments
from .models import FuelEntry, FuelGrade, FuelType, Vehicle
from .periods import add_months
from .repository import VehicleRecords

DEFAULT_MOVING_AVERAGE = 5


class StatsPeriod(StrEnum):
    """Période des statistiques."""

    DAYS_30 = "30d"
    MONTHS_3 = "3m"
    MONTHS_12 = "12m"
    SINCE_ACQUISITION = "all"


def period_start(
    period: StatsPeriod,
    today: dt.date,
    acquisition_date: dt.date | None,
    first_record: dt.date | None,
) -> dt.date:
    """Premier jour inclus de la période."""
    if period is StatsPeriod.DAYS_30:
        return today - dt.timedelta(days=29)
    if period is StatsPeriod.MONTHS_3:
        return _same_day_months_ago(today, 3)
    if period is StatsPeriod.MONTHS_12:
        return _same_day_months_ago(today, 12)
    candidates = [d for d in (acquisition_date, first_record) if d is not None]
    return min(candidates) if candidates else today


def _same_day_months_ago(day: dt.date, months: int) -> dt.date:
    """Même quantième ``months`` mois plus tôt (borné à la fin du mois), + 1 jour."""
    first = add_months(day, -months)
    next_month = add_months(first, 1)
    last_day = (next_month - dt.timedelta(days=1)).day
    return first.replace(day=min(day.day, last_day)) + dt.timedelta(days=1)


@dataclass(frozen=True, slots=True)
class PeriodStats:
    """Statistiques d'une période (km, litres, devise)."""

    start: dt.date
    end: dt.date
    distance: float
    fuel_volume: dict[FuelType, float]
    consumption: dict[FuelType, float | None]
    fuel_cost: float
    expense_cost: float
    expenses_by_category: dict[str, float]
    fill_count: int
    expense_count: int
    co2_kg: float = 0.0

    @property
    def total_cost(self) -> float:
        """Coût total de la période."""
        return self.fuel_cost + self.expense_cost

    @property
    def cost_per_km(self) -> float | None:
        """Coût total par km."""
        return costs.cost_per_distance(self.total_cost, self.distance)

    @property
    def fuel_cost_per_km(self) -> float | None:
        """Coût carburant par km."""
        return costs.cost_per_distance(self.fuel_cost, self.distance)

    @property
    def co2_g_per_km(self) -> float | None:
        """Émissions en g CO2e par km parcouru."""
        if self.distance <= 0:
            return None
        return self.co2_kg * 1000 / self.distance

    @property
    def days(self) -> int:
        """Nombre de jours de la période."""
        return (self.end - self.start).days + 1


def period_stats(
    vehicle: Vehicle,
    records: VehicleRecords,
    period: StatsPeriod,
    today: dt.date,
) -> PeriodStats:
    """Calculer les statistiques d'une période se terminant aujourd'hui.

    La consommation d'une période ne retient que les segments (plein complet à
    plein complet) qui se terminent dans la période.
    """
    fuel = records.fuel.items
    expenses = records.expenses.items
    first_dates = [x.date for x in (fuel[:1] + expenses[:1])]
    start = period_start(
        period,
        today,
        vehicle.acquisition_date,
        min(first_dates) if first_dates else None,
    )
    end_excl = today + dt.timedelta(days=1)

    def in_period(day: dt.date) -> bool:
        return start <= day < end_excl

    readings = distance.collect_readings(fuel, expenses, records.odometer.items)
    by_id = {e.id: e for e in fuel}
    consumption: dict[FuelType, float | None] = {}
    volume: dict[FuelType, float] = {}
    for fuel_type in vehicle.fuel_types:
        segments = [
            s
            for s in consumption_segments(fuel, fuel_type)
            if in_period(by_id[s.end_id].date)
        ]
        consumption[fuel_type] = average_consumption(segments)
        volume[fuel_type] = sum(
            e.volume for e in fuel if e.fuel_type is fuel_type and in_period(e.date)
        )

    period_expenses = [e for e in expenses if in_period(e.date)]
    by_category: dict[str, float] = {}
    for expense in period_expenses:
        by_category[expense.category_id] = (
            by_category.get(expense.category_id, 0.0) + expense.amount
        )

    return PeriodStats(
        start=start,
        end=today,
        distance=distance.distance_between(
            readings,
            dt.datetime.combine(start, dt.time.min),
            dt.datetime.combine(end_excl, dt.time.min),
        ),
        fuel_volume=volume,
        consumption=consumption,
        fuel_cost=costs.fuel_cost(fuel, start, end_excl),
        expense_cost=sum(e.amount for e in period_expenses),
        expenses_by_category=by_category,
        fill_count=sum(1 for e in fuel if in_period(e.date)),
        expense_count=len(period_expenses),
        co2_kg=carbon.total_emissions(e for e in fuel if in_period(e.date)),
    )


@dataclass(frozen=True, slots=True)
class PricePoint:
    """Prix unitaire payé à un plein (par litre, ou par kg pour le GNV)."""

    entry_id: str
    date: dt.date
    unit_price: float
    grade: FuelGrade | None


def price_series(
    entries: Iterable[FuelEntry], fuel_type: FuelType, start: dt.date | None = None
) -> list[PricePoint]:
    """Évolution du prix du carburant, plein par plein, à partir de ``start``."""
    return [
        PricePoint(e.id, e.date, e.unit_price, e.grade)
        for e in entries
        if e.fuel_type is fuel_type
        and e.unit_price > 0
        and (start is None or e.date >= start)
    ]


@dataclass(frozen=True, slots=True)
class ConsumptionPoint:
    """Un point de la courbe : consommation du segment fermé par ce plein."""

    entry_id: str
    date: dt.date
    odometer: float
    l_per_100km: float
    moving_average: float


def consumption_series(
    entries: Iterable[FuelEntry],
    fuel_type: FuelType,
    window: int = DEFAULT_MOVING_AVERAGE,
    start: dt.date | None = None,
) -> list[ConsumptionPoint]:
    """Courbe de consommation par plein complet, avec moyenne mobile.

    La moyenne mobile porte sur les ``window`` derniers segments et est
    pondérée (Σ litres ÷ Σ km), comme la moyenne générale. Elle utilise aussi
    l'historique antérieur à ``start`` pour que le début de la courbe soit
    significatif ; seuls les points à partir de ``start`` sont renvoyés.
    """
    entries = list(entries)
    by_id = {e.id: e for e in entries}
    segments: list[ConsumptionSegment] = consumption_segments(entries, fuel_type)
    window = max(1, window)
    points: list[ConsumptionPoint] = []
    for index, segment in enumerate(segments):
        end = by_id[segment.end_id]
        if start is not None and end.date < start:
            continue
        recent = segments[max(0, index - window + 1) : index + 1]
        average = average_consumption(recent)
        assert average is not None  # chaque segment a une distance > 0
        points.append(
            ConsumptionPoint(
                entry_id=end.id,
                date=end.date,
                odometer=end.odometer,
                l_per_100km=segment.l_per_100km,
                moving_average=average,
            )
        )
    return points


# Distance minimale (km) avant le premier point de la courbe du coût au km :
# sur quelques dizaines de km, un plein ou une dépense donnerait des €/km
# absurdes (375 € sur 50 km = 7,5 €/km) et écraserait l'échelle du graphique.
MIN_COST_DISTANCE_KM = 1000.0


@dataclass(frozen=True, slots=True)
class CostPoint:
    """Coût au km cumulé depuis le premier relevé, à la fin d'une journée."""

    date: dt.date
    total_per_km: float
    fuel_per_km: float


def cost_per_km_series(
    records: VehicleRecords,
    today: dt.date,
    start: dt.date | None = None,
    min_distance: float = MIN_COST_DISTANCE_KM,
) -> list[CostPoint]:
    """Évolution du coût au km, cumulé depuis le début du carnet.

    Un point par jour comportant un plein ou une dépense (et aujourd'hui) :
    Σ montants jusqu'à ce jour ÷ distance parcourue jusqu'à ce jour. Le cumul
    lisse les à-coups (assurance annuelle, gros entretien) et converge vers le
    coût réel du véhicule. Seuls les points à partir de ``start`` sont renvoyés,
    et seulement une fois ``min_distance`` km parcourus.
    """
    fuel = records.fuel.items
    expenses = records.expenses.items
    readings = distance.collect_readings(fuel, expenses, records.odometer.items)
    if len(readings) < 2:
        return []
    # Distance cumulée à chaque relevé (progressions positives uniquement).
    reading_at = [r.at for r in readings]
    cumulated = [0.0]
    for previous, current in pairwise(readings):
        cumulated.append(cumulated[-1] + max(0.0, current.odometer - previous.odometer))
    outlays = sorted(
        [(e.date, e.total_cost, e.total_cost) for e in fuel]
        + [(x.date, x.amount, 0.0) for x in expenses if x.date <= today]
    )
    days = sorted({day for day, _, _ in outlays} | {today})
    points: list[CostPoint] = []
    total = fuel_total = 0.0
    index = 0
    for day in days:
        while index < len(outlays) and outlays[index][0] <= day:
            total += outlays[index][1]
            fuel_total += outlays[index][2]
            index += 1
        if start is not None and day < start:
            continue
        cutoff = dt.datetime.combine(day + dt.timedelta(days=1), dt.time.min)
        count = bisect_left(reading_at, cutoff)
        km = cumulated[count - 1] if count else 0.0
        if km <= 0 or km < min_distance:
            continue
        points.append(CostPoint(day, total / km, fuel_total / km))
    return points


@dataclass(frozen=True, slots=True)
class OdometerPoint:
    """Kilométrage total relevé en fin de journée."""

    date: dt.date
    odometer: float


def odometer_series(
    records: VehicleRecords, start: dt.date | None = None
) -> list[OdometerPoint]:
    """Courbe du compteur : dernier relevé de chaque jour à partir de ``start``."""
    readings = distance.collect_readings(
        records.fuel.items, records.expenses.items, records.odometer.items
    )
    by_day: dict[dt.date, float] = {}
    for reading in readings:
        day = reading.at.date()
        if start is None or day >= start:
            by_day[day] = reading.odometer
    return [OdometerPoint(day, km) for day, km in by_day.items()]
