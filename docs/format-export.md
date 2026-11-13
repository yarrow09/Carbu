# Format d'export CSV

Le service `vehicle_log.export_data` écrit un dossier
`<config>/vehicle_log/exports/<AAAAMMJJ-HHMMSS>/` contenant cinq fichiers. Version
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

`vehicle_id;vehicle_name;id;date;time;odometer_km;volume;volume_unit;unit_price;total_cost;fuel_type;full_tank;station;notes`

* `fuel_type` : `gasoline`, `diesel`, `lpg`, `cng`.
* `unit_price` : prix par litre (ou par kg).

### `depenses.csv`

`vehicle_id;vehicle_name;id;date;odometer_km;amount;category_id;category_name;description;attachment`

* `attachment` : nom du fichier dans `<config>/vehicle_log/attachments/<vehicle_id>/`.
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
