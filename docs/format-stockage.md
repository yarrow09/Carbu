# Format de stockage

Fichier : `<config>/.storage/carbu.data` (helper `Store` de Home Assistant,
écriture atomique, différée de 5 s pour regrouper les modifications ; les
écritures en attente sont vidées à l'arrêt de Home Assistant).

Version courante : **1.2** (`version` majeure / `minor_version`).

## Unités de référence

| Grandeur | Unité stockée |
|---|---|
| Distance, kilométrage | km |
| Quantité de carburant | L (kg pour le GNV) |
| Montant | devise configurée dans Home Assistant |
| Date / heure | ISO 8601 (`YYYY-MM-DD`, `HH:MM:SS`), heure locale |

Les unités choisies pour un véhicule (miles, gallons, MPG…) ne servent qu'à la
saisie et à l'affichage.

## Où vit quoi

* **Configuration des véhicules** : dans les *subentries* de l'entrée de
  configuration (nom, marque, carburant(s), capacités, unités, plage de
  consommation…). L'identifiant du véhicule est le `subentry_id`.
* **Enregistrements** : dans le fichier de stockage décrit ci-dessous, rangés
  par `subentry_id`.

## Structure

```json
{
  "categories": [
    {"id": "maintenance", "name": null, "color": "#1e88e5", "icon": "mdi:wrench", "builtin": true},
    {"id": "3f2a…", "name": "Lavage", "color": "#00aaff", "icon": "mdi:car-wash", "builtin": false}
  ],
  "vehicles": {
    "<subentry_id>": {
      "fuel": [
        {"id": "…", "date": "2026-01-02", "time": "08:30:00", "odometer": 12345.6,
         "volume": 40.5, "unit_price": 1.799, "total_cost": 72.86,
         "fuel_type": "gasoline", "grade": "e10", "full_tank": true,
         "station": null, "notes": ""}
      ],
      "expenses": [
        {"id": "…", "date": "2026-03-01", "odometer": null, "amount": 89.9,
         "category_id": "maintenance", "description": "", "attachment": null}
      ],
      "odometer": [
        {"id": "…", "date": "2026-03-02", "time": null, "odometer": 15000}
      ],
      "reminders": [
        {"id": "…", "label": "Vidange", "kind": "both", "due_date": "2027-01-01",
         "due_odometer": 30000, "alert_days": 30, "alert_distance": 1000,
         "interval_days": 365, "interval_distance": 15000, "active": true,
         "last_done_date": "2026-01-01", "last_done_odometer": 15000,
         "notified": ["alert"]}
      ],
      "recurring": [
        {"id": "…", "label": "Assurance", "amount": 42.5,
         "category_id": "insurance", "interval_months": 1,
         "start_date": "2026-01-31", "end_date": null, "active": true,
         "last_date": "2026-03-31"}
      ]
    }
  }
}
```

* `fuel_type` : `gasoline`, `diesel`, `lpg`, `cng`.
* `grade` : qualité d'essence (`e10`, `sp95`, `sp98`), `null` si non précisée ou
  pour un autre carburant. Champ facultatif ajouté en 1.0.0-alpha.1, sans
  changement de version du stockage : son absence vaut `null`.
* Catégorie par défaut : `name: null` → libellé traduit ; un nom renseigné la
  renomme. Une catégorie par défaut supprimée ne réapparaît pas. La catégorie
  `other` est indélébile et reçoit les dépenses des catégories supprimées.
* `odometer` ne contient que les relevés manuels ; les kilométrages des pleins
  et des dépenses sont fusionnés au calcul.
* `reminders` : `kind` vaut `date`, `distance` ou `both` (déclenché au premier
  critère atteint). `interval_*` : récurrence facultative. `notified` : étapes
  déjà notifiées pour l'échéance en cours (`alert`, `due`), remis à zéro quand
  l'échéance change. `active: false` : rappel non récurrent déjà fait.
* `recurring` : dépenses récurrentes (ajouté en 1.0.0-alpha.2, absent = liste
  vide, sans changement de version du stockage). Chaque échéance arrivée crée
  une dépense dans `expenses`, avec `recurring_id` ; `last_date` est la dernière
  échéance créée. Le quantième de `start_date` est conservé, borné à la fin du
  mois (31 janvier → 28 février → 31 mars).
* `expenses[].recurring_id` : facultatif, `null` pour une saisie manuelle.

## Migrations

`core/migrations.py` : une étape par version. Ajout d'un champ facultatif →
version mineure ; changement incompatible → version majeure.

| Version | Changement |
|---|---|
| 1.1 | Version initiale |
| 1.2 | Rappels : récurrence, état actif, dernière réalisation, notifications envoyées |
