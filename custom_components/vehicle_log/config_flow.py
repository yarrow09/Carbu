"""Configuration graphique de Vehicle Log.

* ``VehicleLogConfigFlow`` : crée l'entrée unique « Carnet de bord ».
* ``VehicleSubentryFlow`` : assistant multi-étapes d'ajout / modification d'un
  véhicule (un subentry par véhicule).
* ``VehicleLogOptionsFlow`` : page globale (gestion des catégories).
"""

from __future__ import annotations

import datetime as dt
from pathlib import Path
import shutil
from typing import TYPE_CHECKING, Any

from homeassistant.config_entries import (
    SOURCE_RECONFIGURE,
    ConfigEntry,
    ConfigEntryState,
    ConfigFlow,
    ConfigFlowResult,
    ConfigSubentryFlow,
    OptionsFlow,
    SubentryFlowResult,
)
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.selector import (
    BooleanSelector,
    ColorRGBSelector,
    DateSelector,
    EntitySelector,
    EntitySelectorConfig,
    FileSelector,
    FileSelectorConfig,
    IconSelector,
    NumberSelector,
    NumberSelectorConfig,
    NumberSelectorMode,
    SelectOptionDict,
    SelectSelector,
    SelectSelectorConfig,
    SelectSelectorMode,
    TextSelector,
)
from homeassistant.helpers.translation import async_get_translations
from homeassistant.util.unit_system import US_CUSTOMARY_SYSTEM
import probatio as vol

from .const import (
    CONF_MOVING_AVERAGE,
    CONF_NOTIFY_ENTITIES,
    CONF_NOTIFY_SERVICES,
    DEFAULT_MOVING_AVERAGE,
    DOMAIN,
    SUBENTRY_TYPE_VEHICLE,
)
from .core.backup import BackupContent, InvalidBackupError, summarize
from .core.models import (
    CATEGORY_OTHER,
    Category,
    ConsumptionUnit,
    DistanceUnit,
    FuelType,
    VolumeUnit,
)
from .core.repository import CategoryError
from .core.units import (
    consumption_to_l100,
    l100_to_consumption,
    liters_to_volume,
    volume_to_liters,
)

if TYPE_CHECKING:
    from . import VehicleLogConfigEntry

DEFAULT_TITLE = "Carnet de bord"

# Clés de formulaire hors modèle
CONF_BIFUEL = "bifuel"
CONF_CATEGORY = "category"


def _select(options: list[str], translation_key: str) -> SelectSelector:
    return SelectSelector(
        SelectSelectorConfig(
            options=options,
            translation_key=translation_key,
            mode=SelectSelectorMode.DROPDOWN,
        )
    )


def _number(unit: str | None = None, step: float = 0.1) -> NumberSelector:
    config = NumberSelectorConfig(min=0, step=step, mode=NumberSelectorMode.BOX)
    if unit is not None:
        config["unit_of_measurement"] = unit
    return NumberSelector(config)


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


