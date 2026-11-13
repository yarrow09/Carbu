"""Modèle de données de Carbu (Python pur).

Toutes les grandeurs sont stockées en unités de référence :

* distances et kilométrages en kilomètres ;
* quantités de carburant en litres (en kilogrammes pour le GNV) ;
* montants dans la devise configurée dans Home Assistant.

La conversion vers les unités choisies pour un véhicule se fait uniquement à
la saisie et à l'affichage.
"""

from __future__ import annotations

from dataclasses import dataclass, field
import datetime as dt
from enum import StrEnum
from typing import Any
import uuid


def new_id() -> str:
    """Retourner un nouvel identifiant unique."""
    return uuid.uuid4().hex


class FuelType(StrEnum):
    """Type de carburant."""

    GASOLINE = "gasoline"
    DIESEL = "diesel"
    LPG = "lpg"
    CNG = "cng"


class DistanceUnit(StrEnum):
    """Unité de distance d'affichage."""

    KILOMETERS = "km"
    MILES = "mi"


class VolumeUnit(StrEnum):
    """Unité de volume d'affichage (ignorée pour le GNV, toujours en kg)."""

    LITERS = "l"
    GALLONS_US = "gal_us"
    GALLONS_UK = "gal_uk"


class ConsumptionUnit(StrEnum):
    """Unité de consommation d'affichage."""

    L_PER_100KM = "l_100km"
    KM_PER_L = "km_l"
    MPG_US = "mpg_us"
    MPG_UK = "mpg_uk"


class ReminderKind(StrEnum):
    """Critère de déclenchement d'un rappel."""

    DATE = "date"
    DISTANCE = "distance"
    BOTH = "both"


def _date(value: str | None) -> dt.date | None:
    return dt.date.fromisoformat(value) if value else None


def _time(value: str | None) -> dt.time | None:
    return dt.time.fromisoformat(value) if value else None


def _iso(value: dt.date | dt.time | None) -> str | None:
    return value.isoformat() if value is not None else None


def _opt_float(value: Any) -> float | None:
    return float(value) if value is not None else None


@dataclass(slots=True, kw_only=True)
class Vehicle:
    """Véhicule (configuration stockée dans le subentry Home Assistant)."""

    id: str
    name: str
    make: str = ""
    model: str = ""
    plate: str | None = None
    fuel_type: FuelType = FuelType.GASOLINE
    secondary_fuel_type: FuelType | None = None
    tank_capacity: float | None = None
    secondary_tank_capacity: float | None = None
    distance_unit: DistanceUnit = DistanceUnit.KILOMETERS
    volume_unit: VolumeUnit = VolumeUnit.LITERS
    consumption_unit: ConsumptionUnit = ConsumptionUnit.L_PER_100KM
    acquisition_date: dt.date | None = None
    consumption_min: float = 3.0
    consumption_max: float = 20.0

    @property
    def is_bifuel(self) -> bool:
        """Indiquer si le véhicule est bi-carburant."""
        return self.secondary_fuel_type is not None

    @property
    def fuel_types(self) -> tuple[FuelType, ...]:
        """Carburants acceptés par le véhicule."""
        if self.secondary_fuel_type is None:
            return (self.fuel_type,)
        return (self.fuel_type, self.secondary_fuel_type)

    def tank_capacity_for(self, fuel: FuelType) -> float | None:
        """Capacité du réservoir associé au carburant donné."""
        if fuel == self.fuel_type:
            return self.tank_capacity
        if fuel == self.secondary_fuel_type:
            return self.secondary_tank_capacity
        return None

    def to_dict(self) -> dict[str, Any]:
        """Sérialiser (sans l'identifiant, porté par le subentry)."""
        return {
            "name": self.name,
            "make": self.make,
            "model": self.model,
            "plate": self.plate,
            "fuel_type": self.fuel_type.value,
            "secondary_fuel_type": (
                self.secondary_fuel_type.value if self.secondary_fuel_type else None
            ),
            "tank_capacity": self.tank_capacity,
            "secondary_tank_capacity": self.secondary_tank_capacity,
            "distance_unit": self.distance_unit.value,
            "volume_unit": self.volume_unit.value,
            "consumption_unit": self.consumption_unit.value,
            "acquisition_date": _iso(self.acquisition_date),
            "consumption_min": self.consumption_min,
            "consumption_max": self.consumption_max,
        }

    @classmethod
    def from_dict(cls, vehicle_id: str, data: dict[str, Any]) -> Vehicle:
        """Désérialiser."""
        secondary = data.get("secondary_fuel_type")
        return cls(
            id=vehicle_id,
            name=data["name"],
            make=data.get("make", ""),
            model=data.get("model", ""),
            plate=data.get("plate") or None,
            fuel_type=FuelType(data.get("fuel_type", FuelType.GASOLINE)),
            secondary_fuel_type=FuelType(secondary) if secondary else None,
            tank_capacity=_opt_float(data.get("tank_capacity")),
            secondary_tank_capacity=_opt_float(data.get("secondary_tank_capacity")),
            distance_unit=DistanceUnit(data.get("distance_unit", "km")),
            volume_unit=VolumeUnit(data.get("volume_unit", "l")),
            consumption_unit=ConsumptionUnit(data.get("consumption_unit", "l_100km")),
            acquisition_date=_date(data.get("acquisition_date")),
            consumption_min=float(data.get("consumption_min", 3.0)),
            consumption_max=float(data.get("consumption_max", 20.0)),
        )


