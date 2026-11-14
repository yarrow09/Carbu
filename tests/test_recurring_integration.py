"""Dépenses récurrentes, export CSV et courbes via l'API des cartes."""

from collections.abc import Awaitable, Callable
from typing import Any

from freezegun.api import FrozenDateTimeFactory
from homeassistant.core import HomeAssistant
import pytest
from pytest_homeassistant_custom_component.common import async_fire_time_changed
from pytest_homeassistant_custom_component.typing import WebSocketGenerator

from custom_components.carbu.const import DOMAIN
from custom_components.carbu.core.repository import LogData

from .common import REFERENCE, setup_integration, store_data
from .core import reference_dataset as ref

pytestmark = pytest.mark.freeze_time("2026-03-25 20:00:00+00:00")

type Call = Callable[..., Awaitable[dict[str, Any]]]


@pytest.fixture(autouse=True)
def _custom_integrations(enable_custom_integrations: None) -> None:
    """Autoriser le chargement de l'intégration personnalisée."""


@pytest.fixture
async def call(
    hass: HomeAssistant,
    hass_storage: dict[str, Any],
    hass_ws_client: WebSocketGenerator,
) -> Call:
    data = LogData()
    for entry in ref.FUEL:
        data.records("ref").fuel.add(entry)
    store_data(hass_storage, data)
    await setup_integration(hass, {"ref": REFERENCE})
    client = await hass_ws_client(hass)

    async def _call(command: str, **payload: Any) -> dict[str, Any]:
        await client.send_json_auto_id({"type": f"{DOMAIN}/{command}", **payload})
        response: dict[str, Any] = await client.receive_json()
        return response

    return _call


async def _expenses(call: Call) -> list[dict[str, Any]]:
    response = await call("expense/list", vehicle_id="ref")
    items: list[dict[str, Any]] = response["result"]["items"]
    return items


async def test_recurring_creates_expenses(
    hass: HomeAssistant, call: Call, freezer: FrozenDateTimeFactory
) -> None:
    response = await call(
        "recurring/save",
        vehicle_id="ref",
        label="Assurance",
        amount=42.5,
        category_id="insurance",
        interval_months=1,
        start_date="2026-01-25",
    )
    assert response["success"], response
    item = response["result"]
    assert item["next_date"] == "2026-04-25"
    assert item["monthly_amount"] == 42.5
    # Échéances passées et du jour créées immédiatement.
    created = await _expenses(call)
    assert sorted(e["date"] for e in created) == [
        "2026-01-25",
        "2026-02-25",
        "2026-03-25",
    ]
    assert {e["recurring_id"] for e in created} == {item["id"]}

    # L'échéance suivante est créée au passage horaire du jour venu.
    freezer.move_to("2026-04-25 08:00:00+00:00")
    async_fire_time_changed(hass)
    await hass.async_block_till_done()
    assert len(await _expenses(call)) == 4

    listed = (await call("recurring", vehicle_id="ref"))["result"]
    assert [r["next_date"] for r in listed] == ["2026-05-25"]

    # Modification : seules les échéances suivantes changent.
    response = await call(
        "recurring/save",
        vehicle_id="ref",
        recurring_id=item["id"],
        label="Assurance",
        amount=50,
        category_id="insurance",
        interval_months=3,
        start_date="2026-01-25",
    )
    assert response["result"]["next_date"] == "2026-07-25"
    assert len(await _expenses(call)) == 4

    assert (await call("recurring/delete", vehicle_id="ref", recurring_id=item["id"]))[
        "success"
    ]
    assert (await call("recurring", vehicle_id="ref"))["result"] == []
    assert len(await _expenses(call)) == 4  # les dépenses créées restent


async def test_recurring_rejects_invalid_input(call: Call) -> None:
    base = {"vehicle_id": "ref", "label": "X", "amount": 10}
    unknown = await call("recurring/save", **base, category_id="nope")
    assert unknown["error"]["code"] == "invalid_format"
    bad_interval = await call(
        "recurring/save", **base, category_id="other", interval_months=5
    )
    assert not bad_interval["success"]
    missing = await call(
        "recurring/save", **{**base, "vehicle_id": "x"}, category_id="other"
    )
    assert missing["error"]["code"] == "not_found"


async def test_export_and_curves(call: Call) -> None:
    await call(
        "recurring/save",
        vehicle_id="ref",
        label="Parking",
        amount=30,
        category_id="parking",
        start_date="2026-03-01",
    )
    result = (await call("export", vehicle_id="ref"))["result"]
    files = result["files"]
    assert result["rows"]["pleins.csv"] == len(ref.FUEL)
    assert result["rows"]["depenses_recurrentes.csv"] == 1
    assert set(files) == {
        "pleins.csv",
        "depenses.csv",
        "depenses_recurrentes.csv",
        "releves.csv",
        "rappels.csv",
    }
    assert files["pleins.csv"].count("\n") == len(ref.FUEL) + 1
    assert "Parking" in files["depenses_recurrentes.csv"]
    assert (await call("export", vehicle_id="x"))["error"]["code"] == "not_found"

    stats = (await call("stats", vehicle_id="ref", period="all"))["result"]
    odometer = stats["odometer_curve"]
    assert odometer[0]["value"] == ref.FUEL[0].odometer
    assert odometer[-1]["value"] == ref.FUEL[-1].odometer
    cost = stats["cost_curve"]
    assert cost
    assert cost[-1]["date"] == "2026-03-25"
    assert cost[-1]["total"] > cost[-1]["fuel"] > 0


async def test_vehicles_reports_installed_version(call: Call) -> None:
    result = (await call("vehicles"))["result"]
    assert result["version"] == "1.0.0-alpha.4"


async def test_next_fill_sensor(hass: HomeAssistant, call: Call) -> None:
    states = [
        s
        for s in hass.states.async_all("sensor")
        if s.entity_id.endswith("next_fill_up")
    ]
    assert len(states) == 1
    state = states[0]
    # Jeu de référence : date ISO et attributs arrondis.
    assert len(state.state) == 10
    assert state.state > "2026-03-01"
    assert state.attributes["odometer"] == round(state.attributes["odometer"])
    vehicles = (await call("vehicles"))["result"]["vehicles"]
    assert vehicles[0]["summary"]["next_fill"]["date"] == state.state
