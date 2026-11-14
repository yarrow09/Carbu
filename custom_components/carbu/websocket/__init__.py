"""API websocket interne utilisée par les cartes Lovelace.

Ces commandes ne sont pas une API publique (les services ``carbu.*`` le
sont). Toutes les valeurs échangées sont dans les unités du véhicule. Chaque
module couvre un domaine et expose son tuple ``COMMANDS`` ; ce module est le
point d'enregistrement unique.
"""

from __future__ import annotations

from homeassistant.components.websocket_api import async_register_command
from homeassistant.core import HomeAssistant, callback

from . import expenses, export, fuel, recurring, reminders, stats, vehicles

_MODULES = (vehicles, fuel, expenses, reminders, recurring, stats, export)


@callback
def async_register_websocket_commands(hass: HomeAssistant) -> None:
    """Enregistrer toutes les commandes ``carbu/*``."""
    for module in _MODULES:
        for handler in module.COMMANDS:
            async_register_command(hass, handler)
