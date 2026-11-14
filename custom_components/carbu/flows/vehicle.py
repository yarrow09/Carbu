"""Assistant véhicule : identité → unités → carburant(s) → consommation.

Un subentry par véhicule ; la modification reprend les mêmes étapes,
pré-remplies avec les valeurs actuelles.
"""

from __future__ import annotations

import datetime as dt
from typing import Any

from homeassistant.config_entries import (
    SOURCE_RECONFIGURE,
    ConfigSubentryFlow,
    SubentryFlowResult,
)
from homeassistant.core import callback
from homeassistant.helpers.selector import (
    BooleanSelector,
    DateSelector,
    TextSelector,
)
from homeassistant.util.unit_system import US_CUSTOMARY_SYSTEM
import probatio as vol

from ..core.models import ConsumptionUnit, DistanceUnit, FuelType, VolumeUnit
from ..core.units import (
    consumption_to_l100,
    l100_to_consumption,
    liters_to_volume,
    volume_to_liters,
)
from .common import number, select

# Clé de formulaire hors modèle
CONF_BIFUEL = "bifuel"


def _volume_label(fuel: FuelType, unit: VolumeUnit) -> str:
    """Unité de quantité affichée pour un carburant."""
    if fuel is FuelType.CNG:
        return "kg"
    return {"l": "L", "gal_us": "gal (US)", "gal_uk": "gal (UK)"}[unit.value]


def _capacity_to_liters(
    value: float | None, fuel: FuelType, unit: VolumeUnit
) -> float | None:
    if value is None or value <= 0:
        return None
    if fuel is FuelType.CNG:
        return value  # GNV : toujours en kg
    return volume_to_liters(value, unit)


def _capacity_from_liters(
    value: float | None, fuel: FuelType, unit: VolumeUnit
) -> float | None:
    if value is None:
        return None
    if fuel is FuelType.CNG:
        return value
    return round(liters_to_volume(value, unit), 2)


