"""Page globale : destinataires des notifications et réglages des statistiques."""

from __future__ import annotations

from typing import Any

from homeassistant.config_entries import ConfigFlowResult
from homeassistant.helpers.selector import (
    EntitySelector,
    EntitySelectorConfig,
    NumberSelector,
    NumberSelectorConfig,
    NumberSelectorMode,
    SelectSelector,
    SelectSelectorConfig,
    SelectSelectorMode,
)
import probatio as vol

from ..const import (
    CONF_MOVING_AVERAGE,
    CONF_NOTIFY_ENTITIES,
    CONF_NOTIFY_SERVICES,
    DEFAULT_MOVING_AVERAGE,
)
from .common import OptionsFlowBase


class SettingsFlow(OptionsFlowBase):
    """Étapes ``notifications`` et ``statistics`` (options de l'entrée)."""

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
