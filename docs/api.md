# API

## Intégration frontend

La cartographie exhaustive est maintenue dans `docs/frontend-route-api-mapping.md`. Le client lit `VITE_API_BASE_URL`, envoie `credentials: "include"`, récupère le jeton via `GET /api/auth/csrf` avant une mutation protégée et utilise le nom d’en-tête renvoyé par le backend. Les réponses `ApiError` alimentent les messages globaux et les violations de champ.

Le client traite explicitement 401, 403, 404, 409, validation et erreurs serveur. Les `AbortSignal` de TanStack Query sont transmis jusqu’à `fetch`.

## Conventions

- Base `/api`, JSON UTF-8, pagination `page`/`size` (maximum 100).
- Instants ISO 8601 en UTC; montants décimaux exacts.
- Erreurs: `timestamp`, `status`, `code`, `message`, `path`, `violations`.
- Sauf santé, métadonnées, Swagger et connexion, les routes exigent une session.
- Les mutations exigent le jeton CSRF retourné par `GET /api/auth/csrf`.

## Endpoints implémentés

| Groupe | Routes principales | Rôles |
|---|---|---|
| Auth | `GET /api/auth/csrf`, `POST /api/auth/login`, `GET /api/auth/me`, `POST /api/auth/logout` | public/session |
| Catalogue | `/api/products`, `/api/catalog/categories`, `/authors`, `/publishers`, `/suppliers` | tous en lecture; admin/manager en mutation |
| Inventaire | `GET /api/inventory`, `GET /api/inventory/products/{id}/movements`, `POST /api/inventory/movements` | tous les rôles |
| Commandes | `GET/POST /api/orders`, `GET /api/orders/{id}`, `PATCH /api/orders/{id}/status` | admin/manager |
| Imports | `POST /api/imports/sales/preview`, `POST /api/imports/{id}/confirm`, historique et erreurs CSV | admin/manager |
| Dashboard | `GET /api/dashboard` avec `start`, `end`, catégorie, langue, auteur, éditeur | admin/manager |
| Alertes | `GET /api/alerts`, refresh, acknowledge, resolve | selon opération |
| Prévisions | génération produit et recommandations sous `/api/forecasting` | admin/manager |
| Rapports | inventaire, stock faible, recommandations CSV et `management.pdf` | admin/manager |
| Administration | utilisateurs, audit et paramètres sous `/api/admin` | administrateur |
| Démonstration | `POST /api/admin/demo-data/catalog`, présent uniquement si `DEMO_DATA_ENABLED=true` | administrateur |

Le contrat exécutable complet est disponible dans `/v3/api-docs` et `/swagger-ui.html`.

Le chargeur de démonstration est idempotent: il ne recrée pas les SKU ou mouvements `INITIAL_STOCK` déjà présents. Il ne charge aucune donnée réelle et doit rester désactivé en production.
