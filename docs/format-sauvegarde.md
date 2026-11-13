# Format de sauvegarde complète

Une sauvegarde est une archive ZIP nommée `vehicle_log_backup_<AAAAMMJJ-HHMMSS>.zip`,
rangée dans `<config>/vehicle_log/backups/`. Elle est donc aussi incluse dans les
sauvegardes de Home Assistant. On la crée depuis la page globale de l'intégration
(**Créer une sauvegarde complète**) ou avec le service `vehicle_log.backup`.

Version du format : **1**.

## Contenu de l'archive

```
backup.json
attachments/<vehicle_id>/<expense_id>.<jpg|png|webp|pdf>
```

## `backup.json`

```json
{
  "format": "vehicle_log_backup",
  "format_version": 1,
  "created_at": "2026-03-25T13:00:00",
  "integration_version": "0.3.0",
  "storage_version": [1, 2],
  "vehicles": [
    {"id": "<subentry_id>", "title": "Clio", "data": { "...": "configuration du véhicule" }}
  ],
  "options": {"notify_entities": [], "notify_services": [], "moving_average_window": 5},
  "data": { "...": "même structure que le fichier de stockage, voir format-stockage.md" }
}
```

| Champ | Contenu |
|---|---|
| `vehicles[].data` | Configuration saisie dans l'assistant véhicule : unités, carburants, réservoirs, plage de consommation… |
| `options` | Réglages de la page globale |
| `storage_version` | Version des `data`. Une sauvegarde plus ancienne est migrée à la lecture. |
| `data` | Catégories, pleins, dépenses, relevés et rappels, en unités métriques |

## Restauration

Depuis la page globale, **Restaurer une sauvegarde** propose deux sources : une
sauvegarde du dossier, ou une archive envoyée depuis l'ordinateur. Un aperçu indique
ce qui sera restauré (véhicules, nombre d'entrées, pièces jointes) avant toute
modification.

La restauration **remplace tout** :
- les véhicules, recréés avec leurs identifiants d'origine, ce qui conserve les
  entités et l'historique de Home Assistant ;
- les options ;
- les données ;
- les pièces jointes.

L'intégration est ensuite rechargée une seule fois.

Une archive est refusée dans ces cas :
- ce n'est pas un ZIP, ou elle est endommagée ;
- elle ne contient pas `backup.json` ;
- `format` ou `format_version` est inconnu ;
- les données sont invalides ;
- elle dépasse 1 Go une fois décompressée.

Seuls les fichiers de pièces jointes au chemin attendu sont restaurés, ce qui écarte
tout chemin de fichier malveillant.
