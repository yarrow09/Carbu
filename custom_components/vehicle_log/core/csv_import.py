"""Import CSV dans un véhicule : aperçu puis application (Python pur).

Fichiers acceptés : ceux de l'export (``pleins.csv``, ``depenses.csv``,
``releves.csv``, ``rappels.csv``), y compris après passage dans un tableur.
Le type est reconnu d'après les colonnes. Tolérances :

* encodage UTF-8 (avec ou sans BOM) ou Windows-1252 ;
* séparateur « ; » (ou « , » si le fichier n'en contient pas) ;
* dates ``AAAA-MM-JJ`` ou ``JJ/MM/AAAA`` ; décimales avec point ou virgule ;
* booléens ``true/false``, ``1/0``, ``oui/non``, ``vrai/faux``, ``yes/no``.

Les valeurs sont en unités métriques (km, L ; kg pour le GNV), comme l'export.
Une ligne déjà présente (même identifiant, ou mêmes valeurs clés) est un
doublon et n'est pas importée. Rien n'est modifié avant ``apply_import``.
"""

from __future__ import annotations

from collections.abc import Callable, Mapping
import csv
from dataclasses import dataclass, field
import datetime as dt
from enum import StrEnum
import io
from typing import Any

from .models import (
    CATEGORY_OTHER,
    Category,
    Expense,
    FuelEntry,
    FuelType,
    OdometerReading,
    Reminder,
    ReminderKind,
    new_id,
)
from .repository import LogData, VehicleRecords
from .validation import complete_fill_amounts

MAX_ROWS = 20000


class ImportKind(StrEnum):
    """Type de fichier importé."""

    FUEL = "fuel"
    EXPENSES = "expenses"
    ODOMETER = "odometer"
    REMINDERS = "reminders"


class LineStatus(StrEnum):
    """Sort d'une ligne."""

    NEW = "new"
    DUPLICATE = "duplicate"
    ERROR = "error"


class ImportFileError(ValueError):
    """Fichier inutilisable dans son ensemble."""


@dataclass(slots=True)
class ImportLine:
    """Ligne analysée (``line`` : numéro dans le fichier, en-tête = 1)."""

    line: int
    status: LineStatus
    record: Any = None
    message: str | None = None


@dataclass(slots=True)
class ImportPreview:
    """Résultat de l'analyse, sans effet sur les données."""

    kind: ImportKind
    lines: list[ImportLine]
    new_categories: dict[str, Category] = field(default_factory=dict)

    def count(self, status: LineStatus) -> int:
        """Nombre de lignes dans un état donné."""
        return sum(1 for line in self.lines if line.status is status)


# --- Lecture des valeurs -------------------------------------------------------


def decode(raw: bytes) -> str:
    """Texte du fichier (UTF-8, sinon Windows-1252)."""
    try:
        return raw.decode("utf-8-sig")
    except UnicodeDecodeError:
        return raw.decode("cp1252")


def _date(value: str) -> dt.date:
    value = value.strip()
    if "/" in value:
        day, month, year = value.split("/")
        return dt.date(int(year), int(month), int(day))
    return dt.date.fromisoformat(value[:10])


def _time(value: str) -> dt.time | None:
    value = value.strip()
    return dt.time.fromisoformat(value) if value else None


def _number(value: str) -> float | None:
    cleaned = value.strip().replace(" ", "").replace(" ", "")
    if not cleaned:
        return None
    if "," in cleaned and "." in cleaned:
        # Le dernier séparateur est la virgule décimale ; l'autre groupe les milliers.
        if cleaned.rfind(",") > cleaned.rfind("."):
            cleaned = cleaned.replace(".", "").replace(",", ".")
        else:
            cleaned = cleaned.replace(",", "")
    elif "," in cleaned:
        cleaned = cleaned.replace(",", ".")
    return float(cleaned)


def _required_number(row: Mapping[str, str], key: str) -> float:
    value = _number(row.get(key, ""))
    if value is None:
        raise ValueError(f"{key} manquant")
    if value < 0:
        raise ValueError(f"{key} négatif")
    return value


def _int(value: str) -> int | None:
    number = _number(value)
    return int(number) if number is not None else None


def _bool(value: str, default: bool) -> bool:
    text = value.strip().casefold()
    if not text:
        return default
    if text in {"true", "1", "oui", "vrai", "yes", "o", "y"}:
        return True
    if text in {"false", "0", "non", "faux", "no", "n"}:
        return False
    raise ValueError(f"booléen invalide : {value}")


