# Rapport du jalon 1 — Fondation vérifiée

**Date:** 2026-08-27  
**Périmètre arrêté:** aucune authentification, dashboard, prévision ou synchronisation WooCommerce.

## Ce qui fonctionne

- Monorepo structuré en backend, frontend, documentation, infrastructure et exemples synthétiques.
- API Spring Boot Java 21 construite par Maven Wrapper.
- Configuration PostgreSQL externe et migration Flyway V1 du domaine complet.
- Endpoint `/api/platform`, santé Actuator et génération OpenAPI.
- SPA React/TypeScript/Vite avec Tailwind, React Router et TanStack Query.
- Page française responsive avec états API chargement, succès et erreur.
- Conteneurs backend/frontend et stack Compose avec dépendances de santé.
- Tests smoke backend, composants frontend et E2E Playwright.

## Fichiers principaux

- Racine: `README.md`, `AGENTS.md`, `CHANGELOG.md`, `.env.example`, `.gitignore`, `docker-compose.yml`.
- Backend: `pom.xml`, Maven Wrapper, application/configuration, contrôleur plateforme, migration V1, tests et Dockerfile.
- Frontend: configuration Vite/TypeScript/Playwright, page de fondation, design tokens, client API, tests, Nginx et Dockerfile.
- Documentation: cadrage, exigences, stories, architecture, base, API, sécurité, KPI, prévision, tests, déploiement, guide, décisions et plan.
- Données: un CSV synthétique valide et un CSV volontairement invalide.

## Vérifications exécutées

| Vérification | Résultat |
|---|---|
| `./mvnw -B verify` | succès; 2 tests, 0 échec; migration V1 appliquée sur H2 PostgreSQL-mode |
| `npm ci` | succès; lockfile reproductible |
| `npm run lint` | succès |
| `npm run test:run` | succès; 2 tests, 0 échec |
| `npm run build` | succès; TypeScript strict et bundle Vite |
| `npm run test:e2e` | succès; 1 scénario Chromium |
| `npm audit --audit-level=high` | 0 vulnérabilité connue signalée |
| Démarrage API smoke + `curl` | santé `UP`, métadonnées et OpenAPI disponibles |
| Inspection navigateur 1440×900 et 768×1024 | aucun log d'erreur; aucun débordement horizontal tablette |
| `docker compose config/up` | non exécuté: Docker absent de la machine |

## Vérification manuelle recommandée après installation de Docker

```bash
cp .env.example .env
docker compose config
docker compose up --build
curl --fail http://localhost:8080/actuator/health
curl --fail http://localhost:8080/api/platform
```

Ouvrir ensuite `http://localhost:5173` et `http://localhost:8080/swagger-ui.html`, puis arrêter avec `docker compose down`. Ne pas ajouter `--volumes` sauf intention explicite de supprimer la base locale.

## Hypothèses confirmées ou différées

- `discount` est un montant MAD absolu par ligne CSV.
- Le stock courant est dérivé des mouvements.
- Les instants sont UTC et le calendrier métier `Africa/Casablanca`.
- Une session HttpOnly/CSRF est proposée mais ne sera décidée définitivement qu'au jalon 4.
- Les seuils vente lente/stock mort et la valorisation des coûts nécessitent validation métier.

## Limites et risques

- La migration n'a pas encore été exécutée sur un vrai PostgreSQL local; H2 ne remplace pas Testcontainers.
- Les entités JPA et services métier ne sont pas encore implémentés; le schéma est une conception initiale évolutive.
- Le mot de passe `.env.example` doit être changé; `.env` est ignoré par Git.
- Le smoke manuel H2 requiert une commande de classpath de test et n'est pas un mode de déploiement.
- Le jeu annuel synthétique et les règles de prévision seront créés avec leur jalon pour éviter une divergence prématurée.

## Recommandation

Installer Docker Engine/Compose, valider la stack et PostgreSQL, puis démarrer le jalon 2 par le mapping JPA du catalogue et des tests PostgreSQL Testcontainers. Ne pas avancer vers l'authentification avant que la migration V1 soit prouvée sur PostgreSQL.

