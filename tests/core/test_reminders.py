"""Rappels : état, premier critère atteint, récurrence, notifications."""

import datetime as dt

import pytest

from custom_components.vehicle_log.core.models import (
    NotificationStage,
    Reminder,
    ReminderKind,
)
from custom_components.vehicle_log.core.reminders import (
    Criterion,
    ReminderState,
    mark_done,
    notification_to_send,
    record_notification,
    reminder_status,
)

TODAY = dt.date(2026, 6, 1)


def _both(**kwargs: object) -> Reminder:
    defaults: dict[str, object] = {
        "label": "Vidange",
        "kind": ReminderKind.BOTH,
        "due_date": dt.date(2026, 9, 1),
        "due_odometer": 30000,
        "alert_days": 30,
        "alert_distance": 1000,
    }
    return Reminder(**{**defaults, **kwargs})  # type: ignore[arg-type]


@pytest.mark.parametrize(
    ("today", "odometer", "state", "criterion"),
    [
        (TODAY, 25000, ReminderState.OK, None),
        (dt.date(2026, 8, 2), 25000, ReminderState.ALERT, Criterion.DATE),  # 30 j
        (TODAY, 29000, ReminderState.ALERT, Criterion.DISTANCE),  # 1000 km
        (dt.date(2026, 9, 1), 25000, ReminderState.DUE, Criterion.DATE),
        (TODAY, 30000, ReminderState.DUE, Criterion.DISTANCE),  # premier critère
        (dt.date(2026, 10, 1), 31000, ReminderState.DUE, Criterion.DATE),
    ],
)
def test_status_first_criterion(
    today: dt.date,
    odometer: float,
    state: ReminderState,
    criterion: Criterion | None,
) -> None:
    status = reminder_status(_both(), today, odometer)
    assert status.state is state
    assert status.criterion is criterion


def test_status_values_and_single_criteria() -> None:
    status = reminder_status(_both(), TODAY, 25000)
    assert status.days_left == 92
    assert status.distance_left == 5000

    by_date = _both(kind=ReminderKind.DATE)
    assert reminder_status(by_date, TODAY, 99999).state is ReminderState.OK
    assert reminder_status(by_date, TODAY, None).distance_left is None

    by_km = _both(kind=ReminderKind.DISTANCE)
    assert reminder_status(by_km, dt.date(2030, 1, 1), 100).state is ReminderState.OK
    # Kilométrage inconnu : le critère de distance ne peut pas déclencher.
    assert reminder_status(by_km, TODAY, None).state is ReminderState.OK


def test_inactive_reminder() -> None:
    reminder = _both(active=False)
    assert reminder_status(reminder, TODAY, 99999).state is ReminderState.INACTIVE


def test_mark_done_recurring() -> None:
    reminder = _both(
        interval_days=365, interval_distance=15000, notified=[NotificationStage.DUE]
    )
    done = mark_done(reminder, dt.date(2026, 9, 5), 30200)
    assert done.active
    assert done.due_date == dt.date(2027, 9, 5)
    assert done.due_odometer == 45200
    assert done.last_done_date == dt.date(2026, 9, 5)
    assert done.notified == []
    assert reminder.notified == [NotificationStage.DUE]  # original inchangé


def test_mark_done_single_interval_and_not_recurring() -> None:
    # Récurrence en km seulement : le critère de date disparaît.
    done = mark_done(_both(interval_distance=10000), TODAY, 30100)
    assert (done.due_date, done.due_odometer) == (None, 40100)

    once = mark_done(_both(), TODAY, 30100)
    assert not once.active
    assert reminder_status(once, TODAY, 50000).state is ReminderState.INACTIVE


def test_notifications_sent_once_per_stage() -> None:
    reminder = _both()
    alert = reminder_status(reminder, TODAY, 29500)
    assert notification_to_send(reminder, alert) is NotificationStage.ALERT
    record_notification(reminder, NotificationStage.ALERT)
    assert notification_to_send(reminder, alert) is None

    due = reminder_status(reminder, TODAY, 30000)
    assert notification_to_send(reminder, due) is NotificationStage.DUE
    record_notification(reminder, NotificationStage.DUE)
    assert notification_to_send(reminder, due) is None


def test_due_without_prior_alert_sends_only_due() -> None:
    reminder = _both()
    due = reminder_status(reminder, TODAY, 31000)
    assert notification_to_send(reminder, due) is NotificationStage.DUE
    record_notification(reminder, NotificationStage.DUE)
    assert reminder.notified == [NotificationStage.ALERT, NotificationStage.DUE]
    ok = reminder_status(reminder, TODAY, 1000)
    assert notification_to_send(reminder, ok) is None
