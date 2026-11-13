"""Envoi des notifications de rappels via le domaine ``notify``.

Destinataires (options de l'intégration) : entités ``notify`` (service
``notify.send_message``) et/ou anciens services ``notify.xxx`` (ex. application
mobile). Une erreur d'envoi est journalisée sans interrompre l'intégration.
"""

from __future__ import annotations

from collections.abc import Mapping
import logging
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError

from .const import CONF_NOTIFY_ENTITIES, CONF_NOTIFY_SERVICES
from .core.models import NotificationStage, Reminder, Vehicle
from .core.presenter import VehicleUnits
from .core.reminders import ReminderStatus

_LOGGER = logging.getLogger(__name__)

_TEXTS = {
    "fr": {
        "title_alert": "Rappel bientôt dû : {label}",
        "title_due": "Rappel dû : {label}",
        "days": "{days} jour(s)",
        "distance": "{distance} {unit}",
        "alert": "{vehicle} : « {label} » arrive à échéance dans {left}.",
        "due": "{vehicle} : « {label} » est dû.",
        "due_date": "Échéance : {date}.",
        "due_odometer": "Kilométrage d'échéance : {odometer} {unit}.",
        "or": " ou ",
    },
    "en": {
        "title_alert": "Reminder coming up: {label}",
        "title_due": "Reminder due: {label}",
        "days": "{days} day(s)",
        "distance": "{distance} {unit}",
        "alert": "{vehicle}: “{label}” is due in {left}.",
        "due": "{vehicle}: “{label}” is due.",
        "due_date": "Due date: {date}.",
        "due_odometer": "Due odometer: {odometer} {unit}.",
        "or": " or ",
    },
}


def build_message(
    language: str,
    vehicle: Vehicle,
    reminder: Reminder,
    status: ReminderStatus,
    stage: NotificationStage,
) -> tuple[str, str]:
    """Titre et texte de la notification (distances dans l'unité du véhicule)."""
    texts = _TEXTS["fr" if language.startswith("fr") else "en"]
    units = VehicleUnits(vehicle)
    unit = units.distance_label
    if stage is NotificationStage.ALERT:
        left: list[str] = []
        if status.days_left is not None:
            left.append(texts["days"].format(days=status.days_left))
        if status.distance_left is not None:
            distance = units.distance_out(status.distance_left) or 0
            left.append(texts["distance"].format(distance=f"{distance:.0f}", unit=unit))
        body = texts["alert"].format(
            vehicle=vehicle.name, label=reminder.label, left=texts["or"].join(left)
        )
        title = texts["title_alert"].format(label=reminder.label)
    else:
        body = texts["due"].format(vehicle=vehicle.name, label=reminder.label)
        title = texts["title_due"].format(label=reminder.label)
    details = []
    if reminder.due_date is not None:
        details.append(texts["due_date"].format(date=reminder.due_date.isoformat()))
    if reminder.due_odometer is not None:
        odometer = units.distance_out(reminder.due_odometer) or 0
        details.append(
            texts["due_odometer"].format(odometer=f"{odometer:.0f}", unit=unit)
        )
    return title, " ".join([body, *details])


async def async_send_reminder_notification(
    hass: HomeAssistant,
    options: Mapping[str, Any],
    *,
    vehicle: Vehicle,
    reminder: Reminder,
    status: ReminderStatus,
    stage: NotificationStage,
) -> None:
    """Envoyer la notification à tous les destinataires configurés."""
    entities: list[str] = list(options.get(CONF_NOTIFY_ENTITIES, []))
    services: list[str] = list(options.get(CONF_NOTIFY_SERVICES, []))
    if not entities and not services:
        return
    title, message = build_message(
        hass.config.language, vehicle, reminder, status, stage
    )
    calls: list[tuple[str, dict[str, Any], dict[str, Any] | None]] = []
    if entities:
        calls.append(
            (
                "send_message",
                {"title": title, "message": message},
                {"entity_id": entities},
            )
        )
    for service in services:
        calls.append(
            (
                service.removeprefix("notify."),
                {"title": title, "message": message},
                None,
            )
        )
    for service, data, target in calls:
        try:
            await hass.services.async_call(
                "notify", service, data, target=target, blocking=True
            )
        except (HomeAssistantError, ValueError) as err:
            _LOGGER.warning(
                "Notification « %s » non envoyée via notify.%s : %s",
                reminder.label,
                service,
                err,
            )
