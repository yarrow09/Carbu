"""Services publics de Carbu.

``add_fuel``, ``add_expense``, ``update_odometer`` et ``export_data``.

Les valeurs sont exprimées dans les unités du véhicule, choisi par son
appareil Home Assistant. Une automatisation ne pouvant pas confirmer, les
avertissements de cohérence n'empêchent pas l'enregistrement (ils sont
journalisés et renvoyés) sauf avec ``strict: true``.
"""

from __future__ import annotations

import datetime as dt
import logging
from pathlib import Path
from typing import Any, cast

from homeassistant.core import (
    HomeAssistant,
    ServiceCall,
    ServiceResponse,
    SupportsResponse,
    callback,
)
from homeassistant.exceptions import ServiceValidationError
from homeassistant.helpers import config_validation as cv, device_registry as dr
from homeassistant.helpers.service import async_register_admin_service
import probatio as vol

from .const import DOMAIN, MAX_LONG_TEXT, MAX_SHORT_TEXT
from .coordinator import SaveResult, VehicleLogCoordinator, local_now
from .core.export import build_export
from .core.models import FuelGrade, FuelType
from .core.repository import CategoryError
from .core.validation import CoherenceWarning

_LOGGER = logging.getLogger(__name__)

SERVICE_ADD_FUEL = "add_fuel"
SERVICE_ADD_EXPENSE = "add_expense"
SERVICE_UPDATE_ODOMETER = "update_odometer"
SERVICE_EXPORT_DATA = "export_data"
SERVICE_BACKUP = "backup"

ATTR_VEHICLE = "vehicle"
ATTR_STRICT = "strict"

_POSITIVE = vol.All(vol.Coerce(float), vol.Range(min=0))

ADD_FUEL_SCHEMA = vol.Schema(
    {
        vol.Required(ATTR_VEHICLE): cv.string,
        vol.Required("odometer"): _POSITIVE,
        vol.Optional("volume"): _POSITIVE,
        vol.Optional("unit_price"): _POSITIVE,
        vol.Optional("total_cost"): _POSITIVE,
        vol.Optional("date"): cv.date,
        vol.Optional("time"): cv.time,
        vol.Optional("fuel_type"): vol.In([f.value for f in FuelType]),
        vol.Optional("grade"): vol.In([g.value for g in FuelGrade]),
        vol.Optional("full_tank", default=True): cv.boolean,
        vol.Optional("station"): vol.All(cv.string, vol.Length(max=MAX_SHORT_TEXT)),
        vol.Optional("notes", default=""): vol.All(
            cv.string, vol.Length(max=MAX_LONG_TEXT)
        ),
        vol.Optional(ATTR_STRICT, default=False): cv.boolean,
    }
)
ADD_EXPENSE_SCHEMA = vol.Schema(
    {
        vol.Required(ATTR_VEHICLE): cv.string,
        vol.Required("amount"): _POSITIVE,
        vol.Required("category"): cv.string,
        vol.Optional("date"): cv.date,
        vol.Optional("odometer"): _POSITIVE,
        vol.Optional("description", default=""): vol.All(
            cv.string, vol.Length(max=MAX_LONG_TEXT)
        ),
    }
)
UPDATE_ODOMETER_SCHEMA = vol.Schema(
    {
        vol.Required(ATTR_VEHICLE): cv.string,
        vol.Required("odometer"): _POSITIVE,
        vol.Optional(ATTR_STRICT, default=False): cv.boolean,
    }
)
EXPORT_SCHEMA = vol.Schema({})
BACKUP_SCHEMA = vol.Schema({})


def _coordinator(hass: HomeAssistant) -> VehicleLogCoordinator:
    entries = hass.config_entries.async_loaded_entries(DOMAIN)
    if not entries:
        raise ServiceValidationError(
            translation_domain=DOMAIN, translation_key="not_loaded"
        )
    coordinator: VehicleLogCoordinator = entries[0].runtime_data.coordinator
    return coordinator


def _vehicle_id(
    hass: HomeAssistant, coordinator: VehicleLogCoordinator, ref: str
) -> str:
    """Identifiant du véhicule à partir de l'appareil (ou de l'identifiant)."""
    if ref in coordinator.vehicles:
        return ref
    device = dr.async_get(hass).async_get(ref)
    if device is not None:
        for domain, identifier in device.identifiers:
            if domain == DOMAIN and identifier in coordinator.vehicles:
                return identifier
    raise ServiceValidationError(
        translation_domain=DOMAIN,
        translation_key="vehicle_not_found",
        translation_placeholders={"vehicle": ref},
    )


def _invalid(err: Exception) -> ServiceValidationError:
    return ServiceValidationError(
        translation_domain=DOMAIN,
        translation_key="invalid_input",
        translation_placeholders={"error": str(err)},
    )


def _check_strict(
    outcome: SaveResult[Any], strict: bool, label: str
) -> list[dict[str, Any]]:
    warnings: list[CoherenceWarning] = outcome.warnings
    if not warnings:
        return []
    codes = ", ".join(w.code.value for w in warnings)
    if strict and not outcome.saved:
        raise ServiceValidationError(
            translation_domain=DOMAIN,
            translation_key="coherence_warnings",
            translation_placeholders={"warnings": codes},
        )
    _LOGGER.warning("%s enregistré malgré les avertissements : %s", label, codes)
    return [{"code": w.code.value, "details": dict(w.details)} for w in warnings]


