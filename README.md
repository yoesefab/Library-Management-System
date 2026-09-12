# Maarif Analytics

Maarif Analytics est une application web de démonstration pour piloter le catalogue, les ventes et les stocks de **Maarif Culture**. Elle réunit une API Spring Boot, une interface React et PostgreSQL dans un monolithe en couches, exécutable localement avec Docker Compose et déployable sur un VPS.

> [!IMPORTANT]
> Les fichiers de `sample-data/` et le catalogue de démonstration sont entièrement fictifs. Ne connectez jamais ce projet au système de production de Maarif Culture sans autorisation explicite.

## Pourquoi utiliser ce projet ?

L'application fournit un parcours cohérent de la transaction à la décision :

- gérer un catalogue multilingue, ses images et ses référentiels;
- conserver un stock traçable, calculé à partir des mouvements;
- créer des commandes et importer des ventes CSV après prévisualisation;
- suivre les KPI, alertes de stock et produits à faible rotation;
- produire des prévisions et recommandations de réapprovisionnement explicables;
- exporter l'inventaire en CSV et les rapports de gestion en PDF;
- administrer les utilisateurs, rôles, paramètres et journaux d'audit.

Trois profils sont pris en charge : **administrateur**, **manager** et **employé de stock**. L'autorisation est toujours vérifiée par le backend; le masquage d'une action dans l'interface ne constitue pas un contrôle de sécurité.

## Technologies

| Partie | Technologies principales |
| --- | --- |
| Backend | Java 21, Spring Boot 3, Spring Security, Spring Data JPA |
| Données | PostgreSQL 17, Hibernate, Flyway |
| Frontend | React 19, TypeScript, Vite, TanStack Router/Query, Tailwind CSS |
| Sécurité | JWT HS256 en cookie HttpOnly, CSRF, BCrypt, autorisation par rôle |
| Tests | JUnit, MockMvc, H2, Testcontainers, Vitest, Playwright |
| Déploiement | Docker Compose, Nginx, Caddy |

## Structure du dépôt

```text
.
├── backend/             API Java et migrations Flyway
├── frontend/            client React/TypeScript servi par Nginx
├── docs/                documentation fonctionnelle et technique
├── sample-data/         données CSV/XLSX exclusivement synthétiques
├── scripts/             utilitaires d'installation
├── docker-compose.yml   pile de déploiement
└── docker-compose.dev.yml  exposition locale des services
```

Le backend respecte le sens de dépendance `controller -> service -> repository -> model`. Les contrôleurs échangent des DTO, les services portent les règles métier et les transactions, et les entités JPA ne sont jamais exposées directement.

## Démarrage rapide avec Docker

### Prérequis

- Docker Engine avec Docker Compose v2;
- Git;
- les ports `5432`, `8080` et `5173` disponibles sur l'interface locale.

### 1. Configurer l'environnement

```bash
git clone <URL_DU_DEPOT>
cd Library-Management-System
cp .env.example .env
chmod 600 .env
openssl rand -base64 32
```

Dans `.env`, remplacez au minimum les valeurs de :

- `POSTGRES_PASSWORD`;
- `BOOTSTRAP_ADMIN_EMAIL`;
- `BOOTSTRAP_ADMIN_PASSWORD`;
- `JWT_SECRET` avec la valeur générée par `openssl`.

Pour disposer immédiatement d'un catalogue fictif, définissez également `DEMO_DATA_ENABLED=true`. Ne commitez jamais le fichier `.env`.

### 2. Lancer l'application

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

Attendez que les health checks soient valides, puis ouvrez :

| Service | URL locale |
| --- | --- |
| Application | <http://localhost:5173> |
| Santé de l'API | <http://localhost:8080/actuator/health> |
| Swagger UI | <http://localhost:8080/swagger-ui.html> |
| Spécification OpenAPI | <http://localhost:8080/v3/api-docs> |

Connectez-vous avec `BOOTSTRAP_ADMIN_EMAIL` et `BOOTSTRAP_ADMIN_PASSWORD`. Le compte administrateur initial n'est créé que lorsque les deux valeurs sont renseignées correctement.

### 3. Essayer les principaux parcours

1. Si `DEMO_DATA_ENABLED=true`, chargez le catalogue synthétique avec `POST /api/admin/demo-data/catalog` depuis un client authentifié.
2. Prévisualisez `sample-data/sales-invalid.csv` pour observer le rapport de validation.
3. Prévisualisez puis confirmez `sample-data/sales-valid.csv`.
4. Consultez le tableau de bord, l'inventaire et les alertes.
5. Générez une prévision, puis exportez un rapport.

Le détail des écrans et des rôles se trouve dans le [guide utilisateur](docs/user-guide.md). Les formats d'import sont décrits dans la [documentation des données de démonstration](sample-data/README.md).

