"""Données en mémoire et opérations CRUD (Python pur).

``LogData`` détient l'ensemble des enregistrements. Il ne connaît pas la
persistance : la couche ``storage`` le sérialise via ``to_dict`` après chaque
modification.
"""

from __future__ import annotations

from bisect import insort
from collections.abc import Callable, Iterator
from dataclasses import dataclass, field, replace
from typing import Any, Protocol

from .models import (
    CATEGORY_OTHER,
    DEFAULT_CATEGORIES,
    Category,
    Expense,
    FuelEntry,
    OdometerReading,
    Reminder,
)


class RecordNotFoundError(LookupError):
    """Enregistrement introuvable."""


class CategoryError(ValueError):
    """Opération invalide sur une catégorie."""


class _Record(Protocol):
    id: str

    def to_dict(self) -> dict[str, Any]: ...


class _Collection[T: _Record]:
    """Liste d'enregistrements maintenue triée, avec index par identifiant."""

    def __init__(
        self, items: list[T] | None = None, key: Callable[[T], Any] | None = None
    ) -> None:
        self._key = key
        self._items: list[T] = list(items or [])
        if key is not None:
            self._items.sort(key=key)
        self._by_id: dict[str, T] = {item.id: item for item in self._items}

    def __iter__(self) -> Iterator[T]:
        return iter(self._items)

    def __len__(self) -> int:
        return len(self._items)

    @property
    def items(self) -> list[T]:
        """Éléments triés (ne pas modifier la liste retournée)."""
        return self._items

    def get(self, item_id: str) -> T:
        try:
            return self._by_id[item_id]
        except KeyError as err:
            raise RecordNotFoundError(item_id) from err

    def add(self, item: T) -> T:
        if item.id in self._by_id:
            raise ValueError(f"Identifiant déjà utilisé : {item.id}")
        if self._key is None:
            self._items.append(item)
        else:
            insort(self._items, item, key=self._key)
        self._by_id[item.id] = item
        return item

    def update(self, item: T) -> T:
        old = self.get(item.id)
        self._items.remove(old)
        del self._by_id[old.id]
        return self.add(item)

    def delete(self, item_id: str) -> T:
        item = self.get(item_id)
        self._items.remove(item)
        del self._by_id[item_id]
        return item

    def to_list(self) -> list[dict[str, Any]]:
        return [item.to_dict() for item in self._items]


def _fuel_key(entry: FuelEntry) -> Any:
    return entry.sort_key()


def _expense_key(expense: Expense) -> Any:
    return expense.sort_key()


def _odometer_key(reading: OdometerReading) -> Any:
    return reading.sort_key()


@dataclass(slots=True)
class VehicleRecords:
    """Enregistrements d'un véhicule."""

    fuel: _Collection[FuelEntry] = field(
        default_factory=lambda: _Collection(key=_fuel_key)
    )
    expenses: _Collection[Expense] = field(
        default_factory=lambda: _Collection(key=_expense_key)
    )
    odometer: _Collection[OdometerReading] = field(
        default_factory=lambda: _Collection(key=_odometer_key)
    )
    reminders: _Collection[Reminder] = field(default_factory=_Collection)

    def to_dict(self) -> dict[str, Any]:
        """Sérialiser."""
        return {
            "fuel": self.fuel.to_list(),
            "expenses": self.expenses.to_list(),
            "odometer": self.odometer.to_list(),
            "reminders": self.reminders.to_list(),
        }

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> VehicleRecords:
        """Désérialiser."""
        return cls(
            fuel=_Collection(
                [FuelEntry.from_dict(d) for d in data.get("fuel", [])], _fuel_key
            ),
            expenses=_Collection(
                [Expense.from_dict(d) for d in data.get("expenses", [])],
                _expense_key,
            ),
            odometer=_Collection(
                [OdometerReading.from_dict(d) for d in data.get("odometer", [])],
                _odometer_key,
            ),
            reminders=_Collection(
                [Reminder.from_dict(d) for d in data.get("reminders", [])]
            ),
        )


