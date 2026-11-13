"""Indicateurs agrégés d'un véhicule (Python pur, unités de référence)."""

from __future__ import annotations

from dataclasses import dataclass
import datetime as dt

from . import costs, distance
from .consumption import average_consumption, consumption_segments
from .models import FuelType, Vehicle
from .periods import Period, period_bounds
from .repository import VehicleRecords


@dataclass(frozen=True, slots=True)
class VehicleSummary:
    """Indicateurs d'un véhicule, en km, litres (kg GNV) et devise HA."""

    consumption: dict[FuelType, float | None]
    last_consumption: dict[FuelType, float | None]
    current_odometer: float | None
    total_distance: float
    distance_week: float
    distance_month: float
    distance_year: float
    month_fuel_cost: float
    month_expense_cost: float
    total_fuel_cost: float
    total_expense_cost: float
    fill_count: int
    expense_count: int

    @property
    def month_cost(self) -> float:
        """Coût total du mois en cours (pleins + dépenses)."""
        return self.month_fuel_cost + self.month_expense_cost

    @property
    def total_cost(self) -> float:
        """Coût total enregistré."""
        return self.total_fuel_cost + self.total_expense_cost

    @property
    def cost_per_km(self) -> float | None:
        """Coût par km sur toute la période enregistrée."""
        return costs.cost_per_distance(self.total_cost, self.total_distance)

    @property
    def fuel_cost_per_km(self) -> float | None:
        """Coût carburant seul par km."""
        return costs.cost_per_distance(self.total_fuel_cost, self.total_distance)


def compute_summary(
    vehicle: Vehicle, records: VehicleRecords, now: dt.datetime
) -> VehicleSummary:
    """Calculer les indicateurs d'un véhicule à l'instant ``now`` (heure locale)."""
    fuel = records.fuel.items
    expenses = records.expenses.items
    readings = distance.collect_readings(fuel, expenses, records.odometer.items)

    consumption: dict[FuelType, float | None] = {}
    last: dict[FuelType, float | None] = {}
    for fuel_type in vehicle.fuel_types:
        segments = consumption_segments(fuel, fuel_type)
        consumption[fuel_type] = average_consumption(segments)
        last[fuel_type] = segments[-1].l_per_100km if segments else None

    def _distance(period: Period) -> float:
        start, end = period_bounds(period, now.date())
        return distance.distance_between(readings, start, end)

    month_start, month_end = period_bounds(Period.MONTH, now.date())
    return VehicleSummary(
        consumption=consumption,
        last_consumption=last,
        current_odometer=distance.current_odometer(readings),
        total_distance=distance.total_distance(readings),
        distance_week=_distance(Period.WEEK),
        distance_month=_distance(Period.MONTH),
        distance_year=_distance(Period.YEAR),
        month_fuel_cost=costs.fuel_cost(fuel, month_start.date(), month_end.date()),
        month_expense_cost=costs.expense_cost(
            expenses, month_start.date(), month_end.date()
        ),
        total_fuel_cost=costs.fuel_cost(fuel),
        total_expense_cost=costs.expense_cost(expenses),
        fill_count=len(fuel),
        expense_count=len(expenses),
    )