class VehicleLogConfigFlow(ConfigFlow, domain=DOMAIN):
    """Création de l'entrée unique."""

    VERSION = 1
    MINOR_VERSION = 1

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Confirmer l'installation."""
        if user_input is not None:
            return self.async_create_entry(title=DEFAULT_TITLE, data={})
        return self.async_show_form(step_id="user", data_schema=vol.Schema({}))

    @classmethod
    @callback
    def async_get_supported_subentry_types(
        cls, config_entry: ConfigEntry
    ) -> dict[str, type[ConfigSubentryFlow]]:
        """Un subentry par véhicule."""
        return {SUBENTRY_TYPE_VEHICLE: VehicleSubentryFlow}

    @staticmethod
    @callback
    def async_get_options_flow(config_entry: ConfigEntry) -> OptionsFlow:
        """Page globale."""
        return VehicleLogOptionsFlow()


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
                vol.Required("distance_unit"): _select(
                    [u.value for u in DistanceUnit], "distance_unit"
                ),
                vol.Required("volume_unit"): _select(
                    [u.value for u in VolumeUnit], "volume_unit"
                ),
                vol.Required("consumption_unit"): _select(
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
                vol.Required("fuel_type"): _select(
                    [f.value for f in FuelType], "fuel_type"
                ),
                vol.Optional("tank_capacity"): _number(),
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
                vol.Required("secondary_fuel_type"): _select(
                    [f.value for f in FuelType if f is not primary], "fuel_type"
                ),
                vol.Optional("secondary_tank_capacity"): _number(),
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
                vol.Required("consumption_min"): _number(),
                vol.Required("consumption_max"): _number(),
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


# --- Page globale : catégories ------------------------------------------


def _hex_to_rgb(value: str | None) -> list[int] | None:
    if not value or len(value) != 7:
        return None
    return [int(value[i : i + 2], 16) for i in (1, 3, 5)]


def _rgb_to_hex(value: list[int] | None) -> str | None:
    if not value:
        return None
    return "#{:02x}{:02x}{:02x}".format(*value)


async def async_category_labels(hass: HomeAssistant) -> dict[str, str]:
    """Libellés traduits des catégories par défaut."""
    translations = await async_get_translations(
        hass, hass.config.language, "selector", [DOMAIN]
    )
    prefix = f"component.{DOMAIN}.selector.category.options."
    return {
        key.removeprefix(prefix): value
        for key, value in translations.items()
        if key.startswith(prefix)
    }


class VehicleLogOptionsFlow(OptionsFlow):
    """Paramètres globaux : création, modification et suppression de catégories."""

    def __init__(self) -> None:
        """Initialiser."""
        self._category_id: str | None = None
        self._restore: tuple[BackupContent, dict[str, bytes]] | None = None

    @property
    def _entry(self) -> VehicleLogConfigEntry:
        return self.config_entry

    def _done(self) -> ConfigFlowResult:
        self._entry.runtime_data.storage.async_schedule_save()
        return self.async_create_entry(data=dict(self.config_entry.options))

    async def _labels(self) -> dict[str, str]:
        labels = await async_category_labels(self.hass)
        return {
            cat.id: cat.name or labels.get(cat.id, cat.id)
            for cat in self._entry.runtime_data.storage.data.categories.values()
        }

    async def async_step_init(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Menu de la page globale."""
        if self.config_entry.state is not ConfigEntryState.LOADED:
            return self.async_abort(reason="not_loaded")
        return self.async_show_menu(
            step_id="init",
            menu_options=[
                "add_category",
                "edit_category",
                "delete_category",
                "notifications",
                "statistics",
                "backup",
                "restore",
            ],
        )

    def _legacy_notify_services(self) -> list[str]:
        """Anciens services ``notify.xxx`` (ex. application mobile)."""
        excluded = {"send_message", "persistent_notification", "notify"}
        return sorted(
            name
            for name in self.hass.services.async_services_for_domain("notify")
            if name not in excluded
        )

    async def async_step_notifications(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Destinataires des notifications de rappels."""
        if user_input is not None:
            return self.async_create_entry(
                data={
                    **self.config_entry.options,
                    CONF_NOTIFY_ENTITIES: user_input.get(CONF_NOTIFY_ENTITIES, []),
                    CONF_NOTIFY_SERVICES: user_input.get(CONF_NOTIFY_SERVICES, []),
                }
            )
        options = self.config_entry.options
        services = self._legacy_notify_services()
        services += [
            s for s in options.get(CONF_NOTIFY_SERVICES, []) if s not in services
        ]
        schema = vol.Schema(
            {
                vol.Optional(CONF_NOTIFY_ENTITIES): EntitySelector(
                    EntitySelectorConfig(domain="notify", multiple=True)
                ),
                vol.Optional(CONF_NOTIFY_SERVICES): SelectSelector(
                    SelectSelectorConfig(
                        options=services,
                        multiple=True,
                        custom_value=True,
                        mode=SelectSelectorMode.DROPDOWN,
                    )
                ),
            }
        )
        return self.async_show_form(
            step_id="notifications",
            data_schema=self.add_suggested_values_to_schema(
                schema,
                {
                    CONF_NOTIFY_ENTITIES: options.get(CONF_NOTIFY_ENTITIES, []),
                    CONF_NOTIFY_SERVICES: options.get(CONF_NOTIFY_SERVICES, []),
                },
            ),
        )

    async def async_step_statistics(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Réglages des statistiques."""
        if user_input is not None:
            return self.async_create_entry(
                data={
                    **self.config_entry.options,
                    CONF_MOVING_AVERAGE: int(user_input[CONF_MOVING_AVERAGE]),
                }
            )
        schema = vol.Schema(
            {
                vol.Required(CONF_MOVING_AVERAGE): NumberSelector(
                    NumberSelectorConfig(
                        min=2, max=20, step=1, mode=NumberSelectorMode.BOX
                    )
                )
            }
        )
        return self.async_show_form(
            step_id="statistics",
            data_schema=self.add_suggested_values_to_schema(
                schema,
                {
                    CONF_MOVING_AVERAGE: self.config_entry.options.get(
                        CONF_MOVING_AVERAGE, DEFAULT_MOVING_AVERAGE
                    )
                },
            ),
        )

    async def async_step_backup(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Créer une sauvegarde complète."""
        from .backup_archive import async_create_backup  # noqa: PLC0415

        path = await async_create_backup(self.hass, self._entry)
        return self.async_abort(
            reason="backup_created",
            description_placeholders={"path": str(path)},
        )

    async def async_step_restore(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Choisir une sauvegarde existante ou envoyer une archive."""
        from .backup_archive import (  # noqa: PLC0415
            async_read_backup,
            backup_dir,
            list_backups,
        )

        errors: dict[str, str] = {}
        if user_input is not None:
            path: Path | None = None
            if user_input.get("upload"):
                path = await self._async_store_upload(user_input["upload"])
            elif user_input.get("backup"):
                path = backup_dir(self.hass) / Path(user_input["backup"]).name
            if path is None:
                errors["base"] = "no_backup_selected"
            else:
                try:
                    self._restore = await async_read_backup(self.hass, path)
                except (InvalidBackupError, OSError) as err:
                    errors["base"] = (
                        f"backup_{err}"
                        if isinstance(err, InvalidBackupError)
                        else "backup_corrupted"
                    )
                else:
                    return await self.async_step_restore_confirm()

        backups = await self.hass.async_add_executor_job(list_backups, self.hass)
        schema = vol.Schema(
            {
                vol.Optional("backup"): SelectSelector(
                    SelectSelectorConfig(
                        options=backups, mode=SelectSelectorMode.DROPDOWN
                    )
                ),
                vol.Optional("upload"): FileSelector(
                    FileSelectorConfig(accept=".zip,application/zip")
                ),
            }
        )
        return self.async_show_form(
            step_id="restore", data_schema=schema, errors=errors
        )

    async def _async_store_upload(self, file_id: str) -> Path:
        """Copier l'archive envoyée dans le dossier des sauvegardes."""
        from homeassistant.components.file_upload import (  # noqa: PLC0415
            process_uploaded_file,
        )

        from .backup_archive import BACKUP_PREFIX, backup_dir  # noqa: PLC0415

        stamp = dt.datetime.now().strftime("%Y%m%d-%H%M%S")  # noqa: DTZ005
        target = backup_dir(self.hass) / f"{BACKUP_PREFIX}{stamp}-import.zip"

        def _copy() -> None:
            target.parent.mkdir(parents=True, exist_ok=True)
            with process_uploaded_file(self.hass, file_id) as uploaded:
                shutil.copyfile(uploaded, target)

        await self.hass.async_add_executor_job(_copy)
        return target

    async def async_step_restore_confirm(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Aperçu de la sauvegarde, puis restauration après confirmation."""
        from .backup_archive import async_restore_backup  # noqa: PLC0415

        assert self._restore is not None
        content, files = self._restore
        if user_input is not None:
            await async_restore_backup(self.hass, self._entry, content, files)
            return self.async_abort(reason="restore_done")
        return self.async_show_form(
            step_id="restore_confirm",
            data_schema=vol.Schema({}),
            description_placeholders=_backup_placeholders(content),
        )

    async def async_step_add_category(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Créer une catégorie personnalisée."""
        errors: dict[str, str] = {}
        if user_input is not None:
            name = user_input["name"].strip()
            if name.casefold() in {
                n.casefold() for n in (await self._labels()).values()
            }:
                errors["name"] = "category_exists"
            else:
                try:
                    self._entry.runtime_data.storage.data.add_category(
                        Category(
                            name=name,
                            color=_rgb_to_hex(user_input.get("color")),
                            icon=user_input.get("icon"),
                        )
                    )
                except CategoryError:
                    errors["name"] = "name_required"
                else:
                    return self._done()
        schema = vol.Schema(
            {
                vol.Required("name"): TextSelector(),
                vol.Optional("color"): ColorRGBSelector(),
                vol.Optional("icon"): IconSelector(),
            }
        )
        return self.async_show_form(
            step_id="add_category",
            data_schema=self.add_suggested_values_to_schema(schema, user_input or {}),
            errors=errors,
        )

    async def _category_selector(self, exclude: set[str]) -> SelectSelector:
        labels = await self._labels()
        options = [
            SelectOptionDict(value=cid, label=label)
            for cid, label in sorted(labels.items(), key=lambda kv: kv[1].casefold())
            if cid not in exclude
        ]
        return SelectSelector(
            SelectSelectorConfig(options=options, mode=SelectSelectorMode.DROPDOWN)
        )

    async def async_step_edit_category(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Choisir la catégorie à modifier."""
        if user_input is not None:
            self._category_id = user_input[CONF_CATEGORY]
            return await self.async_step_edit_category_details()
        return self.async_show_form(
            step_id="edit_category",
            data_schema=vol.Schema(
                {vol.Required(CONF_CATEGORY): await self._category_selector(set())}
            ),
        )

    async def async_step_edit_category_details(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Renommer, changer la couleur ou l'icône."""
        assert self._category_id is not None
        data = self._entry.runtime_data.storage.data
        category = data.categories[self._category_id]
        errors: dict[str, str] = {}
        if user_input is not None:
            name = (user_input.get("name") or "").strip()
            others = {
                label.casefold()
                for cid, label in (await self._labels()).items()
                if cid != category.id
            }
            if name.casefold() in others:
                errors["name"] = "category_exists"
            else:
                try:
                    data.update_category(
                        category.id,
                        name=name,
                        color=_rgb_to_hex(user_input.get("color")),
                        icon=user_input.get("icon"),
                    )
                except CategoryError:
                    errors["name"] = "name_required"
                else:
                    return self._done()

        label = (await self._labels())[category.id]
        schema = vol.Schema(
            {
                vol.Optional("name"): TextSelector(),
                vol.Optional("color"): ColorRGBSelector(),
                vol.Optional("icon"): IconSelector(),
            }
        )
        suggested: dict[str, Any] = {"name": category.name or ""}
        if (rgb := _hex_to_rgb(category.color)) is not None:
            suggested["color"] = rgb
        if category.icon:
            suggested["icon"] = category.icon
        return self.async_show_form(
            step_id="edit_category_details",
            data_schema=self.add_suggested_values_to_schema(
                schema, user_input or suggested
            ),
            errors=errors,
            description_placeholders={"category": label},
        )

    async def async_step_delete_category(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Choisir la catégorie à supprimer (« autre » est exclue)."""
        if user_input is not None:
            self._category_id = user_input[CONF_CATEGORY]
            return await self.async_step_confirm_delete()
        return self.async_show_form(
            step_id="delete_category",
            data_schema=vol.Schema(
                {
                    vol.Required(CONF_CATEGORY): await self._category_selector(
                        {CATEGORY_OTHER}
                    )
                }
            ),
        )

    async def async_step_confirm_delete(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Confirmer la suppression et la réassignation des dépenses."""
        assert self._category_id is not None
        data = self._entry.runtime_data.storage.data
        if user_input is not None:
            data.delete_category(self._category_id)
            return self._done()
        labels = await self._labels()
        return self.async_show_form(
            step_id="confirm_delete",
            data_schema=vol.Schema({}),
            description_placeholders={
                "category": labels[self._category_id],
                "count": str(data.category_usage(self._category_id)),
                "other": labels[CATEGORY_OTHER],
            },
        )


def _backup_placeholders(content: BackupContent) -> dict[str, str]:
    """Résumé lisible d'une sauvegarde pour l'écran de confirmation."""
    summary = summarize(content)
    lines = [
        f"- {v['name']} : {v['fuel']} plein(s), {v['expenses']} dépense(s), "
        f"{v['odometer']} relevé(s), {v['reminders']} rappel(s), "
        f"{v['attachments']} pièce(s) jointe(s)"
        for v in summary["vehicles"]
    ]
    return {
        "created_at": summary["created_at"].replace("T", " ")[:16],
        "version": summary["integration_version"],
        "vehicles": "\n".join(lines) or "-",
        "categories": str(summary["categories"]),
    }
