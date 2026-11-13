# Journal des modifications

Format inspiré de [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/). Le projet
suit le [versionnage sémantique](https://semver.org/lang/fr/).

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