class LogData:
    """Ensemble des données du carnet de bord."""

    def __init__(
        self,
        categories: dict[str, Category] | None = None,
        vehicles: dict[str, VehicleRecords] | None = None,
    ) -> None:
        """Initialiser.

        Sans catégories fournies (premier démarrage), les catégories par
        défaut sont créées. La catégorie « autre » existe toujours.
        """
        if categories is None:
            categories = {c.id: replace(c) for c in DEFAULT_CATEGORIES}
        self.categories: dict[str, Category] = dict(categories)
        if CATEGORY_OTHER not in self.categories:
            other = next(c for c in DEFAULT_CATEGORIES if c.id == CATEGORY_OTHER)
            self.categories[CATEGORY_OTHER] = replace(other)
        self.vehicles: dict[str, VehicleRecords] = dict(vehicles or {})

    # --- Sérialisation -------------------------------------------------

    def to_dict(self) -> dict[str, Any]:
        """Sérialiser l'ensemble des données."""
        return {
            "categories": [c.to_dict() for c in self.categories.values()],
            "vehicles": {vid: rec.to_dict() for vid, rec in self.vehicles.items()},
        }

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> LogData:
        """Désérialiser l'ensemble des données."""
        categories: dict[str, Category] | None = None
        if "categories" in data:
            loaded = (Category.from_dict(c) for c in data["categories"])
            categories = {c.id: c for c in loaded}
        return cls(
            categories=categories,
            vehicles={
                vid: VehicleRecords.from_dict(rec)
                for vid, rec in data.get("vehicles", {}).items()
            },
        )

    # --- Véhicules -----------------------------------------------------

    def records(self, vehicle_id: str) -> VehicleRecords:
        """Enregistrements d'un véhicule (créés à la demande)."""
        return self.vehicles.setdefault(vehicle_id, VehicleRecords())

    def remove_vehicle(self, vehicle_id: str) -> None:
        """Supprimer toutes les données d'un véhicule."""
        self.vehicles.pop(vehicle_id, None)

    # --- Dépenses (contrôle de catégorie) -------------------------------

    def _check_category(self, category_id: str) -> None:
        if category_id not in self.categories:
            raise CategoryError(f"Catégorie inconnue : {category_id}")

    def add_expense(self, vehicle_id: str, expense: Expense) -> Expense:
        """Ajouter une dépense."""
        self._check_category(expense.category_id)
        return self.records(vehicle_id).expenses.add(expense)

    def update_expense(self, vehicle_id: str, expense: Expense) -> Expense:
        """Modifier une dépense."""
        self._check_category(expense.category_id)
        return self.records(vehicle_id).expenses.update(expense)

    # --- Catégories ----------------------------------------------------

    def add_category(self, category: Category) -> Category:
        """Créer une catégorie personnalisée."""
        if category.id in self.categories:
            raise CategoryError(f"Catégorie déjà existante : {category.id}")
        if not category.name:
            raise CategoryError("Une catégorie personnalisée doit avoir un nom")
        category.builtin = False
        self.categories[category.id] = category
        return category

    def update_category(
        self,
        category_id: str,
        *,
        name: str | None = None,
        color: str | None = None,
        icon: str | None = None,
    ) -> Category:
        """Renommer une catégorie ou changer sa couleur / son icône."""
        try:
            category = self.categories[category_id]
        except KeyError as err:
            raise RecordNotFoundError(category_id) from err
        if name is not None:
            name = name.strip()
            if not name and not category.builtin:
                raise CategoryError("Une catégorie personnalisée doit avoir un nom")
            # Nom vide sur une catégorie par défaut : retour au libellé traduit.
            category.name = name or None
        if color is not None:
            category.color = color
        if icon is not None:
            category.icon = icon
        return category

    def category_usage(self, category_id: str) -> int:
        """Nombre de dépenses (tous véhicules) utilisant la catégorie."""
        return sum(
            1
            for rec in self.vehicles.values()
            for expense in rec.expenses
            if expense.category_id == category_id
        )

    def delete_category(self, category_id: str) -> int:
        """Supprimer une catégorie et réassigner ses dépenses à « autre ».

        Retourne le nombre de dépenses réassignées. La demande de confirmation
        est à la charge de l'interface (voir ``category_usage``).
        """
        if category_id == CATEGORY_OTHER:
            raise CategoryError("La catégorie « autre » ne peut pas être supprimée")
        if category_id not in self.categories:
            raise RecordNotFoundError(category_id)
        moved = 0
        for rec in self.vehicles.values():
            for expense in rec.expenses:
                if expense.category_id == category_id:
                    expense.category_id = CATEGORY_OTHER
                    moved += 1
        del self.categories[category_id]
        return moved
