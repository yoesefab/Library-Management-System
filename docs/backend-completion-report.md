# Rapport — version backend complète

**Date:** 2026-08-27  
**Périmètre:** backend-only, jalons fonctionnels 1 à 10.

## Capacités livrées

- Sessions Spring Security, BCrypt, CSRF, rôles et bootstrap administrateur sans secret source.
- Utilisateurs, activation, rôles, paramètres et audit des mutations importantes.
- Catalogue et référentiels avec DTO, validation, pagination et désactivation logique.
- Stock calculé par mouvements, validation du sens et exception administrateur motivée pour stock négatif.
- Commandes et transitions appliquant `SALE`/`CUSTOMER_RETURN` une fois grâce aux contraintes d'unicité.
- Import CSV prévisualisé puis confirmé, checksum SHA-256, erreurs numérotées et déduplication.
- KPI serveur avec plage de dates et filtres catégorie/langue/auteur/éditeur.
- Alertes expliquées, acquittement/résolution et seuils de rotation configurables.
- Prévisions hebdomadaires SMA, WMA, lissage exponentiel et baseline comparées par MAE; MAPE enregistré dans les paramètres lorsqu'il est valide; fallback documenté.
- Recommandations expliquées sans mutation automatique du stock.
- Exports inventaire/stock faible/recommandations CSV et rapport PDF.
- Jeu synthétique annuel, chargeur idempotent opt-in et parcours HTTP complet de soutenance.

## Preuves exécutées

- `./backend/mvnw -f backend/pom.xml verify`: 21 tests unitaires/API, zéro échec.
- PostgreSQL 17 Testcontainers: mapping catalogue et parcours HTTP annuel complet, 3 tests exécutés sans échec.
- Intégrations PostgreSQL externes activables séparément: 2 tests validés lors du jalon précédent.
- PostgreSQL 18.6: Flyway V1 et V2 validées; Hibernate `ddl-auto=validate` accepté.
- Test de workflow HTTP sur H2 et PostgreSQL: connexion, chargeur synthétique, CSV invalide, import annuel confirmé deux fois, stock réduit une seule fois, KPI, alertes, prévisions, recommandation, CSV et PDF.
- Test sécurité: requête anonyme `401`, session valide, rôle stock refusé sur dashboard financier (`403`).
- Runtime: health `UP`, statut `BACKEND_READY`, connexion administrateur et inventaire protégé.

## Limites connues

- Sessions en mémoire adaptées à une instance; Spring Session JDBC est requis pour plusieurs réplicas.
- Limitation de débit du login et tests de concurrence à renforcer avant exposition Internet.
- WooCommerce reste volontairement non implémenté et aucune connexion production n'a été effectuée.
- Les anciens rapports de jalons mentionnant React décrivent un état historique supprimé du produit courant.
