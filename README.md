# Vehicle Log — carnet de bord véhicule pour Home Assistant

Intégration personnalisée qui tient le carnet de bord de vos véhicules thermiques :
pleins, consommation réelle, dépenses par catégorie, coût par kilomètre, rappels
d'entretien.
Tout se configure depuis l'interface, les données restent sur votre Home Assistant.

> **Version 0.2.0.** L'intégration sert à suivre la consommation et les coûts. Elle
> ne recherche pas les prix des carburants en ligne. Les véhicules électriques ne sont
> pas pris en charge.

## Sommaire

- [Installation](#installation)
- [Configuration](#configuration)
- [Cartes du tableau de bord](#cartes-du-tableau-de-bord)
- [Entités](#entités)
- [Rappels et notifications](#rappels-et-notifications)
- [Services](#services)
- [Calculs](#calculs)
- [Données et vie privée](#données-et-vie-privée)
- [Développement](#développement)

## Installation

Prérequis : Home Assistant **2026.10** ou plus récent.

### Avec HACS (recommandé)

1. Dans HACS, ouvrez le menu **⋮ → Dépôts personnalisés**.
2. Ajoutez l'URL de ce dépôt avec la catégorie **Intégration**.
3. Recherchez **Vehicle Log**, puis cliquez sur **Télécharger**.
4. Redémarrez Home Assistant une fois. Ce redémarrage est demandé par HACS pour toute
   nouvelle intégration. L'intégration elle-même ne demande ensuite aucun redémarrage.

### Manuellement

Copiez le dossier `custom_components/vehicle_log` dans le dossier `custom_components`
de votre configuration, puis redémarrez Home Assistant.

## Configuration

Tout se fait dans **Paramètres → Appareils et services**, sans YAML.

1. **Ajouter l'intégration** : bouton **Ajouter une intégration**, puis
   **Vehicle Log**. Une seule installation est possible ; elle regroupe tous vos
   véhicules.
2. **Ajouter un véhicule** : sur la page de l'intégration, bouton **Ajouter un
   véhicule**. L'assistant comporte quatre étapes :
   1. **Identité** : nom, marque, modèle, immatriculation (facultative), date d'acquisition.
   2. **Unités** : distance (km ou miles), volume (litres, gallons US ou UK),
      consommation (L/100 km, km/L, MPG US ou UK). Les valeurs proposées
      suivent le système d'unités de Home Assistant.
   3. **Carburant** : essence, diesel, GPL ou GNV, capacité du réservoir, et
      bi-carburant si besoin. Le second carburant a alors son propre réservoir.
   4. **Consommation plausible** : la plage qui sert à repérer les erreurs de saisie
      (3 à 20 L/100 km par défaut).
3. **Modifier un véhicule** : action **Modifier le véhicule** sur la ligne du véhicule.
   Les mêmes étapes s'affichent, pré-remplies. Changer d'unités ne modifie pas les données
   enregistrées, qui sont stockées en unités métriques.
4. **Supprimer un véhicule** : menu **⋮ → Supprimer** du véhicule. Ses pleins,
   dépenses, relevés et pièces jointes sont effacés.
5. **Page globale** : bouton **Configurer** de l'intégration.
   - Ajouter une catégorie de dépense (nom, couleur, icône).
   - Renommer une catégorie ou changer sa couleur et son icône. Pour une catégorie par
     défaut, un nom vide rétablit le libellé d'origine.
   - Supprimer une catégorie. Un écran de confirmation indique combien de dépenses
     l'utilisent ; elles sont réassignées à « Autre ». La catégorie « Autre » ne peut pas
     être supprimée.
   - **Notifications des rappels** : entités `notify` et/ou anciens services
     `notify.xxx`, comme l'application mobile.
   - **Statistiques** : nombre de pleins de la moyenne mobile (5 par défaut).

Catégories par défaut : entretien, assurance, stationnement, péage, contrôle technique,
réparation, autre.

## Cartes du tableau de bord

Les cartes sont fournies par l'intégration et chargées automatiquement. Il n'y a
aucune ressource Lovelace à déclarer. Pour les ajouter, mettez le tableau de bord en
édition, cliquez sur **Ajouter une carte** et cherchez **Vehicle Log** ou **Journal du
véhicule**. L'éditeur graphique permet de choisir le véhicule, le titre et les sections
affichées.

### Carnet de bord véhicule (`custom:vehicle-log-card`)

- Indicateurs : consommation moyenne, coût du mois, coût par km (ou par mile),
  kilométrage, distance du mois.
- **Saisie rapide d'un plein** : bouton **+ Plein**, puis kilométrage, quantité et
  montant, puis **Entrée**.
  - Le kilométrage est pré-rempli avec le dernier relevé.
  - Le prix unitaire et le montant se calculent l'un à partir de l'autre, dans les deux
    sens.
  - Date, heure, carburant (pour un véhicule bi-carburant), station et notes sont
    facultatifs, sous **Plus d'options**.
- Contrôles de cohérence : un avertissement s'affiche, et il faut confirmer pour
  enregistrer, dans ces cas :
  - kilométrage inférieur au relevé précédent ;
  - consommation hors de la plage du véhicule ;
  - plein supérieur à la capacité du réservoir.
- **Dépense** : montant, catégorie, date, kilométrage (facultatif), description et
  pièce jointe (photo ou PDF, 10 Mo au plus).
- **Rappels** : état (dû, bientôt, à jour, fait), échéance et temps ou distance
  restant. Le bouton **Fait** calcule l'échéance suivante d'un rappel récurrent. On
  peut aussi ajouter, modifier et supprimer des rappels.
- Les 5 derniers pleins et les 5 dernières dépenses, modifiables et supprimables.
- Histogramme des dépenses des 12 derniers mois, empilé par catégorie, carburant
  compris.

### Journal du véhicule (`custom:vehicle-log-journal-card`)

- Onglets **Pleins** et **Dépenses**, avec pagination.
- Filtres des dépenses : période (ce mois-ci, 3 mois, cette année, tout, ou dates
  libres), catégories, montant minimum et maximum. Le nombre d'entrées et le total
  sont affichés.
- Modification et suppression avec confirmation. Tous les indicateurs sont
  recalculés.

### Statistiques du véhicule (`custom:vehicle-log-stats-card`)

- Périodes : 30 jours, 3 mois, 12 mois, depuis l'acquisition. La période par défaut
  se règle dans l'éditeur.
- Indicateurs : distance, consommation moyenne (par carburant), carburant, autres
  dépenses, coût total, coût par km, nombre de pleins, quantité.
- Courbe de consommation par plein complet, avec la moyenne mobile.
- Dépenses de la période par catégorie, carburant compris.

Les cartes suivent le thème clair ou sombre de Home Assistant et s'adaptent au mobile.
Elles visent le niveau AA des WCAG : contrastes, libellés sur tous les champs, et un
tableau de données pour les lecteurs d'écran. Elles se mettent à jour en direct quand
une donnée change ailleurs.

## Entités

Chaque véhicule est un **appareil** qui porte les entités suivantes. Les valeurs sont
exprimées dans les unités choisies pour le véhicule.

| Entité | Type | Description |
|---|---|---|
| Consommation moyenne | `sensor` | Moyenne pondérée sur tous les pleins complets |
| Consommation moyenne (second carburant) | `sensor` | Uniquement pour un véhicule bi-carburant |
| Coût du mois | `sensor` (monétaire) | Pleins + dépenses du mois civil en cours, remis à zéro chaque mois. Attributs : `fuel`, `expenses` |
| Coût par distance | `sensor` | Total des montants ÷ distance parcourue. Attributs : `fuel_only`, `total_cost`, `distance` |
| Kilométrage total | `sensor` (distance) | Dernier relevé du compteur. Attribut : `distance_logged` |
| Distance cette semaine / ce mois-ci / cette année | `sensor` (distance) | Semaine du lundi au dimanche |
| Kilométrage actuel | `number` | Saisir une valeur crée un relevé daté de maintenant. Une valeur inférieure au dernier relevé est refusée |
| *Libellé du rappel* | `binary_sensor` (problème) | Un par rappel. **Activé quand le rappel est dû.** Attributs : `state` (`ok`, `alert`, `due`, `inactive`), `due_date`, `due_odometer`, `days_left`, `distance_left`, `criterion`, `recurring`, `last_done_date` |

Les montants utilisent la devise configurée dans Home Assistant.

## Rappels et notifications

Un rappel peut se déclencher à une date, à un kilométrage, ou aux deux. Il devient
**dû dès que le premier critère est atteint**.
- **Seuil d'alerte** : X jours et/ou X km avant l'échéance, le rappel passe à
  « bientôt ».
- **Récurrence** (facultative) : tous les N jours et/ou N km. Quand on clique sur
  **Fait**, la prochaine échéance est calculée à partir de la date et du kilométrage
  du jour. Un rappel non récurrent devient inactif.
- **Notifications** : envoyées aux destinataires choisis dans la page globale, une
  au seuil d'alerte et une à l'échéance, jamais répétées pour la même échéance.
  L'état est vérifié à chaque saisie et toutes les heures.

## Services

Les quatre services s'utilisent dans les automatisations et les scripts. Le véhicule
se choisit par son appareil, et les valeurs sont dans les unités du véhicule. Chaque
service peut renvoyer une réponse (`response_variable`).

| Service | Champs | Réponse |
|---|---|---|
| `vehicle_log.add_fuel` | `vehicle`, `odometer`, deux parmi `volume` / `total_cost` / `unit_price`, puis facultatifs : `date`, `time`, `fuel_type`, `full_tank` (vrai par défaut), `station`, `notes`, `strict` | `saved`, `warnings`, `entry` |
| `vehicle_log.add_expense` | `vehicle`, `amount`, `category` (identifiant ou nom), puis facultatifs : `date`, `odometer`, `description` | `expense` |
| `vehicle_log.update_odometer` | `vehicle`, `odometer`, `strict` | `saved`, `warnings` |
| `vehicle_log.export_data` | aucun | `folder`, `files` |

Une automatisation ne peut pas répondre à une demande de confirmation. Les
avertissements de cohérence (kilométrage en baisse, plein supérieur au réservoir…)
**n'empêchent donc pas l'enregistrement** : ils sont journalisés et renvoyés dans la
réponse. Avec `strict: true`, l'enregistrement est refusé.

Exemple : enregistrer un plein depuis un bouton NFC.

```yaml
actions:
  - action: vehicle_log.add_fuel
    data:
      vehicle: 1a2b3c4d5e6f…   # identifiant de l'appareil du véhicule
      odometer: "{{ states('input_number.compteur') }}"
      volume: 40
      total_cost: 72.40
    response_variable: plein
  - action: persistent_notification.create
    data:
      message: "Plein enregistré ({{ plein.warnings | count }} avertissement(s))."
```

`export_data` écrit `pleins.csv`, `depenses.csv`, `releves.csv`, `rappels.csv` et
`categories.csv` dans `<config>/vehicle_log/exports/<date-heure>/`. Le format est
décrit dans [docs/format-export.md](docs/format-export.md).

## Calculs

Les formules, les règles des pleins partiels et le jeu de données de référence calculé
à la main sont détaillés dans [docs/calculs.md](docs/calculs.md). En résumé :

- **Consommation** : litres consommés entre deux pleins complets ÷ km parcourus × 100.
  Les pleins partiels intermédiaires s'ajoutent. Le plein complet initial est exclu et
  le plein complet final est inclus.
- **Moyenne** : total des litres ÷ total des km des segments, et non la moyenne des
  segments.
- **Coût par distance** : total des montants de la période ÷ distance de la période.
- **Moyenne mobile** : pondérée sur les *n* derniers segments.
- **Distance d'une période** : somme des progressions du compteur, au prorata du temps
  aux bornes de la période. Une baisse du compteur ne retire jamais de distance.
- **Bi-carburant** : chaque carburant est calculé séparément. Limite connue : la
  distance utilisée pour le GPL inclut les km faits à l'essence, ce qui sous-estime sa
  consommation.

## Données et vie privée

- Tout est stocké localement :
  - les pleins, dépenses, relevés, rappels et catégories dans
    `<config>/.storage/vehicle_log.data`, au format versionné décrit dans
    [docs/format-stockage.md](docs/format-stockage.md) ;
  - les pièces jointes dans `<config>/vehicle_log/attachments/` ;
  - les exports dans `<config>/vehicle_log/exports/`.
- La configuration des véhicules est enregistrée dans l'entrée de configuration
  Home Assistant.
- Aucune donnée n'est envoyée à un tiers et aucun compte en ligne n'est nécessaire.
- Les sauvegardes de Home Assistant incluent ces fichiers.

## Développement

```bash
# Python 3.14, environnement isolé
uv venv --python 3.14 .venv
uv pip install --python .venv -r requirements_test.txt
.venv/bin/pytest            # tests unitaires, d'intégration et de performance
.venv/bin/ruff check . && .venv/bin/ruff format --check .
.venv/bin/mypy

# Cartes (Lit + TypeScript, bundle committé dans custom_components/vehicle_log/www)
cd frontend
npm ci
npm run check               # vérification des types + construction du bundle
```

`frontend/dev/index.html` est un banc d'essai des cartes avec un `hass` simulé. Pour
l'ouvrir, lancez `python3 -m http.server` à la racine du dépôt, puis ouvrez
`/frontend/dev/index.html`.

Arborescence :

```
custom_components/vehicle_log/
  core/            calculs et modèle, Python pur, sans dépendance à Home Assistant
  storage.py       Store versionné et migrations
  coordinator.py   indicateurs et point d'entrée des modifications
  config_flow.py   installation, assistant véhicule, page globale
  sensor.py, number.py, binary_sensor.py, services.py, notifications.py
  websocket_api.py, attachments.py, frontend.py
frontend/src/      sources des cartes
tests/             tests (core/ : calculs purs ; perf/ : 5 ans de données)
```

## Licence

À définir.
