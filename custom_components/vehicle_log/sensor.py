"""Sensors par véhicule."""

from __future__ import annotations

from collections.abc import Callable
from dataclasses import dataclass
import datetime as dt
from typing import TYPE_CHECKING, Any

from homeassistant.components.sensor import (
    SensorDeviceClass,
    SensorEntity,
    SensorEntityDescription,
    SensorStateClass,
)
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback
from homeassistant.util import dt as dt_util

from .coordinator import VehicleLogCoordinator
from .core.models import FuelType, Vehicle
from .core.presenter import VehicleUnits
from .core.summary import VehicleSummary
from .entity import VehicleEntity

if TYPE_CHECKING:
    from . import VehicleLogConfigEntry


@dataclass(frozen=True, kw_only=True)
class VehicleSensorDescription(SensorEntityDescription):
    """Description d'un sensor de véhicule."""

    value_fn: Callable[[VehicleSummary, VehicleUnits], float | None]
    unit_fn: Callable[[VehicleUnits, str], str | None]
    monthly_reset: bool = False


def _consumption(fuel: FuelType, key: str) -> VehicleSensorDescription:
    return VehicleSensorDescription(
        key=key,
        translation_key=key,
        state_class=SensorStateClass.MEASUREMENT,
        suggested_display_precision=2,
        value_fn=lambda s, u: u.consumption_out(s.consumption.get(fuel), fuel),
        unit_fn=lambda u, _currency: u.consumption_label(fuel),
    )


def _distance(
    key: str, attr: str, state_class: SensorStateClass | None
) -> VehicleSensorDescription:
    return VehicleSensorDescription(
        key=key,
        translation_key=key,
        device_class=SensorDeviceClass.DISTANCE,
        state_class=state_class,
        suggested_display_precision=0,
        value_fn=lambda s, u: u.distance_out(getattr(s, attr)),
        unit_fn=lambda u, _currency: u.distance_label,
    )


def _descriptions(vehicle: Vehicle) -> list[VehicleSensorDescription]:
    descriptions = [
        _consumption(vehicle.fuel_type, "consumption"),
        VehicleSensorDescription(
            key="month_cost",
            translation_key="month_cost",
            device_class=SensorDeviceClass.MONETARY,
            state_class=SensorStateClass.TOTAL,
            suggested_display_precision=2,
            monthly_reset=True,
            value_fn=lambda s, _u: s.month_cost,
            unit_fn=lambda _u, currency: currency,
        ),
        VehicleSensorDescription(
            key="cost_per_distance",
            translation_key="cost_per_distance",
            state_class=SensorStateClass.MEASUREMENT,
            suggested_display_precision=3,
            value_fn=lambda s, u: (
                s.cost_per_km * u.distance_in(1.0)
                if s.cost_per_km is not None
                else None
            ),
            unit_fn=lambda u, currency: f"{currency}/{u.distance_label}",
        ),
        _distance("odometer", "current_odometer", SensorStateClass.TOTAL_INCREASING),
        _distance("distance_week", "distance_week", None),
        _distance("distance_month", "distance_month", None),
        _distance("distance_year", "distance_year", None),
    ]
    if vehicle.secondary_fuel_type is not None:
        descriptions.insert(
            1, _consumption(vehicle.secondary_fuel_type, "consumption_secondary")
        )
    return descriptions


async def async_setup_entry(
    hass: HomeAssistant,
    entry: VehicleLogConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    """Créer les sensors de chaque véhicule (rattachés à son subentry)."""
    coordinator = entry.runtime_data.coordinator
    currency = hass.config.currency
    for vehicle_id, vehicle in coordinator.vehicles.items():
        async_add_entities(
            [
                VehicleSensor(coordinator, vehicle, description, currency)
                for description in _descriptions(vehicle)
            ],
            config_subentry_id=vehicle_id,
        )


class VehicleSensor(VehicleEntity, SensorEntity):
    """Indicateur d'un véhicule."""

    entity_description: VehicleSensorDescription

    def __init__(
        self,
        coordinator: VehicleLogCoordinator,
        vehicle: Vehicle,
        description: VehicleSensorDescription,
        currency: str,
    ) -> None:
        """Initialiser."""
        super().__init__(coordinator, vehicle, description.key)
        self.entity_description = description
        unit = description.unit_fn(self.units, currency)
        self._attr_native_unit_of_measurement = unit
        if description.device_class is SensorDeviceClass.DISTANCE:
            # Respecter l'unité choisie pour le véhicule plutôt que celle du
            # système d'unités global.
            self._attr_suggested_unit_of_measurement = unit

    @property
    def native_value(self) -> float | None:
        """Valeur dans les unités du véhicule."""
        if (summary := self.summary) is None:
            return None
        return self.entity_description.value_fn(summary, self.units)

    @property
    def last_reset(self) -> dt.datetime | None:
        """Début du mois en cours pour les coûts mensuels."""
        if not self.entity_description.monthly_reset:
            return None
        return dt_util.start_of_local_day(dt_util.now().date().replace(day=1))

    @property
    def extra_state_attributes(self) -> dict[str, Any] | None:
        """Détails complémentaires."""
        summary = self.summary
        if summary is None:
            return None
        key = self.entity_description.key
        if key == "month_cost":
            return {
                "fuel": summary.month_fuel_cost,
                "expenses": summary.month_expense_cost,
            }
        if key == "cost_per_distance":
            fuel = summary.fuel_cost_per_km
            return {
                "fuel_only": fuel * self.units.distance_in(1.0)
                if fuel is not None
                else None,
                "total_cost": summary.total_cost,
                "distance": self.units.distance_out(summary.total_distance),
            }
        if key == "odometer":
            return {"distance_logged": self.units.distance_out(summary.total_distance)}
        return None
