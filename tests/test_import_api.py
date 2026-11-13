"""API d'import CSV (aperçu puis application) et service de sauvegarde."""

from pathlib import Path
from typing import Any

from aiohttp import FormData
from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er
import pytest
from pytest_homeassistant_custom_component.typing import ClientSessionGenerator

from custom_components.vehicle_log.const import DOMAIN
from custom_components.vehicle_log.core.export import build_export
from custom_components.vehicle_log.core.repository import LogData

from .common import CLIO, REFERENCE, setup_integration, store_data
from .core import reference_dataset as ref

URL = "/api/vehicle_log/import/{}"


@pytest.fixture(autouse=True)
def _custom_integrations(enable_custom_integrations: None) -> None:
    """Autoriser le chargement de l'intégration personnalisée."""


@pytest.fixture
def source() -> LogData:
    data = LogData()
    for fill in ref.FUEL:
        data.records("ref").fuel.add(fill)
    for expense in ref.EXPENSES:
        data.add_expense("ref", expense)
    return data


@pytest.fixture
async def entry(
    hass: HomeAssistant, hass_storage: dict[str, Any], source: LogData
) -> Any:
    store_data(hass_storage, source)
    return await setup_integration(hass, {"ref": REFERENCE, "clio": CLIO})


def _form(content: bytes) -> FormData:
    form = FormData()
    form.add_field("file", content, filename="f.csv", content_type="text/csv")
    return form


async def test_preview_then_apply(
    hass: HomeAssistant,
    entry: Any,
    source: LogData,
    hass_client: ClientSessionGenerator,
) -> None:
    """Critère d'acceptation : import CSV avec aperçu avant écriture."""
    files = build_export(source, {"ref": ref.VEHICLE})
    content = files["pleins.csv"].encode("utf-8-sig")
    client = await hass_client()

    response = await client.post(URL.format("clio"), data=_form(content))
    assert response.status == 200
    preview = await response.json()
    assert preview["kind"] == "fuel"
    assert preview["counts"] == {"new": 6, "duplicate": 0, "error": 0}
    assert preview["lines"][0]["values"]["odometer"] == 10000
    # Rien n'est écrit pendant l'aperçu.
    assert len(entry.runtime_data.storage.data.records("clio").fuel) == 0

    response = await client.post(URL.format("clio") + "?apply=1", data=_form(content))
    assert (await response.json()) == {
        "added": 6,
        "counts": {"new": 6, "duplicate": 0, "error": 0},
    }
    assert len(entry.runtime_data.storage.data.records("clio").fuel) == 6
    entity_id = er.async_get(hass).async_get_entity_id(
        "sensor", DOMAIN, "clio_consumption"
    )
    state = hass.states.get(entity_id or "")
    assert state is not None
    assert float(state.state) == pytest.approx(ref.EXPECTED_AVERAGE_L100)

    # Un second import du même fichier ne crée que des doublons.
    response = await client.post(URL.format("clio") + "?apply=1", data=_form(content))
    assert (await response.json())["added"] == 0


async def test_preview_lists_errors_first(
    entry: Any, hass_client: ClientSessionGenerator
) -> None:
    content = (
        "date;amount;category_name\n2026-04-01;10;Lavage\nmauvaise date;5;Péage\n"
    ).encode()
    client = await hass_client()
    preview = await (await client.post(URL.format("ref"), data=_form(content))).json()
    assert preview["kind"] == "expenses"
    assert preview["new_categories"] == ["Lavage"]
    assert [line["status"] for line in preview["lines"]] == ["error", "new"]
    assert preview["lines"][0]["line"] == 3


async def test_import_errors(
    entry: Any,
    hass_client: ClientSessionGenerator,
    hass_client_no_auth: ClientSessionGenerator,
) -> None:
    client = await hass_client()
    response = await client.post(URL.format("ref"), data=_form(b"foo;bar\n1;2\n"))
    assert (response.status, (await response.json())["code"]) == (400, "unknown_format")
    response = await client.post(URL.format("nope"), data=_form(b"date\n"))
    assert response.status == 404
    response = await client.post(URL.format("ref"), data=b"x")
    assert (await response.json())["code"] == "missing_file"
    response = await client.post(
        URL.format("ref"), data=_form(b"date;amount\n" + b"x" * (6 * 1024 * 1024))
    )
    assert response.status == 413

    anonymous = await hass_client_no_auth()
    assert (await anonymous.post(URL.format("ref"), data=_form(b"x"))).status == 401


async def test_backup_service(hass: HomeAssistant, entry: Any) -> None:
    response = await hass.services.async_call(
        DOMAIN, "backup", {}, blocking=True, return_response=True
    )
    assert response is not None
    path = Path(str(response["path"]))
    assert path.name.startswith("vehicle_log_backup_")
    assert await hass.async_add_executor_job(path.is_file)
