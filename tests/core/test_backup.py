"""Format de sauvegarde : aller-retour sans perte, validation, migration."""

from dataclasses import replace
import datetime as dt
import json

import pytest

from custom_components.carbu.core.backup import (
    InvalidBackupError,
    build_backup,
    parse_backup,
    summarize,
)
from custom_components.carbu.core.models import (
    Category,
    OdometerReading,
    Reminder,
    ReminderKind,
)
from custom_components.carbu.core.repository import LogData

from . import reference_dataset as ref

VEHICLE_DATA = ref.VEHICLE.to_dict()


def _data() -> LogData:
    data = LogData()
    # Copies : la suppression de catégorie modifie les dépenses en place.
    for fill in ref.FUEL:
        data.records("ref").fuel.add(replace(fill))
    for expense in ref.EXPENSES:
        data.add_expense("ref", replace(expense))
    data.add_category(Category(id="wash", name="Lavage", color="#00aaff"))
    data.delete_category("toll")  # catégorie par défaut supprimée : doit le rester
    data.records("ref").odometer.add(
        OdometerReading(id="o1", date=dt.date(2026, 3, 24), odometer=12400)
    )
    data.records("ref").reminders.add(
        Reminder(
            id="r1", label="Vidange", kind=ReminderKind.DISTANCE, due_odometer=15000
        )
    )
    data.records("ghost").fuel.add(replace(ref.FUEL[0]))  # véhicule supprimé : exclu
    return data


def _backup(data: LogData) -> dict:
    return build_backup(
        vehicles={"ref": ("Référence", VEHICLE_DATA)},
        options={"moving_average_window": 7},
        data=data,
        storage_version=(1, 2),
        created_at=dt.datetime(2026, 3, 25, 13, 0),
        integration_version="0.3.0",
    )


def test_roundtrip_is_lossless() -> None:
    data = _data()
    obj = json.loads(json.dumps(_backup(data)))  # passage par du vrai JSON
    content = parse_backup(obj, ["attachments/ref/e1.pdf", "attachments/ghost/x.png"])
    expected = data.to_dict()
    del expected["vehicles"]["ghost"]
    assert content.data.to_dict() == expected
    assert "toll" not in content.data.categories
    assert content.options == {"moving_average_window": 7}
    assert [(v.id, v.title, v.data) for v in content.vehicles] == [
        ("ref", "Référence", VEHICLE_DATA)
    ]
    assert content.attachments == ["attachments/ref/e1.pdf"]


def test_summary() -> None:
    content = parse_backup(_backup(_data()), ["attachments/ref/e1.pdf"])
    summary = summarize(content)
    assert summary["created_at"] == "2026-03-25T13:00:00"
    (vehicle,) = summary["vehicles"]
    assert vehicle == {
        "id": "ref",
        "name": "Référence",
        "fuel": 6,
        "expenses": 5,
        "odometer": 1,
        "reminders": 1,
        "attachments": 1,
    }


def test_older_storage_version_is_migrated() -> None:
    obj = _backup(LogData())
    obj["storage_version"] = [1, 1]
    obj["data"]["vehicles"] = {
        "ref": {"reminders": [{"id": "r1", "label": "CT", "kind": "date",
                               "due_date": "2027-01-01"}]}
    }  # fmt: skip
    content = parse_backup(obj)
    assert content.data.records("ref").reminders.get("r1").active


@pytest.mark.parametrize(
    ("mutate", "reason"),
    [
        (lambda o: o.update(format="autre"), "not_a_backup"),
        (lambda o: o.update(format_version=99), "unsupported_version"),
        (lambda o: o.update(storage_version=[9, 0]), "unsupported_version"),
        (lambda o: o["vehicles"][0].pop("data"), "corrupted"),
        (lambda o: o["vehicles"][0]["data"].update(fuel_type="kerosene"), "corrupted"),
        (lambda o: o["data"]["vehicles"]["ref"]["fuel"][0].pop("date"), "corrupted"),
    ],
)
def test_invalid_backups(mutate, reason: str) -> None:  # type: ignore[no-untyped-def]
    obj = json.loads(json.dumps(_backup(_data())))
    mutate(obj)
    with pytest.raises(InvalidBackupError, match=reason):
        parse_backup(obj)


def test_not_a_dict() -> None:
    with pytest.raises(InvalidBackupError):
        parse_backup([1, 2, 3])
