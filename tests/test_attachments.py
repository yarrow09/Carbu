"""Pièces jointes : envoi, téléchargement, suppression, nettoyage."""

import datetime as dt
from pathlib import Path
from typing import Any

from aiohttp import FormData
from homeassistant.core import HomeAssistant
import pytest
from pytest_homeassistant_custom_component.typing import (
    ClientSessionGenerator,
    WebSocketGenerator,
)

from custom_components.carbu.attachments import MAX_SIZE, detect_type
from custom_components.carbu.core.models import Expense
from custom_components.carbu.core.repository import LogData

from .common import CLIO, setup_integration, store_data

PNG = b"\x89PNG\r\n\x1a\n" + b"\x00" * 64
PDF = b"%PDF-1.7\n" + b"x" * 64
URL = "/api/carbu/attachment/v1/e1"


@pytest.fixture(autouse=True)
def _custom_integrations(enable_custom_integrations: None) -> None:
    """Autoriser le chargement de l'intégration personnalisée."""


@pytest.fixture
async def entry(hass: HomeAssistant, hass_storage: dict[str, Any]) -> Any:
    data = LogData()
    data.add_expense(
        "v1",
        Expense(id="e1", date=dt.date(2026, 1, 1), amount=50, category_id="repair"),
    )
    store_data(hass_storage, data)
    return await setup_integration(hass, {"v1": CLIO})


def _form(content: bytes, name: str = "ticket.png") -> FormData:
    form = FormData()
    form.add_field("file", content, filename=name, content_type="image/png")
    return form


def _file(hass: HomeAssistant, name: str) -> Path:
    return Path(hass.config.path("carbu", "attachments", "v1", name))


def test_detect_type() -> None:
    assert detect_type(PNG) == "image/png"
    assert detect_type(PDF) == "application/pdf"
    assert detect_type(b"\xff\xd8\xff\xe0rest") == "image/jpeg"
    assert detect_type(b"RIFF\x00\x00\x00\x00WEBPVP8 ") == "image/webp"
    assert detect_type(b"RIFF\x00\x00\x00\x00AVI ") is None
    assert detect_type(b"<html>") is None


async def test_upload_download_replace_delete(
    hass: HomeAssistant, entry: Any, hass_client: ClientSessionGenerator
) -> None:
    client = await hass_client()
    response = await client.post(URL, data=_form(PNG))
    assert response.status == 200
    assert await response.json() == {"attachment": "e1.png"}
    expense = entry.runtime_data.storage.data.records("v1").expenses.get("e1")
    assert expense.attachment == "e1.png"
    assert await hass.async_add_executor_job(_file(hass, "e1.png").read_bytes) == PNG

    response = await client.get(URL)
    assert response.status == 200
    assert response.headers["Content-Type"] == "image/png"
    assert await response.read() == PNG

    # Remplacement par un PDF : l'ancien fichier disparaît.
    response = await client.post(URL, data=_form(PDF, "facture.pdf"))
    assert (await response.json())["attachment"] == "e1.pdf"
    assert not await hass.async_add_executor_job(_file(hass, "e1.png").exists)

    response = await client.delete(URL)
    assert response.status == 200
    assert expense.attachment is None
    assert not await hass.async_add_executor_job(_file(hass, "e1.pdf").exists)
    assert (await client.get(URL)).status == 404


@pytest.mark.usefixtures("entry")
async def test_upload_rejections(hass_client: ClientSessionGenerator) -> None:
    client = await hass_client()
    response = await client.post(URL, data=_form(b"<script>alert(1)</script>"))
    assert response.status == 400
    assert (await response.json())["code"] == "invalid_type"

    response = await client.post(URL, data=_form(PNG + b"\x00" * MAX_SIZE))
    assert response.status == 413

    response = await client.post("/api/carbu/attachment/v1/unknown", data=_form(PNG))
    assert response.status == 404
    response = await client.post(
        "/api/carbu/attachment/..%2F..%2Fetc/e1", data=_form(PNG)
    )
    assert response.status in (400, 404)  # filtre de sécurité HA ou identifiant

    form = FormData()
    form.add_field("other", "x")
    response = await client.post(URL, data=form)
    assert (await response.json())["code"] == "missing_file"


async def test_requires_authentication(
    entry: Any, hass_client_no_auth: ClientSessionGenerator
) -> None:
    client = await hass_client_no_auth()
    assert (await client.get(URL)).status == 401
    assert (await client.post(URL, data=_form(PNG))).status == 401


async def test_deleting_expense_removes_file(
    hass: HomeAssistant,
    entry: Any,
    hass_client: ClientSessionGenerator,
    hass_ws_client: WebSocketGenerator,
) -> None:
    client = await hass_client()
    await client.post(URL, data=_form(PNG))
    ws = await hass_ws_client(hass)
    await ws.send_json_auto_id(
        {"type": "carbu/expense/delete", "vehicle_id": "v1", "expense_id": "e1"}
    )
    assert (await ws.receive_json())["success"]
    await hass.async_block_till_done()
    assert not await hass.async_add_executor_job(_file(hass, "e1.png").exists)


async def test_removing_vehicle_removes_its_files(
    hass: HomeAssistant, entry: Any, hass_client: ClientSessionGenerator
) -> None:
    client = await hass_client()
    await client.post(URL, data=_form(PNG))
    assert hass.config_entries.async_remove_subentry(entry, "v1")
    await hass.async_block_till_done()
    folder = _file(hass, "e1.png").parent
    assert not await hass.async_add_executor_job(folder.exists)
