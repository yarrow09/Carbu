"""Entité de base : une entité appartient à un véhicule (un device)."""

from __future__ import annotations

from homeassistant.helpers.device_registry import DeviceInfo
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from .const import DOMAIN
from .coordinator import VehicleLogCoordinator
from .core.models import Vehicle
from .core.presenter import VehicleUnits
from .core.summary import VehicleSummary


class VehicleEntity(CoordinatorEntity[VehicleLogCoordinator]):
    """Entité rattachée à un véhicule."""

    _attr_has_entity_name = True

    def __init__(
        self, coordinator: VehicleLogCoordinator, vehicle: Vehicle, key: str
    ) -> None:
        """Initialiser."""
        super().__init__(coordinator)
        self.vehicle = vehicle
        self.units = VehicleUnits(vehicle)
        self._attr_translation_key = key
        self._attr_unique_id = f"{vehicle.id}_{key}"
        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, vehicle.id)},
            name=vehicle.name,
            manufacturer=vehicle.make or None,
            model=vehicle.model or None,
            serial_number=vehicle.plate,
        )

    @property
    def summary(self) -> VehicleSummary | None:
        """Indicateurs courants du véhicule."""
        if self.coordinator.data is None:
            return None
        return self.coordinator.data.get(self.vehicle.id)

    @property
    def available(self) -> bool:
        """Disponible tant que le véhicule est connu."""
        return super().available and self.summary is not None
