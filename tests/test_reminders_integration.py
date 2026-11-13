"""Rappels dans Home Assistant : entités, premier critère atteint, notifications."""

import datetime as dt
from typing import Any

from freezegun.api import FrozenDateTimeFactory
from homeassistant.core import HomeAssistant, ServiceCall, State
from homeassistant.helpers import entity_registry as er
import pytest
from pytest_homeassistant_custom_component.common import (
    async_fire_time_changed,
    async_mock_service,
)
from pytest_homeassistant_custom_component.typing import WebSocketGenerator

from custom_components.carbu.const import DOMAIN
from custom_components.carbu.core.repository import LogData

from .common import REFERENCE, setup_integration, store_data
from .core import reference_dataset as ref

pytestmark = pytest.mark.freeze_time("2026-03-25 20:00:00+00:00")

type Call = Any


@pytest.fixture(autouse=True)
def _custom_integrations(enable_custom_integrations: None) -> None:
    """Autoriser le chargement de l'intégration personnalisée."""


@pytest.fixture
def notify_calls(hass: HomeAssistant) -> list[ServiceCall]:
    return async_mock_service(hass, "notify", "mobile_app_phone")


@pytest.fixture
async def call(
    hass: HomeAssistant,
    hass_storage: dict[str, Any],
    hass_ws_client: WebSocketGenerator,
    notify_calls: list[ServiceCall],
) -> Call:
    data = LogData()
    for fill in ref.FUEL:
        data.records("ref").fuel.add(fill)
    store_data(hass_storage, data)
    entry = await setup_integration(hass, {"ref": REFERENCE})
    hass.config_entries.async_update_entry(
        entry, options={"notify_services": ["notify.mobile_app_phone"]}
    )
    await hass.async_block_till_done()
    client = await hass_ws_client(hass)

    async def _call(command: str, **payload: Any) -> Any:
        await client.send_json_auto_id(
            {"type": f"{DOMAIN}/{command}", "vehicle_id": "ref", **payload}
        )
        response = await client.receive_json()
        assert response["success"], response
        return response["result"]

    return _call


def _reminder_state(hass: HomeAssistant, reminder_id: str) -> State | None:
    entity_id = er.async_get(hass).async_get_entity_id(
        "binary_sensor", DOMAIN, f"ref_reminder_{reminder_id}"
    )
    return hass.states.get(entity_id) if entity_id else None


async def _add_fuel(hass: HomeAssistant, odometer: float) -> None:
    await hass.services.async_call(
        DOMAIN,
        "add_fuel",
        {"vehicle": "ref", "odometer": odometer, "volume": 40, "total_cost": 72},
        blocking=True,
    )
    await hass.async_block_till_done()


async def test_reminder_lifecycle_by_distance(
    hass: HomeAssistant, call: Call, notify_calls: list[ServiceCall]
) -> None:
    """Critère d'acceptation : « dû » au premier critère atteint, puis notification."""
    reminder = await call(
        "reminder/save",
        label="Vidange",
        kind="both",
        due_date="2026-12-31",
        due_odometer=13000,
        alert_distance=500,
        interval_distance=15000,
        interval_days=365,
    )
    await hass.async_block_till_done()
    state = _reminder_state(hass, reminder["id"])
    assert state is not None
    assert state.state == "off"
    assert state.name == "Référence Vidange"
    assert state.attributes["distance_left"] == 700  # 13 000 − 12 300
    assert notify_calls == []

    await _add_fuel(hass, 12600)  # 400 km restants < seuil de 500
    state = _reminder_state(hass, reminder["id"])
    assert state is not None
    assert state.state == "off"
    assert state.attributes["state"] == "alert"
    assert len(notify_calls) == 1
    assert "Vidange" in notify_calls[0].data["title"]

    await _add_fuel(hass, 13050)  # kilométrage atteint avant la date
    state = _reminder_state(hass, reminder["id"])
    assert state is not None
    assert state.state == "on"
    assert state.attributes["criterion"] == "distance"
    assert len(notify_calls) == 2

    await _add_fuel(hass, 13200)  # pas de nouvelle notification
    assert len(notify_calls) == 2

    done = await call("reminder/done", reminder_id=reminder["id"])
    await hass.async_block_till_done()
    assert done["due_odometer"] == 28200  # 13 200 + 15 000
    assert done["due_date"] == "2027-03-25"
    state = _reminder_state(hass, reminder["id"])
    assert state is not None
    assert state.state == "off"


