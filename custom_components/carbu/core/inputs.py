"""Construction des enregistrements à partir d'une saisie (Python pur).

Partagé par l'API des cartes et par les services : les valeurs reçues sont
dans les unités du véhicule et sont converties en unités de référence.
Lève ``ValueError`` pour une saisie invalide.
"""

from __future__ import annotations

from collections.abc import Mapping
import datetime as dt
from typing import Any

from .models import (
    Expense,
    FuelEntry,
    FuelGrade,
    FuelType,
    Reminder,
    ReminderKind,
    new_id,
)
from .presenter import VehicleUnits
from .validation import complete_fill_amounts


def fuel_entry_from_input(
    units: VehicleUnits,
    data: Mapping[str, Any],
    existing: FuelEntry | None,
    now: dt.datetime,
) -> FuelEntry:
    """Plein à enregistrer.

    Deux valeurs parmi ``volume``, ``unit_price`` et ``total_cost`` suffisent.
    Sans date, un nouveau plein est daté de maintenant (heure comprise) ; une
    date sans heure laisse l'heure vide.
    """
    vehicle = units.vehicle
    fuel = FuelType(
        data.get("fuel_type") or (existing.fuel_type if existing else vehicle.fuel_type)
    )
    if data.get("odometer") is None or data["odometer"] < 0:
        raise ValueError("Kilométrage invalide")
    volume, price, total = complete_fill_amounts(
        data.get("volume"), data.get("unit_price"), data.get("total_cost")
    )
    day: dt.date = data.get("date") or (existing.date if existing else now.date())
    at: dt.time | None
    if "time" in data:
        at = data["time"]
    elif existing:
        at = existing.time
    else:
        at = (
            now.time().replace(second=0, microsecond=0)
            if not data.get("date")
            else None
        )
    station = (data.get("station") or "").strip() or None
    grade: FuelGrade | None
    if "grade" in data:
        grade = FuelGrade(data["grade"]) if data["grade"] else None
    else:
        grade = existing.grade if existing else None
    if fuel is not FuelType.GASOLINE:
        grade = None  # la qualité ne concerne que l'essence
    return FuelEntry(
        id=existing.id if existing else new_id(),
        date=day,
        time=at,
        odometer=units.distance_in(data["odometer"]),
        volume=units.volume_in(volume, fuel),
        unit_price=units.unit_price_in(price, fuel),
        total_cost=total,
        fuel_type=fuel,
        full_tank=bool(data.get("full_tank", existing.full_tank if existing else True)),
        station=station,
        notes=data.get("notes", existing.notes if existing else "") or "",
        grade=grade,
    )


def expense_from_input(
    units: VehicleUnits,
    data: Mapping[str, Any],
    existing: Expense | None,
    today: dt.date,
) -> Expense:
    """Dépense à enregistrer (la catégorie est contrôlée par ``LogData``)."""
    amount = data.get("amount")
    if amount is None or amount < 0:
        raise ValueError("Montant invalide")
    odometer = data.get("odometer")
    return Expense(
        id=existing.id if existing else new_id(),
        date=data.get("date") or (existing.date if existing else today),
        odometer=units.distance_in(odometer) if odometer is not None else None,
        amount=float(amount),
        category_id=data["category_id"],
        description=(data.get("description") or "").strip(),
        attachment=existing.attachment if existing else None,
    )


def reminder_from_input(
    units: VehicleUnits, data: Mapping[str, Any], existing: Reminder | None
) -> Reminder:
    """Rappel à enregistrer.

    Un changement d'échéance remet à zéro les notifications envoyées et
    réactive le rappel.
    """
    label = (data.get("label") or "").strip()
    if not label:
        raise ValueError("Libellé obligatoire")
    kind = ReminderKind(data["kind"])

    def _km(key: str) -> float | None:
        value = data.get(key)
        if value is None:
            return None
        if value < 0:
            raise ValueError(f"Valeur négative : {key}")
        return units.distance_in(value)

    def _days(key: str) -> int | None:
        value = data.get(key)
        if value is None:
            return None
        if value < 0:
            raise ValueError(f"Valeur négative : {key}")
        return int(value)

    uses_date = kind in (ReminderKind.DATE, ReminderKind.BOTH)
    uses_distance = kind in (ReminderKind.DISTANCE, ReminderKind.BOTH)
    due_date: dt.date | None = data.get("due_date") if uses_date else None
    due_odometer = _km("due_odometer") if uses_distance else None
    if uses_date and due_date is None:
        raise ValueError("Date d'échéance obligatoire")
    if uses_distance and due_odometer is None:
        raise ValueError("Kilométrage d'échéance obligatoire")

    reminder = Reminder(
        id=existing.id if existing else new_id(),
        label=label,
        kind=kind,
        due_date=due_date,
        due_odometer=due_odometer,
        alert_days=_days("alert_days") if uses_date else None,
        alert_distance=_km("alert_distance") if uses_distance else None,
        interval_days=_days("interval_days") if uses_date else None,
        interval_distance=_km("interval_distance") if uses_distance else None,
    )
    if existing is not None:
        reminder.last_done_date = existing.last_done_date
        reminder.last_done_odometer = existing.last_done_odometer
        same_due = (existing.due_date, existing.due_odometer) == (
            reminder.due_date,
            reminder.due_odometer,
        )
        if same_due:
            reminder.notified = list(existing.notified)
            reminder.active = existing.active
    return reminder
