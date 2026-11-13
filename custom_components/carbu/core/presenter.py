"""Conversion entre unités de référence et unités d'un véhicule (Python pur).

Toutes les données échangées avec l'interface (cartes, services) passent par
ce module : entrée dans les unités du véhicule, stockage en km / L / l/100 km.
Pour le GNV, la quantité est toujours en kg et la consommation en kg/100 km
ou km/kg (les unités MPG n'ont pas de sens et sont remplacées par kg/100 km).
"""

from __future__ import annotations

from typing import Any

from . import units
from .models import (
    ConsumptionUnit,
    Expense,
    FuelEntry,
    FuelType,
    Reminder,
    Vehicle,
    VolumeUnit,
)
from .reminders import ReminderStatus
from .statistics import ConsumptionPoint, PeriodStats
from .summary import VehicleSummary
from .validation import CoherenceWarning, WarningCode

_VOLUME_LABELS = {
    VolumeUnit.LITERS: "L",
    VolumeUnit.GALLONS_US: "gal",
    VolumeUnit.GALLONS_UK: "gal",
}
_CONSUMPTION_LABELS = {
    ConsumptionUnit.L_PER_100KM: "L/100 km",
    ConsumptionUnit.KM_PER_L: "km/L",
    ConsumptionUnit.MPG_US: "mpg",
    ConsumptionUnit.MPG_UK: "mpg",
}


