"""Bilan carbone des pleins (Python pur).

Les émissions sont calculées à partir des quantités réellement achetées, et non
d'une consommation théorique : Σ quantité × facteur d'émission du carburant.

Facteurs de la Base Empreinte de l'ADEME (France continentale, éléments
« valide générique »), en kg CO2e par litre (par kg pour le GNV). Ils couvrent
la combustion et l'amont (extraction, raffinage, transport) : périmètre « du
puits à la roue ».

==========  ======================================  ===========  =========
Carburant   Élément ADEME                           Identifiant  Facteur
==========  ======================================  ===========  =========
Essence     Supercarburant sans plomb (95, E10, 98)  25763        2,69 / L
Gazole      Gazole routier B7                        25775        3,10 / L
GPL         GPL pour véhicule routier                14031        1,86 / L
GNV         GNC pour véhicule routier                27095        2,96 / kg
==========  ======================================  ===========  =========

L'ADEME donne le même facteur pour le SP95, le SP95-E10 et le SP98 : la qualité
d'essence ne change donc pas le bilan.
"""

from __future__ import annotations

from collections.abc import Iterable

from .models import FuelEntry, FuelType

EMISSION_FACTORS: dict[FuelType, float] = {
    FuelType.GASOLINE: 2.69,
    FuelType.DIESEL: 3.10,
    FuelType.LPG: 1.86,
    FuelType.CNG: 2.96,
}


def fill_emissions(entry: FuelEntry) -> float:
    """Émissions d'un plein en kg CO2e (quantité en litres, ou kg pour le GNV)."""
    return entry.volume * EMISSION_FACTORS[entry.fuel_type]


def total_emissions(entries: Iterable[FuelEntry]) -> float:
    """Émissions cumulées de plusieurs pleins, en kg CO2e."""
    return sum(fill_emissions(e) for e in entries)
