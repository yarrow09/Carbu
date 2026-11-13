# Format d'export CSV

Le service `carbu.export_data` écrit un dossier
`<config>/carbu/exports/<AAAAMMJJ-HHMMSS>/` contenant cinq fichiers. Version
du format : **1**. Il servira à l'import et à la restauration en phase 3.

## Conventions

| Élément | Règle |
|---|---|
| Encodage | UTF-8 avec BOM (accents lus correctement par Excel) |
| Séparateur | `;` |
| Décimales | point (`1.85`), sans séparateur de milliers |
| Dates / heures | ISO 8601 : `2026-03-25`, `08:30:00` |
| Unités | km, L (kg pour le GNV, voir `volume_unit`), devise de Home Assistant |
| Booléens | `true` / `false` |
| Non renseigné | champ vide |
| Texte | guillemets doublés si nécessaire (RFC 4180) : séparateurs, guillemets et retours à la ligne sont préservés |
| Première ligne | noms des colonnes ci-dessous, dans cet ordre |

## Fichiers

### `pleins.csv`

`vehicle_id;vehicle_name;id;date;time;odometer_km;volume;volume_unit;unit_price;total_cost;fuel_type;grade;full_tank;station;notes`

* `fuel_type` : `gasoline`, `diesel`, `lpg`, `cng`.
* `grade` : qualité d'essence, `e10`, `sp95` ou `sp98` (vide sinon). À l'import,
  `SP95-E10`, `95`, `98`… sont aussi reconnus ; la colonne est facultative.
* `unit_price` : prix par litre (ou par kg).

### `depenses.csv`

`vehicle_id;vehicle_name;id;date;odometer_km;amount;category_id;category_name;description;attachment`

* `attachment` : nom du fichier dans `<config>/carbu/attachments/<vehicle_id>/`.
  Les fichiers eux-mêmes ne sont pas copiés.

### `releves.csv`

`vehicle_id;vehicle_name;id;date;time;odometer_km`

Relevés manuels du compteur (entité « Kilométrage actuel » ou service
`update_odometer`).

### `rappels.csv`

`vehicle_id;vehicle_name;id;label;kind;due_date;due_odometer_km;alert_days;alert_distance_km;interval_days;interval_distance_km;active;last_done_date;last_done_odometer_km`

* `kind` : `date`, `distance` ou `both`.

### `categories.csv`

`id;name;color;icon;builtin`

* `name` vide : catégorie par défaut avec son libellé traduit.

La configuration des véhicules (unités, réservoirs…) n'est pas incluse : elle fait
partie de l'entrée de configuration Home Assistant. Seuls les véhicules existants
sont exportés.

## Réimport

Ces fichiers se réimportent dans un véhicule depuis la carte **Journal du véhicule**,
avec le bouton **Importer**. L'import accepte aussi un fichier modifié dans un tableur :

| Élément | Formes acceptées |
|---|---|
| Encodage | UTF-8 avec ou sans BOM, Windows-1252 |
| Séparateur | `;`, ou `,` si la première ligne ne contient pas de `;` |
| Dates | `AAAA-MM-JJ` ou `JJ/MM/AAAA` |
| Nombres | `1234.5`, `1234,5`, `1 234,5`, `1.234,5`, `1,234.5` |
| Booléens | `true` / `false`, `1` / `0`, `oui` / `non`, `vrai` / `faux`, `yes` / `no` |

* **Type de fichier** : reconnu d'après les colonnes. Seules les colonnes nécessaires
  sont obligatoires :

  | Fichier | Colonnes obligatoires |
  |---|---|
  | Pleins | `date`, `odometer_km`, et deux colonnes parmi `volume`, `unit_price`, `total_cost` |
  | Dépenses | `date`, `amount` |
  | Relevés | `date`, `odometer_km` |
  | Rappels | `label`, `kind` |

* **Colonne `vehicle_id`** : ignorée. Tout est importé dans le véhicule choisi.
* **Catégorie d'une dépense** : `category_id` si elle existe, sinon `category_name`
  (nom ou libellé traduit, sans tenir compte de la casse), sinon une nouvelle catégorie
  est créée. Sans aucune des deux, la dépense va dans « Autre ».
* **Doublons** : une ligne dont l'identifiant existe déjà, ou dont les valeurs clés
  sont déjà présentes, n'est pas importée. Valeurs clés :
  - plein : date, kilométrage, quantité ;
  - dépense : date, montant, catégorie, description ;
  - relevé : date, kilométrage ;
  - rappel : libellé, type.
* **Aperçu** : avant toute écriture, il indique pour chaque ligne si elle est
  nouvelle, en doublon ou en erreur (avec son numéro et le motif).
* **Limites** : 5 Mo et 20 000 lignes par fichier.
