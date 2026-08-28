# Prévision de la demande

## Objectif et limites

La prévision estime une demande, pas une garantie. Elle n'écrit jamais le stock et ne crée jamais de commande fournisseur. Chaque résultat conserve méthode, métrique, date, paramètres et explication.

## Pipeline implémenté

1. Agréger les unités des commandes terminées par semaine et produit, en incluant les semaines à zéro dans la fenêtre.
2. Exiger un minimum configurable de semaines.
3. Réserver les dernières semaines à la validation chronologique.
4. Entraîner moyenne mobile simple, moyenne mobile pondérée et lissage exponentiel.
5. Comparer à une baseline naïve (dernière observation ou moyenne historique documentée).
6. Calculer MAE; calculer MAPE uniquement lorsque les observations réelles non nulles le permettent.
7. Choisir le modèle valide au MAE minimal, avec règle de départage simple.
8. Réentraîner sur l'historique disponible et persister la prévision.

## Fallback

Avec un historique insuffisant, utiliser une moyenne prudente sur les semaines disponibles; sans vente, retourner zéro avec confiance faible. Le résultat est marqué `FALLBACK` et explique la quantité d'historique manquante.

## Réapprovisionnement

```text
demandDuringLeadTime = predictedAverageDailyDemand × leadTimeDays
reorderPoint = demandDuringLeadTime + safetyStock
recommendedQuantity = max(0, targetStock - currentAvailableStock)
```

Le stock de sécurité utilise `forecast.safety_stock_days` (7 jours par défaut). La cible couvre le délai fournisseur puis 30 jours de demande; les quantités sont arrondies vers l'entier supérieur. Le délai du produit est prioritaire, puis celui du fournisseur, puis un repli de 7 jours.

## Tests

Le workflow automatisé prouve le fallback, la persistance et la génération d'une recommandation sans commande automatique. Les tests unitaires détaillés des séries constantes, tendances et départages restent à enrichir pendant le durcissement.
