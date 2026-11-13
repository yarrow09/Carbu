"""Kilométrage actuel modifiable (entité ``number``)."""

from __future__ import annotations

from typing import TYPE_CHECKING

from homeassistant.components.number import NumberDeviceClass, NumberEntity, NumberMode
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ServiceValidationError
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback

from .const import DOMAIN
from .coordinator import VehicleLogCoordinator, local_now
from .core.models import OdometerReading, Vehicle
from .entity import VehicleEntity

if TYPE_CHECKING:
    from . import VehicleLogConfigEntry

MAX_ODOMETER = 9_999_999


async def async_setup_entry(
    hass: HomeAssistant,
    entry: VehicleLogConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    """Créer le compteur de chaque véhicule."""
    coordinator = entry.runtime_data.coordinator
    for vehicle_id, vehicle in coordinator.vehicles.items():
        async_add_entities(
            [OdometerNumber(coordinator, vehicle)], config_subentry_id=vehicle_id
        )


class OdometerNumber(VehicleEntity, NumberEntity):
    """Kilométrage actuel : une saisie crée un relevé manuel daté de maintenant."""

    _attr_device_class = NumberDeviceClass.DISTANCE
    _attr_mode = NumberMode.BOX
    _attr_native_min_value = 0
    _attr_native_max_value = MAX_ODOMETER
    _attr_native_step = 1

    def __init__(self, coordinator: VehicleLogCoordinator, vehicle: Vehicle) -> None:
        """Initialiser."""
        super().__init__(coordinator, vehicle, "current_odometer")
        self._attr_native_unit_of_measurement = self.units.distance_label

    @property
    def native_value(self) -> float | None:
        """Dernier kilométrage connu."""
        if (summary := self.summary) is None:
            return None
        return self.units.distance_out(summary.current_odometer)

    async def async_set_native_value(self, value: float) -> None:
        """Enregistrer un relevé ; un kilométrage inférieur est refusé."""
        current = self.native_value
        if current is not None and value < current:
            raise ServiceValidationError(
                translation_domain=DOMAIN,
                translation_key="odometer_decrease",
                translation_placeholders={
                    "value": f"{value:.0f}",
                    "current": f"{current:.0f}",
                    "unit": self.units.distance_label,
                },
            )
        now = local_now()
        self.coordinator.async_add_odometer(
            self.vehicle.id,
            OdometerReading(
                date=now.date(),
                time=now.time().replace(microsecond=0),
                odometer=self.units.distance_in(value),
            ),
        )
