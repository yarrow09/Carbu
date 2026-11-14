# Carbu — carnet de bord véhicule pour Home Assistant

Carbu suit votre consommation de carburant directement dans Home Assistant. Ajoutez
un plein, voyez vos litres aux 100 km, vos coûts et vos statistiques — sans quitter
votre tableau de bord.

Intégration personnalisée qui tient le carnet de bord de vos véhicules thermiques :
pleins, consommation réelle, dépenses par catégorie, coût par kilomètre, rappels
d'entretien.
Tout se configure depuis l'interface, les données restent sur votre Home Assistant.

> **Version 1.0.0-alpha.2** (préversion : des changements restent possibles avant la
> 1.0.0). L'intégration sert à suivre la consommation et les coûts. Elle
> ne recherche pas les prix des carburants en ligne. Les véhicules électriques ne sont
> pas pris en charge.

## Sommaire

- [Installation](#installation)
- [Configuration](#configuration)
- [Saisir un plein ou des frais](#saisir-un-plein-ou-des-frais)
- [Cartes du tableau de bord](#cartes-du-tableau-de-bord)
- [Entités](#entités)
- [Rappels et notifications](#rappels-et-notifications)
- [Services](#services)
- [Sauvegarde, restauration et import](#sauvegarde-restauration-et-import)
- [Calculs](#calculs)
- [Données et vie privée](#données-et-vie-privée)
- [Développement](#développement)

## Installation

Prérequis : Home Assistant **2026.10** ou plus récent.

### Avec HACS (recommandé)

1. Dans HACS, ouvrez le menu **⋮ → Dépôts personnalisés**.
2. Ajoutez l'URL du dépôt `https://github.com/yarrow09/Carbu` avec la catégorie
   **Intégration**.
3. Recherchez **Carbu**, puis cliquez sur **Télécharger**.
4. Redémarrez Home Assistant une fois. Ce redémarrage est demandé par HACS pour toute
   nouvelle intégration. L'intégration elle-même ne demande ensuite aucun redémarrage.

### Manuellement

Copiez le dossier `custom_components/carbu` dans le dossier `custom_components`
de votre configuration, puis redémarrez Home Assistant.

## Configuration

Tout se fait dans **Paramètres → Appareils et services**, sans YAML.

1. **Ajouter l'intégration** : bouton **Ajouter une intégration**, puis
   **Carbu**. Une seule installation est possible ; elle regroupe tous vos
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
   - **Créer une sauvegarde complète** et **Restaurer une sauvegarde** (voir plus bas).

Catégories par défaut : entretien, assurance, stationnement, péage, contrôle technique,
réparation, autre.

## Saisir un plein ou des frais

Trois accès, sans rien configurer de plus :

- **Page Carbu** dans la barre latérale : les cartes du véhicule choisi (sélecteur
  en haut à droite s'il y en a plusieurs), avec les boutons **Plein** et **Dépense**.
  Le carnet de bord et le journal (5 entrées à la fois, **Afficher plus** pour la
  suite) sont côte à côte, les statistiques en pleine largeur dessous. C'est l'accès
  le plus complet : modification, suppression, rappels, import CSV.
- **Paramètres → Appareils et services → Carbu → Configurer** (roue dentée) :
  **Saisir un plein** et **Saisir des frais** ouvrent des formulaires Home Assistant
  standard. Un plein incohérent (réservoir dépassé, kilométrage inférieur au
  précédent…) affiche les avertissements et demande une confirmation.
- **Services** `carbu.add_fuel` et `carbu.add_expense`, pour les automatisations
  (voir [Services](#services)).

## Cartes du tableau de bord

Les cartes sont fournies par l'intégration et chargées automatiquement. Il n'y a
aucune ressource Lovelace à déclarer.

Le tableau de bord **Vue d'ensemble** par défaut de Home Assistant (2026) ne permet
pas d'ajouter de cartes : créez d'abord un tableau de bord (**Paramètres → Tableaux
de bord → Ajouter un tableau de bord → Nouveau tableau de bord à partir de zéro**),
ou utilisez simplement la page **Carbu** de la barre latérale. Dans votre tableau de
bord, passez en édition, cliquez sur **Ajouter une carte** et cherchez **Carbu**. L'éditeur graphique permet de choisir le véhicule, le titre et les sections
affichées.

### Carnet de bord véhicule (`custom:carbu-card`)

- **Dernier plein** : distance parcourue depuis le plein précédent et consommation
  mesurée, avec l'écart à la moyenne. Pour un plein partiel, la consommation attend le
  prochain plein complet.
- Indicateurs : consommation moyenne, coût du mois, coût par km (ou par mile),
  kilométrage, distance du mois.
- **Saisie rapide d'un plein** : bouton **+ Plein**, puis kilométrage, quantité et
  montant, puis **Entrée**. Pour l'essence, **Carburant à la pompe** précise la
  qualité (SP95-E10, SP95, SP98), pré-remplie avec la dernière utilisée.
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
- **Dépenses récurrentes** (abonnement, assurance au mois, crédit…) : bouton
  **+ Récurrence**, puis libellé, montant, catégorie, périodicité (tous les mois, 2
  mois, trimestre, 6 mois, an), première échéance et, si besoin, dernière échéance.
  - À chaque échéance, la dépense est ajoutée au journal automatiquement (vérifié
    toutes les heures). Les échéances déjà passées sont ajoutées dès
    l'enregistrement.
  - Modifier une récurrence ne change que les échéances à venir ; la supprimer
    conserve les dépenses déjà ajoutées. Décocher **Active** la met en pause.
  - La liste affiche la prochaine échéance et l'équivalent mensuel.
- Les 5 derniers pleins et les 5 dernières dépenses, modifiables et supprimables
  (masqués sur la page Carbu, où le journal les affiche déjà).
- Histogramme des dépenses des 12 derniers mois, empilé par catégorie, carburant
  compris.

### Journal du véhicule (`custom:carbu-journal-card`)

- Onglets **Pleins** et **Dépenses**, avec pagination. Chaque plein indique la
  distance depuis le plein précédent et, pour un plein complet, la consommation
  mesurée.
- Filtres des dépenses : période (ce mois-ci, 3 mois, cette année, tout, ou dates
  libres), catégories, montant minimum et maximum. Le nombre d'entrées et le total
  sont affichés.
- Modification et suppression avec confirmation. Tous les indicateurs sont
  recalculés.
- **Importer** : import d'un fichier CSV dans le véhicule, avec un aperçu avant
  écriture (voir plus bas).
- **Exporter** : téléchargement des données du véhicule en CSV (pleins, dépenses,
  dépenses récurrentes, relevés, rappels), lisibles dans un tableur et
  réimportables. Rien n'est écrit sur le serveur.

### Statistiques du véhicule (`custom:carbu-stats-card`)

- Périodes : 30 jours, 3 mois, 12 mois, depuis l'acquisition. La période par défaut
  se règle dans l'éditeur.
- Indicateurs groupés :
  - **Consommation** : moyenne (par carburant), meilleur et moins bon plein ;
  - **Distance** : distance, nombre de pleins, distance moyenne entre deux pleins,
    quantité ;
  - **Coûts** : total, moyenne par mois, coût par km, prix moyen au litre,
    évolution du prix entre le premier et le dernier plein ;
  - **Bilan carbone** : émissions de la période (kg ou t CO2e), par km et par mois,
    calculées sur les quantités réellement achetées avec les facteurs de l'ADEME
    (voir [calculs](docs/calculs.md#bilan-carbone)).
- Courbe de consommation par plein complet, avec la moyenne mobile.
- Courbe du prix du carburant payé à chaque plein, colorée par qualité d'essence.
- Courbe du **coût au km**, cumulé depuis le début du carnet : tout compris et
  carburant seul.
- Courbe du **compteur** (kilométrage total relevé).
- Dépenses de la période par catégorie, carburant compris : barre de répartition,
  pourcentages et montants.

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

Les cinq services s'utilisent dans les automatisations et les scripts. Le véhicule
se choisit par son appareil, et les valeurs sont dans les unités du véhicule. Chaque
service peut renvoyer une réponse (`response_variable`).

| Service | Champs | Réponse |
|---|---|---|
| `carbu.add_fuel` | `vehicle`, `odometer`, deux parmi `volume` / `total_cost` / `unit_price`, puis facultatifs : `date`, `time`, `fuel_type`, `full_tank` (vrai par défaut), `station`, `notes`, `strict` | `saved`, `warnings`, `entry` |
| `carbu.add_expense` | `vehicle`, `amount`, `category` (identifiant ou nom), puis facultatifs : `date`, `odometer`, `description` | `expense` |
| `carbu.update_odometer` | `vehicle`, `odometer`, `strict` | `saved`, `warnings` |
| `carbu.export_data` | aucun | `folder`, `files` |
| `carbu.backup` | aucun | `path` |

Une automatisation ne peut pas répondre à une demande de confirmation. Les
avertissements de cohérence (kilométrage en baisse, plein supérieur au réservoir…)
**n'empêchent donc pas l'enregistrement** : ils sont journalisés et renvoyés dans la
réponse. Avec `strict: true`, l'enregistrement est refusé.

Exemple : enregistrer un plein depuis un bouton NFC.

```yaml
actions:
  - action: carbu.add_fuel
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
`categories.csv` dans `<config>/carbu/exports/<date-heure>/`. Le format est
décrit dans [docs/format-export.md](docs/format-export.md).

## Sauvegarde, restauration et import

- **Sauvegarde complète** : page globale, ou service `carbu.backup` à planifier
  dans une automatisation.
  - Elle produit une archive ZIP dans `<config>/carbu/backups/` avec les
    véhicules, les réglages, toutes les données et les pièces jointes.
  - Format : [docs/format-sauvegarde.md](docs/format-sauvegarde.md).
- **Restauration** : page globale, **Restaurer une sauvegarde**.
  - Choisissez une sauvegarde du dossier ou envoyez une archive.
  - Un aperçu indique son contenu ; la confirmation remplace **tous** les véhicules
    et toutes les données.
  - Une restauration suivie d'une nouvelle sauvegarde donne des données identiques.
- **Import CSV** : carte **Journal du véhicule**, bouton **Importer**.
  - Il accepte les fichiers de l'export, y compris modifiés dans un tableur.
  - L'aperçu liste les lignes nouvelles, les doublons ignorés et les erreurs avec
    leur numéro de ligne, avant toute écriture.
  - L'import s'ajoute aux données existantes.
  - Règles détaillées dans [docs/format-export.md](docs/format-export.md#réimport).

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
    `<config>/.storage/carbu.data`, au format versionné décrit dans
    [docs/format-stockage.md](docs/format-stockage.md) ;
  - les pièces jointes dans `<config>/carbu/attachments/` ;
  - les exports dans `<config>/carbu/exports/` ;
  - les sauvegardes dans `<config>/carbu/backups/`.
- La configuration des véhicules est enregistrée dans l'entrée de configuration
  Home Assistant.
- Aucune donnée n'est envoyée à un tiers et aucun compte en ligne n'est nécessaire.
- Les sauvegardes de Home Assistant incluent ces fichiers.

### Sécurité

- Toutes les API (cartes, import, pièces jointes) exigent une session Home Assistant.
  Tout utilisateur connecté peut consulter et saisir des données ; les services
  `carbu.export_data` et `carbu.backup`, qui écrivent des fichiers, et la page
  « Configurer » (restauration comprise) sont réservés aux administrateurs.
- Pièces jointes : JPEG, PNG, WebP ou PDF reconnus d'après leur contenu, 10 Mo au
  plus, rangés sous des noms contrôlés. Les images s'affichent dans un document
  isolé (sans script) ; les PDF sont téléchargés plutôt qu'affichés.
- Une sauvegarde restaurée est entièrement revalidée : identifiants, chemins des
  fichiers de l'archive, couleurs et icônes des catégories, options connues
  seulement. Taille décompressée limitée à 256 Mo.
- Les textes exportés en CSV qui ressemblent à une formule (`=`, `+`, `-`, `@`) sont
  précédés d'une apostrophe, pour qu'un tableur ne les exécute pas ; l'import la
  retire.
- Longueurs maximales : 100 caractères pour la station et les libellés, 1 000 pour
  les notes et descriptions.

## Développement

```bash
# Python 3.14, environnement isolé
uv venv --python 3.14 .venv
uv pip install --python .venv -r requirements_test.txt
.venv/bin/pytest            # tests unitaires, d'intégration et de performance
.venv/bin/ruff check . && .venv/bin/ruff format --check .
.venv/bin/mypy

# Cartes (Lit + TypeScript, bundle committé dans custom_components/carbu/www)
cd frontend
npm ci
npm run check               # vérification des types + construction du bundle
```

`frontend/dev/index.html` est un banc d'essai des cartes avec un `hass` simulé. Pour
l'ouvrir, lancez `python3 -m http.server` à la racine du dépôt, puis ouvrez
`/frontend/dev/index.html`.

Arborescence :

```
custom_components/carbu/
  core/            calculs et modèle, Python pur, sans dépendance à Home Assistant
  storage.py       Store versionné et migrations
  coordinator.py   indicateurs et point d'entrée des modifications
  config_flow.py   installation, assistant véhicule, page globale
  sensor.py, number.py, binary_sensor.py, services.py, notifications.py
  websocket_api.py, attachments.py, frontend.py
  backup_archive.py, csv_import_view.py
frontend/src/      sources des cartes
tests/             tests (core/ : calculs purs ; perf/ : 5 ans de données)
```

## Licence

Carbu est un logiciel libre distribué sous la
**GNU General Public License, version 3 ou toute version ultérieure**
(`GPL-3.0-or-later`). Voir le fichier [LICENSE](LICENSE).

Les icônes des cartes proviennent de [Material Design Icons](https://pictogrammers.com/library/mdi/)
(paquet `@mdi/js`, licence Apache 2.0) ; les cartes utilisent [Lit](https://lit.dev)
(licence BSD-3-Clause). Ces licences sont compatibles avec la GPL v3.
