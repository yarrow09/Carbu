"""Configuration graphique de Carbu.

* ``VehicleLogConfigFlow`` : crée l'entrée unique « Carbu » ;
* ``VehicleSubentryFlow`` (``flows/vehicle.py``) : assistant d'ajout et de
  modification d'un véhicule, un subentry par véhicule ;
* ``VehicleLogOptionsFlow`` : page globale, assemblée à partir des étapes
  par domaine de ``flows/`` (catégories, réglages, sauvegardes).
"""

from __future__ import annotations

from typing import Any

from homeassistant.config_entries import (
    ConfigEntry,
    ConfigEntryState,
    ConfigFlow,
    ConfigFlowResult,
    ConfigSubentryFlow,
    OptionsFlow,
)
from homeassistant.core import callback
import probatio as vol

from .const import DOMAIN, SUBENTRY_TYPE_VEHICLE
from .flows.backup import BackupFlow
from .flows.categories import CategoriesFlow
from .flows.settings import SettingsFlow
from .flows.vehicle import VehicleSubentryFlow

DEFAULT_TITLE = "Carbu"

__all__ = ["VehicleLogConfigFlow", "VehicleLogOptionsFlow", "VehicleSubentryFlow"]


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


class VehicleLogOptionsFlow(CategoriesFlow, SettingsFlow, BackupFlow):
    """Page globale : menu vers les étapes de chaque domaine."""

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
