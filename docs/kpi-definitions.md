# Définitions des KPI

Toutes les mesures utilisent les commandes `COMPLETED`, la plage `[dateFrom, dateTo]` dans `Africa/Casablanca` et les mêmes filtres serveur (catégorie, langue, auteur, éditeur). Les retours/annulations seront traités selon leur statut et mouvement associé, sans double comptage.

| KPI | Formule de référence |
|---|---|
| Chiffre d'affaires | `Σ line_total` des lignes éligibles |
| Nombre de commandes | nombre distinct de commandes éligibles |
| Unités vendues | `Σ quantity` des lignes éligibles |
| Panier moyen | chiffre d'affaires / commandes, 0 si aucune commande |
| Stock courant | `Σ inventory_movement.quantity` jusqu'à l'instant de référence |
| Valeur du stock | `Σ max(stock,0) × purchase_cost`; produits sans coût signalés séparément |
| Stock faible | produits actifs avec `0 < stock <= minimum_stock_threshold` |
| Rupture | produits actifs avec `stock = 0` |
| Meilleures ventes | produits triés par unités vendues, puis chiffre d'affaires |
| Rotation du stock | coût des marchandises vendues / stock moyen au coût, seulement avec coûts suffisants |
| Jours de stock estimés | stock disponible / demande quotidienne prévue; non défini si demande nulle |
| Vente lente | seuil configurable de faible demande sur une fenêtre documentée |
| Stock mort | stock positif sans vente pendant une durée configurable |

Les ventes par catégorie/langue et tendances utilisent les mêmes lignes éligibles, regroupées par dimension et période. Les seuils techniques par défaut sont 90 jours sans vente pour `SLOW_MOVING` et 180 jours pour `DEAD_STOCK`; ils sont configurables dans `app_setting` et doivent encore être validés avec le métier.
