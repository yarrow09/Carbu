"""Constantes de l'intégration Vehicle Log."""

from typing import Final

DOMAIN: Final = "vehicle_log"

# Stockage (.storage/vehicle_log.data)
STORAGE_KEY: Final = f"{DOMAIN}.data"
STORAGE_VERSION: Final = 1
STORAGE_MINOR_VERSION: Final = 1
STORAGE_SAVE_DELAY: Final = 5  # secondes

# Type de subentry représentant un véhicule
SUBENTRY_TYPE_VEHICLE: Final = "vehicle"
