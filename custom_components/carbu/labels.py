"""Libellés traduits de l'intégration, lus côté serveur.

Partagé par le config flow, l'API websocket, les services et l'import CSV :
les catégories par défaut n'ont pas de nom enregistré, leur libellé vient des
traductions (``selector.category.options``).
"""

from __future__ import annotations

from homeassistant.core import HomeAssistant
from homeassistant.helpers.translation import async_get_translations

from .const import DOMAIN


async def async_category_labels(hass: HomeAssistant) -> dict[str, str]:
    """Libellés traduits des catégories par défaut, dans la langue du serveur."""
    translations = await async_get_translations(
        hass, hass.config.language, "selector", [DOMAIN]
    )
    prefix = f"component.{DOMAIN}.selector.category.options."
    return {
        key.removeprefix(prefix): value
        for key, value in translations.items()
        if key.startswith(prefix)
    }
