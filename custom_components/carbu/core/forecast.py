"""Estimation du prochain plein (Python pur, unités de référence).

L'estimation s'appuie sur les habitudes récentes du véhicule :

* **distance entre deux pleins** : médiane des 10 derniers intervalles (la
  médiane ignore un plein d'appoint ou un long trajet exceptionnel) ;
* **rythme de roulage** : km par jour sur les 120 derniers jours de relevés ;
* **quantité** : distance entre deux pleins × consommation moyenne, ou, à
  défaut, médiane des dernières quantités ;
* **montant** : quantité × dernier prix payé.

Le prochain plein est attendu au kilométrage du dernier plein + la distance
habituelle ; la date s'en déduit au rythme de roulage, à partir du dernier
relevé du compteur.
"""

from __future__ import annotations

from dataclasses import dataclass
import datetime as dt
import itertools
from statistics import median

from .consumption import average_consumption, consumption_segments
from .distance import Reading, collect_readings
from .models import FuelEntry, FuelType
from .repository import VehicleRecords

MIN_FILLS = 3
INTERVALS = 10
RATE_WINDOW_DAYS = 120
MIN_RATE_DAYS = 7


@dataclass(frozen=True, slots=True)
class NextFillEstimate:
    """Prochain plein estimé (km, litres ou kg, devise)."""

    fuel_type: FuelType
    date: dt.date
    odometer: float
    distance_left: float
    days_left: int
    km_per_day: float
    interval: float
    volume: float | None
    cost: float | None

    @property
    def overdue(self) -> bool:
        """Le plein aurait déjà dû avoir lieu d'après le rythme habituel."""
        return self.days_left < 0


def driving_rate(readings: list[Reading], today: dt.date) -> float | None:
    """Kilomètres parcourus par jour sur la fenêtre récente (``None`` si inconnu)."""
    since = dt.datetime.combine(
        today - dt.timedelta(days=RATE_WINDOW_DAYS), dt.time.min
    )
    recent = [r for r in readings if r.at >= since]
    if len(recent) < 2:
        recent = readings[-2:]
    if len(recent) < 2:
        return None
    first, last = recent[0], recent[-1]
    days = (last.at - first.at).total_seconds() / 86400
    km = sum(max(0.0, b.odometer - a.odometer) for a, b in itertools.pairwise(recent))
    if days < MIN_RATE_DAYS or km <= 0:
        return None
    return km / days


def _typical_interval(fills: list[FuelEntry]) -> float | None:
    deltas = [
        b.odometer - a.odometer
        for a, b in itertools.pairwise(fills[-(INTERVALS + 1) :])
        if b.odometer > a.odometer
    ]
    return median(deltas) if deltas else None


def estimate_next_fill(
    records: VehicleRecords, fuel_type: FuelType, today: dt.date
) -> NextFillEstimate | None:
    """Prochain plein du carburant donné, ou ``None`` sans historique suffisant."""
    fills = [e for e in records.fuel if e.fuel_type is fuel_type]
    if len(fills) < MIN_FILLS:
        return None
    interval = _typical_interval(fills)
    readings = collect_readings(
        records.fuel.items, records.expenses.items, records.odometer.items
    )
    rate = driving_rate(readings, today)
    if interval is None or rate is None:
        return None

    last_fill = fills[-1]
    target = last_fill.odometer + interval
    latest = readings[-1]
    remaining = target - latest.odometer
    eta = latest.at.date() + dt.timedelta(days=round(remaining / rate))
    # Distance restante aujourd'hui : on suppose le rythme habituel maintenu
    # depuis le dernier relevé.
    driven_since = rate * max(0, (today - latest.at.date()).days)

    consumption = average_consumption(consumption_segments(fills, fuel_type))
    if consumption is not None:
        volume: float | None = interval * consumption / 100
    else:
        volume = median(e.volume for e in fills[-5:])
    price = next((e.unit_price for e in reversed(fills) if e.unit_price > 0), None)
    return NextFillEstimate(
        fuel_type=fuel_type,
        date=eta,
        odometer=target,
        distance_left=max(0.0, remaining - driven_since),
        days_left=(eta - today).days,
        km_per_day=rate,
        interval=interval,
        volume=volume,
        cost=volume * price if volume is not None and price is not None else None,
    )
