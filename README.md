# Maarif Analytics

Plateforme web de pilotage des ventes, du catalogue et des stocks de **Maarif Culture**.

Maarif Analytics réunit une API métier Spring Boot, une interface d'administration React et une base PostgreSQL. L'application centralise les opérations quotidiennes — produits, inventaire, commandes et imports — puis transforme ces données en indicateurs, alertes, prévisions et rapports.

> **Environnement de démonstration uniquement.** Les fichiers fournis dans `sample-data/` sont synthétiques et l'application ne doit pas être connectée au système de production de Maarif Culture sans autorisation explicite.

## Sommaire

- [Fonctionnalités](#fonctionnalités)
- [Architecture](#architecture)
- [Prérequis](#prérequis)
- [Lancer l'application avec Docker](#lancer-lapplication-avec-docker)
- [Développer localement](#développer-localement)
- [Charger les données de démonstration](#charger-les-données-de-démonstration)
- [Sécurité et rôles](#sécurité-et-rôles)
- [Vérifier le projet](#vérifier-le-projet)
- [Documentation](#documentation)

## Fonctionnalités

### Opérations

- catalogue multilingue avec catégories, auteurs, éditeurs, fournisseurs et images produit;
- inventaire dérivé de mouvements de stock traçables;
- commandes, transitions de statut, ventes et retours idempotents;
- import CSV avec prévisualisation, validation par ligne et détection des doublons;
- administration des utilisateurs et des paramètres métier.

### Analyse

- tableau de bord et KPI filtrables;
- alertes de rupture, stock faible, rotation lente et stock dormant;
- prévisions explicables avec méthode, hypothèses et métrique d'erreur;
- recommandations de réapprovisionnement non automatiques;
- exports CSV et rapports PDF.

### Garanties techniques

- sessions serveur, cookie HttpOnly, protection CSRF et contrôle d'accès par rôle;
- montants exacts avec `BigDecimal` en Java et `numeric(19,2)` dans PostgreSQL;
- instants persistés en UTC et dates métier présentées dans `Africa/Casablanca`;
- schéma versionné exclusivement avec des migrations Flyway additives;
- journal d'audit pour les opérations sensibles.

## Architecture

```text
Library-Management-System/
├── backend/          API Spring Boot, domaine métier et migrations Flyway
├── frontend/         application React/TypeScript servie par Nginx en conteneur
├── docs/             documentation fonctionnelle et technique
├── sample-data/      catalogue et ventes de démonstration synthétiques
├── scripts/          scripts utilitaires
├── .env.example      modèle de configuration locale
└── docker-compose.yml
```

Le backend est un monolithe organisé en couches sous `ma.maarifculture.analytics`:

```text
controller  →  service  →  repository  →  model
     ↓             ↓
    dto          mapper
```

Les contrôleurs manipulent des DTO et délèguent les règles métier aux services transactionnels. Les entités JPA ne font jamais partie du contrat HTTP. Le frontend accède à l'API par `/api` avec TanStack Query et conserve uniquement l'état d'interface côté client.

| Composant | Technologies principales |
| --- | --- |
| API | Java 21, Spring Boot 3, Spring Security, Spring Data JPA, Flyway |
| Interface | React 19, TypeScript, Vite, TanStack Router, TanStack Query, Tailwind CSS |
| Persistance | PostgreSQL 17 |
| Tests | JUnit, Testcontainers, Vitest, Testing Library, Playwright |
| Exécution | Docker Compose, Nginx |

## Prérequis

### Exécution conteneurisée

- Docker Engine;
- Docker Compose v2;
- ports `5432`, `8080` et `5173` disponibles, ou ports alternatifs définis dans `.env`.

### Développement sans conteneur

- Java 21;
- PostgreSQL 17;
- Node.js et pnpm pour le frontend.

## Lancer l'application avec Docker

### 1. Créer la configuration locale

```bash
cp .env.example .env
```

Ouvrez `.env` et remplacez les valeurs d'exemple. Définissez notamment:

- `POSTGRES_PASSWORD`: mot de passe de la base locale;
- `BOOTSTRAP_ADMIN_EMAIL`: adresse du premier compte administrateur;
- `BOOTSTRAP_ADMIN_PASSWORD`: mot de passe fort de ce compte;
- `DEMO_DATA_ENABLED=true`: uniquement si le chargeur synthétique doit être disponible.

Ne commitez jamais le fichier `.env`.

### 2. Construire et démarrer la pile

```bash
docker compose up --build
```

Docker Compose démarre PostgreSQL, attend que la base soit prête, lance l'API, puis sert le frontend.

| Service | Adresse locale |
| --- | --- |
| Application | <http://localhost:5173> |
| Santé de l'API | <http://localhost:8080/actuator/health> |
| Swagger UI | <http://localhost:8080/swagger-ui.html> |
| OpenAPI JSON | <http://localhost:8080/v3/api-docs> |

Connectez-vous dans l'application avec les valeurs `BOOTSTRAP_ADMIN_EMAIL` et `BOOTSTRAP_ADMIN_PASSWORD` de votre `.env`.

Pour mettre à jour une installation existante après avoir récupéré le code:

```bash
docker compose up -d --build backend frontend
```

Rechargez ensuite la page. Dans **Produits → Nouveau produit** ou **Modifier**, le champ **Image du produit** accepte JPG, PNG et WebP jusqu’à 5 Mo. Les images sont conservées dans le volume `product-images`, y compris après reconstruction des conteneurs.

La base locale utilise V3 pour les préférences dashboard; le champ image est ajouté par V4. Ne modifiez pas les migrations déjà appliquées.

### 3. Arrêter la pile

```bash
docker compose down
```

Cette commande conserve le volume PostgreSQL. N'ajoutez `--volumes` que si vous souhaitez supprimer définitivement les données locales.

## Développer localement

### Base de données

Vous pouvez ne démarrer que PostgreSQL avec Docker:

```bash
POSTGRES_PASSWORD='mot-de-passe-local' docker compose up -d db
```

### Backend

Depuis la racine du dépôt:

```bash
DB_URL='jdbc:postgresql://localhost:5432/maarif_analytics' \
POSTGRES_USER='maarif' \
POSTGRES_PASSWORD='mot-de-passe-local' \
BOOTSTRAP_ADMIN_EMAIL='admin@example.test' \
BOOTSTRAP_ADMIN_PASSWORD='mot-de-passe-fort-local' \
DEMO_DATA_ENABLED='true' \
./backend/mvnw -f backend/pom.xml spring-boot:run
```

Le backend écoute sur <http://localhost:8080>. Flyway applique automatiquement les migrations manquantes au démarrage et Hibernate valide le schéma sans le modifier.

### Frontend

Dans un autre terminal:

```bash
cd frontend
pnpm install --frozen-lockfile
pnpm dev
```

Vite sert l'interface sur <http://127.0.0.1:5174> et relaie `/api` vers <http://127.0.0.1:8080>. Pour utiliser une autre API:

```bash
MAARIF_API_TARGET='http://127.0.0.1:9090' pnpm dev
```

### Appeler directement l'API

L'authentification utilise une session HTTP et un jeton CSRF:

1. appeler `GET /api/auth/csrf`;
2. conserver le cookie retourné;
3. appeler `POST /api/auth/login` avec les identifiants;
4. conserver le cookie `JSESSIONID`;
5. envoyer le jeton dans `X-XSRF-TOKEN` pour chaque requête de mutation.

Swagger UI permet d'explorer les contrats, paramètres et réponses de l'ensemble des endpoints.

## Charger les données de démonstration

Le chargeur n'est créé que lorsque `DEMO_DATA_ENABLED=true`. Après connexion avec un compte administrateur, appelez:

```http
POST /api/admin/demo-data/catalog
```

L'opération est idempotente. Elle crée 15 produits multilingues, leurs référentiels et les mouvements de stock initiaux.

Parcours recommandé:

1. prévisualiser `sample-data/sales-invalid.csv` et examiner les erreurs par ligne;
2. prévisualiser `sample-data/sales-valid.csv`, puis confirmer l'import;
3. consulter le tableau de bord, l'inventaire et les alertes;
4. générer une prévision et une recommandation;
5. exporter les rapports CSV et PDF;
6. consulter le journal d'audit.

Le fichier `sample-data/synthetic-demo-data.xlsx` présente le catalogue et les ventes attendues. Le [guide d'utilisation](docs/user-guide.md) décrit le scénario complet et les résultats de référence.

## Sécurité et rôles

| Capacité | Administrateur | Manager | Employé stock |
| --- | :---: | :---: | :---: |
| Consulter le catalogue et l'inventaire | ✓ | ✓ | ✓ |
| Modifier le catalogue et les référentiels | ✓ | ✓ | — |
| Consulter les KPI, commandes, imports et rapports | ✓ | ✓ | — |
| Administrer les utilisateurs, paramètres et audits | ✓ | — | — |

L'interface masque les actions indisponibles pour améliorer l'expérience, mais **le backend reste toujours l'autorité d'autorisation**. En production, utilisez HTTPS, activez `SESSION_COOKIE_SECURE`, désactivez les données de démonstration et injectez les secrets par un mécanisme dédié.

## Vérifier le projet

### Backend et infrastructure

Depuis la racine:

```bash
./backend/mvnw -f backend/pom.xml verify
POSTGRES_PASSWORD=local-verification-only docker compose config
```

Les tests d'intégration du backend utilisent Testcontainers et nécessitent un démon Docker fonctionnel.

### Frontend

Depuis `frontend/`:

```bash
pnpm format:check
pnpm lint
pnpm test
pnpm build
```

Les tests Vitest s'exécutent dans Chromium avec Playwright. Si le navigateur n'est pas encore installé:

```bash
pnpm test:browser:install
```

## Documentation

| Document | Contenu |
| --- | --- |
| [Guide d'utilisation](docs/user-guide.md) | connexion, parcours fonctionnels et démonstration |
| [Architecture](docs/architecture.md) | couches, flux métier et décisions transversales |
| [API](docs/api.md) | endpoints et conventions HTTP |
| [Base de données](docs/database.md) | modèle relationnel et migrations |
| [Sécurité](docs/security.md) | sessions, CSRF, rôles et limites connues |
| [Déploiement](docs/deployment.md) | conteneurs et recommandations de production |
| [Tests](docs/testing.md) | stratégie et commandes de vérification |
| [Prévisions](docs/forecasting.md) | méthodes, hypothèses et limites analytiques |
| [Définitions des KPI](docs/kpi-definitions.md) | formules des indicateurs métier |

Consultez également [`CHANGELOG.md`](CHANGELOG.md) pour les évolutions non publiées et l'historique du projet.
