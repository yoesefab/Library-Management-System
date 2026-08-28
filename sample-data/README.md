# Données de démonstration

Tous les contenus de ce dossier sont **entièrement synthétiques** et destinés uniquement au développement et à la soutenance. Ils ne proviennent ni de clients ni du catalogue réel de Maarif Culture.

## Fichiers

- `catalog.csv`: 15 livres français, arabes et anglais avec référentiels, coûts, seuils, délais, stock initial et scénario attendu.
- `sales-valid.csv`: 280 lignes, 52 commandes terminées hebdomadaires et deux commandes non terminées, du 1er septembre 2025 au 26 août 2026.
- `sales-invalid.csv`: 10 lignes couvrant valeurs manquantes, date, SKU, quantité, montant, statut, produit dupliqué et incohérence de commande.
- `synthetic-demo-data.xlsx`: vue lisible des trois jeux de données avec filtres et formats MAD.

Le jeu valide contient une saisonnalité scolaire en août/septembre, une meilleure vente, une rotation lente, un stock dormant, une rupture exacte, plusieurs villes marocaines et un produit avec historique de prévision insuffisant.

## Chargement

1. Démarrer le backend avec `DEMO_DATA_ENABLED=true`.
2. Se connecter comme administrateur et envoyer le jeton CSRF.
3. Appeler `POST /api/admin/demo-data/catalog` pour créer les référentiels, produits et stocks initiaux. L'opération est idempotente.
4. Prévisualiser `sales-invalid.csv` sans le confirmer.
5. Prévisualiser puis confirmer `sales-valid.csv`.

La confirmation valide conduit notamment `LIV-AR-004` de 26 à 0 unités et `LIV-FR-001` de 180 à 11 unités. Réimporter le même fichier ne crée aucun second mouvement de vente.

Le champ `discount` est un montant absolu en MAD par ligne (ADR-005).