def detect_kind(columns: list[str]) -> ImportKind:
    """Type de fichier d'après ses colonnes."""
    names = set(columns)
    if {"volume", "odometer_km"} <= names:
        return ImportKind.FUEL
    if "amount" in names:
        return ImportKind.EXPENSES
    if {"label", "kind"} <= names:
        return ImportKind.REMINDERS
    if {"date", "odometer_km"} <= names:
        return ImportKind.ODOMETER
    raise ImportFileError("unknown_format")


def _rows(text: str) -> tuple[list[str], list[tuple[int, dict[str, str]]]]:
    first = text.split("\n", 1)[0]
    delimiter = ";" if ";" in first or "," not in first else ","
    reader = csv.DictReader(io.StringIO(text, newline=""), delimiter=delimiter)
    columns = [c.strip() for c in reader.fieldnames or []]
    if not columns:
        raise ImportFileError("empty")
    reader.fieldnames = columns
    rows: list[tuple[int, dict[str, str]]] = []
    for row in reader:
        if not any((v or "").strip() for v in row.values() if isinstance(v, str)):
            continue
        if len(rows) >= MAX_ROWS:
            raise ImportFileError("too_many_rows")
        # line_num : dernière ligne physique lue (gère les champs multilignes)
        rows.append(
            (reader.line_num, {k: (v or "") for k, v in row.items() if k is not None})
        )
    return columns, rows


# --- Construction des enregistrements ---------------------------------------


def _fuel(row: Mapping[str, str], default_fuel: FuelType) -> FuelEntry:
    volume, price, total = complete_fill_amounts(
        _number(row.get("volume", "")),
        _number(row.get("unit_price", "")),
        _number(row.get("total_cost", "")),
    )
    fuel = row.get("fuel_type", "").strip()
    return FuelEntry(
        id=row.get("id", "").strip() or new_id(),
        date=_date(row["date"]),
        time=_time(row.get("time", "")),
        odometer=_required_number(row, "odometer_km"),
        volume=volume,
        unit_price=price,
        total_cost=total,
        fuel_type=FuelType(fuel) if fuel else default_fuel,
        full_tank=_bool(row.get("full_tank", ""), True),
        station=row.get("station", "").strip() or None,
        notes=row.get("notes", ""),
    )


def _odometer(row: Mapping[str, str]) -> OdometerReading:
    return OdometerReading(
        id=row.get("id", "").strip() or new_id(),
        date=_date(row["date"]),
        time=_time(row.get("time", "")),
        odometer=_required_number(row, "odometer_km"),
    )


def _reminder(row: Mapping[str, str]) -> Reminder:
    label = row.get("label", "").strip()
    if not label:
        raise ValueError("libellé manquant")
    kind = ReminderKind(row["kind"].strip())
    due = row.get("due_date", "").strip()
    reminder = Reminder(
        id=row.get("id", "").strip() or new_id(),
        label=label,
        kind=kind,
        due_date=_date(due) if due else None,
        due_odometer=_number(row.get("due_odometer_km", "")),
        alert_days=_int(row.get("alert_days", "")),
        alert_distance=_number(row.get("alert_distance_km", "")),
        interval_days=_int(row.get("interval_days", "")),
        interval_distance=_number(row.get("interval_distance_km", "")),
        active=_bool(row.get("active", ""), True),
        last_done_date=(
            _date(row["last_done_date"])
            if row.get("last_done_date", "").strip()
            else None
        ),
        last_done_odometer=_number(row.get("last_done_odometer_km", "")),
    )
    if reminder.uses_date and reminder.due_date is None:
        raise ValueError("date d'échéance manquante")
    if reminder.uses_distance and reminder.due_odometer is None:
        raise ValueError("kilométrage d'échéance manquant")
    return reminder


class _CategoryResolver:
    """Catégorie d'une dépense : identifiant, sinon nom, sinon création."""

    def __init__(self, categories: Mapping[str, Category], labels: Mapping[str, str]):
        self._ids = set(categories)
        self._by_name = {
            (cat.name or labels.get(cid, cid)).casefold(): cid
            for cid, cat in categories.items()
        }
        self.created: dict[str, Category] = {}

    def resolve(self, category_id: str, name: str) -> str:
        if category_id in self._ids:
            return category_id
        key = name.strip().casefold()
        if not key:
            return CATEGORY_OTHER
        if key in self._by_name:
            return self._by_name[key]
        if key not in self.created:
            self.created[key] = Category(name=name.strip())
        return self.created[key].id


