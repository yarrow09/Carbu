"""Import CSV : aller-retour avec l'export, tableur, doublons, erreurs."""

from dataclasses import replace
import datetime as dt

import pytest

from custom_components.vehicle_log.core.csv_import import (
    ImportFileError,
    ImportKind,
    LineStatus,
    apply_import,
    decode,
    preview_import,
)
from custom_components.vehicle_log.core.export import build_export
from custom_components.vehicle_log.core.models import (
    Category,
    FuelType,
    OdometerReading,
    Reminder,
    ReminderKind,
)
from custom_components.vehicle_log.core.repository import LogData

from . import reference_dataset as ref

G = FuelType.GASOLINE


def _source() -> LogData:
    data = LogData()
    for fill in ref.FUEL:
        data.records("ref").fuel.add(replace(fill))
    for expense in ref.EXPENSES:
        data.add_expense("ref", replace(expense))
    data.records("ref").odometer.add(
        OdometerReading(id="o1", date=dt.date(2026, 3, 24), odometer=12400)
    )
    data.records("ref").reminders.add(
        Reminder(
            id="r1",
            label="Vidange",
            kind=ReminderKind.BOTH,
            due_date=dt.date(2027, 1, 1),
            due_odometer=15000,
            interval_distance=15000,
        )
    )
    return data


def _import(text: str, target: LogData, vehicle: str = "new") -> int:
    preview = preview_import(
        text, target.records(vehicle), target.categories, default_fuel=G
    )
    return apply_import(preview, target, vehicle)


def test_export_then_import_is_lossless() -> None:
    """Critère d'acceptation : réimport sans perte de ce qui a été exporté."""
    source = _source()
    files = build_export(source, {"ref": ref.VEHICLE})
    target = LogData()
    for name in ("pleins.csv", "depenses.csv", "releves.csv", "rappels.csv"):
        # Passage par des octets UTF-8 avec BOM, comme le fichier écrit.
        _import(decode(files[name].encode("utf-8-sig")), target, "ref")
    assert target.records("ref").to_dict() == source.records("ref").to_dict()


def test_reimport_detects_duplicates() -> None:
    source = _source()
    files = build_export(source, {"ref": ref.VEHICLE})
    preview = preview_import(
        files["pleins.csv"], source.records("ref"), source.categories, default_fuel=G
    )
    assert preview.kind is ImportKind.FUEL
    assert preview.count(LineStatus.DUPLICATE) == 6
    assert apply_import(preview, source, "ref") == 0


def test_spreadsheet_variant() -> None:
    """Fichier réenregistré par un tableur : Windows-1252, JJ/MM/AAAA, virgules."""
    text = (
        "date;odometer_km;volume;total_cost;full_tank;station\r\n"
        "05/01/2026;10 000;40,5;72,90;oui;Total Énergies\r\n"
        "20/01/2026;1.234,5;36;66,6;non;\r\n"
    )
    content = decode(text.encode("cp1252"))
    target = LogData()
    preview = preview_import(
        content, target.records("v"), target.categories, default_fuel=FuelType.DIESEL
    )
    first, second = (line.record for line in preview.lines)
    assert first.date == dt.date(2026, 1, 5)
    assert first.odometer == 10000
    assert first.volume == 40.5
    assert first.unit_price == pytest.approx(1.8)
    assert first.full_tank is True
    assert first.station == "Total Énergies"
    assert first.fuel_type is FuelType.DIESEL  # carburant par défaut du véhicule
    assert second.odometer == 1234.5
    assert second.full_tank is False


def test_comma_separated_and_natural_key_duplicates() -> None:
    target = LogData()
    target.records("v").odometer.add(
        OdometerReading(id="x", date=dt.date(2026, 2, 1), odometer=500)
    )
    text = "date,odometer_km\n2026-02-01,500\n2026-02-02,600\n2026-02-02,600\n"
    preview = preview_import(
        text, target.records("v"), target.categories, default_fuel=G
    )
    assert preview.kind is ImportKind.ODOMETER
    assert [line.status for line in preview.lines] == [
        LineStatus.DUPLICATE,  # déjà présent (même date et kilométrage)
        LineStatus.NEW,
        LineStatus.DUPLICATE,  # répété dans le fichier
    ]


