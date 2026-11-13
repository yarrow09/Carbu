"""Données en mémoire : CRUD, tri, catégories."""

from datetime import date, time

import pytest

from custom_components.vehicle_log.core.migrations import (
    UnsupportedStorageVersionError,
    migrate,
)
from custom_components.vehicle_log.core.models import (
    CATEGORY_OTHER,
    DEFAULT_CATEGORIES,
    Category,
    Expense,
    FuelEntry,
    FuelType,
)
from custom_components.vehicle_log.core.repository import (
    CategoryError,
    LogData,
    RecordNotFoundError,
)


def _fuel(day: int, odometer: float, at: time | None = None) -> FuelEntry:
    return FuelEntry(
        date=date(2026, 1, day),
        time=at,
        odometer=odometer,
        volume=40,
        unit_price=1.8,
        total_cost=72,
        fuel_type=FuelType.GASOLINE,
    )


def test_default_categories_created_once() -> None:
    data = LogData()
    assert set(data.categories) == {c.id for c in DEFAULT_CATEGORIES}
    # Les catégories par défaut ne sont pas partagées entre instances.
    data.update_category("toll", color="#000000")
    assert LogData().categories["toll"].color != "#000000"


def test_fuel_entries_kept_sorted() -> None:
    fuel = LogData().records("v1").fuel
    fuel.add(_fuel(10, 1000))
    fuel.add(_fuel(5, 500))
    fuel.add(_fuel(5, 520, time(18, 0)))
    fuel.add(_fuel(20, 2000))
    assert [e.odometer for e in fuel] == [500, 520, 1000, 2000]


def test_fuel_update_resorts_and_delete() -> None:
    fuel = LogData().records("v1").fuel
    first = fuel.add(_fuel(1, 100))
    fuel.add(_fuel(2, 200))
    first.date = date(2026, 1, 3)
    first.odometer = 300
    fuel.update(first)
    assert [e.odometer for e in fuel] == [200, 300]
    fuel.delete(first.id)
    assert len(fuel) == 1
    with pytest.raises(RecordNotFoundError):
        fuel.get(first.id)
    with pytest.raises(RecordNotFoundError):
        fuel.delete("absent")


def test_duplicate_id_rejected() -> None:
    fuel = LogData().records("v1").fuel
    entry = fuel.add(_fuel(1, 100))
    with pytest.raises(ValueError, match="déjà"):
        fuel.add(entry)


def test_expense_requires_known_category() -> None:
    data = LogData()
    with pytest.raises(CategoryError):
        data.add_expense(
            "v1", Expense(date=date(2026, 1, 1), amount=10, category_id="nope")
        )


def test_custom_category_lifecycle_and_reassignment() -> None:
    data = LogData()
    wash = data.add_category(Category(name="Lavage", color="#00aaff"))
    for vid in ("v1", "v2"):
        data.add_expense(
            vid, Expense(date=date(2026, 1, 1), amount=10, category_id=wash.id)
        )
    data.add_expense(
        "v1", Expense(date=date(2026, 1, 2), amount=5, category_id="parking")
    )

    data.update_category(wash.id, name="Lavage auto")
    assert data.categories[wash.id].name == "Lavage auto"
    with pytest.raises(CategoryError):
        data.update_category(wash.id, name="  ")

    assert data.category_usage(wash.id) == 2
    assert data.delete_category(wash.id) == 2
    assert wash.id not in data.categories
    categories = [e.category_id for rec in data.vehicles.values() for e in rec.expenses]
    assert sorted(categories) == [CATEGORY_OTHER, CATEGORY_OTHER, "parking"]


def test_builtin_category_rename_and_reset() -> None:
    data = LogData()
    data.update_category("toll", name="Autoroute")
    assert data.categories["toll"].name == "Autoroute"
    data.update_category("toll", name="")
    assert data.categories["toll"].name is None


def test_category_rules() -> None:
    data = LogData()
    with pytest.raises(CategoryError):
        data.delete_category(CATEGORY_OTHER)
    with pytest.raises(CategoryError):
        data.add_category(Category(name=""))
    with pytest.raises(CategoryError):
        data.add_category(Category(id="toll", name="Doublon"))
    with pytest.raises(RecordNotFoundError):
        data.delete_category("absent")


def test_deleted_builtin_category_stays_deleted_after_reload() -> None:
    data = LogData()
    data.delete_category("toll")
    restored = LogData.from_dict(data.to_dict())
    assert "toll" not in restored.categories
    assert CATEGORY_OTHER in restored.categories


def test_full_roundtrip_and_remove_vehicle() -> None:
    data = LogData()
    data.records("v1").fuel.add(_fuel(1, 100))
    data.add_expense(
        "v1", Expense(date=date(2026, 1, 1), amount=10, category_id="toll")
    )
    restored = LogData.from_dict(data.to_dict())
    assert restored.to_dict() == data.to_dict()
    restored.remove_vehicle("v1")
    assert "v1" not in restored.vehicles


def test_migrate_current_version_is_identity() -> None:
    payload = {"categories": [], "vehicles": {}}
    assert migrate(1, 1, payload) == payload
    with pytest.raises(UnsupportedStorageVersionError):
        migrate(99, 1, payload)
