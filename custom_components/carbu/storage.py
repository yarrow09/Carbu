"""Persistance des données dans ``.storage`` via ``Store``."""

from __future__ import annotations

from typing import Any

from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.storage import Store

from .const import (
    STORAGE_KEY,
    STORAGE_MINOR_VERSION,
    STORAGE_SAVE_DELAY,
    STORAGE_VERSION,
)
from .core.migrations import migrate
from .core.repository import LogData


class _VehicleLogStore(Store[dict[str, Any]]):
    """``Store`` avec migrations de schéma."""

    async def _async_migrate_func(
        self,
        old_major_version: int,
        old_minor_version: int,
        old_data: dict[str, Any],
    ) -> dict[str, Any]:
        return migrate(old_major_version, old_minor_version, old_data)


class VehicleLogStorage:
    """Données en mémoire + écriture différée sur disque."""

    def __init__(self, hass: HomeAssistant) -> None:
        """Initialiser."""
        self._store = _VehicleLogStore(
            hass,
            STORAGE_VERSION,
            STORAGE_KEY,
            minor_version=STORAGE_MINOR_VERSION,
            atomic_writes=True,
        )
        self.data = LogData()

    async def async_load(self) -> None:
        """Charger les données (ou initialiser un jeu vide)."""
        raw = await self._store.async_load()
        self.data = LogData.from_dict(raw) if raw else LogData()

    @callback
    def async_schedule_save(self) -> None:
        """Programmer une écriture différée (regroupe les modifications)."""
        self._store.async_delay_save(self.data.to_dict, STORAGE_SAVE_DELAY)

    async def async_save(self) -> None:
        """Écrire immédiatement."""
        await self._store.async_save(self.data.to_dict())

    async def async_remove(self) -> None:
        """Supprimer le fichier (désinstallation de l'intégration)."""
        await self._store.async_remove()
