"""Dépenses récurrentes : création des échéances arrivées (Python pur).

Chaque échéance passée ou du jour devient une dépense ordinaire, datée de
l'échéance : les statistiques, l'export et le journal la traitent comme une
saisie manuelle. Une dépense créée garde le lien ``recurring_id`` ; la
supprimer ne la recrée pas (``last_date`` a déjà avancé).
"""

from __future__ import annotations

from collections.abc import Iterable
import datetime as dt

from .models import Expense, RecurringExpense
from .repository import LogData

# Garde-fou : une date de début très ancienne ne crée pas des milliers de lignes
# d'un coup. Au-delà de 60 échéances par récurrence, la suite est créée aux
# passages suivants (toutes les heures).
MAX_CATCH_UP = 60


def due_expenses(item: RecurringExpense, today: dt.date) -> list[Expense]:
    """Dépenses à créer pour les échéances arrivées, et avancer ``last_date``."""
    created: list[Expense] = []
    while len(created) < MAX_CATCH_UP:
        day = item.next_date()
        if day is None or day > today:
            break
        created.append(
            Expense(
                date=day,
                amount=item.amount,
                category_id=item.category_id,
                description=item.label,
                recurring_id=item.id,
            )
        )
        item.last_date = day
    return created


def generate_due(
    data: LogData, today: dt.date, vehicle_ids: Iterable[str] | None = None
) -> int:
    """Créer les dépenses des échéances arrivées ; nombre créé.

    ``vehicle_ids`` limite la création aux véhicules indiqués (véhicules
    configurés : les données d'un véhicule supprimé ne bougent plus).
    """
    count = 0
    wanted = set(data.vehicles if vehicle_ids is None else vehicle_ids)
    for vehicle_id in wanted & data.vehicles.keys():
        for item in data.vehicles[vehicle_id].recurring:
            for expense in due_expenses(item, today):
                data.add_expense(vehicle_id, expense)
                count += 1
    return count


def monthly_amount(item: RecurringExpense) -> float:
    """Équivalent mensuel d'une dépense récurrente."""
    return item.amount / item.interval_months
