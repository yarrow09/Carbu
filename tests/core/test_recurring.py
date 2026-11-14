"""Dépenses récurrentes, coût au km cumulé et courbe du compteur."""

import datetime as dt

import pytest

from custom_components.carbu.core.inputs import recurring_from_input
from custom_components.carbu.core.models import (
    Category,
    Expense,
    FuelEntry,
    FuelType,
    OdometerReading,
    RecurringExpense,
)
from custom_components.carbu.core.recurring import (
    MAX_CATCH_UP,
    due_expenses,
    generate_due,
    monthly_amount,
)
from custom_components.carbu.core.repository import LogData, VehicleRecords
from custom_components.carbu.core.statistics import (
    cost_per_km_series,
    odometer_series,
)


def _item(**kwargs: object) -> RecurringExpense:
    values: dict[str, object] = {
        "id": "r1",
        "label": "Assurance",
        "amount": 40.0,
        "category_id": "insurance",
        "start_date": dt.date(2026, 1, 31),
    }
    values.update(kwargs)
    return RecurringExpense(**values)  # type: ignore[arg-type]


def test_occurrences_keep_day_clamped_to_month_end() -> None:
    item = _item()
    assert [item.occurrence(i) for i in range(4)] == [
        dt.date(2026, 1, 31),
        dt.date(2026, 2, 28),
        dt.date(2026, 3, 31),
        dt.date(2026, 4, 30),
    ]
    quarterly = _item(interval_months=3, start_date=dt.date(2025, 11, 15))
    assert quarterly.occurrence(1) == dt.date(2026, 2, 15)
    assert quarterly.occurrence(5) == dt.date(2027, 2, 15)


def test_due_expenses_and_next_date() -> None:
    item = _item()
    created = due_expenses(item, dt.date(2026, 3, 30))
    assert [e.date for e in created] == [dt.date(2026, 1, 31), dt.date(2026, 2, 28)]
    assert all(e.recurring_id == "r1" and e.amount == 40 for e in created)
    assert created[0].description == "Assurance"
    assert item.last_date == dt.date(2026, 2, 28)
    assert item.next_date() == dt.date(2026, 3, 31)
    # Rien de nouveau le même jour : pas de doublon.
    assert due_expenses(item, dt.date(2026, 3, 30)) == []


def test_end_date_inactive_and_catch_up_limit() -> None:
    ended = _item(end_date=dt.date(2026, 2, 28))
    assert len(due_expenses(ended, dt.date(2027, 1, 1))) == 2
    assert ended.next_date() is None
    paused = _item(active=False)
    assert due_expenses(paused, dt.date(2027, 1, 1)) == []
    old = _item(start_date=dt.date(2000, 1, 1))
    assert len(due_expenses(old, dt.date(2026, 1, 1))) == MAX_CATCH_UP
    assert old.next_date() == dt.date(2005, 1, 1)


def test_generate_due_only_for_known_vehicles() -> None:
    data = LogData()
    data.save_recurring("a", _item())
    data.save_recurring("b", _item(id="r2"))
    assert generate_due(data, dt.date(2026, 2, 1), ["a"]) == 1
    assert len(data.records("a").expenses) == 1
    assert len(data.records("b").expenses) == 0
    assert monthly_amount(_item(amount=120, interval_months=12)) == 10


def test_edit_keeps_created_occurrences() -> None:
    item = _item(last_date=dt.date(2026, 2, 28))
    edited = recurring_from_input(
        {
            "label": " Assurance tous risques ",
            "amount": 45,
            "category_id": "insurance",
            "interval_months": 1,
            "start_date": dt.date(2026, 1, 31),
        },
        item,
        dt.date(2026, 3, 1),
    )
    assert edited.id == "r1"
    assert edited.label == "Assurance tous risques"
    assert edited.last_date == dt.date(2026, 2, 28)
    assert edited.next_date() == dt.date(2026, 3, 31)


