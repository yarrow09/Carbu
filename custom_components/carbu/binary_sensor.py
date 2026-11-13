"""Un ``binary_sensor`` « dû » par rappel, rattaché au véhicule.

Les entités sont ajoutées et retirées dynamiquement quand des rappels sont
créés ou supprimés, sans recharger l'intégration.
"""

from __future__ import annotations

from typing import TYPE_CHECKING, Any

from homeassistant.components.binary_sensor import BinarySensorEntity
from homeassistant.components.binary_sensor.const import BinarySensorDeviceClass
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback

from .coordinator import VehicleLogCoordinator
from .core.models import Reminder, Vehicle
from .entity import VehicleEntity

if TYPE_CHECKING:
    from . import VehicleLogConfigEntry


async def async_setup_entry(
    hass: HomeAssistant,
    entry: VehicleLogConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    """Créer une entité par rappel existant, puis suivre les ajouts."""
    coordinator = entry.runtime_data.coordinator
    known: dict[str, set[str]] = {vid: set() for vid in coordinator.vehicles}

    @callback
    def _sync() -> None:
        for vehicle_id, vehicle in coordinator.vehicles.items():
            current = {r.id for r in coordinator.records(vehicle_id).reminders}
            new = current - known[vehicle_id]
            if new:
                async_add_entities(
                    [ReminderSensor(coordinator, vehicle, rid) for rid in sorted(new)],
                    config_subentry_id=vehicle_id,
                )
            known[vehicle_id] = current

    _sync()
    entry.async_on_unload(coordinator.async_add_listener(_sync))


class ReminderSensor(VehicleEntity, BinarySensorEntity):
    """Rappel : activé quand il est dû (premier critère atteint)."""

    _attr_device_class = BinarySensorDeviceClass.PROBLEM

    def __init__(
        self, coordinator: VehicleLogCoordinator, vehicle: Vehicle, reminder_id: str
    ) -> None:
        """Initialiser."""
        super().__init__(coordinator, vehicle, "reminder")
        self.reminder_id = reminder_id
        self._attr_unique_id = f"{vehicle.id}_reminder_{reminder_id}"
        reminder = self.reminder
        self._attr_name = reminder.label if reminder else None

    @property
    def reminder(self) -> Reminder | None:
        """Rappel suivi (``None`` s'il a été supprimé)."""
        try:
            return self.coordinator.records(self.vehicle.id).reminders.get(
                self.reminder_id
            )
        except LookupError:
            return None

    @property
    def available(self) -> bool:
        """Disponible tant que le rappel existe."""
        return super().available and self.reminder is not None

    @property
    def is_on(self) -> bool | None:
        """Vrai quand le rappel est dû."""
        if (reminder := self.reminder) is None:
            return None
        return self.coordinator.reminder_status(self.vehicle.id, reminder).is_due

    @property
    def extra_state_attributes(self) -> dict[str, Any] | None:
        """État détaillé (unités du véhicule)."""
        if (reminder := self.reminder) is None:
            return None
        view = self.units.reminder_view(
            reminder, self.coordinator.reminder_status(self.vehicle.id, reminder)
        )
        keys = (
            "state", "kind", "due_date", "due_odometer", "days_left",
            "distance_left", "criterion", "recurring", "last_done_date",
        )  # fmt: skip
        return {key: view[key] for key in keys}

    @callback
    def _handle_coordinator_update(self) -> None:
        reminder = self.reminder
        if reminder is None:
            # Rappel supprimé : l'entité disparaît du registre.
            registry = er.async_get(self.hass)
            if self.entity_id in registry.entities:
                registry.async_remove(self.entity_id)
            return
        self._attr_name = reminder.label
        super()._handle_coordinator_update()