async def test_reminder_due_by_date(
    hass: HomeAssistant,
    call: Call,
    notify_calls: list[ServiceCall],
    freezer: FrozenDateTimeFactory,
) -> None:
    reminder = await call(
        "reminder/save", label="Contrôle technique", kind="date", due_date="2026-03-27"
    )
    await hass.async_block_till_done()
    assert _reminder_state(hass, reminder["id"]).state == "off"  # type: ignore[union-attr]

    freezer.move_to("2026-03-27 08:00:00+00:00")
    async_fire_time_changed(hass)  # passage horaire du coordinator
    await hass.async_block_till_done()
    state = _reminder_state(hass, reminder["id"])
    assert state is not None
    assert state.state == "on"
    assert len(notify_calls) == 1
    assert (
        "dû" in notify_calls[0].data["message"]
        or "due" in notify_calls[0].data["message"]
    )


async def test_reminder_edit_list_and_delete(hass: HomeAssistant, call: Call) -> None:
    reminder = await call(
        "reminder/save", label="Pneus", kind="distance", due_odometer=20000
    )
    await hass.async_block_till_done()
    updated = await call(
        "reminder/save",
        reminder_id=reminder["id"],
        label="Pneus hiver",
        kind="distance",
        due_odometer=21000,
    )
    await hass.async_block_till_done()
    assert updated["label"] == "Pneus hiver"
    state = _reminder_state(hass, reminder["id"])
    assert state is not None
    assert state.name == "Référence Pneus hiver"

    (listed,) = await call("reminders")
    assert listed["state"] == "ok"
    assert listed["distance_left"] == 8700

    await call("reminder/delete", reminder_id=reminder["id"])
    await hass.async_block_till_done()
    assert _reminder_state(hass, reminder["id"]) is None
    assert await call("reminders") == []


async def test_reminder_validation(
    hass: HomeAssistant, hass_ws_client: WebSocketGenerator, call: Call
) -> None:
    client = await hass_ws_client(hass)
    await client.send_json_auto_id(
        {
            "type": f"{DOMAIN}/reminder/save",
            "vehicle_id": "ref",
            "label": "Sans date",
            "kind": "date",
        }
    )
    response = await client.receive_json()
    assert response["error"]["code"] == "invalid_format"


async def test_non_recurring_reminder_becomes_inactive(
    hass: HomeAssistant, call: Call
) -> None:
    reminder = await call(
        "reminder/save", label="Vignette", kind="date", due_date="2026-01-01"
    )
    await hass.async_block_till_done()
    assert _reminder_state(hass, reminder["id"]).state == "on"  # type: ignore[union-attr]
    done = await call("reminder/done", reminder_id=reminder["id"], date="2026-03-20")
    await hass.async_block_till_done()
    assert done["active"] is False
    assert done["state"] == "inactive"
    assert _reminder_state(hass, reminder["id"]).state == "off"  # type: ignore[union-attr]


async def test_stats_command(hass: HomeAssistant, call: Call) -> None:
    stats = await call("stats", period="30d")
    assert stats["start"] == "2026-02-24"
    assert stats["consumption"]["gasoline"] == pytest.approx(7.0)
    assert stats["fuel_cost"] == pytest.approx(109.50)
    assert stats["moving_average_window"] == 5
    assert [p["entry_id"] for p in stats["series"]["gasoline"]] == ["f5"]

    stats = await call("stats", period="12m")
    points = stats["series"]["gasoline"]
    assert [p["entry_id"] for p in points] == ["f2", "f4", "f5"]
    assert points[-1]["moving_average"] == pytest.approx(5.775)
    assert dt.date.fromisoformat(stats["start"]) == dt.date(2025, 3, 26)
