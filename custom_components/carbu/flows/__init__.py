"""Étapes du config flow, découpées par domaine.

* ``vehicle`` : assistant d'ajout / modification d'un véhicule (subentry) ;
* ``categories`` : catégories de dépense de la page globale ;
* ``settings`` : notifications et statistiques ;
* ``backup`` : sauvegarde complète et restauration.

``config_flow.py`` assemble ces morceaux : Home Assistant y cherche les
classes de flow.
"""
