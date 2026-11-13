"""Calcul de la consommation réelle (Python pur).

Règles (voir ``docs/calculs.md``) :

* la consommation se calcule entre deux pleins complets d'un même carburant ;
* les litres des pleins partiels intermédiaires s'ajoutent, le plein complet
  initial est exclu, le plein complet final est inclus ;
* un plein partiel avant le premier plein complet, ou après le dernier, ne
  produit aucun segment ;
* un kilométrage décroissant rompt la série : le segment en cours est abandonné
  et l'entrée devient, si elle est complète, le nouveau point de départ ;
* un segment de distance nulle ou négative est ignoré (pas de division par 0) ;
* la moyenne est pondérée : Σ litres ÷ Σ km × 100, et non la moyenne des
  segments.
"""

from __future__ import annotations

from collections.abc import Iterable
from dataclasses import dataclass

from .models import FuelEntry, FuelType


@dataclass(frozen=True, slots=True)
class ConsumptionSegment:
    """Consommation mesurée entre deux pleins complets."""

    start_id: str
    end_id: str
    fuel_type: FuelType
    distance: float
    volume: float
    cost: float

    @property
    def l_per_100km(self) -> float:
        """Consommation du segment en l/100 km."""
        return self.volume / self.distance * 100


def consumption_segments(
    entries: Iterable[FuelEntry], fuel_type: FuelType | None = None
) -> list[ConsumptionSegment]:
    """Calculer les segments de consommation.

    ``entries`` doit être trié chronologiquement. Si ``fuel_type`` est donné,
    seules les entrées de ce carburant sont prises en compte ; sinon chaque
    carburant est traité séparément et les segments sont concaténés.
    """
    entries = list(entries)
    if fuel_type is None:
        fuels = dict.fromkeys(e.fuel_type for e in entries)
        return [seg for fuel in fuels for seg in consumption_segments(entries, fuel)]

    segments: list[ConsumptionSegment] = []
    start: FuelEntry | None = None
    previous: FuelEntry | None = None
    volume = 0.0
    cost = 0.0
    for entry in entries:
        if entry.fuel_type != fuel_type:
            continue
        if previous is not None and entry.odometer < previous.odometer:
            start, volume, cost = None, 0.0, 0.0  # rupture de série
        previous = entry
        if not entry.full_tank:
            if start is not None:
                volume += entry.volume
                cost += entry.total_cost
            continue
        if start is not None:
            distance = entry.odometer - start.odometer
            if distance > 0:
                segments.append(
                    ConsumptionSegment(
                        start_id=start.id,
                        end_id=entry.id,
                        fuel_type=fuel_type,
                        distance=distance,
                        volume=volume + entry.volume,
                        cost=cost + entry.total_cost,
                    )
                )
        start, volume, cost = entry, 0.0, 0.0
    return segments


def average_consumption(segments: Iterable[ConsumptionSegment]) -> float | None:
    """Consommation moyenne pondérée en l/100 km (``None`` sans donnée)."""
    total_volume = 0.0
    total_distance = 0.0
    for seg in segments:
        total_volume += seg.volume
        total_distance += seg.distance
    if total_distance <= 0:
        return None
    return total_volume / total_distance * 100


@dataclass(frozen=True, slots=True)
class FillMetrics:
    """Indicateurs propres à un plein.

    ``distance`` : distance depuis le plein précédent (tous carburants) ;
    ``consumption`` : consommation en l/100 km du segment qui se termine à ce
    plein complet (``None`` pour un plein partiel ou sans plein complet avant).
    """

    distance: float | None
    consumption: float | None


def fill_metrics(entries: Iterable[FuelEntry]) -> dict[str, FillMetrics]:
    """Distance et consommation de chaque plein (``entries`` triés)."""
    entries = list(entries)
    by_end = {seg.end_id: seg.l_per_100km for seg in consumption_segments(entries)}
    result: dict[str, FillMetrics] = {}
    previous: FuelEntry | None = None
    for entry in entries:
        distance = None
        if previous is not None and entry.odometer > previous.odometer:
            distance = entry.odometer - previous.odometer
        result[entry.id] = FillMetrics(distance, by_end.get(entry.id))
        previous = entry
    return result
