"""API websocket des cartes : lecture, saisie rapide, contrôles, recalcul."""

from collections.abc import Awaitable, Callable
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er
import pytest
from pytest_homeassistant_custom_component.typing import WebSocketGenerator

from custom_components.vehicle_log.const import DOMAIN
from custom_components.vehicle_log.core.repository import LogData

from .common import CLIO, REFERENCE, setup_integration, store_data
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
    """Intégration chargée avec le jeu de référence + client websocket."""
    data = LogData()
    for entry in ref.FUEL:
        data.records("ref").fuel.add(entry)
    for expense in ref.EXPENSES:
        data.add_expense("ref", expense)
    store_data(hass_storage, data)
    await setup_integration(
        hass,
        {
            "ref": REFERENCE,
            "us": {**CLIO, "distance_unit": "mi", "volume_unit": "gal_us"},
        },
    )
    client = await hass_ws_client(hass)

    async def _call(command: str, **payload: Any) -> dict[str, Any]:
        await client.send_json_auto_id({"type": f"{DOMAIN}/{command}", **payload})
        response: dict[str, Any] = await client.receive_json()
        return response

    return _call


def _sensor(hass: HomeAssistant, unique_id: str) -> float:
    entity_id = er.async_get(hass).async_get_entity_id("sensor", DOMAIN, unique_id)
    assert entity_id
    state = hass.states.get(entity_id)
    assert state
    return float(state.state)


async def test_vehicles_and_dashboard(call: Call) -> None:
    response = await call("vehicles")
    assert response["success"]
    names = {v["name"] for v in response["result"]["vehicles"]}
    assert names == {"Référence", "Clio"}

    response = await call("dashboard", vehicle_id="ref")
    result = response["result"]
    assert result["summary"]["consumption"]["gasoline"] == pytest.approx(5.775)
    assert result["summary"]["month_cost"] == pytest.approx(417.50)
    assert [e["id"] for e in result["recent_fuel"]] == ["f6", "f5", "f4", "f3", "f2"]
    assert [e["id"] for e in result["recent_expenses"]] == [
        "e5",
        "e4",
        "e3",
        "e2",
        "e1",
    ]
    monthly = {m["month"]: m["values"] for m in result["monthly"]}
    assert len(monthly) == 12
    assert list(monthly)[-1] == "2026-03"
    for month, values in ref.EXPECTED_MONTHLY.items():
        assert monthly[month] == pytest.approx(values)
    labels = {c["id"]: c["label"] for c in result["categories"]}
    assert labels["toll"] == "Toll"  # langue des tests : anglais


async def test_fuel_defaults_prefill(call: Call) -> None:
    result = (await call("fuel/defaults", vehicle_id="ref"))["result"]
    assert result["odometer"] == 12300
    assert result["fuel_type"] == "gasoline"
    assert result["unit_price"] == {"gasoline": 1.8}
    assert result["date"] == "2026-03-25"


async def test_quick_fill_minimal_form(hass: HomeAssistant, call: Call) -> None:
    """Kilométrage, litres, montant : le reste est calculé."""
    response = await call(
        "fuel/save", vehicle_id="ref", odometer=12900, volume=40, total_cost=74
    )
    result = response["result"]
    assert result["saved"] is True
    assert result["warnings"] == []
    entry = result["entry"]
    assert entry["unit_price"] == pytest.approx(1.85)
    assert entry["date"] == "2026-03-25"
    assert entry["time"] == "13:00"
    # Nouveau segment : (20 + 40) L / (12900 − 12000) km = 6,667 l/100 km
    # Moyenne : (115,5 + 60) / (2000 + 900) × 100 = 6,0517
    assert _sensor(hass, "ref_consumption") == pytest.approx(175.5 / 2900 * 100)
    assert _sensor(hass, "ref_odometer") == 12900


async def test_price_to_amount_direction(call: Call) -> None:
    result = (
        await call(
            "fuel/save",
            vehicle_id="ref",
            odometer=12500,
            volume=10,
            unit_price=1.799,
            full_tank=False,
        )
    )["result"]
    assert result["entry"]["total_cost"] == pytest.approx(17.99)


