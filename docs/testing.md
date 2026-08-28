# Stratégie de test

## Frontend

Depuis `frontend/`: `npm run typecheck`, `npm run lint`, `npm test`, `npm run build` et `npm run test:sites`. Avec la pile synthétique locale, `E2E_EMAIL='compte-local' E2E_PASSWORD='secret-local' npm run test:e2e` valide le parcours principal. Les identifiants E2E ne sont jamais committés.

Vitest/Testing Library couvre la connexion, la restauration de session, les routes protégées, la navigation par rôle, le chargement et le formulaire produit, la pagination, la prévention d’un stock négatif, les filtres dashboard en heure de Casablanca, les erreurs d’aperçu CSV, la résolution d’alertes, la prévision de repli, les téléchargements de rapports ainsi que les états de chargement et d’erreur. Playwright valide connexion, catalogue, inventaire et déconnexion contre Spring Boot/PostgreSQL.

- Tests unitaires: invariants produits, services catalogue et inventaire.
- Tests API MVC: validation, pagination et erreurs structurées.
- Tests sécurité: authentification par session, rejet anonyme et refus des KPI financiers au rôle stock.
- Test HTTP de démonstration complet: connexion, chargeur idempotent, CSV invalide, import annuel confirmé deux fois, stock, KPI, alertes, deux chemins de prévision, recommandation et exports.
- Smoke Spring: démarrage complet avec Flyway V1/V2 et validation Hibernate sur H2 en mode PostgreSQL.
- Intégrations PostgreSQL: mapping catalogue et parcours HTTP réel via les classes `*IT`.
- Testcontainers PostgreSQL 17 prouve les migrations, le mapping catalogue et le parcours HTTP complet sur le moteur cible.

```bash
./backend/mvnw -f backend/pom.xml test
./backend/mvnw -f backend/pom.xml verify
```

PostgreSQL externe contrôlé:

```bash
MAARIF_EXTERNAL_POSTGRES_TEST=true \
DB_URL=jdbc:postgresql://127.0.0.1:55432/maarif_analytics \
POSTGRES_USER=maarif POSTGRES_PASSWORD=local-only \
./backend/mvnw -f backend/pom.xml verify
```

Un test ignoré n'est jamais annoncé comme réussi. H2 est un smoke rapide, pas une preuve de compatibilité PostgreSQL.

Le scénario principal est `BackendEndToEndApiTest`. `BackendEndToEndPostgresIT` réexécute le même scénario sur PostgreSQL 17 Testcontainers. Ils utilisent les fichiers versionnés de `sample-data/` afin que les tests automatisés et la soutenance exercent exactement les mêmes données.
