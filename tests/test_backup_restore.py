"""Sauvegarde complète puis restauration sans perte (page globale)."""

import datetime as dt
import io
from pathlib import Path
from typing import Any
import zipfile

from aiohttp import FormData
from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResultType
from homeassistant.helpers import entity_registry as er
import pytest
from pytest_homeassistant_custom_component.typing import ClientSessionGenerator

from custom_components.carbu.const import DOMAIN
from custom_components.carbu.core.models import Category, Expense
from custom_components.carbu.core.repository import LogData

from .common import CLIO, REFERENCE, setup_integration, store_data
from .core import reference_dataset as ref

PNG = b"\x89PNG\r\n\x1a\n" + b"\x00" * 32


@pytest.fixture(autouse=True)
def _custom_integrations(enable_custom_integrations: None) -> None:
    """Autoriser le chargement de l'intégration personnalisée."""


@pytest.fixture
async def entry(
    hass: HomeAssistant,
    hass_storage: dict[str, Any],
    hass_client: ClientSessionGenerator,
) -> Any:
    data = LogData()
    for fill in ref.FUEL:
        data.records("ref").fuel.add(fill)
    for expense in ref.EXPENSES:
        data.add_expense("ref", expense)
    data.add_category(Category(id="wash", name="Lavage", color="#00aaff"))
    store_data(hass_storage, data)
    entry = await setup_integration(hass, {"ref": REFERENCE, "clio": CLIO})
    hass.config_entries.async_update_entry(entry, options={"moving_average_window": 7})
    await hass.async_block_till_done()
    # Une pièce jointe sur la dépense e1.
    form = FormData()
    form.add_field("file", PNG, filename="t.png", content_type="image/png")
    client = await hass_client()
    assert (await client.post("/api/carbu/attachment/ref/e1", data=form)).status == 200
    return entry


async def _menu(hass: HomeAssistant, entry: Any, step: str) -> Any:
    result = await hass.config_entries.options.async_init(entry.entry_id)
    return await hass.config_entries.options.async_configure(
        result["flow_id"], {"next_step_id": step}
    )


def _snapshot(entry: Any) -> dict[str, Any]:
    return {
        "data": entry.runtime_data.storage.data.to_dict(),
        "subentries": {
            sid: (sub.title, dict(sub.data)) for sid, sub in entry.subentries.items()
        },
        "options": dict(entry.options),
    }


async def test_backup_then_restore_is_lossless(hass: HomeAssistant, entry: Any) -> None:
    """Critère d'acceptation : export puis réimport complet sans perte."""
    before = _snapshot(entry)

    result = await _menu(hass, entry, "backup")
    assert result["type"] is FlowResultType.ABORT
    assert result["reason"] == "backup_created"
    path = Path(result["description_placeholders"]["path"])
    names = await hass.async_add_executor_job(lambda: zipfile.ZipFile(path).namelist())
    assert names == ["backup.json", "attachments/ref/e1.png"]

    # Modifications après la sauvegarde.
    coordinator = entry.runtime_data.coordinator
    coordinator.async_delete_fuel("ref", "f3")
    coordinator.async_add_expense(
        "clio", Expense(date=dt.date(2026, 3, 1), amount=9, category_id="parking")
    )
    coordinator.async_delete_expense("ref", "e1")  # supprime aussi la pièce jointe
    hass.config_entries.async_update_entry(entry, options={"moving_average_window": 3})
    await hass.async_block_till_done()
    assert hass.config_entries.async_remove_subentry(entry, "clio")
    await hass.async_block_till_done()
    assert _snapshot(entry) != before

    # Restauration.
    result = await _menu(hass, entry, "restore")
    assert result["step_id"] == "restore"
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"backup": path.name}
    )
    assert result["step_id"] == "restore_confirm"
    placeholders = result["description_placeholders"]
    assert "Référence : 6 plein(s), 5 dépense(s)" in placeholders["vehicles"]
    assert "1 pièce(s) jointe(s)" in placeholders["vehicles"]
    result = await hass.config_entries.options.async_configure(result["flow_id"], {})
    assert result["type"] is FlowResultType.ABORT
    assert result["reason"] == "restore_done"
    await hass.async_block_till_done()

    assert _snapshot(entry) == before
    attachment = Path(hass.config.path("carbu", "attachments", "ref", "e1.png"))
    assert await hass.async_add_executor_job(attachment.read_bytes) == PNG
    # Les entités du véhicule restauré existent de nouveau.
    registry = er.async_get(hass)
    assert registry.async_get_entity_id("sensor", DOMAIN, "clio_odometer")
    state = hass.states.get(
        registry.async_get_entity_id("sensor", DOMAIN, "ref_odometer") or ""
    )
    assert state is not None
    assert float(state.state) == 12300


async def test_restore_from_uploaded_archive(
    hass: HomeAssistant, entry: Any, hass_client: ClientSessionGenerator
) -> None:
    result = await _menu(hass, entry, "backup")
    path = Path(result["description_placeholders"]["path"])
    content = await hass.async_add_executor_job(path.read_bytes)
    await hass.async_add_executor_job(path.unlink)

    client = await hass_client()
    form = FormData()
    form.add_field(
        "file", content, filename="sauvegarde.zip", content_type="application/zip"
    )
    response = await client.post("/api/file_upload", data=form)
    assert response.status == 200
    file_id = (await response.json())["file_id"]

    result = await _menu(hass, entry, "restore")
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"upload": file_id}
    )
    assert result["step_id"] == "restore_confirm"


async def test_restore_rejects_invalid_files(
    hass: HomeAssistant, entry: Any, hass_client: ClientSessionGenerator
) -> None:
    client = await hass_client()

    async def _upload(content: bytes) -> str:
        form = FormData()
        form.add_field(
            "file", content, filename="x.zip", content_type="application/zip"
        )
        response = await client.post("/api/file_upload", data=form)
        return str((await response.json())["file_id"])

    buffer = io.BytesIO()
    with zipfile.ZipFile(buffer, "w") as archive:
        archive.writestr("autre.txt", "bonjour")
    cases = [
        (b"pas un zip", "backup_corrupted"),
        (buffer.getvalue(), "backup_not_a_backup"),
    ]
    for content, error in cases:
        result = await _menu(hass, entry, "restore")
        result = await hass.config_entries.options.async_configure(
            result["flow_id"], {"upload": await _upload(content)}
        )
        assert result["errors"] == {"base": error}

    result = await _menu(hass, entry, "restore")
    result = await hass.config_entries.options.async_configure(result["flow_id"], {})
    assert result["errors"] == {"base": "no_backup_selected"}
