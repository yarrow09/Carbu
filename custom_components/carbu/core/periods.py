"""Bornes de périodes calendaires (Python pur).

Toutes les bornes sont des ``datetime`` naïfs en heure locale, intervalle
semi-ouvert ``[début, fin[``.
"""

from __future__ import annotations

import datetime as dt
from enum import StrEnum


class Period(StrEnum):
    """Période calendaire."""

    WEEK = "week"
    MONTH = "month"
    YEAR = "year"


def _midnight(day: dt.date) -> dt.datetime:
    return dt.datetime.combine(day, dt.time.min)


def month_start(day: dt.date) -> dt.date:
    """Premier jour du mois."""
    return day.replace(day=1)


def add_months(day: dt.date, months: int) -> dt.date:
    """Premier jour du mois décalé de ``months`` (négatif possible)."""
    index = day.year * 12 + (day.month - 1) + months
    return dt.date(index // 12, index % 12 + 1, 1)


def period_bounds(period: Period, day: dt.date) -> tuple[dt.datetime, dt.datetime]:
    """Bornes de la période contenant ``day``.

    La semaine commence le lundi (ISO 8601).
    """
    if period is Period.WEEK:
        start = day - dt.timedelta(days=day.weekday())
        return _midnight(start), _midnight(start + dt.timedelta(days=7))
    if period is Period.MONTH:
        start = month_start(day)
        return _midnight(start), _midnight(add_months(start, 1))
    start = dt.date(day.year, 1, 1)
    return _midnight(start), _midnight(dt.date(day.year + 1, 1, 1))


def month_keys(last_month: dt.date, count: int) -> list[str]:
    """Clés ``AAAA-MM`` des ``count`` mois se terminant par ``last_month``."""
    first = add_months(last_month, -(count - 1))
    return [add_months(first, i).strftime("%Y-%m") for i in range(count)]
