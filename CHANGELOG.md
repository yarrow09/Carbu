# Journal des modifications

Format inspiré de [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/). Le projet
suit le [versionnage sémantique](https://semver.org/lang/fr/).

## [0.3.0] — non publiée (phase 3)

### Modifié

- **L'intégration s'appelle désormais Carbu** (dépôt `yarrow09/Carbu`). Comme rien
  n'avait été publié, l'identifiant technique change sans migration :
  - domaine `carbu` (anciennement `vehicle_log`) ;
  - services `carbu.*` ;
  - cartes `custom:carbu-card`, `custom:carbu-journal-card` et `custom:carbu-stats-card` ;
  - stockage `.storage/carbu.data` ;
  - fichiers dans `<config>/carbu/`.

  Les sections ci-dessous gardent les anciens noms.
- Licence : GNU GPL version 3 ou ultérieure.

### Ajouté

- **Sauvegarde complète** au format ZIP (`backup.json` versionné et pièces jointes),
  depuis la page globale ou le service `vehicle_log.backup`.
- **Restauration** depuis une sauvegarde existante ou une archive envoyée, avec aperçu
  et confirmation. Les véhicules sont recréés avec leurs identifiants, ce qui rend
  l'aller-retour sans perte (testé).
- **Import CSV** dans un véhicule depuis la carte journal :
  - aperçu des lignes nouvelles, des doublons et des erreurs avant écriture ;
  - tolérance aux fichiers modifiés dans un tableur (encodage, dates, décimales) ;
  - catégories résolues ou créées.
- Documentation des formats de sauvegarde et d'import.

### Retiré du périmètre

- Rapport PDF et coût total de possession avec amortissement, abandonnés à la
  demande du porteur du projet. Le calcul de TCO présent depuis la phase 1 a été
  supprimé.

## [0.2.0] — non publiée (phase 2)

### Ajouté

- **Rappels** :
  - déclenchement par date, par kilométrage, ou par le premier des deux atteint ;
  - seuil d'alerte en jours et en km ;
  - récurrence facultative, et bouton « Fait » qui calcule l'échéance suivante ;
  - un `binary_sensor` « dû » par rappel, ajouté et retiré sans redémarrage.
- **Notifications** des rappels via des entités `notify` ou d'anciens services
  `notify.xxx` : une à l'alerte, une à l'échéance, sans répétition.
- **Services** `vehicle_log.add_fuel`, `add_expense`, `update_odometer` et
  `export_data` :
  - réponse facultative ;
  - valeurs dans les unités du véhicule ;
  - les avertissements sont journalisés sans bloquer l'enregistrement, sauf avec
    `strict`.
- **Export CSV complet** : pleins, dépenses, relevés, rappels et catégories. UTF-8 avec
  BOM, séparateur « ; », point décimal, format documenté.
- **Carte `vehicle-log-stats-card`** : statistiques sur 30 jours, 3 mois, 12 mois ou
  depuis l'acquisition, courbe de consommation par plein avec moyenne mobile
  pondérée, dépenses par catégorie.
- **Section rappels** dans la carte principale.
- **Options** : destinataires des notifications, taille de la moyenne mobile.

### Modifié

- Stockage en version 1.2, avec migration automatique depuis la 1.1 : récurrence et
  suivi des notifications des rappels.
- Couleurs d'état assombries dans les cartes, pour garder un contraste AA quel que soit
  le thème.

### Retiré du périmètre

- La recherche des prix des carburants en ligne (sources, cache, entités de prix,
  carte des stations, service `refresh_fuel_prices`) a été abandonnée à la demande
  du porteur du projet. L'intégration se concentre sur le suivi de la consommation.

## [0.1.0] — non publiée (phase 1 : MVP)

### Ajouté

- **Installation et configuration graphiques** : une entrée unique « Carnet de bord »,
  puis un véhicule par subentry via un assistant en 4 étapes (identité, unités,
  carburant ou bi-carburant, plage de consommation plausible). Les véhicules se
  reconfigurent et se suppriment depuis l'interface, sans redémarrage.
- **Page globale** : catégories de dépense personnalisées (nom, couleur, icône),
  renommage, suppression confirmée avec réassignation des dépenses à « Autre ».
- **Journal carburant** :
  - saisie avec deux valeurs sur trois parmi quantité, prix unitaire et montant ;
  - kilométrage pré-rempli ;
  - modification et suppression avec recalcul.
- **Contrôles de cohérence**, sous forme d'avertissements à confirmer : kilométrage
  inférieur au relevé précédent ou supérieur au suivant, consommation hors plage,
  plein supérieur au réservoir, carburant non déclaré, montant incohérent.
- **Journal des coûts** : catégories, filtres par période, catégorie et montant,
  pièces jointes (JPEG, PNG, WebP, PDF, 10 Mo au plus).
- **Calculs** : consommation réelle entre pleins complets (pleins partiels cumulés),
  moyenne pondérée, coût par distance, kilométrage total et par semaine, mois et année,
  conversions km/miles, litres/gallons, L/100 km, km/L et MPG US/UK.
- **Entités par véhicule** : consommation moyenne (et second carburant), coût du mois,
  coût par distance, kilométrage total, distances de la semaine, du mois et de l'année,
  `number` « Kilométrage actuel ».
- **Cartes Lovelace** `vehicle-log-card` et `vehicle-log-journal-card`, chargées
  automatiquement : vue d'ensemble, saisie rapide, 5 dernières entrées, histogramme
  mensuel empilé, journal filtrable, éditeur graphique, thème clair et sombre, mobile,
  français et anglais.
- **Stockage local versionné** (`.storage/vehicle_log.data`, version 1.1) avec
  migrations et écriture différée.
- **Tests** :
  - unitaires des calculs, sur un jeu de référence calculé à la main ;
  - d'intégration du config flow, des entités, de l'API websocket et des pièces jointes ;
  - de performance sur 5 ans de données.
- Traductions française et anglaise.
