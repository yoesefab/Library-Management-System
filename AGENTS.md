# Instructions de contribution — Maarif Analytics

## Périmètre

Ce dépôt contient un backend monolithique en couches (`backend/`), le client React approuvé (`frontend/`), `docs/` et `sample-data/`. Le frontend conserve l’identité visuelle du prototype validé; ne pas le redessiner sans demande explicite. Préserver les changements non liés et ne jamais utiliser de commande Git destructive.

## Règles obligatoires

- Le code et les noms techniques sont en anglais; les messages et descriptions OpenAPI visibles sont en français.
- Les montants utilisent `BigDecimal` côté Java et `numeric(19,2)` en base, jamais `double` ou `float`.
- Les instants sont stockés en UTC; l'affichage métier utilise `Africa/Casablanca`.
- Les contrôleurs restent minces; règles métier et transactions vivent dans les services/domaines.
- Les entités JPA ne sont jamais exposées directement: employer des DTO et un mapping explicite.
- Toute évolution du schéma passe par une nouvelle migration Flyway immuable.
- Tout changement de stock doit produire un mouvement; ne jamais mettre à jour un stock silencieusement.
- L'autorisation backend est la référence et doit être testée par rôle.
- Ne jamais journaliser ou committer mot de passe, jeton, secret ou donnée personnelle réelle.
- Ne jamais se connecter au système de production Maarif Culture sans autorisation explicite.
- Maintenir la documentation et `CHANGELOG.md` avec le code.

## Vérifications avant livraison

Depuis la racine:

```bash
./backend/mvnw -f backend/pom.xml verify
POSTGRES_PASSWORD=local-verification-only docker compose config
```

Pour un changement frontend, exécuter aussi depuis `frontend/`: `npm run format:check`, `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, `npm run test:sites` et, avec la pile synthétique locale, `npm run test:e2e`.

Les tests d'intégration Testcontainers et les tests E2E nécessitent Docker. Ne jamais déclarer un jalon terminé si une vérification pertinente échoue; documenter clairement une vérification impossible faute d'outil.

## Architecture en couches du backend

Toutes les fonctionnalités utilisent les packages globaux suivants sous `ma.maarifculture.analytics`: `controller`, `dto`, `model`, `repository`, `service`, `mapper`, `exception` et `config`. Ne pas recréer de packages par fonctionnalité comme `catalog.*` ou `inventory.*`.

Les dépendances suivent le sens `controller -> service -> repository -> model`. Les contrôleurs manipulent des DTO, les services portent les règles métier et les transactions, les repositories encapsulent la persistance, les mappers assurent les conversions explicites, et les exceptions/configurations restent transversales. Éviter les cycles, l'accès direct d'un contrôleur à un repository et l'exposition d'une entité JPA dans l'API.
