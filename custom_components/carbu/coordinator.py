"""Coordinator : indicateurs par véhicule et point d'entrée des modifications.

Aucun appel réseau : les indicateurs sont recalculés immédiatement après
chaque modification, et une fois par heure pour suivre les changements de
semaine / mois / année.
"""

from __future__ import annotations

from collections.abc import Mapping
from dataclasses import dataclass, field
import datetime as dt
import logging
from typing import TYPE_CHECKING, Any

from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator
from homeassistant.util import dt as dt_util

from .attachments import AttachmentStore
from .const import CONF_MOVING_AVERAGE, DEFAULT_MOVING_AVERAGE, DOMAIN
from .core.distance import Reading, collect_readings
from .core.inputs import expense_from_input, fuel_entry_from_input, reminder_from_input
from .core.models import Expense, FuelEntry, OdometerReading, Reminder, Vehicle
from .core.presenter import VehicleUnits
from .core.reminders import (
    ReminderStatus,
    mark_done,
    notification_to_send,
    record_notification,
    reminder_status,
)
from .core.repository import VehicleRecords
from .core.summary import VehicleSummary, compute_summary
from .core.validation import CoherenceWarning, check_fuel_entry, check_odometer
from .notifications import async_send_reminder_notification
from .storage import VehicleLogStorage

if TYPE_CHECKING:
    from homeassistant.config_entries import ConfigEntry

_LOGGER = logging.getLogger(__name__)
UPDATE_INTERVAL = dt.timedelta(hours=1)


class VehicleNotFoundError(LookupError):
    """Véhicule inconnu."""


@dataclass(slots=True)
class SaveResult[T]:
    """Résultat d'un enregistrement soumis aux contrôles de cohérence."""

    record: T
    saved: bool
    warnings: list[CoherenceWarning] = field(default_factory=list)


def local_now() -> dt.datetime:
    """Heure locale de Home Assistant, sans fuseau (convention du cœur pur)."""
    return dt_util.now().replace(tzinfo=None)


