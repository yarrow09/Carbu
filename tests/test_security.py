"""Durcissement : données d'origine externe, droits, en-têtes HTTP."""

import datetime as dt
from typing import Any

from aiohttp import FormData
from homeassistant.core import Context, HomeAssistant
from homeassistant.exceptions import Unauthorized
import pytest
from pytest_homeassistant_custom_component.common import MockUser
from pytest_homeassistant_custom_component.typing import (
    ClientSessionGenerator,
    WebSocketGenerator,
)

from custom_components.carbu.core.backup import (
    InvalidBackupError,
    parse_backup,
    sanitize_options,
)
from custom_components.carbu.core.csv_import import decode, preview_import
from custom_components.carbu.core.export import build_export, neutralize_formula
from custom_components.carbu.core.models import (
    Category,
    Expense,
    FuelEntry,
    FuelType,
    Vehicle,
)
from custom_components.carbu.core.repository import LogData, VehicleRecords

from .common import CLIO, setup_integration, store_data


@pytest.fixture(autouse=True)
def _custom_integrations(enable_custom_integrations: None) -> None:
    """Autoriser le chargement de l'intégration personnalisée."""


# --- Sauvegarde modifiée à la main ------------------------------------------


def test_category_color_and_icon_are_sanitized() -> None:
    evil = Category.from_dict(
        {
            "id": "x",
            "name": "Lavage",
            "color": "red;background:url(https://evil.example/x)",
            "icon": 'mdi:car" onload="alert(1)',
        }
    )
    assert evil.color is None
    assert evil.icon is None
    ok = Category.from_dict({"id": "y", "color": "#00aaff", "icon": "mdi:car-wash"})
    assert (ok.color, ok.icon) == ("#00aaff", "mdi:car-wash")


def test_sanitize_options() -> None:
    assert sanitize_options(None) == {}
    assert sanitize_options(
        {
            "notify_entities": ["notify.phone", "light.kitchen; rm -rf /", 3],
            "notify_services": ["mobile_app_phone", "../../x"],
            "moving_average_window": 500,
            "unexpected": {"a": 1},
        }
    ) == {"notify_entities": ["notify.phone"], "notify_services": ["mobile_app_phone"]}
    assert sanitize_options({"moving_average_window": 7}) == {
        "moving_average_window": 7
    }


def _backup(vehicle_id: str) -> dict[str, Any]:
    return {
        "format": "carbu_backup",
        "format_version": 1,
        "storage_version": [1, 2],
        "data": {"categories": [], "vehicles": {}},
        "vehicles": [{"id": vehicle_id, "title": "V", "data": {"name": "V"}}],
    }


def test_backup_rejects_unsafe_vehicle_id() -> None:
    assert parse_backup(_backup("01ABC_def-9")).vehicles[0].id == "01ABC_def-9"
    for bad in ("../../etc", "a/b", "", "x" * 65):
        with pytest.raises(InvalidBackupError):
            parse_backup(_backup(bad))


# --- Export CSV ouvert dans un tableur --------------------------------------


@pytest.mark.parametrize("text", ['=HYPERLINK("x")', "+1", "-2", "@SUM(A1)"])
def test_formulas_are_neutralized(text: str) -> None:
    assert neutralize_formula(text) == f"'{text}"
    assert neutralize_formula("Lavage") == "Lavage"


def test_formula_roundtrip_export_import() -> None:
    data = LogData()
    data.records("v").fuel.add(
        FuelEntry(
            id="f1",
            date=dt.date(2026, 1, 1),
            odometer=1000,
            volume=40,
            unit_price=1.8,
            total_cost=72,
            fuel_type=FuelType.GASOLINE,
            notes='=HYPERLINK("https://evil.example","clic")',
        )
    )
    files = build_export(data, {"v": Vehicle(id="v", name="V")}, {})
    assert "'=HYPERLINK" in files["pleins.csv"]
    preview = preview_import(
        decode(files["pleins.csv"].encode("utf-8-sig")),
        VehicleRecords(),
        data.categories,
        default_fuel=FuelType.GASOLINE,
    )
    assert preview.lines[0].record.notes == '=HYPERLINK("https://evil.example","clic")'


