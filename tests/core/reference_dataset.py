"""Jeu de données de référence (voir docs/calculs.md pour le calcul manuel)."""

import datetime as dt

from custom_components.carbu.core.models import (
    Expense,
    FuelEntry,
    FuelType,
    Vehicle,
)

VEHICLE = Vehicle(
    id="ref",
    name="Référence",
    fuel_type=FuelType.GASOLINE,
    tank_capacity=50,
    acquisition_date=dt.date(2026, 1, 1),
)


def _fill(
    fid: str,
    day: dt.date,
    km: float,
    liters: float,
    price: float,
    total: float,
    full: bool,
) -> FuelEntry:
    return FuelEntry(
        id=fid,
        date=day,
        odometer=km,
        volume=liters,
        unit_price=price,
        total_cost=total,
        fuel_type=FuelType.GASOLINE,
        full_tank=full,
    )


FUEL = [
    _fill("f1", dt.date(2026, 1, 5), 10000, 40.00, 1.800, 72.00, True),
    _fill("f2", dt.date(2026, 1, 20), 10600, 36.00, 1.850, 66.60, True),
    _fill("f3", dt.date(2026, 2, 3), 10900, 15.00, 1.900, 28.50, False),
    _fill("f4", dt.date(2026, 2, 15), 11400, 22.50, 1.800, 40.50, True),
    _fill("f5", dt.date(2026, 3, 1), 12000, 42.00, 1.750, 73.50, True),
    _fill("f6", dt.date(2026, 3, 20), 12300, 20.00, 1.800, 36.00, False),
]

EXPENSES = [
    Expense(
        id="e1", date=dt.date(2026, 1, 10), amount=120.00, category_id="maintenance"
    ),
    Expense(id="e2", date=dt.date(2026, 2, 12), amount=15.40, category_id="toll"),
    Expense(id="e3", date=dt.date(2026, 2, 25), amount=4.60, category_id="parking"),
    Expense(id="e4", date=dt.date(2026, 3, 5), amount=300.00, category_id="insurance"),
    Expense(id="e5", date=dt.date(2026, 3, 15), amount=8.00, category_id="toll"),
]

# Résultats attendus, calculés à la main (docs/calculs.md).
EXPECTED_SEGMENTS = [
    ("f1", "f2", 600, 36.0, 6.0, 66.60),
    ("f2", "f4", 800, 37.5, 4.6875, 69.00),
    ("f4", "f5", 600, 42.0, 7.0, 73.50),
]
EXPECTED_AVERAGE_L100 = 5.775
EXPECTED_KM_PER_L = 17.316017
EXPECTED_MPG_US = 40.729870
EXPECTED_MPG_UK = 48.914459
EXPECTED_CURRENT_ODOMETER = 12300
EXPECTED_TOTAL_DISTANCE = 2300
EXPECTED_DISTANCE_JAN = 857.142857
EXPECTED_DISTANCE_FEB = 1142.857143
EXPECTED_DISTANCE_MAR = 300
EXPECTED_FUEL_COST = 317.10
EXPECTED_EXPENSE_COST = 448.00
EXPECTED_COST_PER_KM = 0.332652
EXPECTED_MONTHLY = {
    "2026-01": {"fuel": 138.60, "maintenance": 120.00},
    "2026-02": {"fuel": 69.00, "toll": 15.40, "parking": 4.60},
    "2026-03": {"fuel": 109.50, "toll": 8.00, "insurance": 300.00},
}
