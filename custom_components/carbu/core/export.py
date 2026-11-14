"""Export CSV complet (Python pur).

Format (voir ``docs/format-export.md``) : un fichier par type de données,
séparateur « ; », point décimal, dates ISO 8601, unités métriques (km, L ; kg
pour le GNV), booléens ``true`` / ``false``, valeur vide pour « non renseigné ».
L'encodage (UTF-8 avec BOM) est appliqué à l'écriture du fichier.
"""

from __future__ import annotations

from collections.abc import Iterable, Mapping
import csv
import io
from typing import Any

from .models import Vehicle
from .repository import LogData

EXPORT_FORMAT_VERSION = 1
DELIMITER = ";"

FUEL_COLUMNS = (
    "vehicle_id", "vehicle_name", "id", "date", "time", "odometer_km",
    "volume", "volume_unit", "unit_price", "total_cost", "fuel_type",
    "grade", "full_tank", "station", "notes",
)  # fmt: skip
EXPENSE_COLUMNS = (
    "vehicle_id", "vehicle_name", "id", "date", "odometer_km", "amount",
    "category_id", "category_name", "description", "attachment",
)  # fmt: skip
ODOMETER_COLUMNS = ("vehicle_id", "vehicle_name", "id", "date", "time", "odometer_km")
REMINDER_COLUMNS = (
    "vehicle_id", "vehicle_name", "id", "label", "kind", "due_date",
    "due_odometer_km", "alert_days", "alert_distance_km", "interval_days",
    "interval_distance_km", "active", "last_done_date", "last_done_odometer_km",
)  # fmt: skip
CATEGORY_COLUMNS = ("id", "name", "color", "icon", "builtin")


def _cell(value: Any) -> str:
    if value is None:
        return ""
    if isinstance(value, bool):
        return "true" if value else "false"
    if isinstance(value, float):
        text = repr(round(value, 6))
        return text.removesuffix(".0")
    if hasattr(value, "isoformat"):
        return str(value.isoformat())
    return neutralize_formula(str(value))


# Premiers caractères qu'un tableur interprète comme une formule.
FORMULA_PREFIXES = ("=", "+", "-", "@", "\t", "\r")


def neutralize_formula(text: str) -> str:
    """Empêcher un tableur d'exécuter un texte saisi comme une formule.

    Une note « =HYPERLINK(...) » ouverte dans Excel ou LibreOffice serait
    évaluée : on la préfixe d'une apostrophe, retirée à l'import.
    """
    return f"'{text}" if text.startswith(FORMULA_PREFIXES) else text


def to_csv(columns: Iterable[str], rows: Iterable[Mapping[str, Any]]) -> str:
    """Produire le texte CSV (première ligne : noms de colonnes)."""
    columns = tuple(columns)
    buffer = io.StringIO()
    writer = csv.writer(buffer, delimiter=DELIMITER, lineterminator="\n")
    writer.writerow(columns)
    for row in rows:
        writer.writerow([_cell(row.get(col)) for col in columns])
    return buffer.getvalue()


def build_export(
    data: LogData,
    vehicles: Mapping[str, Vehicle],
    category_labels: Mapping[str, str] | None = None,
) -> dict[str, str]:
    """Contenu des fichiers ``{nom de fichier: texte CSV}``.

    Seuls les véhicules connus sont exportés.
    """
    labels = category_labels or {}
    fuel, expenses, odometer, reminders = [], [], [], []
    for vehicle_id, vehicle in vehicles.items():
        rec = data.records(vehicle_id)
        common = {"vehicle_id": vehicle_id, "vehicle_name": vehicle.name}
        for e in rec.fuel:
            fuel.append({
                **common, "id": e.id, "date": e.date, "time": e.time,
                "odometer_km": e.odometer, "volume": e.volume,
                "volume_unit": "kg" if e.fuel_type.value == "cng" else "L",
                "unit_price": e.unit_price, "total_cost": e.total_cost,
                "fuel_type": e.fuel_type.value,
                "grade": e.grade.value if e.grade else None,
                "full_tank": e.full_tank,
                "station": e.station, "notes": e.notes,
            })  # fmt: skip
        for x in rec.expenses:
            category = data.categories.get(x.category_id)
            expenses.append({
                **common, "id": x.id, "date": x.date, "odometer_km": x.odometer,
                "amount": x.amount, "category_id": x.category_id,
                "category_name": (category.name if category else None)
                or labels.get(x.category_id, x.category_id),
                "description": x.description, "attachment": x.attachment,
            })  # fmt: skip
        for r in rec.odometer:
            odometer.append({
                **common, "id": r.id, "date": r.date, "time": r.time,
                "odometer_km": r.odometer,
            })  # fmt: skip
        for m in rec.reminders:
            reminders.append({
                **common, "id": m.id, "label": m.label, "kind": m.kind.value,
                "due_date": m.due_date, "due_odometer_km": m.due_odometer,
                "alert_days": m.alert_days, "alert_distance_km": m.alert_distance,
                "interval_days": m.interval_days,
                "interval_distance_km": m.interval_distance, "active": m.active,
                "last_done_date": m.last_done_date,
                "last_done_odometer_km": m.last_done_odometer,
            })  # fmt: skip
    categories = [c.to_dict() for c in data.categories.values()]
    return {
        "pleins.csv": to_csv(FUEL_COLUMNS, fuel),
        "depenses.csv": to_csv(EXPENSE_COLUMNS, expenses),
        "releves.csv": to_csv(ODOMETER_COLUMNS, odometer),
        "rappels.csv": to_csv(REMINDER_COLUMNS, reminders),
        "categories.csv": to_csv(CATEGORY_COLUMNS, categories),
    }