class VehicleUnits:
    """Convertisseur lié à un véhicule."""

    def __init__(self, vehicle: Vehicle) -> None:
        """Initialiser."""
        self.vehicle = vehicle

    # --- Libellés ---------------------------------------------------------

    @property
    def distance_label(self) -> str:
        """Unité de distance (``km`` ou ``mi``)."""
        return self.vehicle.distance_unit.value

    def volume_label(self, fuel: FuelType) -> str:
        """Unité de quantité pour un carburant."""
        return (
            "kg" if fuel is FuelType.CNG else _VOLUME_LABELS[self.vehicle.volume_unit]
        )

    def consumption_unit(self, fuel: FuelType) -> ConsumptionUnit:
        """Unité de consommation effective pour un carburant."""
        unit = self.vehicle.consumption_unit
        if fuel is FuelType.CNG and unit in (
            ConsumptionUnit.MPG_US,
            ConsumptionUnit.MPG_UK,
        ):
            return ConsumptionUnit.L_PER_100KM
        return unit

    def consumption_label(self, fuel: FuelType) -> str:
        """Libellé de l'unité de consommation pour un carburant."""
        unit = self.consumption_unit(fuel)
        label = _CONSUMPTION_LABELS[unit]
        return label.replace("L", "kg") if fuel is FuelType.CNG else label

    # --- Distances --------------------------------------------------------

    def distance_out(self, km: float | None) -> float | None:
        """Km → unité du véhicule."""
        if km is None:
            return None
        return units.km_to_distance(km, self.vehicle.distance_unit)

    def distance_in(self, value: float) -> float:
        """Unité du véhicule → km."""
        return units.distance_to_km(value, self.vehicle.distance_unit)

    # --- Quantités et prix -------------------------------------------------

    def _liters_per_unit(self, fuel: FuelType) -> float:
        if fuel is FuelType.CNG:
            return 1.0
        return units.volume_to_liters(1.0, self.vehicle.volume_unit)

    def volume_out(self, liters: float | None, fuel: FuelType) -> float | None:
        """L (kg GNV) → unité du véhicule."""
        if liters is None:
            return None
        return liters / self._liters_per_unit(fuel)

    def volume_in(self, value: float, fuel: FuelType) -> float:
        """Unité du véhicule → L (kg GNV)."""
        return value * self._liters_per_unit(fuel)

    def unit_price_out(self, price_per_liter: float, fuel: FuelType) -> float:
        """Prix par litre → prix par unité du véhicule."""
        return price_per_liter * self._liters_per_unit(fuel)

    def unit_price_in(self, price: float, fuel: FuelType) -> float:
        """Prix par unité du véhicule → prix par litre."""
        return price / self._liters_per_unit(fuel)

    # --- Consommation -------------------------------------------------------

    def consumption_out(self, l100: float | None, fuel: FuelType) -> float | None:
        """l/100 km → unité de consommation du véhicule."""
        return units.l100_to_consumption(l100, self.consumption_unit(fuel))

    # --- Vues ---------------------------------------------------------------

    def fuel_entry_view(self, entry: FuelEntry) -> dict[str, Any]:
        """Plein exprimé dans les unités du véhicule."""
        return {
            "id": entry.id,
            "date": entry.date.isoformat(),
            "time": entry.time.isoformat(timespec="minutes") if entry.time else None,
            "odometer": self.distance_out(entry.odometer),
            "volume": self.volume_out(entry.volume, entry.fuel_type),
            "unit_price": self.unit_price_out(entry.unit_price, entry.fuel_type),
            "total_cost": entry.total_cost,
            "fuel_type": entry.fuel_type.value,
            "full_tank": entry.full_tank,
            "station": entry.station,
            "notes": entry.notes,
        }

    def expense_view(self, expense: Expense) -> dict[str, Any]:
        """Dépense exprimée dans les unités du véhicule."""
        return {
            "id": expense.id,
            "date": expense.date.isoformat(),
            "odometer": self.distance_out(expense.odometer),
            "amount": expense.amount,
            "category_id": expense.category_id,
            "description": expense.description,
            "attachment": expense.attachment,
        }

    def summary_view(self, summary: VehicleSummary) -> dict[str, Any]:
        """Indicateurs exprimés dans les unités du véhicule."""
        km_per_unit = units.distance_to_km(1.0, self.vehicle.distance_unit)

        def _per_distance(value: float | None) -> float | None:
            return value * km_per_unit if value is not None else None

        return {
            "consumption": {
                fuel.value: self.consumption_out(value, fuel)
                for fuel, value in summary.consumption.items()
            },
            "last_consumption": {
                fuel.value: self.consumption_out(value, fuel)
                for fuel, value in summary.last_consumption.items()
            },
            "current_odometer": self.distance_out(summary.current_odometer),
            "total_distance": self.distance_out(summary.total_distance),
            "distance_week": self.distance_out(summary.distance_week),
            "distance_month": self.distance_out(summary.distance_month),
            "distance_year": self.distance_out(summary.distance_year),
            "month_cost": summary.month_cost,
            "month_fuel_cost": summary.month_fuel_cost,
            "month_expense_cost": summary.month_expense_cost,
            "total_cost": summary.total_cost,
            "cost_per_distance": _per_distance(summary.cost_per_km),
            "fuel_cost_per_distance": _per_distance(summary.fuel_cost_per_km),
            "fill_count": summary.fill_count,
            "expense_count": summary.expense_count,
        }

    def warning_view(self, warning: CoherenceWarning, fuel: FuelType) -> dict[str, Any]:
        """Avertissement avec valeurs converties pour l'affichage."""
        details: dict[str, Any] = dict(warning.details)
        if warning.code in (
            WarningCode.ODOMETER_BELOW_PREVIOUS,
            WarningCode.ODOMETER_ABOVE_NEXT,
        ):
            details = {k: self.distance_out(float(v)) for k, v in details.items()}
        elif warning.code is WarningCode.VOLUME_EXCEEDS_TANK:
            details["capacity"] = self.volume_out(float(details["capacity"]), fuel)
        elif warning.code is WarningCode.CONSUMPTION_OUT_OF_RANGE:
            details = {
                k: self.consumption_out(float(v), fuel) for k, v in details.items()
            }
        return {"code": warning.code.value, "details": details}

    def units_view(self) -> dict[str, Any]:
        """Libellés d'unités pour l'interface."""
        return {
            "distance": self.distance_label,
            "volume": {f.value: self.volume_label(f) for f in self.vehicle.fuel_types},
            "consumption": {
                f.value: self.consumption_label(f) for f in self.vehicle.fuel_types
            },
        }

    def reminder_view(
        self, reminder: Reminder, status: ReminderStatus
    ) -> dict[str, Any]:
        """Rappel et son état, distances dans l'unité du véhicule."""
        return {
            "id": reminder.id,
            "label": reminder.label,
            "kind": reminder.kind.value,
            "due_date": reminder.due_date.isoformat() if reminder.due_date else None,
            "due_odometer": self.distance_out(reminder.due_odometer),
            "alert_days": reminder.alert_days,
            "alert_distance": self.distance_out(reminder.alert_distance),
            "interval_days": reminder.interval_days,
            "interval_distance": self.distance_out(reminder.interval_distance),
            "active": reminder.active,
            "recurring": reminder.is_recurring,
            "last_done_date": (
                reminder.last_done_date.isoformat() if reminder.last_done_date else None
            ),
            "last_done_odometer": self.distance_out(reminder.last_done_odometer),
            "state": status.state.value,
            "days_left": status.days_left,
            "distance_left": self.distance_out(status.distance_left),
            "criterion": status.criterion.value if status.criterion else None,
        }

    def stats_view(self, stats: PeriodStats) -> dict[str, Any]:
        """Statistiques d'une période dans les unités du véhicule."""
        km_per_unit = self.distance_in(1.0)

        def _per_distance(value: float | None) -> float | None:
            return value * km_per_unit if value is not None else None

        return {
            "start": stats.start.isoformat(),
            "end": stats.end.isoformat(),
            "days": stats.days,
            "distance": self.distance_out(stats.distance),
            "fuel_volume": {
                f.value: self.volume_out(v, f) for f, v in stats.fuel_volume.items()
            },
            "consumption": {
                f.value: self.consumption_out(v, f)
                for f, v in stats.consumption.items()
            },
            "fuel_cost": stats.fuel_cost,
            "expense_cost": stats.expense_cost,
            "total_cost": stats.total_cost,
            "cost_per_distance": _per_distance(stats.cost_per_km),
            "fuel_cost_per_distance": _per_distance(stats.fuel_cost_per_km),
            "expenses_by_category": stats.expenses_by_category,
            "fill_count": stats.fill_count,
            "expense_count": stats.expense_count,
        }

    def consumption_point_view(
        self, point: ConsumptionPoint, fuel: FuelType
    ) -> dict[str, Any]:
        """Point de la courbe de consommation."""
        return {
            "entry_id": point.entry_id,
            "date": point.date.isoformat(),
            "odometer": self.distance_out(point.odometer),
            "value": self.consumption_out(point.l_per_100km, fuel),
            "moving_average": self.consumption_out(point.moving_average, fuel),
        }
