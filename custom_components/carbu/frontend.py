"""Service des cartes Lovelace (bundle JS fourni avec l'intégration).

Le fichier est chargé automatiquement par le frontend : aucune ressource
Lovelace à déclarer à la main. Le numéro de version dans l'URL invalide le
cache du navigateur à chaque mise à jour.
"""

from __future__ import annotations

from pathlib import Path

from homeassistant.components.http.server import StaticPathConfig
from homeassistant.core import HomeAssistant
from homeassistant.loader import async_get_integration

from .const import DOMAIN

CARDS_URL = f"/{DOMAIN}/carbu-cards.js"
CARDS_FILE = Path(__file__).parent / "www" / "carbu-cards.js"


async def async_register_frontend(hass: HomeAssistant) -> None:
    """Servir le bundle et l'ajouter aux modules chargés par le frontend."""
    await hass.http.async_register_static_paths(
        [StaticPathConfig(CARDS_URL, str(CARDS_FILE), cache_headers=False)]
    )
    if "frontend" not in hass.config.components:
        return  # environnement sans interface (tests)
    from homeassistant.components.frontend import add_extra_js_url  # noqa: PLC0415

    integration = await async_get_integration(hass, DOMAIN)
    add_extra_js_url(hass, f"{CARDS_URL}?v={integration.version}")