async def test_warnings_require_confirmation(hass: HomeAssistant, call: Call) -> None:
    payload = {"vehicle_id": "ref", "odometer": 12000, "volume": 60, "total_cost": 100}
    result = (await call("fuel/save", **payload))["result"]
    assert result["saved"] is False
    codes = {w["code"] for w in result["warnings"]}
    assert codes == {"odometer_below_previous", "volume_exceeds_tank"}
    assert _sensor(hass, "ref_odometer") == 12300  # rien d'enregistré

    result = (await call("fuel/save", confirm=True, **payload))["result"]
    assert result["saved"] is True


async def test_edit_and_delete_recalculate(hass: HomeAssistant, call: Call) -> None:
    # Le plein f5 passe de 42 L à 48 L : segment C = 8 l/100 km
    response = await call(
        "fuel/save",
        vehicle_id="ref",
        entry_id="f5",
        odometer=12000,
        volume=48,
        total_cost=84,
    )
    assert response["result"]["saved"]
    assert response["result"]["entry"]["date"] == "2026-03-01"
    assert _sensor(hass, "ref_consumption") == pytest.approx(121.5 / 2000 * 100)

    assert (await call("fuel/delete", vehicle_id="ref", entry_id="f5"))["success"]
    # Plus de segment C : (36 + 37,5) / 1400
    assert _sensor(hass, "ref_consumption") == pytest.approx(73.5 / 1400 * 100)
    response = await call("fuel/delete", vehicle_id="ref", entry_id="f5")
    assert response["error"]["code"] == "not_found"


async def test_fuel_list_and_units_conversion(call: Call) -> None:
    result = (await call("fuel/list", vehicle_id="ref", start="2026-02-01"))["result"]
    assert result["total"] == 4
    assert result["items"][0]["id"] == "f6"
    page = (await call("fuel/list", vehicle_id="ref", limit=2, offset=1))["result"]
    assert [e["id"] for e in page["items"]] == ["f5", "f4"]

    # Véhicule en miles et gallons US : saisie et restitution dans ces unités.
    result = (
        await call(
            "fuel/save", vehicle_id="us", odometer=1000, volume=10, unit_price=4.0
        )
    )["result"]
    entry = result["entry"]
    assert entry["odometer"] == pytest.approx(1000)
    assert entry["volume"] == pytest.approx(10)
    assert entry["unit_price"] == pytest.approx(4.0)
    assert entry["total_cost"] == pytest.approx(40.0)


async def test_expenses_crud_and_filters(hass: HomeAssistant, call: Call) -> None:
    response = await call(
        "expense/save",
        vehicle_id="ref",
        amount=60,
        category_id="maintenance",
        description=" Vidange ",
        date="2026-03-20",
    )
    expense = response["result"]
    assert expense["description"] == "Vidange"
    assert _sensor(hass, "ref_month_cost") == pytest.approx(477.50)

    result = (
        await call(
            "expense/list",
            vehicle_id="ref",
            start="2026-02-01",
            end="2026-03-31",
            category_ids=["toll", "maintenance"],
            min_amount=10,
        )
    )["result"]
    assert [e["id"] for e in result["items"]] == [expense["id"], "e2"]
    assert result["sum"] == pytest.approx(75.40)

    response = await call(
        "expense/save",
        vehicle_id="ref",
        expense_id=expense["id"],
        amount=65,
        category_id="repair",
    )
    assert response["result"]["date"] == "2026-03-20"
    assert _sensor(hass, "ref_month_cost") == pytest.approx(482.50)

    assert (await call("expense/delete", vehicle_id="ref", expense_id=expense["id"]))[
        "success"
    ]
    assert _sensor(hass, "ref_month_cost") == pytest.approx(417.50)


async def test_errors(call: Call) -> None:
    response = await call(
        "expense/save", vehicle_id="ref", amount=10, category_id="unknown"
    )
    assert response["error"]["code"] == "invalid_format"
    response = await call("fuel/defaults", vehicle_id="nope")
    assert response["error"]["code"] == "not_found"
    response = await call("fuel/save", vehicle_id="ref", odometer=1, volume=10)
    assert response["error"]["code"] == "invalid_format"  # une seule valeur sur 3
    response = await call(
        "fuel/save", vehicle_id="ref", odometer=-1, volume=1, total_cost=2
    )
    assert response["error"]["code"] == "invalid_format"


async def test_categories(call: Call) -> None:
    result = (await call("categories"))["result"]
    assert {c["id"] for c in result} >= {"other", "toll", "maintenance"}
