# Guide d'utilisation

## Interface React

L’application s’ouvre sur `/login`. Après connexion, les gestionnaires et administrateurs arrivent sur `/dashboard`; les employés de stock sont dirigés vers `/inventory`. La barre latérale affiche uniquement les sections autorisées. Produits, inventaire, commandes, imports, alertes, prévisions, rapports et administration utilisent les données du backend et présentent des états de chargement, vide et erreur.

## Connexion

1. Démarrer PostgreSQL et le backend avec les variables bootstrap administrateur.
2. Ouvrir `http://localhost:8080/swagger-ui.html`.
3. Appeler `GET /api/auth/csrf` et conserver cookie/token.
4. Appeler `POST /api/auth/login` avec email et mot de passe.
5. Pour chaque mutation, envoyer le token via `X-XSRF-TOKEN`.

## Parcours de démonstration

1. Activer localement `DEMO_DATA_ENABLED=true`.
2. Appeler `POST /api/admin/demo-data/catalog`; vérifier `productsAvailable=15`.
3. Prévisualiser `sample-data/sales-invalid.csv`; observer les numéros de ligne et codes d'erreur sans confirmer.
4. Prévisualiser `sample-data/sales-valid.csv`; vérifier `status=READY`, `totalRows=280`, puis confirmer l'identifiant retourné.
5. Confirmer une seconde fois le même identifiant et réenvoyer le même fichier: le stock reste inchangé.
6. Vérifier que `LIV-AR-004` vaut 0 et que `LIV-FR-001` vaut 11.
7. Consulter le dashboard du `2025-09-01T00:00:00Z` au `2026-08-27T23:59:59Z`: 52 commandes terminées et 585 unités vendues.
8. Rafraîchir les alertes; observer rupture, stocks faibles, rotation lente et stock dormant.
9. Générer une prévision pour `LIV-FR-001`, puis le repli `FALLBACK` pour `NEW-EN-015`.
10. Générer la recommandation de `LIV-AR-004`; aucune commande fournisseur n'est créée.
11. Exporter inventaire, stock faible, recommandations et rapport PDF.
12. Consulter `/api/admin/audit-logs` pour les mutations sensibles.

Toutes les données de démonstration sont synthétiques. Les prévisions expriment une estimation et ne modifient jamais le stock ni ne créent une commande fournisseur.
