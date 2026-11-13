"""Regroupements pour le tableau de bord et les listes (Python pur)."""

from __future__ import annotations

from collections.abc import Collection, Iterable, Sequence
import datetime as dt

from .models import Expense, FuelEntry
from .periods import month_keys

# Clé de la pile « carburant » dans l'histogramme mensuel.
FUEL_STACK = "fuel"


def monthly_costs_by_category(
    fuel: Iterable[FuelEntry],
    expenses: Iterable[Expense],
    last_month: dt.date,
    months: int = 12,
) -> dict[str, dict[str, float]]:
    """Montants par mois (``AAAA-MM``) puis par catégorie.

    Les pleins sont regroupés sous ``FUEL_STACK``. Tous les mois de la fenêtre
    sont présents, même vides, dans l'ordre chronologique.
    """
    result: dict[str, dict[str, float]] = {
        key: {} for key in month_keys(last_month, months)
    }

    def _add(day: dt.date, category: str, amount: float) -> None:
        bucket = result.get(day.strftime("%Y-%m"))
        if bucket is not None:
            bucket[category] = bucket.get(category, 0.0) + amount

    for entry in fuel:
        _add(entry.date, FUEL_STACK, entry.total_cost)
    for expense in expenses:
        _add(expense.date, expense.category_id, expense.amount)
    return result


def filter_expenses(
    expenses: Iterable[Expense],
    *,
    start: dt.date | None = None,
    end: dt.date | None = None,
    category_ids: Collection[str] | None = None,
    min_amount: float | None = None,
    max_amount: float | None = None,
) -> list[Expense]:
    """Filtrer les dépenses (période ``[start, end[``, catégories, montant)."""
    return [
        e
        for e in expenses
        if (start is None or e.date >= start)
        and (end is None or e.date < end)
        and (category_ids is None or e.category_id in category_ids)
        and (min_amount is None or e.amount >= min_amount)
        and (max_amount is None or e.amount <= max_amount)
    ]


def latest[T](items: Sequence[T], count: int = 5) -> list[T]:
    """Les ``count`` derniers éléments d'une liste triée, du plus récent."""
    if count <= 0:
        return []
    return list(reversed(items[-count:]))
