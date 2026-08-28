# Cartographie frontend, routes et API

Cette cartographie a été établie avant la refactorisation du prototype approuvé. Les chemins frontend sont gérés par React Router et les données métier proviennent exclusivement des DTO backend.

| Écran du prototype | Route frontend | API backend |
| --- | --- | --- |
| Connexion | `/login` | `GET /api/auth/csrf`, `POST /api/auth/login`, `GET /api/auth/me`, `POST /api/auth/logout` |
| Tableau de bord | `/dashboard` | `GET /api/dashboard`, référentiels sous `/api/catalog/*` |
| Catalogue | `/products` | `GET /api/products` |
| Création produit | `/products/new` | `POST /api/products`, `GET /api/catalog/*` |
| Détail produit | `/products/:id` | `GET /api/products/{id}`, `GET /api/inventory/products/{id}/movements`, `GET /api/forecasting/recommendations` |
| Modification produit | `/products/:id/edit` | `GET /api/products/{id}`, `PUT /api/products/{id}`, `DELETE /api/products/{id}` |
| Inventaire | `/inventory` | `GET /api/inventory`, `POST /api/inventory/movements`, historique par produit |
| Commandes | `/orders` | `GET /api/orders`, `POST /api/orders` |
| Détail commande | `/orders/:id` | `GET /api/orders/{id}`, `PATCH /api/orders/{id}/status` |
| Imports CSV | `/imports` | `POST /api/imports/sales/preview`, `GET /api/imports`, `POST /api/imports/{id}/confirm` |
| Détail import | `/imports/:id` | `GET /api/imports/{id}`, `GET /api/imports/{id}/errors.csv` |
| Alertes | `/alerts` | `GET /api/alerts`, actions `refresh`, `acknowledge`, `resolve` |
| Prévisions | `/forecasting` | génération par produit et `/api/forecasting/recommendations` |
| Rapports | `/reports` | exports sous `/api/reports/*` |
| Utilisateurs | `/administration/users` | `GET/POST/PUT /api/admin/users` |
| Paramètres | `/administration/settings` | `GET /api/admin/settings`, `PUT /api/admin/settings/{key}` |
| Audit | `/administration/audit` | `GET /api/admin/audit-logs` |
| Accès refusé | `/unauthorized` | aucun appel métier |

## Écarts backend connus

- La désactivation d’un produit est disponible, mais aucune réactivation n’est exposée.
- Le backend calcule une prévision à la demande et expose les recommandations; il ne fournit pas une série temporelle historique/prédite complète pour reproduire un graphique de courbe. L’interface présente donc les valeurs et l’explication réelles sans inventer de points.
- Les listes d’inventaire ne proposent pas encore de recherche ou de filtres côté serveur. Les contrôles correspondants filtrent uniquement la page chargée et l’interface l’indique explicitement.
- L’historique des mouvements n’est exposé que par produit ; aucun flux global consolidé n’est simulé.

## Rôles

- `ADMINISTRATOR`: toutes les sections, dont administration.
- `MANAGER`: dashboard, catalogue en écriture, inventaire, commandes, imports, alertes, prévisions et rapports.
- `STOCK_EMPLOYEE`: catalogue en lecture, inventaire et alertes; les routes non autorisées redirigent vers `/unauthorized`.