@dataclass(slots=True, kw_only=True)
class FuelEntry:
    """Plein de carburant."""

    id: str = field(default_factory=new_id)
    date: dt.date
    time: dt.time | None = None
    odometer: float
    volume: float
    unit_price: float
    total_cost: float
    fuel_type: FuelType
    full_tank: bool = True
    station: str | None = None
    notes: str = ""

    def sort_key(self) -> tuple[dt.date, dt.time, float]:
        """Clé de tri chronologique."""
        return (self.date, self.time or dt.time.min, self.odometer)

    def to_dict(self) -> dict[str, Any]:
        """Sérialiser."""
        return {
            "id": self.id,
            "date": self.date.isoformat(),
            "time": _iso(self.time),
            "odometer": self.odometer,
            "volume": self.volume,
            "unit_price": self.unit_price,
            "total_cost": self.total_cost,
            "fuel_type": self.fuel_type.value,
            "full_tank": self.full_tank,
            "station": self.station,
            "notes": self.notes,
        }

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> FuelEntry:
        """Désérialiser."""
        return cls(
            id=data["id"],
            date=dt.date.fromisoformat(data["date"]),
            time=_time(data.get("time")),
            odometer=float(data["odometer"]),
            volume=float(data["volume"]),
            unit_price=float(data["unit_price"]),
            total_cost=float(data["total_cost"]),
            fuel_type=FuelType(data["fuel_type"]),
            full_tank=bool(data.get("full_tank", True)),
            station=data.get("station"),
            notes=data.get("notes", ""),
        )


@dataclass(slots=True, kw_only=True)
class Expense:
    """Dépense hors carburant."""

    id: str = field(default_factory=new_id)
    date: dt.date
    odometer: float | None = None
    amount: float
    category_id: str
    description: str = ""
    attachment: str | None = None

    def sort_key(self) -> tuple[dt.date, float]:
        """Clé de tri chronologique."""
        return (self.date, self.odometer or 0.0)

    def to_dict(self) -> dict[str, Any]:
        """Sérialiser."""
        return {
            "id": self.id,
            "date": self.date.isoformat(),
            "odometer": self.odometer,
            "amount": self.amount,
            "category_id": self.category_id,
            "description": self.description,
            "attachment": self.attachment,
        }

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> Expense:
        """Désérialiser."""
        return cls(
            id=data["id"],
            date=dt.date.fromisoformat(data["date"]),
            odometer=_opt_float(data.get("odometer")),
            amount=float(data["amount"]),
            category_id=data["category_id"],
            description=data.get("description", ""),
            attachment=data.get("attachment"),
        )


@dataclass(slots=True, kw_only=True)
class OdometerReading:
    """Relevé manuel du compteur (hors pleins et dépenses)."""

    id: str = field(default_factory=new_id)
    date: dt.date
    time: dt.time | None = None
    odometer: float

    def sort_key(self) -> tuple[dt.date, dt.time, float]:
        """Clé de tri chronologique."""
        return (self.date, self.time or dt.time.min, self.odometer)

    def to_dict(self) -> dict[str, Any]:
        """Sérialiser."""
        return {
            "id": self.id,
            "date": self.date.isoformat(),
            "time": _iso(self.time),
            "odometer": self.odometer,
        }

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> OdometerReading:
        """Désérialiser."""
        return cls(
            id=data["id"],
            date=dt.date.fromisoformat(data["date"]),
            time=_time(data.get("time")),
            odometer=float(data["odometer"]),
        )


