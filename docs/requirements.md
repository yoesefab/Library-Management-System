# Exigences

## Fonctionnelles

| ID | Exigence | Priorité | Jalon cible |
|---|---|---:|---:|
| F-01 | Gérer utilisateurs et rôles administrateur, manager et employé de stock | Must | 4 |
| F-02 | Gérer catalogue, références, fournisseurs et seuils | Must | 5 |
| F-03 | Calculer le stock à partir de mouvements traçables | Must | 5 |
| F-04 | Créer une vente terminée et décrémenter le stock exactement une fois | Must | 6 |
| F-05 | Prévisualiser, valider et confirmer un import CSV idempotent | Must | 6 |
| F-06 | Afficher les KPI filtrés côté serveur | Must | 7 |
| F-07 | Détecter, expliquer, acquitter et résoudre les alertes | Must | 8 |
| F-08 | Comparer des méthodes de prévision explicables et conserver le résultat | Must | 9 |
| F-09 | Générer une recommandation sans modifier automatiquement le stock | Must | 9 |
| F-10 | Exporter CSV, inventaire et rapport PDF mensuel | Must | 10 |
| F-11 | Synchroniser WooCommerce en lecture seule | Could | 11 |

## Règles métier critiques

- RM-01: un stock négatif est refusé, sauf correction explicite autorisée d'un administrateur avec motif.
- RM-02: toute variation de stock a exactement un mouvement.
- RM-03: une transition de commande vers `COMPLETED` décrémente une seule fois; son annulation restaure une seule fois.
- RM-04: `(source, external_reference)` identifie une commande importée.
- RM-05: `(import_type, file_checksum)` empêche la confirmation répétée d'un même fichier.
- RM-06: un produit inactif reste consultable dans l'historique mais ne peut entrer dans une nouvelle commande.
- RM-07: toute alerte ou recommandation contient une explication humaine.
- RM-08: une prévision n'écrit ni le stock ni une commande fournisseur.
- RM-09: les mutations critiques sont transactionnelles et auditées.
- RM-10: les listes sont paginées; filtres et recherche sont exécutés côté serveur.

## Non fonctionnelles

- NF-01 Sécurité: hash robuste, cookie HttpOnly, protection CSRF/CORS cohérente, RBAC backend, limitation des imports et erreurs sûres.
- NF-02 Exactitude: `BigDecimal`/`numeric`, dates métier `Africa/Casablanca`, instants UTC.
- NF-03 Maintenabilité: monolithe backend en couches, DTO, mapping explicite, migrations immuables.
- NF-04 Utilisabilité API: contrats OpenAPI, messages français, erreurs structurées et exemples Swagger.
- NF-05 Testabilité: tests unitaires, sécurité, intégration PostgreSQL/Testcontainers et API.
- NF-06 Portabilité: exécution locale Docker Compose sans service payant.
- NF-07 Observabilité: health checks, logs structurés sans secrets et historique d'audit.

## Contraintes et traçabilité

La matrice détaillée exigences → endpoints → tests sera enrichie à chaque jalon. Au jalon 1, NF-03, NF-05 (smoke), NF-06 (configuration) et NF-07 (health) sont amorcées.
