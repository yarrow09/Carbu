"""Performance avec 5 ans de données (≈ 500 pleins, 5 000 dépenses).

Objectif produit : tableau de bord affiché en moins de 2 s. La part serveur
(chargement, calcul des indicateurs, réponse websocket du tableau de bord)
doit rester très en dessous ; on lui accorde ici 0,5 s au maximum, ce qui
laisse l'essentiel du budget au rendu des cartes.
"""

import datetime as dt
import random
import time
from typing import Any

from homeassistant.core import HomeAssistant
import pytest
from pytest_homeassistant_custom_component.typing import WebSocketGenerator

from custom_components.carbu.const import DOMAIN
from custom_components.carbu.core.models import Expense, FuelEntry, FuelType
from custom_components.carbu.core.repository import LogData
from custom_components.carbu.core.summary import compute_summary
from custom_components.carbu.storage import VehicleLogStorage

from ..common import REFERENCE, setup_integration, store_data
from ..core import reference_dataset as ref

SERVER_BUDGET_S = 0.5
FILLS = 500
EXPENSES = 5000
CATEGORIES = [
    "maintenance",
    "insurance",
    "parking",
    "toll",
    "inspection",
    "repair",
    "other",
]


def five_years_of_data(seed: int = 42) -> LogData:
    """Jeu de données réaliste et déterministe sur 5 ans."""
    rng = random.Random(seed)
    data = LogData()
    start = dt.date.today() - dt.timedelta(days=5 * 365)
    odometer = 20000.0
    for i in range(FILLS):
        odometer += rng.uniform(450, 750)
        volume = round(rng.uniform(30, 50), 2)
        price = round(rng.uniform(1.6, 2.0), 3)
        data.records("ref").fuel.add(
            FuelEntry(
                date=start + dt.timedelta(days=i * 365 * 5 // FILLS),
                odometer=round(odometer, 1),
                volume=volume,
                unit_price=price,
                total_cost=round(volume * price, 2),
                fuel_type=FuelType.GASOLINE,
                full_tank=rng.random() > 0.15,
            )
        )
    for i in range(EXPENSES):
        data.add_expense(
            "ref",
            Expense(
                date=start + dt.timedelta(days=i * 365 * 5 // EXPENSES),
                amount=round(rng.uniform(2, 300), 2),
                category_id=rng.choice(CATEGORIES),
            ),
        )
    return data


def test_pure_summary_is_fast() -> None:
    data = five_years_of_data()
    began = time.perf_counter()
    compute_summary(ref.VEHICLE, data.records("ref"), dt.datetime.now())
    assert time.perf_counter() - began < SERVER_BUDGET_S


@pytest.mark.usefixtures("enable_custom_integrations")
async def test_dashboard_round_trip_is_fast(
    hass: HomeAssistant,
    hass_storage: dict[str, Any],
    hass_ws_client: WebSocketGenerator,
) -> None:
    store_data(hass_storage, five_years_of_data())

    began = time.perf_counter()
    entry = await setup_integration(hass, {"ref": REFERENCE})
    setup_s = time.perf_counter() - began
    assert len(entry.runtime_data.storage.data.records("ref").expenses) == EXPENSES

    client = await hass_ws_client(hass)
    began = time.perf_counter()
    await client.send_json_auto_id({"type": f"{DOMAIN}/dashboard", "vehicle_id": "ref"})
    response = await client.receive_json()
    dashboard_s = time.perf_counter() - began

    assert response["success"]
    assert len(response["result"]["monthly"]) == 12
    assert setup_s < SERVER_BUDGET_S, f"chargement : {setup_s:.3f} s"
    assert dashboard_s < SERVER_BUDGET_S, f"tableau de bord : {dashboard_s:.3f} s"


async def test_serialization_roundtrip_is_fast(hass: HomeAssistant) -> None:
    data = five_years_of_data()
    began = time.perf_counter()
    restored = LogData.from_dict(data.to_dict())
    assert time.perf_counter() - began < SERVER_BUDGET_S
    assert len(restored.records("ref").fuel) == FILLS
    storage = VehicleLogStorage(hass)
    storage.data = restored
    await storage.async_save()
