"""Éléments partagés par les étapes du config flow."""

from __future__ import annotations

from typing import TYPE_CHECKING

from homeassistant.config_entries import ConfigFlowResult, OptionsFlow
from homeassistant.helpers.selector import (
    NumberSelector,
    NumberSelectorConfig,
    NumberSelectorMode,
    SelectSelector,
    SelectSelectorConfig,
    SelectSelectorMode,
)

if TYPE_CHECKING:
    from .. import VehicleLogConfigEntry

# Clés de formulaire hors modèle
CONF_CATEGORY = "category"


def select(options: list[str], translation_key: str) -> SelectSelector:
    """Liste déroulante dont les libellés viennent des traductions."""
    return SelectSelector(
        SelectSelectorConfig(
            options=options,
            translation_key=translation_key,
            mode=SelectSelectorMode.DROPDOWN,
        )
    )


def number(unit: str | None = None, step: float = 0.1) -> NumberSelector:
    """Champ numérique positif, saisi au clavier."""
    config = NumberSelectorConfig(min=0, step=step, mode=NumberSelectorMode.BOX)
    if unit is not None:
        config["unit_of_measurement"] = unit
    return NumberSelector(config)


class OptionsFlowBase(OptionsFlow):
    """Accès typé à l'entrée et validation sans changement d'options."""

    @property
    def _entry(self) -> VehicleLogConfigEntry:
        return self.config_entry

    def _done(self) -> ConfigFlowResult:
        """Terminer après une modification des données (pas des options)."""
        self._entry.runtime_data.storage.async_schedule_save()
        return self.async_create_entry(data=dict(self.config_entry.options))