@dataclass(slots=True, kw_only=True)
class Category:
    """Catégorie de dépense.

    Pour une catégorie par défaut non renommée, ``name`` vaut ``None`` et le
    libellé affiché provient des traductions (clé = ``id``).
    """

    id: str = field(default_factory=new_id)
    name: str | None = None
    color: str | None = None
    icon: str | None = None
    builtin: bool = False

    def to_dict(self) -> dict[str, Any]:
        """Sérialiser."""
        return {
            "id": self.id,
            "name": self.name,
            "color": self.color,
            "icon": self.icon,
            "builtin": self.builtin,
        }

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> Category:
        """Désérialiser."""
        return cls(
            id=data["id"],
            name=data.get("name"),
            color=data.get("color"),
            icon=data.get("icon"),
            builtin=bool(data.get("builtin", False)),
        )


CATEGORY_OTHER = "other"

DEFAULT_CATEGORIES: tuple[Category, ...] = (
    Category(id="maintenance", color="#1e88e5", icon="mdi:wrench", builtin=True),
    Category(id="insurance", color="#8e24aa", icon="mdi:shield-car", builtin=True),
    Category(id="parking", color="#00897b", icon="mdi:parking", builtin=True),
    Category(id="toll", color="#f4511e", icon="mdi:highway", builtin=True),
    Category(
        id="inspection", color="#3949ab", icon="mdi:clipboard-check", builtin=True
    ),
    Category(id="repair", color="#e53935", icon="mdi:car-wrench", builtin=True),
    Category(
        id=CATEGORY_OTHER, color="#757575", icon="mdi:dots-horizontal", builtin=True
    ),
)


class NotificationStage(StrEnum):
    """Notification déjà envoyée pour l'échéance en cours."""

    ALERT = "alert"
    DUE = "due"


@dataclass(slots=True, kw_only=True)
class Reminder:
    """Rappel d'entretien ou d'échéance administrative.

    Déclenché au premier critère atteint (date ou kilométrage). Avec une
    récurrence (``interval_days`` / ``interval_distance``), le marquer comme
    fait calcule l'échéance suivante ; sans récurrence, il devient inactif.
    """

    id: str = field(default_factory=new_id)
    label: str
    kind: ReminderKind
    due_date: dt.date | None = None
    due_odometer: float | None = None
    alert_days: int | None = None
    alert_distance: float | None = None
    interval_days: int | None = None
    interval_distance: float | None = None
    active: bool = True
    last_done_date: dt.date | None = None
    last_done_odometer: float | None = None
    notified: list[NotificationStage] = field(default_factory=list)

    @property
    def uses_date(self) -> bool:
        """Indique si le rappel a un critère de date."""
        return self.kind in (ReminderKind.DATE, ReminderKind.BOTH)

    @property
    def uses_distance(self) -> bool:
        """Indique si le rappel a un critère de kilométrage."""
        return self.kind in (ReminderKind.DISTANCE, ReminderKind.BOTH)

    @property
    def is_recurring(self) -> bool:
        """Indique si le rappel se renouvelle après avoir été fait."""
        return bool(
            (self.uses_date and self.interval_days)
            or (self.uses_distance and self.interval_distance)
        )

    def to_dict(self) -> dict[str, Any]:
        """Sérialiser."""
        return {
            "id": self.id,
            "label": self.label,
            "kind": self.kind.value,
            "due_date": _iso(self.due_date),
            "due_odometer": self.due_odometer,
            "alert_days": self.alert_days,
            "alert_distance": self.alert_distance,
            "interval_days": self.interval_days,
            "interval_distance": self.interval_distance,
            "active": self.active,
            "last_done_date": _iso(self.last_done_date),
            "last_done_odometer": self.last_done_odometer,
            "notified": [stage.value for stage in self.notified],
        }

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> Reminder:
        """Désérialiser."""

        def _opt_int(key: str) -> int | None:
            value = data.get(key)
            return int(value) if value is not None else None

        return cls(
            id=data["id"],
            label=data["label"],
            kind=ReminderKind(data["kind"]),
            due_date=_date(data.get("due_date")),
            due_odometer=_opt_float(data.get("due_odometer")),
            alert_days=_opt_int("alert_days"),
            alert_distance=_opt_float(data.get("alert_distance")),
            interval_days=_opt_int("interval_days"),
            interval_distance=_opt_float(data.get("interval_distance")),
            active=bool(data.get("active", True)),
            last_done_date=_date(data.get("last_done_date")),
            last_done_odometer=_opt_float(data.get("last_done_odometer")),
            notified=[NotificationStage(v) for v in data.get("notified", [])],
        )
