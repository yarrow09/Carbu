# Calculs de référence

Les calculs sont dans `custom_components/vehicle_log/core/`, en Python pur.
Ils sont vérifiés par `tests/core/test_reference.py` sur le jeu ci-dessous, dont
les résultats ont été calculés à la main.

## Formules

| Grandeur | Formule | Module |
|---|---|---|
| Consommation d'un segment | litres entre deux pleins complets ÷ km × 100 | `consumption.py` |
| Consommation moyenne | Σ litres des segments ÷ Σ km des segments × 100 (pondérée) | `consumption.py` |
| km/l | 100 ÷ (l/100 km) | `units.py` |
| MPG US / UK | 235,215 / 282,481 ÷ (l/100 km) | `units.py` |
| Miles | km ÷ 1,609344 | `units.py` |
| Gallon US / UK | 3,785411784 L / 4,54609 L | `units.py` |
| Coût par distance | Σ montants de la période ÷ distance de la période | `costs.py` |
| TCO | (pleins + dépenses + amortissement) ÷ distance ; ÷ mois pour le coût mensuel | `costs.py` |
| Mois | jours ÷ (365,25 ÷ 12) | `costs.py` |

### Règles du segment de consommation

* Un segment va d'un plein **complet** au plein **complet** suivant du même
  carburant.
* Les litres des pleins partiels intermédiaires s'ajoutent. Le plein complet
  initial est exclu et le plein complet final est inclus.
* Un plein partiel situé avant le premier plein complet, ou après le dernier,
  ne produit aucun segment.
* Un kilométrage décroissant rompt la série. L'entrée fautive devient le nouveau
  départ si c'est un plein complet.
* Une distance nulle ou négative ne produit pas de segment, ce qui évite toute
  division par zéro.
* **Bi-carburant** : chaque carburant a sa propre série. Limite connue : la
  distance d'un segment GPL inclut les km parcourus à l'essence. La
  consommation par carburant est donc sous-estimée.

### Distance par période

Les relevés de compteur viennent des pleins, des dépenses qui portent un
kilométrage et des relevés manuels, triés chronologiquement. La distance d'une
période `[début, fin[` est la somme des progressions **positives** entre
relevés consécutifs. Une progression à cheval sur une borne est répartie au
prorata du temps (interpolation linéaire, heure 00:00 si non renseignée). Une
baisse du compteur ne retire jamais de distance.

### Saisie d'un plein

Deux valeurs parmi volume, prix unitaire et montant suffisent. La troisième
est calculée : prix arrondi à 3 décimales, montant à 2 décimales, volume à
2 décimales. Si les trois sont saisies, elles sont conservées, et un écart
supérieur à 0,05 entre volume × prix et le montant déclenche un
avertissement.

### Contrôles de cohérence (avertissements, pas de refus)

* Kilométrage inférieur au relevé précédent, ou supérieur au relevé suivant
  (saisie antidatée).
* Consommation du segment fermé par ce plein hors de la plage du véhicule
  (3 à 20 l/100 km par défaut).
* Volume supérieur à la capacité du réservoir de ce carburant.
* Carburant non déclaré pour le véhicule.
* Montant incohérent avec volume × prix.

## Jeu de données de référence

Véhicule essence, réservoir de 50 L, acquis le 01/01/2026.

| # | Date | Km | Litres | Prix €/L | Montant € | Type |
|---|---|---|---|---|---|---|
| 1 | 05/01/2026 | 10 000 | 40,00 | 1,800 | 72,00 | complet |
| 2 | 20/01/2026 | 10 600 | 36,00 | 1,850 | 66,60 | complet |
| 3 | 03/02/2026 | 10 900 | 15,00 | 1,900 | 28,50 | partiel |
| 4 | 15/02/2026 | 11 400 | 22,50 | 1,800 | 40,50 | complet |
| 5 | 01/03/2026 | 12 000 | 42,00 | 1,750 | 73,50 | complet |
| 6 | 20/03/2026 | 12 300 | 20,00 | 1,800 | 36,00 | partiel |

| Date | Catégorie | Montant € |
|---|---|---|
| 10/01/2026 | entretien | 120,00 |
| 12/02/2026 | péage | 15,40 |
| 25/02/2026 | stationnement | 4,60 |
| 05/03/2026 | assurance | 300,00 |
| 15/03/2026 | péage | 8,00 |

### Résultats attendus (calcul manuel)

**Segments de consommation**

| Segment | Calcul | l/100 km | Coût € |
|---|---|---|---|
| A : #1 → #2 | 36,00 ÷ (10 600 − 10 000) × 100 | **6,00** | 66,60 |
| B : #2 → #4 | (15,00 + 22,50) ÷ (11 400 − 10 600) × 100 = 37,5 ÷ 800 × 100 | **4,6875** | 28,50 + 40,50 = 69,00 |
| C : #4 → #5 | 42,00 ÷ (12 000 − 11 400) × 100 | **7,00** | 73,50 |

* Le plein #1 est exclu : c'est le premier plein complet.
* Le plein #6 est un partiel en dernière position. Il est en attente et ne
  compte pas.

**Moyenne** : (36 + 37,5 + 42) ÷ (600 + 800 + 600) × 100 = 115,5 ÷ 2 000 × 100 =
**5,775 l/100 km**. La moyenne simple des segments serait (6 + 4,6875 + 7) ÷ 3 =
5,8958, valeur volontairement **non** retenue.

Conversions de la moyenne :

* 100 ÷ 5,775 = **17,316017 km/l**
* 235,215 ÷ 5,775 = **40,729870 MPG US**
* 282,481 ÷ 5,775 = **48,914459 MPG UK**

**Kilométrage**

* Kilométrage actuel : **12 300 km**.
* Distance totale : 12 300 − 10 000 = **2 300 km**.
* Distance de janvier :
  * #1 → #2 : 600 km, entièrement en janvier.
  * #2 → #3 : 300 km sur 14 jours, dont 12 jours en janvier, soit 300 × 12 ÷ 14 = 257,142857 km.
  * Total : **857,142857 km**.
* Distance de février :
  * #2 → #3 : 300 × 2 ÷ 14 = 42,857143 km.
  * #3 → #4 : 500 km.
  * #4 → #5 : 600 km (se termine le 01/03 à 00:00, borne exclue).
  * Total : **1 142,857143 km**.
* Distance de mars : #5 → #6, **300 km**.
* Vérification : 857,142857 + 1 142,857143 + 300 = 2 300.

**Coûts**

* Carburant : 72 + 66,60 + 28,50 + 40,50 + 73,50 + 36 = **317,10 €**
* Dépenses : 120 + 15,40 + 4,60 + 300 + 8 = **448,00 €**
* Coût par km : 765,10 ÷ 2 300 = **0,332652 €/km**

**Regroupement mensuel (histogramme)**

| Mois | carburant | entretien | péage | stationnement | assurance |
|---|---|---|---|---|---|
| 2026-01 | 138,60 | 120,00 | | | |
| 2026-02 | 69,00 | | 15,40 | 4,60 | |
| 2026-03 | 109,50 | | 8,00 | | 300,00 |

**TCO** (avec amortissement : achat 15 000 €, valeur estimée 13 000 €, du
01/01/2026 au 01/04/2026, soit 90 jours)

* Total : 317,10 + 448,00 + 2 000 = 2 765,10 €
* Par km : 2 765,10 ÷ 2 300 = **1,202217 €/km**
* Nombre de mois : 90 ÷ 30,4375 = 2,956879
* Par mois : 2 765,10 ÷ 2,956879 = **935,141458 €/mois**