### 4. Arrêter la pile

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml down
```

Cette commande conserve les volumes. L'option `--volumes` supprime définitivement les données locales et ne doit jamais être utilisée sur un environnement à préserver.

## Développement local

### Backend

Prérequis : JDK 21 et PostgreSQL 17. Une fois PostgreSQL démarré et les variables de `.env` disponibles :

```bash
JWT_SECRET="$(openssl rand -base64 32)" \
DB_URL='jdbc:postgresql://localhost:5432/maarif_analytics' \
POSTGRES_USER='maarif' \
POSTGRES_PASSWORD='mot-de-passe-local' \
BOOTSTRAP_ADMIN_EMAIL='admin@example.test' \
BOOTSTRAP_ADMIN_PASSWORD='MotDePasseLocal123' \
DEMO_DATA_ENABLED='true' \
./backend/mvnw -f backend/pom.xml spring-boot:run
```

Flyway applique les migrations au démarrage et Hibernate valide ensuite le schéma sans le modifier.

### Frontend

Prérequis : une version récente de Node.js et pnpm.

```bash
cd frontend
pnpm install --frozen-lockfile
pnpm dev
```

Le serveur Vite écoute sur <http://127.0.0.1:5174> et relaie `/api` vers <http://127.0.0.1:8080>. Pour utiliser un autre backend :

```bash
MAARIF_API_TARGET='http://127.0.0.1:9090' pnpm dev
```

## Configuration importante

La liste complète et commentée des variables se trouve dans [`.env.example`](.env.example). Les variables indispensables au déploiement sont :

| Variable | Rôle |
| --- | --- |
| `APP_DOMAIN` | domaine public sans protocole |
| `ACME_EMAIL` | contact utilisé par Caddy pour les certificats |
| `POSTGRES_PASSWORD` | mot de passe PostgreSQL |
| `BOOTSTRAP_ADMIN_EMAIL` | adresse du premier administrateur |
| `BOOTSTRAP_ADMIN_PASSWORD` | mot de passe initial fort |
| `JWT_SECRET` | secret Base64 aléatoire d'au moins 256 bits |

Les instants sont persistés en UTC et présentés dans le fuseau `Africa/Casablanca`. Les montants utilisent `numeric(19,2)` en base et `BigDecimal` en Java.

## Vérifications

### Backend et infrastructure

Depuis la racine :

```bash
./backend/mvnw -f backend/pom.xml verify
POSTGRES_PASSWORD=local-verification-only \
APP_DOMAIN=analytics.example.test \
ACME_EMAIL=admin@example.test \
JWT_SECRET=MDEyMzQ1Njc4OWFiY2RlZjAxMjM0NTY3ODlhYmNkZWY= \
docker compose config --quiet
```

Les tests Testcontainers nécessitent un démon Docker actif.

### Frontend

```bash
cd frontend
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm knip
```

Les tests Vitest s'exécutent dans Chromium avec Playwright. Installez le navigateur si nécessaire avec `pnpm test:browser:install`.

## Déploiement

La pile de production utilise Caddy comme unique point d'entrée HTTP/HTTPS; le frontend, le backend et PostgreSQL restent sur le réseau Docker privé. Consultez le [guide de déploiement Hostinger VPS](docs/hostinger-vps-deployment.md) pour le DNS, le pare-feu, les sauvegardes, les mises à jour et la restauration.

## Documentation et aide

| Ressource | Sujet |
| --- | --- |
| [Guide utilisateur](docs/user-guide.md) | connexion, rôles et parcours métier |
| [Architecture](docs/architecture.md) | couches, composants et flux |
| [API](docs/api.md) | endpoints et conventions HTTP |
| [Base de données](docs/database.md) | modèle, contraintes et migrations |
| [Sécurité](docs/security.md) | JWT, CSRF et matrice d'accès |
| [Stratégie de test](docs/testing.md) | suites et prérequis |
| [Prévisions](docs/forecasting.md) | méthodes et limites analytiques |
| [KPI](docs/kpi-definitions.md) | définitions et formules |
| [Déploiement](docs/hostinger-vps-deployment.md) | procédure VPS complète |
| [Journal des changements](CHANGELOG.md) | évolutions livrées |

Pour demander de l'aide, consultez d'abord ces documents, puis ouvrez une issue dans le gestionnaire du dépôt avec les étapes de reproduction, le résultat attendu, le résultat observé et les logs expurgés de toute donnée sensible.

## Maintenance et contribution

Le projet est maintenu par **l'équipe du projet Maarif Analytics** et ses contributeurs. Les corrections documentaires, tests et améliorations ciblées sont bienvenues.

Avant de proposer un changement, lisez [`CONTRIBUTING.md`](CONTRIBUTING.md). Ce guide présente l'installation, les conventions d'architecture, les vérifications attendues et le contenu d'une pull request. Les mentions relatives aux composants frontend réutilisés sont conservées dans [`frontend/LICENSE`](frontend/LICENSE) et [`frontend/THIRD_PARTY_NOTICES.md`](frontend/THIRD_PARTY_NOTICES.md).
