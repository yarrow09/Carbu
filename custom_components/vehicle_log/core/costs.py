"""Coûts : coût par distance et coût total de possession (Python pur)."""

from __future__ import annotations

from collections.abc import Iterable
import datetime as dt

from .models import Expense, FuelEntry

DAYS_PER_MONTH = 365.25 / 12


def _in_range(day: dt.date, start: dt.date | None, end: dt.date | None) -> bool:
    return (start is None or day >= start) and (end is None or day < end)


def fuel_cost(
    entries: Iterable[FuelEntry],
    start: dt.date | None = None,
    end: dt.date | None = None,
) -> float:
    """Somme des montants des pleins dans ``[start, end[``."""
    return sum(e.total_cost for e in entries if _in_range(e.date, start, end))


def expense_cost(
    expenses: Iterable[Expense],
    start: dt.date | None = None,
    end: dt.date | None = None,
) -> float:
    """Somme des dépenses dans ``[start, end[``."""
    return sum(e.amount for e in expenses if _in_range(e.date, start, end))


def cost_per_distance(amount: float, distance: float) -> float | None:
    """Coût par unité de distance ; ``None`` si la distance est nulle."""
    if distance <= 0:
        return None
    return amount / distance


def depreciation(purchase_value: float | None, estimated_value: float | None) -> float:
    """Amortissement = valeur d'achat − valeur estimée (0 si non renseigné)."""
    if purchase_value is None or estimated_value is None:
        return 0.0
    return purchase_value - estimated_value


def months_between(start: dt.date, end: dt.date) -> float:
    """Durée en mois moyens (365,25 / 12 jours)."""
    return max(0, (end - start).days) / DAYS_PER_MONTH


def tco(
    fuel_total: float,
    expense_total: float,
    distance: float,
    months: float,
    depreciation_amount: float = 0.0,
) -> tuple[float | None, float | None]:
    """Coût total de possession : (par unité de distance, par mois).

    TCO = (pleins + dépenses + amortissement) ÷ distance ; rapporté au mois :
    même total ÷ nombre de mois. ``None`` quand le dénominateur est nul.
    """
    total = fuel_total + expense_total + depreciation_amount
    per_distance = total / distance if distance > 0 else None
    per_month = total / months if months > 0 else None
    return per_distance, per_month
