"""État des rappels, échéance suivante et notifications (Python pur).

Règles (voir ``docs/calculs.md``) :

* un rappel est **dû** dès que le premier de ses critères est atteint :
  date du jour ≥ date d'échéance, ou kilométrage ≥ kilométrage d'échéance ;
* il est **en alerte** quand il n'est pas dû mais qu'il reste au plus
  ``alert_days`` jours ou ``alert_distance`` km avant l'un des critères ;
* marquer un rappel récurrent comme fait recalcule l'échéance à partir de la
  date et du kilométrage de réalisation ; un rappel non récurrent devient
  inactif ;
* chaque étape (alerte, échéance) n'est notifiée qu'une fois par échéance.
"""

from __future__ import annotations

from dataclasses import dataclass, replace
import datetime as dt
from enum import StrEnum

from .models import NotificationStage, Reminder


class ReminderState(StrEnum):
    """État d'un rappel."""

    OK = "ok"
    ALERT = "alert"
    DUE = "due"
    INACTIVE = "inactive"


class Criterion(StrEnum):
    """Critère qui détermine l'état."""

    DATE = "date"
    DISTANCE = "distance"


@dataclass(frozen=True, slots=True)
class ReminderStatus:
    """État calculé d'un rappel (distances en km)."""

    state: ReminderState
    days_left: int | None
    distance_left: float | None
    criterion: Criterion | None

    @property
    def is_due(self) -> bool:
        """Indique si le rappel est dû."""
        return self.state is ReminderState.DUE


def reminder_status(
    reminder: Reminder, today: dt.date, odometer: float | None
) -> ReminderStatus:
    """Calculer l'état d'un rappel au jour ``today`` et au kilométrage donné."""
    if not reminder.active:
        return ReminderStatus(ReminderState.INACTIVE, None, None, None)

    days_left = (
        (reminder.due_date - today).days
        if reminder.uses_date and reminder.due_date is not None
        else None
    )
    distance_left = (
        reminder.due_odometer - odometer
        if reminder.uses_distance
        and reminder.due_odometer is not None
        and odometer is not None
        else None
    )

    if days_left is not None and days_left <= 0:
        return ReminderStatus(
            ReminderState.DUE, days_left, distance_left, Criterion.DATE
        )
    if distance_left is not None and distance_left <= 0:
        return ReminderStatus(
            ReminderState.DUE, days_left, distance_left, Criterion.DISTANCE
        )
    if (
        days_left is not None
        and reminder.alert_days is not None
        and days_left <= reminder.alert_days
    ):
        return ReminderStatus(
            ReminderState.ALERT, days_left, distance_left, Criterion.DATE
        )
    if (
        distance_left is not None
        and reminder.alert_distance is not None
        and distance_left <= reminder.alert_distance
    ):
        return ReminderStatus(
            ReminderState.ALERT, days_left, distance_left, Criterion.DISTANCE
        )
    return ReminderStatus(ReminderState.OK, days_left, distance_left, None)


def mark_done(
    reminder: Reminder, done_date: dt.date, done_odometer: float | None
) -> Reminder:
    """Rappel après réalisation : échéance suivante, ou inactif sinon."""
    updated = replace(
        reminder,
        last_done_date=done_date,
        last_done_odometer=done_odometer,
        notified=[],
    )
    if not reminder.is_recurring:
        return replace(updated, active=False)
    due_date = (
        done_date + dt.timedelta(days=reminder.interval_days)
        if reminder.uses_date and reminder.interval_days
        else None
    )
    due_odometer = (
        done_odometer + reminder.interval_distance
        if reminder.uses_distance
        and reminder.interval_distance
        and done_odometer is not None
        else None
    )
    return replace(updated, active=True, due_date=due_date, due_odometer=due_odometer)


def notification_to_send(
    reminder: Reminder, status: ReminderStatus
) -> NotificationStage | None:
    """Étape à notifier maintenant (``None`` si rien de nouveau).

    Si l'échéance est atteinte sans que l'alerte ait été envoyée, seule
    l'échéance est notifiée.
    """
    if status.state is ReminderState.DUE:
        if NotificationStage.DUE not in reminder.notified:
            return NotificationStage.DUE
        return None
    if (
        status.state is ReminderState.ALERT
        and NotificationStage.ALERT not in reminder.notified
        and NotificationStage.DUE not in reminder.notified
    ):
        return NotificationStage.ALERT
    return None


def record_notification(reminder: Reminder, stage: NotificationStage) -> None:
    """Mémoriser l'envoi (l'échéance implique l'alerte)."""
    stages = {*reminder.notified, stage}
    if stage is NotificationStage.DUE:
        stages.add(NotificationStage.ALERT)
    reminder.notified = sorted(stages)
