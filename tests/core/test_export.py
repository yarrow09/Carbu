"""Export CSV."""

import csv
import datetime as dt
import io

from custom_components.carbu.core.export import (
    EXPENSE_COLUMNS,
    FUEL_COLUMNS,
    REMINDER_COLUMNS,
    build_export,
    to_csv,
)
from custom_components.carbu.core.models import (
    Category,
    OdometerReading,
    Reminder,
    ReminderKind,
)
from custom_components.carbu.core.repository import LogData

from . import reference_dataset as ref


def _parse(text: str) -> list[dict[str, str]]:
    return list(csv.DictReader(io.StringIO(text), delimiter=";"))


def _data() -> LogData:
    data = LogData()
    for entry in ref.FUEL:
        data.records("ref").fuel.add(entry)
    for expense in ref.EXPENSES:
        data.add_expense("ref", expense)
    wash = data.add_category(Category(id="wash", name="Lavage; intérieur"))
    data.add_expense(
        "ref",
        ref.EXPENSES[0].__class__(
            id="e9", date=dt.date(2026, 3, 22), amount=12.5, category_id=wash.id,
            description='Aspirateur "pro"\nligne 2',
        ),
    )  # fmt: skip
    data.records("ref").odometer.add(
        OdometerReading(id="o1", date=dt.date(2026, 3, 24), odometer=12400)
    )
    data.records("ref").reminders.add(
        Reminder(
            id="r1", label="Vidange", kind=ReminderKind.DISTANCE,
            due_odometer=15000, interval_distance=15000,
        )
    )  # fmt: skip
    data.records("orphan").fuel.add(ref.FUEL[0])  # véhicule inconnu : ignoré
    return data


def test_export_contains_all_data() -> None:
    files = build_export(_data(), {"ref": ref.VEHICLE}, {"toll": "Péage"})
    assert set(files) == {
        "pleins.csv",
        "depenses.csv",
        "releves.csv",
        "rappels.csv",
        "categories.csv",
    }
    fuel = _parse(files["pleins.csv"])
    assert len(fuel) == len(ref.FUEL)
    assert tuple(fuel[0]) == FUEL_COLUMNS
    assert fuel[0] == {
        "vehicle_id": "ref", "vehicle_name": "Référence", "id": "f1",
        "date": "2026-01-05", "time": "", "odometer_km": "10000", "volume": "40",
        "volume_unit": "L", "unit_price": "1.8", "total_cost": "72",
        "fuel_type": "gasoline", "grade": "", "full_tank": "true", "station": "",
        "notes": "",
    }  # fmt: skip
    assert fuel[2]["full_tank"] == "false"

    expenses = _parse(files["depenses.csv"])
    assert tuple(expenses[0]) == EXPENSE_COLUMNS
    assert len(expenses) == len(ref.EXPENSES) + 1
    by_id = {e["id"]: e for e in expenses}
    assert by_id["e2"]["category_name"] == "Péage"
    # Séparateur, guillemets et retour à la ligne correctement échappés.
    assert by_id["e9"]["category_name"] == "Lavage; intérieur"
    assert by_id["e9"]["description"] == 'Aspirateur "pro"\nligne 2'

    assert _parse(files["releves.csv"])[0]["odometer_km"] == "12400"
    reminder = _parse(files["rappels.csv"])[0]
    assert tuple(reminder) == REMINDER_COLUMNS
    assert reminder["interval_distance_km"] == "15000"
    assert reminder["due_date"] == ""
    assert reminder["active"] == "true"
    assert {c["id"] for c in _parse(files["categories.csv"])} >= {"other", "wash"}


def test_empty_export_has_headers() -> None:
    files = build_export(LogData(), {})
    assert files["pleins.csv"] == ";".join(FUEL_COLUMNS) + "\n"


def test_number_formatting() -> None:
    text = to_csv(["a", "b", "c"], [{"a": 1.85, "b": 0.1 + 0.2, "c": 12345678.0}])
    assert text.splitlines()[1] == "1.85;0.3;12345678"