# --- Aperçu et application ---------------------------------------------------


def _round(value: float | None, digits: int) -> float | None:
    return round(value, digits) if value is not None else None


_KEYS: dict[ImportKind, Callable[[Any], tuple[Any, ...]]] = {
    ImportKind.FUEL: lambda e: (e.date, _round(e.odometer, 1), _round(e.volume, 2)),
    ImportKind.EXPENSES: lambda e: (
        e.date,
        _round(e.amount, 2),
        e.category_id,
        e.description.strip().casefold(),
    ),
    ImportKind.ODOMETER: lambda e: (e.date, _round(e.odometer, 1)),
    ImportKind.REMINDERS: lambda e: (e.label.casefold(), e.kind),
}


def _existing(kind: ImportKind, records: VehicleRecords) -> list[Any]:
    if kind is ImportKind.FUEL:
        return list(records.fuel)
    if kind is ImportKind.EXPENSES:
        return list(records.expenses)
    if kind is ImportKind.ODOMETER:
        return list(records.odometer)
    return list(records.reminders)


def preview_import(
    text: str,
    records: VehicleRecords,
    categories: Mapping[str, Category],
    *,
    default_fuel: FuelType,
    category_labels: Mapping[str, str] | None = None,
) -> ImportPreview:
    """Analyser un fichier sans rien modifier."""
    columns, rows = _rows(text)
    kind = detect_kind(columns)
    resolver = _CategoryResolver(categories, category_labels or {})
    existing = _existing(kind, records)
    seen_ids = {item.id for item in existing}
    key = _KEYS[kind]
    seen_keys = {key(item) for item in existing}

    lines: list[ImportLine] = []
    for number, row in rows:
        try:
            record: Any
            if kind is ImportKind.FUEL:
                record = _fuel(row, default_fuel)
            elif kind is ImportKind.ODOMETER:
                record = _odometer(row)
            elif kind is ImportKind.REMINDERS:
                record = _reminder(row)
            else:
                amount = _required_number(row, "amount")
                odometer = _number(row.get("odometer_km", ""))
                record = Expense(
                    id=row.get("id", "").strip() or new_id(),
                    date=_date(row["date"]),
                    odometer=odometer,
                    amount=amount,
                    category_id=resolver.resolve(
                        row.get("category_id", "").strip(),
                        row.get("category_name", ""),
                    ),
                    description=row.get("description", "").strip(),
                    attachment=None,
                )
        except (KeyError, ValueError) as err:
            message = (
                f"{err.args[0]} manquant" if isinstance(err, KeyError) else str(err)
            )
            lines.append(ImportLine(number, LineStatus.ERROR, message=message))
            continue
        if record.id in seen_ids or key(record) in seen_keys:
            lines.append(ImportLine(number, LineStatus.DUPLICATE, record=record))
            continue
        seen_ids.add(record.id)
        seen_keys.add(key(record))
        lines.append(ImportLine(number, LineStatus.NEW, record=record))

    used = {
        line.record.category_id
        for line in lines
        if line.status is LineStatus.NEW and kind is ImportKind.EXPENSES
    }
    new_categories = {
        cat.id: cat for cat in resolver.created.values() if cat.id in used
    }
    return ImportPreview(kind=kind, lines=lines, new_categories=new_categories)


def apply_import(preview: ImportPreview, data: LogData, vehicle_id: str) -> int:
    """Écrire les nouvelles lignes de l'aperçu ; retourne leur nombre."""
    for category in preview.new_categories.values():
        if category.id not in data.categories:
            data.add_category(category)
    records = data.records(vehicle_id)
    added = 0
    for line in preview.lines:
        if line.status is not LineStatus.NEW:
            continue
        if preview.kind is ImportKind.FUEL:
            records.fuel.add(line.record)
        elif preview.kind is ImportKind.EXPENSES:
            data.add_expense(vehicle_id, line.record)
        elif preview.kind is ImportKind.ODOMETER:
            records.odometer.add(line.record)
        else:
            records.reminders.add(line.record)
        added += 1
    return added
