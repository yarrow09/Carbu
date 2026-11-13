"""Coûts : montants par période et coût par distance (Python pur)."""

from __future__ import annotations

from collections.abc import Iterable
import datetime as dt

from .models import Expense, FuelEntry


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
