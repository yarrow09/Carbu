"""Page globale : sauvegarde complète et restauration."""

from __future__ import annotations

from pathlib import Path
import shutil
from typing import Any

from homeassistant.components.file_upload import process_uploaded_file
from homeassistant.config_entries import ConfigFlowResult
from homeassistant.helpers.selector import (
    FileSelector,
    FileSelectorConfig,
    SelectSelector,
    SelectSelectorConfig,
    SelectSelectorMode,
)
import probatio as vol

from ..backup_archive import (
    BACKUP_PREFIX,
    async_create_backup,
    async_read_backup,
    async_restore_backup,
    backup_dir,
    list_backups,
)
from ..coordinator import local_now
from ..core.backup import BackupContent, InvalidBackupError, summarize
from .common import OptionsFlowBase


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


class BackupFlow(OptionsFlowBase):
    """Étapes ``backup``, ``restore`` et ``restore_confirm``."""

    _restore: tuple[BackupContent, dict[str, bytes]] | None = None

    async def async_step_backup(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Créer une sauvegarde complète."""
        path = await async_create_backup(self.hass, self._entry)
        return self.async_abort(
            reason="backup_created",
            description_placeholders={"path": str(path)},
        )

    async def async_step_restore(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Choisir une sauvegarde existante ou envoyer une archive."""
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
        stamp = local_now().strftime("%Y%m%d-%H%M%S")
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
