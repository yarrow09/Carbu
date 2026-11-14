# Calculs de référence

Les calculs sont dans `custom_components/carbu/core/`, en Python pur.
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

## Rappels

Module `core/reminders.py`.

* **Dû** dès que le **premier** critère est atteint : date du jour ≥ date d'échéance,
  ou kilométrage actuel ≥ kilométrage d'échéance. Un rappel « les deux » est donc dû
  à la date **ou** au kilométrage, selon ce qui arrive en premier.
* **Alerte** : pas encore dû, mais il reste au plus `alert_days` jours ou
  `alert_distance` km avant un critère.
* **Fait** : avec une récurrence, la prochaine échéance devient la date de réalisation
  + `interval_days` et/ou le kilométrage de réalisation + `interval_distance`. Sans
  récurrence, le rappel devient inactif.
* **Notifications** : une à l'alerte, une à l'échéance, jamais répétées pour la même
  échéance. Si l'échéance est atteinte sans alerte préalable, seule l'échéance est
  notifiée.

## Statistiques

Module `core/statistics.py`. Les périodes sont glissantes et se terminent aujourd'hui
inclus :

| Période | Premier jour |
|---|---|
| 30 jours | aujourd'hui − 29 jours |
| 3 mois / 12 mois | même quantième 3 / 12 mois plus tôt (borné à la fin du mois) + 1 jour |
| Depuis l'acquisition | date d'acquisition, sinon première donnée enregistrée |

* La **distance** suit la même règle que la distance par période ci-dessus
  (interpolation aux bornes).
* La **consommation** de la période ne retient que les segments qui **se terminent**
  dans la période, avec une moyenne pondérée.
* Les **coûts** additionnent les pleins et les dépenses datés dans la période.

### Exemple vérifié : 30 derniers jours au 25/03/2026 (jeu de référence)

* Période du 24/02 au 25/03/2026 (30 jours).
* Pleins : #5 (73,50 €) et #6 (36,00 €), soit **109,50 €** et 62 L.
* Dépenses : 4,60 + 300,00 + 8,00 = **312,60 €**.
* Consommation : seul le segment C (#4 → #5, terminé le 01/03) compte, soit **7,00 L/100 km**.
* Distance :
  * #4 → #5 : 600 km sur 14 jours, dont 5 jours dans la période, soit 214,29 km.
  * #5 → #6 : 300 km.
  * Total : **514,29 km**.
* Coût par km : 422,10 ÷ 514,29 = **0,8207 €/km**.

### Courbe de consommation et moyenne mobile

* Un point par plein complet fermant un segment.
* La moyenne mobile porte sur les *n* derniers segments (5 par défaut, réglable).
  Elle est **pondérée** (Σ litres ÷ Σ km), comme la moyenne générale. Elle utilise
  l'historique antérieur au début du graphique, pour que les premiers points soient
  significatifs.
* Exemple avec *n* = 2 sur le jeu de référence :

  | Point | Calcul | Moyenne mobile |
  |---|---|---|
  | A | segment seul | 6,00 |
  | B | (36 + 37,5) ÷ 1 400 × 100 | 5,25 |
  | C | (37,5 + 42) ÷ 1 400 × 100 | 5,679 |

### Indicateurs par plein

* **Distance parcourue** : kilométrage du plein − kilométrage du plein précédent
  (tous carburants). Rien si le compteur recule (rupture de série).
* **Consommation au plein** : celle du segment qui se termine à ce plein complet
  (voir les règles du segment). Un plein partiel n'en a pas : ses litres sont
  ajoutés au segment fermé par le plein complet suivant.

### Évolution du prix

* Courbe : prix unitaire payé à chaque plein de la période, par carburant, coloré
  selon la qualité d'essence (SP95-E10, SP95, SP98).
* **Évolution du prix** : prix du dernier plein de la période ÷ prix du premier − 1.
* **Prix moyen** : coût du carburant de la période ÷ quantité achetée (moyenne
  pondérée par les volumes).

### Bilan carbone

Module `core/carbon.py`. Les émissions se calculent à partir des **quantités
réellement achetées**, pas d'une consommation théorique :

> émissions (kg CO2e) = Σ quantité × facteur d'émission du carburant

Facteurs de la [Base Empreinte de l'ADEME](https://base-empreinte.ademe.fr/)
(France continentale, éléments « valide générique »). Ils couvrent la combustion
et l'amont (extraction, raffinage, transport), soit le périmètre « du puits à la
roue » :

| Carburant | Élément ADEME | Identifiant | Facteur |
|---|---|---|---|
| Essence (SP95, SP95-E10, SP98) | Supercarburant sans plomb (95, 95-E10, 98) | 25763 | 2,69 kg CO2e/L |
| Gazole | Gazole routier B7 | 25775 | 3,10 kg CO2e/L |
| GPL | GPL pour véhicule routier | 14031 | 1,86 kg CO2e/L |
| GNV | GNC pour véhicule routier | 27095 | 2,96 kg CO2e/kg |

* L'ADEME applique le même facteur aux trois qualités d'essence : choisir E10, SP95
  ou SP98 ne change pas le bilan.
* **Par km** : émissions de la période × 1 000 ÷ distance de la période (g CO2e/km).
* **Par mois** : émissions de la période ÷ durée de la période en mois (30,44 jours).
* Exemple : 40 L d'essence = 40 × 2,69 = **107,6 kg CO2e** ; 50 L de gazole =
  **155 kg CO2e**.

### Coût au km

* Courbe **cumulée depuis le début du carnet** : à chaque jour comportant un plein
  ou une dépense (et aujourd'hui), Σ montants jusqu'à ce jour ÷ distance parcourue
  jusqu'à ce jour. Deux courbes : tout compris, et carburant seul.
* Le cumul lisse les dépenses ponctuelles (assurance annuelle, gros entretien) et
  converge vers le coût réel du véhicule. La période choisie limite seulement la
  partie affichée.
* Pas de point avant **1 000 km** parcourus depuis le premier relevé : sur
  quelques dizaines de km, un plein ou une dépense donnerait un coût au km
  absurde (375 € sur 50 km = 7,50 €/km) et écraserait l'échelle du graphique.
* La tuile **Coût par km** reste, elle, calculée sur la seule période.

### Compteur

* Dernier relevé connu de chaque jour (pleins, dépenses avec kilométrage, relevés
  manuels), sur une échelle de temps réelle.

## Dépenses récurrentes

Module `core/recurring.py`.

* Échéance n° *k* = date de début + *k* × périodicité (mois), même quantième borné à
  la fin du mois : une récurrence du 31 tombe le 28 (ou 29) février, le 30 avril…
* Chaque passage horaire, et chaque enregistrement, crée les dépenses des échéances
  arrivées (date ≤ aujourd'hui) et avance `last_date`. Une dépense créée puis
  supprimée n'est pas recréée.
* Au plus 60 échéances par récurrence et par passage : une date de début très
  ancienne est rattrapée progressivement.
* **Équivalent mensuel** : montant ÷ périodicité en mois (120 € par an = 10 €/mois).