class VehicleSubentryFlow(ConfigSubentryFlow):
    """Assistant véhicule : identité → unités → carburant(s) → consommation."""

    def __init__(self) -> None:
        """Initialiser."""
        self._data: dict[str, Any] = {}

    @property
    def _is_reconfigure(self) -> bool:
        return self.source == SOURCE_RECONFIGURE

    def _default_units(self) -> dict[str, str]:
        if self.hass.config.units is US_CUSTOMARY_SYSTEM:
            return {
                "distance_unit": DistanceUnit.MILES,
                "volume_unit": VolumeUnit.GALLONS_US,
                "consumption_unit": ConsumptionUnit.MPG_US,
            }
        return {
            "distance_unit": DistanceUnit.KILOMETERS,
            "volume_unit": VolumeUnit.LITERS,
            "consumption_unit": ConsumptionUnit.L_PER_100KM,
        }

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> SubentryFlowResult:
        """Ajouter un véhicule."""
        self._data = {
            "fuel_type": FuelType.GASOLINE,
            "consumption_min": 3.0,
            "consumption_max": 20.0,
            **self._default_units(),
        }
        return await self.async_step_identity()

    async def async_step_reconfigure(
        self, user_input: dict[str, Any] | None = None
    ) -> SubentryFlowResult:
        """Modifier un véhicule (mêmes étapes, valeurs actuelles pré-remplies)."""
        self._data = dict(self._get_reconfigure_subentry().data)
        return await self.async_step_identity()

    # --- Étape 1 : identité -------------------------------------------

    async def async_step_identity(
        self, user_input: dict[str, Any] | None = None
    ) -> SubentryFlowResult:
        """Nom, marque, modèle, immatriculation, date d'acquisition."""
        errors: dict[str, str] = {}
        if user_input is not None:
            name = user_input["name"].strip()
            current_id = (
                self._get_reconfigure_subentry().subentry_id
                if self._is_reconfigure
                else None
            )
            taken = {
                sub.title.casefold()
                for sub_id, sub in self._get_entry().subentries.items()
                if sub_id != current_id
            }
            if not name:
                errors["name"] = "name_required"
            elif name.casefold() in taken:
                errors["name"] = "name_exists"
            else:
                self._data.update(
                    name=name,
                    make=user_input.get("make", "").strip(),
                    model=user_input.get("model", "").strip(),
                    plate=(user_input.get("plate") or "").strip() or None,
                    acquisition_date=user_input.get("acquisition_date"),
                )
                return await self.async_step_units()

        schema = vol.Schema(
            {
                vol.Required("name"): TextSelector(),
                vol.Optional("make"): TextSelector(),
                vol.Optional("model"): TextSelector(),
                vol.Optional("plate"): TextSelector(),
                vol.Optional("acquisition_date"): DateSelector(),
            }
        )
        suggested = {k: v for k, v in self._data.items() if v is not None}
        return self.async_show_form(
            step_id="identity",
            data_schema=self.add_suggested_values_to_schema(
                schema, user_input or suggested
            ),
            errors=errors,
        )

    # --- Étape 2 : unités ---------------------------------------------

    async def async_step_units(
        self, user_input: dict[str, Any] | None = None
    ) -> SubentryFlowResult:
        """Unités d'affichage et de saisie."""
        if user_input is not None:
            self._data.update(user_input)
            return await self.async_step_fuel()

        schema = vol.Schema(
            {
                vol.Required("distance_unit"): select(
                    [u.value for u in DistanceUnit], "distance_unit"
                ),
                vol.Required("volume_unit"): select(
                    [u.value for u in VolumeUnit], "volume_unit"
                ),
                vol.Required("consumption_unit"): select(
                    [u.value for u in ConsumptionUnit], "consumption_unit"
                ),
            }
        )
        return self.async_show_form(
            step_id="units",
            data_schema=self.add_suggested_values_to_schema(schema, self._data),
        )

    # --- Étape 3 : carburant principal --------------------------------

    async def async_step_fuel(
        self, user_input: dict[str, Any] | None = None
    ) -> SubentryFlowResult:
        """Carburant, capacité du réservoir, bi-carburant."""
        unit = VolumeUnit(self._data["volume_unit"])
        if user_input is not None:
            fuel = FuelType(user_input["fuel_type"])
            self._data.update(
                fuel_type=fuel,
                tank_capacity=_capacity_to_liters(
                    user_input.get("tank_capacity"), fuel, unit
                ),
            )
            if user_input.get(CONF_BIFUEL):
                return await self.async_step_secondary_fuel()
            self._data.update(secondary_fuel_type=None, secondary_tank_capacity=None)
            return await self.async_step_consumption()

        fuel = FuelType(self._data["fuel_type"])
        schema = vol.Schema(
            {
                vol.Required("fuel_type"): select(
                    [f.value for f in FuelType], "fuel_type"
                ),
                vol.Optional("tank_capacity"): number(),
                vol.Required(CONF_BIFUEL): BooleanSelector(),
            }
        )
        suggested: dict[str, Any] = {
            "fuel_type": fuel,
            CONF_BIFUEL: bool(self._data.get("secondary_fuel_type")),
        }
        capacity = _capacity_from_liters(self._data.get("tank_capacity"), fuel, unit)
        if capacity is not None:
            suggested["tank_capacity"] = capacity
        return self.async_show_form(
            step_id="fuel",
            data_schema=self.add_suggested_values_to_schema(schema, suggested),
            description_placeholders={
                "volume_unit": _volume_label(FuelType.GASOLINE, unit)
            },
        )

    # --- Étape 3 bis : carburant secondaire ---------------------------

    async def async_step_secondary_fuel(
        self, user_input: dict[str, Any] | None = None
    ) -> SubentryFlowResult:
        """Second carburant d'un véhicule bi-carburant."""
        unit = VolumeUnit(self._data["volume_unit"])
        primary = FuelType(self._data["fuel_type"])
        errors: dict[str, str] = {}
        if user_input is not None:
            secondary = FuelType(user_input["secondary_fuel_type"])
            if secondary is primary:
                errors["secondary_fuel_type"] = "same_fuel"
            else:
                self._data.update(
                    secondary_fuel_type=secondary,
                    secondary_tank_capacity=_capacity_to_liters(
                        user_input.get("secondary_tank_capacity"), secondary, unit
                    ),
                )
                return await self.async_step_consumption()

        schema = vol.Schema(
            {
                vol.Required("secondary_fuel_type"): select(
                    [f.value for f in FuelType if f is not primary], "fuel_type"
                ),
                vol.Optional("secondary_tank_capacity"): number(),
            }
        )
        suggested: dict[str, Any] = {}
        current = self._data.get("secondary_fuel_type")
        if current and FuelType(current) is not primary:
            suggested["secondary_fuel_type"] = current
            capacity = _capacity_from_liters(
                self._data.get("secondary_tank_capacity"), FuelType(current), unit
            )
            if capacity is not None:
                suggested["secondary_tank_capacity"] = capacity
        return self.async_show_form(
            step_id="secondary_fuel",
            data_schema=self.add_suggested_values_to_schema(
                schema, user_input or suggested
            ),
            errors=errors,
            description_placeholders={
                "volume_unit": _volume_label(FuelType.GASOLINE, unit),
            },
        )

    # --- Étape 4 : plage de consommation -------------------------------

    async def async_step_consumption(
        self, user_input: dict[str, Any] | None = None
    ) -> SubentryFlowResult:
        """Plage de consommation plausible (contrôle de cohérence)."""
        unit = ConsumptionUnit(self._data["consumption_unit"])
        errors: dict[str, str] = {}
        if user_input is not None:
            low = consumption_to_l100(user_input["consumption_min"], unit)
            high = consumption_to_l100(user_input["consumption_max"], unit)
            if low is None or high is None or low == high:
                errors["base"] = "invalid_range"
            else:
                # Les unités inverses (km/l, MPG) inversent l'ordre min/max.
                low, high = sorted((low, high))
                self._data.update(consumption_min=low, consumption_max=high)
                return self._async_finish()

        a = l100_to_consumption(self._data["consumption_min"], unit)
        b = l100_to_consumption(self._data["consumption_max"], unit)
        low_d, high_d = sorted((round(a or 0, 1), round(b or 0, 1)))
        schema = vol.Schema(
            {
                vol.Required("consumption_min"): number(),
                vol.Required("consumption_max"): number(),
            }
        )
        return self.async_show_form(
            step_id="consumption",
            data_schema=self.add_suggested_values_to_schema(
                schema,
                user_input or {"consumption_min": low_d, "consumption_max": high_d},
            ),
            errors=errors,
        )

    @callback
    def _async_finish(self) -> SubentryFlowResult:
        data = {
            key: (value.value if hasattr(value, "value") else value)
            for key, value in self._data.items()
        }
        if isinstance(data.get("acquisition_date"), dt.date):
            data["acquisition_date"] = data["acquisition_date"].isoformat()
        title = data["name"]
        if self._is_reconfigure:
            return self.async_update_and_abort(
                self._get_entry(),
                self._get_reconfigure_subentry(),
                title=title,
                data=data,
            )
        return self.async_create_entry(title=title, data=data)