class VehicleLogCoordinator(DataUpdateCoordinator[dict[str, VehicleSummary]]):
    """Indicateurs de tous les véhicules de l'entrée."""

    def __init__(
        self,
        hass: HomeAssistant,
        entry: ConfigEntry,
        storage: VehicleLogStorage,
        vehicles: dict[str, Vehicle],
        attachments: AttachmentStore,
    ) -> None:
        """Initialiser."""
        super().__init__(
            hass,
            _LOGGER,
            config_entry=entry,
            name=DOMAIN,
            update_interval=UPDATE_INTERVAL,
        )
        self.storage = storage
        self.vehicles = vehicles
        self.attachments = attachments

    async def _async_update_data(self) -> dict[str, VehicleSummary]:
        data = self._compute()
        # Passage horaire : prend en compte les échéances par date.
        self._async_process_notifications(data)
        return data

    def _compute(self) -> dict[str, VehicleSummary]:
        now = local_now()
        return {
            vid: compute_summary(vehicle, self.records(vid), now)
            for vid, vehicle in self.vehicles.items()
        }

    # --- Accès ----------------------------------------------------------

    @property
    def moving_average_window(self) -> int:
        """Taille de la moyenne mobile (option globale)."""
        options = self.config_entry.options if self.config_entry else {}
        return int(options.get(CONF_MOVING_AVERAGE, DEFAULT_MOVING_AVERAGE))

    def vehicle(self, vehicle_id: str) -> Vehicle:
        """Véhicule par identifiant."""
        try:
            return self.vehicles[vehicle_id]
        except KeyError as err:
            raise VehicleNotFoundError(vehicle_id) from err

    def records(self, vehicle_id: str) -> VehicleRecords:
        """Enregistrements d'un véhicule."""
        return self.storage.data.records(vehicle_id)

    def readings(
        self, vehicle_id: str, exclude_fuel_id: str | None = None
    ) -> list[Reading]:
        """Relevés de compteur d'un véhicule (optionnellement sans un plein)."""
        rec = self.records(vehicle_id)
        fuel = [e for e in rec.fuel if e.id != exclude_fuel_id]
        return collect_readings(fuel, rec.expenses, rec.odometer)

    # --- Modifications --------------------------------------------------

    @callback
    def async_commit(self) -> None:
        """Programmer l'écriture et publier les nouveaux indicateurs."""
        data = self._compute()
        self._async_process_notifications(data)
        self.storage.async_schedule_save()
        self.async_set_updated_data(data)

    def check_fuel(self, vehicle_id: str, entry: FuelEntry) -> list[CoherenceWarning]:
        """Contrôles de cohérence d'un plein avant enregistrement."""
        rec = self.records(vehicle_id)
        others = collect_readings([], rec.expenses, rec.odometer)
        return check_fuel_entry(self.vehicle(vehicle_id), entry, rec.fuel, others)

    def check_odometer(
        self, vehicle_id: str, at: dt.datetime, odometer: float
    ) -> list[CoherenceWarning]:
        """Contrôle d'un relevé manuel."""
        return check_odometer(at, odometer, self.readings(vehicle_id))

    @callback
    def async_add_fuel(self, vehicle_id: str, entry: FuelEntry) -> FuelEntry:
        """Enregistrer un nouveau plein."""
        self.vehicle(vehicle_id)
        self.records(vehicle_id).fuel.add(entry)
        self.async_commit()
        return entry

    @callback
    def async_update_fuel(self, vehicle_id: str, entry: FuelEntry) -> FuelEntry:
        """Modifier un plein (recalcul automatique)."""
        self.vehicle(vehicle_id)
        self.records(vehicle_id).fuel.update(entry)
        self.async_commit()
        return entry

    @callback
    def async_delete_fuel(self, vehicle_id: str, entry_id: str) -> None:
        """Supprimer un plein (recalcul automatique)."""
        self.vehicle(vehicle_id)
        self.records(vehicle_id).fuel.delete(entry_id)
        self.async_commit()

    @callback
    def async_add_expense(self, vehicle_id: str, expense: Expense) -> Expense:
        """Enregistrer une dépense."""
        self.vehicle(vehicle_id)
        self.storage.data.add_expense(vehicle_id, expense)
        self.async_commit()
        return expense

    @callback
    def async_update_expense(self, vehicle_id: str, expense: Expense) -> Expense:
        """Modifier une dépense."""
        self.vehicle(vehicle_id)
        self.storage.data.update_expense(vehicle_id, expense)
        self.async_commit()
        return expense

    @callback
    def async_delete_expense(self, vehicle_id: str, expense_id: str) -> None:
        """Supprimer une dépense."""
        self.vehicle(vehicle_id)
        expense = self.records(vehicle_id).expenses.delete(expense_id)
        if expense.attachment:
            self.hass.async_create_task(
                self.attachments.async_delete(vehicle_id, expense.attachment),
                "carbu_delete_attachment",
            )
        self.async_commit()

    @callback
    def async_add_odometer(
        self, vehicle_id: str, reading: OdometerReading
    ) -> OdometerReading:
        """Enregistrer un relevé manuel du compteur."""
        self.vehicle(vehicle_id)
        self.records(vehicle_id).odometer.add(reading)
        self.async_commit()
        return reading

    # --- Saisie partagée (cartes et services) -------------------------------

    def units(self, vehicle_id: str) -> VehicleUnits:
        """Convertisseur d'unités du véhicule."""
        return VehicleUnits(self.vehicle(vehicle_id))

    @callback
    def async_save_fuel(
        self,
        vehicle_id: str,
        data: Mapping[str, Any],
        *,
        entry_id: str | None = None,
        save_with_warnings: bool,
    ) -> SaveResult[FuelEntry]:
        """Ajouter ou modifier un plein saisi dans les unités du véhicule.

        Avec des avertissements, le plein n'est enregistré que si
        ``save_with_warnings`` est vrai.
        """
        rec = self.records(vehicle_id)
        existing = rec.fuel.get(entry_id) if entry_id else None
        entry = fuel_entry_from_input(
            self.units(vehicle_id), data, existing, local_now()
        )
        warnings = self.check_fuel(vehicle_id, entry)
        if warnings and not save_with_warnings:
            return SaveResult(entry, False, warnings)
        if existing:
            self.async_update_fuel(vehicle_id, entry)
        else:
            self.async_add_fuel(vehicle_id, entry)
        return SaveResult(entry, True, warnings)

    @callback
    def async_save_expense(
        self,
        vehicle_id: str,
        data: Mapping[str, Any],
        *,
        expense_id: str | None = None,
    ) -> Expense:
        """Ajouter ou modifier une dépense saisie dans les unités du véhicule."""
        rec = self.records(vehicle_id)
        existing = rec.expenses.get(expense_id) if expense_id else None
        expense = expense_from_input(
            self.units(vehicle_id), data, existing, local_now().date()
        )
        if existing:
            return self.async_update_expense(vehicle_id, expense)
        return self.async_add_expense(vehicle_id, expense)

    @callback
    def async_save_odometer(
        self,
        vehicle_id: str,
        value: float,
        at: dt.datetime | None = None,
        *,
        save_with_warnings: bool,
    ) -> SaveResult[OdometerReading]:
        """Relevé manuel saisi dans l'unité de distance du véhicule."""
        if value < 0:
            raise ValueError("Kilométrage invalide")
        at = at or local_now().replace(microsecond=0)
        reading = OdometerReading(
            date=at.date(),
            time=at.time(),
            odometer=self.units(vehicle_id).distance_in(value),
        )
        warnings = self.check_odometer(vehicle_id, at, reading.odometer)
        if warnings and not save_with_warnings:
            return SaveResult(reading, False, warnings)
        self.async_add_odometer(vehicle_id, reading)
        return SaveResult(reading, True, warnings)

    # --- Rappels ------------------------------------------------------------

    def current_odometer(self, vehicle_id: str) -> float | None:
        """Dernier kilométrage connu (km)."""
        readings = self.readings(vehicle_id)
        return readings[-1].odometer if readings else None

    def reminder_status(self, vehicle_id: str, reminder: Reminder) -> ReminderStatus:
        """État d'un rappel aujourd'hui."""
        return reminder_status(
            reminder, local_now().date(), self.current_odometer(vehicle_id)
        )

    @callback
    def async_save_reminder(
        self,
        vehicle_id: str,
        data: Mapping[str, Any],
        *,
        reminder_id: str | None = None,
    ) -> Reminder:
        """Créer ou modifier un rappel (valeurs dans les unités du véhicule)."""
        reminders = self.records(vehicle_id).reminders
        existing = reminders.get(reminder_id) if reminder_id else None
        reminder = reminder_from_input(self.units(vehicle_id), data, existing)
        if existing:
            reminders.update(reminder)
        else:
            reminders.add(reminder)
        self.async_commit()
        return reminder

    @callback
    def async_delete_reminder(self, vehicle_id: str, reminder_id: str) -> None:
        """Supprimer un rappel."""
        self.vehicle(vehicle_id)
        self.records(vehicle_id).reminders.delete(reminder_id)
        self.async_commit()

    @callback
    def async_mark_reminder_done(
        self,
        vehicle_id: str,
        reminder_id: str,
        done_date: dt.date | None = None,
        done_odometer: float | None = None,
    ) -> Reminder:
        """Marquer un rappel comme fait (kilométrage dans l'unité du véhicule).

        Par défaut : aujourd'hui et le dernier kilométrage connu.
        """
        reminders = self.records(vehicle_id).reminders
        reminder = reminders.get(reminder_id)
        odometer_km = (
            self.units(vehicle_id).distance_in(done_odometer)
            if done_odometer is not None
            else self.current_odometer(vehicle_id)
        )
        updated = mark_done(reminder, done_date or local_now().date(), odometer_km)
        reminders.update(updated)
        self.async_commit()
        return updated

    # --- Notifications ------------------------------------------------------

    @callback
    def _async_process_notifications(self, data: Mapping[str, VehicleSummary]) -> None:
        """Envoyer les notifications d'alerte ou d'échéance non encore envoyées."""
        today = local_now().date()
        changed = False
        for vehicle_id, vehicle in self.vehicles.items():
            summary = data.get(vehicle_id)
            odometer = summary.current_odometer if summary else None
            for reminder in self.records(vehicle_id).reminders:
                status = reminder_status(reminder, today, odometer)
                stage = notification_to_send(reminder, status)
                if stage is None:
                    continue
                record_notification(reminder, stage)
                changed = True
                self.hass.async_create_background_task(
                    async_send_reminder_notification(
                        self.hass,
                        self.config_entry.options if self.config_entry else {},
                        vehicle=vehicle,
                        reminder=reminder,
                        status=status,
                        stage=stage,
                    ),
                    f"{DOMAIN}_notify_{reminder.id}",
                )
        if changed:
            self.storage.async_schedule_save()
