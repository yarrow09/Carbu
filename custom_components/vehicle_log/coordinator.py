"""Coordinator : indicateurs par véhicule et point d'entrée des modifications.

Aucun appel réseau : les indicateurs sont recalculés immédiatement après
chaque modification, et une fois par heure pour suivre les changements de
semaine / mois / année.
"""

from __future__ import annotations

import datetime as dt
import logging
from typing import TYPE_CHECKING

from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator
from homeassistant.util import dt as dt_util

from .attachments import AttachmentStore
from .const import DOMAIN
from .core.distance import Reading, collect_readings
from .core.models import Expense, FuelEntry, OdometerReading, Vehicle
from .core.repository import VehicleRecords
from .core.summary import VehicleSummary, compute_summary
from .core.validation import CoherenceWarning, check_fuel_entry, check_odometer
from .storage import VehicleLogStorage

if TYPE_CHECKING:
    from homeassistant.config_entries import ConfigEntry

_LOGGER = logging.getLogger(__name__)
UPDATE_INTERVAL = dt.timedelta(hours=1)


class VehicleNotFoundError(LookupError):
    """Véhicule inconnu."""


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
        return self._compute()

    def _compute(self) -> dict[str, VehicleSummary]:
        now = local_now()
        return {
            vid: compute_summary(vehicle, self.records(vid), now)
            for vid, vehicle in self.vehicles.items()
        }

    # --- Accès ----------------------------------------------------------

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
        self.storage.async_schedule_save()
        self.async_set_updated_data(self._compute())

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
                "vehicle_log_delete_attachment",
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