def test_import_truncates_long_texts() -> None:
    text = decode(
        (
            "date;odometer_km;volume;total_cost;station;notes\n"
            f"2026-01-01;1000;40;72;{'s' * 500};{'n' * 5000}\n"
        ).encode()
    )
    preview = preview_import(
        text, VehicleRecords(), LogData().categories, default_fuel=FuelType.GASOLINE
    )
    record = preview.lines[0].record
    assert len(record.station) == 100
    assert len(record.notes) == 1000


# --- Droits et API ---------------------------------------------------------------


async def test_file_writing_services_require_admin(
    hass: HomeAssistant, hass_read_only_user: MockUser
) -> None:
    await setup_integration(hass, {"v1": CLIO})
    for service in ("backup", "export_data"):
        with pytest.raises(Unauthorized):
            await hass.services.async_call(
                "carbu",
                service,
                {},
                blocking=True,
                return_response=True,
                context=Context(user_id=hass_read_only_user.id),
            )
    # Un utilisateur non administrateur peut toujours saisir un plein.
    await hass.services.async_call(
        "carbu",
        "add_fuel",
        {"vehicle": "v1", "odometer": 1000, "volume": 40, "total_cost": 72},
        blocking=True,
        context=Context(user_id=hass_read_only_user.id),
    )


async def test_websocket_rejects_oversized_text(
    hass: HomeAssistant, hass_ws_client: WebSocketGenerator
) -> None:
    await setup_integration(hass, {"v1": CLIO})
    client = await hass_ws_client(hass)
    await client.send_json_auto_id(
        {
            "type": "carbu/fuel/save",
            "vehicle_id": "v1",
            "odometer": 1000,
            "volume": 40,
            "total_cost": 72,
            "notes": "x" * 1001,
        }
    )
    response = await client.receive_json()
    assert not response["success"]
    assert response["error"]["code"] == "invalid_format"


# --- Pièces jointes : affichage isolé ------------------------------------------


@pytest.fixture
async def attachment_entry(hass: HomeAssistant, hass_storage: dict[str, Any]) -> Any:
    data = LogData()
    data.add_expense(
        "v1",
        Expense(id="e1", date=dt.date(2026, 1, 1), amount=50, category_id="repair"),
    )
    store_data(hass_storage, data)
    return await setup_integration(hass, {"v1": CLIO})


def _form(content: bytes) -> FormData:
    form = FormData()
    form.add_field("file", content, filename="f", content_type="image/png")
    return form


@pytest.mark.usefixtures("attachment_entry")
async def test_attachment_security_headers(hass_client: ClientSessionGenerator) -> None:
    client = await hass_client()
    url = "/api/carbu/attachment/v1/e1"
    await client.post(url, data=_form(b"\x89PNG\r\n\x1a\n" + b"\x00" * 16))
    response = await client.get(url)
    assert response.headers["X-Content-Type-Options"] == "nosniff"
    assert response.headers["Content-Security-Policy"].startswith("sandbox")
    assert response.headers["Content-Disposition"].startswith("inline")

    await client.post(url, data=_form(b"%PDF-1.7\n" + b"x" * 16))
    response = await client.get(url)
    # Un PDF peut contenir du code : il est téléchargé, jamais affiché.
    assert response.headers["Content-Disposition"].startswith("attachment")


async def test_invalid_stored_attachment_name_is_a_404(
    attachment_entry: Any, hass_client: ClientSessionGenerator
) -> None:
    expense = attachment_entry.runtime_data.storage.data.records("v1").expenses.get(
        "e1"
    )
    expense.attachment = "../../secrets.yaml"
    client = await hass_client()
    url = "/api/carbu/attachment/v1/e1"
    assert (await client.get(url)).status == 404
    assert (await client.delete(url)).status == 200
    assert expense.attachment is None
