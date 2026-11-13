"""Service des cartes Lovelace (bundle JS fourni avec l'intégration).

Le fichier est chargé automatiquement par le frontend : aucune ressource
Lovelace à déclarer à la main. L'empreinte du fichier dans l'URL invalide le
cache du navigateur dès que le bundle change.
"""

from __future__ import annotations

import hashlib
from pathlib import Path

from homeassistant.components.http.server import StaticPathConfig
from homeassistant.core import HomeAssistant, callback

from .const import DOMAIN

CARDS_URL = f"/{DOMAIN}/carbu-cards.js"
CARDS_FILE = Path(__file__).parent / "www" / "carbu-cards.js"
PANEL_URL_PATH = DOMAIN
PANEL_ELEMENT = "carbu-panel"


def _file_digest() -> str:
    return hashlib.sha256(CARDS_FILE.read_bytes()).hexdigest()[:12]


async def _async_module_url(hass: HomeAssistant) -> str:
    """URL du bundle avec l'empreinte de son contenu."""
    digest = await hass.async_add_executor_job(_file_digest)
    return f"{CARDS_URL}?v={digest}"


async def async_register_frontend(hass: HomeAssistant) -> None:
    """Servir le bundle et l'ajouter aux modules chargés par le frontend."""
    await hass.http.async_register_static_paths(
        [StaticPathConfig(CARDS_URL, str(CARDS_FILE), cache_headers=False)]
    )
    if "frontend" not in hass.config.components:
        return  # environnement sans interface (tests)
    from homeassistant.components.frontend import add_extra_js_url  # noqa: PLC0415

    add_extra_js_url(hass, await _async_module_url(hass))


async def async_register_panel(hass: HomeAssistant) -> None:
    """Ajouter la page « Carbu » à la barre latérale.

    Le tableau de bord « Vue d'ensemble » de Home Assistant ne permet plus
    d'ajouter des cartes : la page dédiée donne un accès direct à la saisie.
    """
    if "frontend" not in hass.config.components:
        return
    from homeassistant.components import panel_custom  # noqa: PLC0415

    await panel_custom.async_register_panel(
        hass,
        frontend_url_path=PANEL_URL_PATH,
        webcomponent_name=PANEL_ELEMENT,
        sidebar_title="Carbu",
        sidebar_icon="mdi:gas-station",
        module_url=await _async_module_url(hass),
        require_admin=False,
    )


@callback
def async_remove_panel(hass: HomeAssistant) -> None:
    """Retirer la page de la barre latérale."""
    if "frontend" not in hass.config.components:
        return
    from homeassistant.components.frontend import (  # noqa: PLC0415
        async_remove_panel as remove,
    )

    remove(hass, PANEL_URL_PATH, warn_if_unknown=False)