def test_errors_are_reported_per_line() -> None:
    text = (
        "date;odometer_km;volume;total_cost;fuel_type\n"
        "2026-01-05;1000;40;72;gasoline\n"
        "pas une date;1000;40;72;\n"
        "2026-01-07;;40;72;\n"
        "2026-01-08;1100;40;;\n"
        "2026-01-09;1200;40;72;kerosene\n"
        "2026-01-10;-5;40;72;\n"
    )
    target = LogData()
    preview = preview_import(
        text, target.records("v"), target.categories, default_fuel=G
    )
    statuses = [(line.line, line.status) for line in preview.lines]
    assert statuses == [
        (2, LineStatus.NEW),
        (3, LineStatus.ERROR),
        (4, LineStatus.ERROR),
        (5, LineStatus.ERROR),  # une seule valeur parmi quantité / prix / montant
        (6, LineStatus.ERROR),
        (7, LineStatus.ERROR),
    ]
    assert preview.lines[2].message == "odometer_km manquant"
    assert apply_import(preview, target, "v") == 1


def test_expense_categories_resolution() -> None:
    target = LogData()
    target.add_category(Category(id="wash", name="Lavage"))
    text = (
        "date;amount;category_id;category_name;description\n"
        "2026-01-01;10;toll;;\n"  # identifiant connu
        "2026-01-02;11;;lavage;\n"  # nom connu (insensible à la casse)
        "2026-01-03;12;;Péage;\n"  # libellé traduit d'une catégorie par défaut
        "2026-01-04;13;xyz;Accessoires;\n"  # inconnue : créée
        "2026-01-05;14;;Accessoires;\n"  # même catégorie créée une seule fois
        "2026-01-06;15;;;Sans catégorie\n"  # → autre
    )
    preview = preview_import(
        text,
        target.records("v"),
        target.categories,
        default_fuel=G,
        category_labels={"toll": "Péage"},
    )
    ids = [line.record.category_id for line in preview.lines]
    (created,) = preview.new_categories.values()
    assert created.name == "Accessoires"
    assert ids == ["toll", "wash", "toll", created.id, created.id, "other"]
    assert created.id not in target.categories  # rien d'écrit avant application
    assert apply_import(preview, target, "v") == 6
    assert target.categories[created.id].name == "Accessoires"


def test_reminder_import_validation() -> None:
    text = (
        "label;kind;due_date;due_odometer_km;active\n"
        "CT;date;2027-03-01;;true\n"
        "Pneus;distance;;;true\n"
        ";date;2027-01-01;;\n"
        "Courroie;sometimes;;;\n"
    )
    target = LogData()
    preview = preview_import(
        text, target.records("v"), target.categories, default_fuel=G
    )
    assert preview.kind is ImportKind.REMINDERS
    assert [line.status for line in preview.lines] == [
        LineStatus.NEW,
        LineStatus.ERROR,
        LineStatus.ERROR,
        LineStatus.ERROR,
    ]


@pytest.mark.parametrize(
    ("text", "reason"),
    [("", "empty"), ("foo;bar\n1;2\n", "unknown_format")],
)
def test_unusable_files(text: str, reason: str) -> None:
    target = LogData()
    with pytest.raises(ImportFileError, match=reason):
        preview_import(text, target.records("v"), target.categories, default_fuel=G)


def test_blank_lines_are_ignored_and_multiline_fields_kept() -> None:
    text = 'date;amount;description\n\n2026-01-01;5;"ligne 1\nligne 2"\n;;\n'
    target = LogData()
    preview = preview_import(
        text, target.records("v"), target.categories, default_fuel=G
    )
    (line,) = preview.lines
    assert line.record.description == "ligne 1\nligne 2"