@pytest.mark.parametrize(
    "data",
    [
        {"label": "", "amount": 10, "category_id": "x"},
        {"label": "A", "amount": 0, "category_id": "x"},
        {"label": "A", "amount": 10, "category_id": "x", "interval_months": 5},
        {
            "label": "A",
            "amount": 10,
            "category_id": "x",
            "start_date": dt.date(2026, 2, 1),
            "end_date": dt.date(2026, 1, 1),
        },
    ],
)
def test_invalid_input(data: dict[str, object]) -> None:
    with pytest.raises(ValueError, match=r"\w"):
        recurring_from_input(data, None, dt.date(2026, 1, 1))


def test_storage_roundtrip_legacy_and_category_deletion() -> None:
    records = VehicleRecords()
    records.recurring.add(_item(last_date=dt.date(2026, 1, 31)))
    restored = VehicleRecords.from_dict(records.to_dict())
    assert restored.recurring.items == records.recurring.items
    assert len(VehicleRecords.from_dict({"fuel": []}).recurring) == 0
    expense = Expense(id="e", date=dt.date(2026, 1, 1), amount=1, category_id="x")
    expense.recurring_id = "r1"
    assert Expense.from_dict(expense.to_dict()) == expense

    data = LogData()
    data.add_category(Category(id="sub", name="Abonnement"))
    data.save_recurring("v", _item(category_id="sub"))
    assert data.category_usage("sub") == 1
    assert data.delete_category("sub") == 1
    assert data.records("v").recurring.get("r1").category_id == "other"


def _fill(fid: str, day: dt.date, km: float, cost: float) -> FuelEntry:
    return FuelEntry(
        id=fid,
        date=day,
        odometer=km,
        volume=cost / 2,
        unit_price=2,
        total_cost=cost,
        fuel_type=FuelType.GASOLINE,
    )


def test_cost_per_km_series() -> None:
    records = VehicleRecords()
    records.fuel.add(_fill("f1", dt.date(2026, 1, 1), 10000, 60))
    records.fuel.add(_fill("f2", dt.date(2026, 1, 15), 10500, 50))
    records.expenses.add(
        Expense(id="e1", date=dt.date(2026, 1, 20), amount=90, category_id="x")
    )
    records.fuel.add(_fill("f3", dt.date(2026, 2, 1), 11000, 40))
    # Avec le seuil par défaut (1 000 km), la courbe ne démarre qu'au 1er février.
    assert [p.date for p in cost_per_km_series(records, dt.date(2026, 2, 10))] == [
        dt.date(2026, 2, 1),
        dt.date(2026, 2, 10),
    ]
    points = cost_per_km_series(records, dt.date(2026, 2, 10), min_distance=0)
    # Pas de point au premier plein : aucune distance encore parcourue.
    assert [p.date for p in points] == [
        dt.date(2026, 1, 15),
        dt.date(2026, 1, 20),
        dt.date(2026, 2, 1),
        dt.date(2026, 2, 10),
    ]
    assert points[0].total_per_km == pytest.approx(110 / 500)
    assert points[1].total_per_km == pytest.approx(200 / 500)
    assert points[1].fuel_per_km == pytest.approx(110 / 500)
    assert points[-1].total_per_km == pytest.approx(240 / 1000)
    assert points[-1].fuel_per_km == pytest.approx(150 / 1000)
    later = cost_per_km_series(
        records, dt.date(2026, 2, 10), dt.date(2026, 2, 1), min_distance=0
    )
    assert [p.date for p in later] == [dt.date(2026, 2, 1), dt.date(2026, 2, 10)]
    assert cost_per_km_series(VehicleRecords(), dt.date(2026, 1, 1)) == []


def test_odometer_series() -> None:
    records = VehicleRecords()
    records.fuel.add(_fill("f1", dt.date(2026, 1, 1), 10000, 60))
    records.odometer.add(
        OdometerReading(
            id="o1", date=dt.date(2026, 1, 1), time=dt.time(18), odometer=10050
        )
    )
    records.fuel.add(_fill("f2", dt.date(2026, 1, 15), 10500, 50))
    assert [(p.date, p.odometer) for p in odometer_series(records)] == [
        (dt.date(2026, 1, 1), 10050),
        (dt.date(2026, 1, 15), 10500),
    ]
    assert len(odometer_series(records, dt.date(2026, 1, 2))) == 1
