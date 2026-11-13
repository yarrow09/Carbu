# Vehicle Log — carnet de bord véhicule pour Home Assistant

Intégration personnalisée qui tient le carnet de bord de vos véhicules thermiques :
pleins, consommation réelle, dépenses par catégorie, coût par kilomètre.
Tout se configure depuis l'interface, les données restent sur votre Home Assistant.

> **Version 0.1.0 : phase 1 (MVP).** Les prix des carburants, les rappels, les services
> publics et l'export CSV arrivent en phase 2. Les véhicules électriques ne sont pas
> pris en charge.

## Sommaire

- [Installation](#installation)
- [Configuration](#configuration)
- [Cartes du tableau de bord](#cartes-du-tableau-de-bord)
- [Entités](#entités)
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

Les montants utilisent la devise configurée dans Home Assistant.

**Services** : `vehicle_log.add_fuel`, `add_expense`, `update_odometer`,
`refresh_fuel_prices` et `export_data` arrivent en phase 2.

## Calculs

Les formules, les règles des pleins partiels et le jeu de données de référence calculé
à la main sont détaillés dans [docs/calculs.md](docs/calculs.md). En résumé :

- **Consommation** : litres consommés entre deux pleins complets ÷ km parcourus × 100.
  Les pleins partiels intermédiaires s'ajoutent. Le plein complet initial est exclu et
  le plein complet final est inclus.
- **Moyenne** : total des litres ÷ total des km des segments, et non la moyenne des
  segments.
- **Coût par distance** : total des montants de la période ÷ distance de la période.
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
  - les pièces jointes dans `<config>/vehicle_log/attachments/`.
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
  sensor.py, number.py, websocket_api.py, attachments.py, frontend.py
frontend/src/      sources des cartes
tests/             tests (core/ : calculs purs ; perf/ : 5 ans de données)
```

## Licence

À définir.
