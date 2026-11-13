"""Sérialisation des modèles."""

from datetime import date, time

from custom_components.vehicle_log.core.models import (
    Category,
    ConsumptionUnit,
    DistanceUnit,
    Expense,
    FuelEntry,
    FuelType,
    OdometerReading,
    Reminder,
    ReminderKind,
    Vehicle,
    VolumeUnit,
)


def test_vehicle_roundtrip_and_bifuel() -> None:
    vehicle = Vehicle(
        id="v1",
        name="Clio",
        make="Renault",
        model="Clio IV",
        fuel_type=FuelType.GASOLINE,
        secondary_fuel_type=FuelType.LPG,
        tank_capacity=45,
        secondary_tank_capacity=32,
        distance_unit=DistanceUnit.MILES,
        volume_unit=VolumeUnit.GALLONS_UK,
        consumption_unit=ConsumptionUnit.MPG_UK,
        acquisition_date=date(2020, 5, 1),
    )
    restored = Vehicle.from_dict("v1", vehicle.to_dict())
    assert restored == vehicle
    assert restored.is_bifuel
    assert restored.fuel_types == (FuelType.GASOLINE, FuelType.LPG)
    assert restored.tank_capacity_for(FuelType.LPG) == 32
    assert restored.tank_capacity_for(FuelType.DIESEL) is None


def test_vehicle_defaults_from_minimal_dict() -> None:
    vehicle = Vehicle.from_dict("v1", {"name": "Twingo"})
    assert vehicle.fuel_type is FuelType.GASOLINE
    assert not vehicle.is_bifuel
    assert vehicle.plate is None
    assert vehicle.consumption_unit is ConsumptionUnit.L_PER_100KM


def test_fuel_entry_roundtrip() -> None:
    entry = FuelEntry(
        date=date(2026, 1, 2),
        time=time(8, 30),
        odometer=12345.6,
        volume=40.5,
        unit_price=1.799,
        total_cost=72.86,
        fuel_type=FuelType.DIESEL,
        full_tank=False,
        station="Total",
        notes="autoroute",
    )
    assert FuelEntry.from_dict(entry.to_dict()) == entry


def test_other_models_roundtrip() -> None:
    expense = Expense(
        date=date(2026, 3, 1), amount=89.9, category_id="maintenance", odometer=None
    )
    reading = OdometerReading(date=date(2026, 3, 2), odometer=15000)
    category = Category(name="Lavage", color="#00ff00", icon="mdi:car-wash")
    reminder = Reminder(
        label="Vidange",
        kind=ReminderKind.BOTH,
        due_date=date(2027, 1, 1),
        due_odometer=30000,
        alert_days=30,
        alert_distance=1000,
    )
    assert Expense.from_dict(expense.to_dict()) == expense
    assert OdometerReading.from_dict(reading.to_dict()) == reading
    assert Category.from_dict(category.to_dict()) == category
    assert Reminder.from_dict(reminder.to_dict()) == reminder


def test_ids_are_unique() -> None:
    ids = {Category(name="x").id for _ in range(100)}
    assert len(ids) == 100