async def _add_fuel(call: ServiceCall) -> ServiceResponse:
    """Service ``add_fuel``."""
    hass = call.hass
    coordinator = _coordinator(hass)
    vehicle_id = _vehicle_id(hass, coordinator, call.data[ATTR_VEHICLE])
    data = {k: v for k, v in call.data.items() if k not in (ATTR_VEHICLE, ATTR_STRICT)}
    strict = call.data[ATTR_STRICT]
    try:
        outcome = coordinator.async_save_fuel(
            vehicle_id, data, save_with_warnings=not strict
        )
    except ValueError as err:
        raise _invalid(err) from err
    warnings = _check_strict(outcome, strict, "Plein")
    units = coordinator.units(vehicle_id)
    return cast(
        ServiceResponse,
        {
            "saved": outcome.saved,
            "warnings": warnings,
            "entry": units.fuel_entry_view(outcome.record),
        },
    )


async def _add_expense(call: ServiceCall) -> ServiceResponse:
    """Service ``add_expense``."""
    from .config_flow import async_category_labels  # noqa: PLC0415

    hass = call.hass
    coordinator = _coordinator(hass)
    vehicle_id = _vehicle_id(hass, coordinator, call.data[ATTR_VEHICLE])
    wanted = call.data["category"].strip()
    labels = await async_category_labels(hass)
    categories = coordinator.storage.data.categories
    category_id = next(
        (
            cid
            for cid, cat in categories.items()
            if wanted.casefold()
            in {cid.casefold(), (cat.name or labels.get(cid, cid)).casefold()}
        ),
        None,
    )
    if category_id is None:
        raise ServiceValidationError(
            translation_domain=DOMAIN,
            translation_key="unknown_category",
            translation_placeholders={"category": wanted},
        )
    data = {k: v for k, v in call.data.items() if k not in (ATTR_VEHICLE, "category")}
    data["category_id"] = category_id
    try:
        expense = coordinator.async_save_expense(vehicle_id, data)
    except (ValueError, CategoryError) as err:
        raise _invalid(err) from err
    return cast(
        ServiceResponse,
        {"expense": coordinator.units(vehicle_id).expense_view(expense)},
    )


async def _update_odometer(call: ServiceCall) -> ServiceResponse:
    """Service ``update_odometer``."""
    hass = call.hass
    coordinator = _coordinator(hass)
    vehicle_id = _vehicle_id(hass, coordinator, call.data[ATTR_VEHICLE])
    strict = call.data[ATTR_STRICT]
    try:
        outcome = coordinator.async_save_odometer(
            vehicle_id, call.data["odometer"], save_with_warnings=not strict
        )
    except ValueError as err:
        raise _invalid(err) from err
    warnings = _check_strict(outcome, strict, "Relevé")
    return cast(ServiceResponse, {"saved": outcome.saved, "warnings": warnings})


async def _export_data(call: ServiceCall) -> ServiceResponse:
    """Service ``export_data``."""
    from .config_flow import async_category_labels  # noqa: PLC0415

    hass = call.hass
    coordinator = _coordinator(hass)
    files = build_export(
        coordinator.storage.data,
        coordinator.vehicles,
        await async_category_labels(hass),
    )
    stamp = export_timestamp(local_now())
    folder = Path(hass.config.path(DOMAIN, "exports", stamp))

    def _write() -> list[str]:
        folder.mkdir(parents=True, exist_ok=True)
        written = []
        for name, content in files.items():
            target = folder / name
            target.write_text(content, encoding="utf-8-sig", newline="")
            written.append(str(target))
        return written

    written = await hass.async_add_executor_job(_write)
    _LOGGER.info("Export Carbu écrit dans %s", folder)
    return cast(ServiceResponse, {"folder": str(folder), "files": written})


async def _backup(call: ServiceCall) -> ServiceResponse:
    """Service ``backup`` : sauvegarde complète (archive ZIP)."""
    from .backup_archive import async_create_backup  # noqa: PLC0415

    hass = call.hass
    _coordinator(hass)  # contrôle : intégration chargée
    entry = hass.config_entries.async_loaded_entries(DOMAIN)[0]
    path = await async_create_backup(hass, entry)
    _LOGGER.info("Sauvegarde Carbu créée : %s", path)
    return cast(ServiceResponse, {"path": str(path)})


@callback
def async_register_services(hass: HomeAssistant) -> None:
    """Enregistrer les services du domaine."""
    for name, handler, schema in (
        (SERVICE_ADD_FUEL, _add_fuel, ADD_FUEL_SCHEMA),
        (SERVICE_ADD_EXPENSE, _add_expense, ADD_EXPENSE_SCHEMA),
        (SERVICE_UPDATE_ODOMETER, _update_odometer, UPDATE_ODOMETER_SCHEMA),
    ):
        hass.services.async_register(
            DOMAIN, name, handler, schema, supports_response=SupportsResponse.OPTIONAL
        )
    # Écrivent des fichiers dans le dossier de configuration : réservés aux
    # administrateurs (les automatisations restent autorisées).
    for name, handler, schema in (
        (SERVICE_EXPORT_DATA, _export_data, EXPORT_SCHEMA),
        (SERVICE_BACKUP, _backup, BACKUP_SCHEMA),
    ):
        async_register_admin_service(
            hass,
            DOMAIN,
            name,
            handler,
            schema,
            supports_response=SupportsResponse.OPTIONAL,
        )


def export_timestamp(now: dt.datetime) -> str:
    """Nom du dossier d'export pour un instant donné."""
    return now.strftime("%Y%m%d-%H%M%S")
