# **Maarif Analytics — Pilotage des ventes et des stocks**

Une plateforme web complète pour administrer un catalogue, tracer les mouvements de stock et transformer les ventes en indicateurs, alertes et prévisions exploitables. Son monolithe en couches réunit une API Spring Boot sécurisée et une interface React responsive, prête pour Docker.

![Java 21](https://img.shields.io/badge/Java-21-ED8B00?logo=openjdk&logoColor=white)
![Spring Boot 3.5](https://img.shields.io/badge/Spring_Boot-3.5-6DB33F?logo=springboot&logoColor=white)
![React 19](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=0B1F33)
![PostgreSQL 17](https://img.shields.io/badge/PostgreSQL-17-4169E1?logo=postgresql&logoColor=white)
![Docker Compose](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)
![Frontend license: MIT](https://img.shields.io/badge/frontend_license-MIT-green)

> [!IMPORTANT]
> Les fichiers de `sample-data/` sont entièrement fictifs. Ne connectez jamais l'application au système de production de Maarif Culture sans autorisation explicite.

## 🚀 Features

- **Catalogue centralisé** : Gérez produits multilingues, catégories, auteurs, éditeurs, fournisseurs, tarifs et visuels.
- **Stock traçable** : Calculez le stock depuis les achats, ventes, retours, dommages et corrections, sans mise à jour silencieuse.
- **Import de ventes fiable** : Prévisualisez et validez les CSV, bloquez les doublons et exportez les lignes rejetées.
- **Aide à la décision** : Consultez les KPI, alertes, rotations, prévisions de demande et recommandations de réapprovisionnement.
- **Sécurité par rôle** : Protégez les parcours administrateur, manager et employé de stock avec JWT HttpOnly, CSRF et autorisations backend.
- **Exploitation prête à l'emploi** : Déployez PostgreSQL, Spring Boot, Nginx et Caddy avec Docker Compose, HTTPS et volumes persistants.

## 🛠️ Tech Stack

| Domaine | Technologies principales |
| --- | --- |
| **Frontend** | React 19, TypeScript 6, Vite 8, Tailwind CSS 4, TanStack Router, Query et Table, Recharts, Radix UI |
| **Backend** | Java 21, Spring Boot 3.5, Spring MVC, Spring Security, Spring Data JPA, Hibernate |
| **Données** | PostgreSQL 17, Flyway, H2 pour certains tests |
| **Sécurité** | JWT HS256 en cookie HttpOnly, protection CSRF, BCrypt, contrôle d'accès par rôle |
| **Qualité** | Maven, JUnit, MockMvc, Testcontainers, Vitest, Playwright, ESLint, Prettier |
| **Déploiement** | Docker Compose, Caddy, Nginx, health checks et volumes persistants |

## 📂 Repository Structure

```text
Library-Management-System/
├── backend/
│   ├── src/main/java/              # API et monolithe en couches
│   ├── src/main/resources/         # Configuration et migrations Flyway
│   ├── src/test/                   # Tests unitaires et d'intégration
│   └── pom.xml                     # Build Maven et dépendances Java
├── frontend/
│   ├── src/api/                    # Client HTTP typé
│   ├── src/components/             # Composants UI partagés
│   ├── src/features/               # Parcours métier React
│   └── package.json                # Scripts et dépendances frontend
├── docs/                           # Architecture, API, sécurité et exploitation
├── sample-data/                    # Catalogue et ventes synthétiques
├── .env.example                    # Modèle de configuration sans secret réel
├── Caddyfile                       # Terminaison HTTPS en production
├── docker-compose.yml              # Pile de production
├── docker-compose.dev.yml          # Surcharge locale
├── CONTRIBUTING.md                 # Règles de contribution
└── CHANGELOG.md                    # Historique des évolutions
```

- **`backend/`** suit la chaîne `controller → service → repository → model`, avec DTO et mappers explicites.
- **`frontend/`** contient l'interface approuvée, ses appels API et ses tests navigateur.
- **`docs/`** détaille les choix d'architecture, les endpoints, la sécurité, les KPI et le déploiement.
- **`sample-data/`** fournit uniquement des jeux de démonstration réutilisables localement.

## 🏁 Getting Started

### Prerequisites

Pour le parcours recommandé :

- Docker Engine **>= 24** ;
- Docker Compose **>= 2.20** ;
- Git **>= 2.40** ;
- OpenSSL **>= 3** pour générer le secret JWT ;
- ports `5432`, `8080` et `5173` disponibles en local.

Pour exécuter les services hors conteneurs, installez également Java **21**, Node.js **>= 22** et pnpm **10.32.1**.

### Installation

1. Clonez le dépôt et ouvrez son répertoire :

```bash
git clone <repository-url>
cd Library-Management-System
```

2. Créez votre configuration locale depuis le modèle versionné :

```bash
cp .env.example .env
chmod 600 .env
```

3. Générez un secret, puis renseignez `.env` avec des valeurs réservées au développement :

```bash
openssl rand -base64 32
```

```dotenv
POSTGRES_PASSWORD=replace-with-a-long-local-password
BOOTSTRAP_ADMIN_EMAIL=admin@example.test
BOOTSTRAP_ADMIN_PASSWORD=ReplaceWithAStrongPassword123
JWT_SECRET=replace-with-the-generated-base64-value
DEMO_DATA_ENABLED=true
```

4. Si vous développez sans Docker, installez les dépendances frontend :

```bash
cd frontend
corepack enable
corepack prepare pnpm@10.32.1 --activate
pnpm install --frozen-lockfile
cd ..
```

Le Maven Wrapper de `backend/` télécharge automatiquement la version Maven attendue.

### Running the Application

Lancez toute la pile locale :

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

| Service | URL locale |
| --- | --- |
| Application | <http://localhost:5173> |
| API | <http://localhost:8080/api> |
| Swagger UI | <http://localhost:8080/swagger-ui.html> |
| Health check | <http://localhost:8080/actuator/health> |

Pour un développement séparé, démarrez PostgreSQL, puis lancez les deux applications :

```bash
POSTGRES_PASSWORD='local-password' \
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d db
```

```bash
JWT_SECRET="$(openssl rand -base64 32)" \
DB_URL='jdbc:postgresql://localhost:5432/maarif_analytics' \
POSTGRES_USER='maarif' \
POSTGRES_PASSWORD='local-password' \
BOOTSTRAP_ADMIN_EMAIL='admin@example.test' \
BOOTSTRAP_ADMIN_PASSWORD='StrongLocalPassword123' \
DEMO_DATA_ENABLED='true' \
./backend/mvnw -f backend/pom.xml spring-boot:run
```

```bash
cd frontend
pnpm dev
```

Construisez et vérifiez le projet :

```bash
./backend/mvnw -f backend/pom.xml verify
```

```bash
cd frontend
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm knip
```

Validez enfin la configuration de déploiement :

```bash
POSTGRES_PASSWORD=local-verification-only \
APP_DOMAIN=analytics.example.test \
ACME_EMAIL=admin@example.test \
JWT_SECRET=MDEyMzQ1Njc4OWFiY2RlZjAxMjM0NTY3ODlhYmNkZWY= \
docker compose config
```

## 💡 Usage Examples

### Charger le catalogue synthétique

Connectez-vous en tant qu'administrateur, récupérez le cookie CSRF, puis chargez les données de démonstration. `curl` conserve ici les cookies JWT et CSRF entre les requêtes.

```bash
curl --cookie-jar cookies.txt http://localhost:8080/api/auth/csrf
XSRF_TOKEN="$(awk '$6 == "XSRF-TOKEN" { print $7 }' cookies.txt)"

curl --cookie cookies.txt --cookie-jar cookies.txt \
  --header 'Content-Type: application/json' \
  --header "X-XSRF-TOKEN: ${XSRF_TOKEN}" \
  --data '{"email":"admin@example.test","password":"StrongLocalPassword123"}' \
  http://localhost:8080/api/auth/login

curl --cookie cookies.txt \
  --header "X-XSRF-TOKEN: ${XSRF_TOKEN}" \
  --request POST \
  http://localhost:8080/api/admin/demo-data/catalog
```

### Inspecter la santé du backend

```bash
curl --fail --silent http://localhost:8080/actuator/health
```

```json
{"status":"UP"}
```

Le parcours métier complet — import CSV, consultation des alertes, prévisions et exports — est décrit dans le [guide utilisateur](docs/user-guide.md). Les contrats HTTP figurent dans la [documentation API](docs/api.md).

## 🤝 Contributing

1. Forkez le dépôt et ouvrez une issue ciblée.
2. Créez une branche courte, par exemple `feat/import-validation`, `fix/stock-alerts` ou `docs/api-examples`.
3. Respectez l'architecture en couches, ajoutez les tests pertinents et consignez tout changement notable dans `CHANGELOG.md`.
4. Exécutez les vérifications backend, frontend et Compose applicables.
5. Ouvrez une pull request avec un résumé, les résultats des tests et les impacts éventuels sur la sécurité, les données ou le déploiement.

Consultez [`CONTRIBUTING.md`](CONTRIBUTING.md) et [`AGENTS.md`](AGENTS.md) avant toute modification importante. Utilisez uniquement des données fictives et ne commitez jamais `.env`, mot de passe, jeton, secret ou donnée personnelle réelle.

## 📄 License

Le client React réutilisé est distribué sous **licence MIT**. Cette licence autorise l'utilisation, la copie, la modification, la distribution, la sous-licence et la vente, sous réserve de conserver la notice de copyright et la licence. Consultez [`frontend/LICENSE`](frontend/LICENSE) et [`frontend/THIRD_PARTY_NOTICES.md`](frontend/THIRD_PARTY_NOTICES.md).

Le dépôt ne contient actuellement aucune licence racine couvrant explicitement l'ensemble du backend et de la documentation. En l'absence d'une telle licence, leurs droits restent réservés ; contactez les mainteneurs avant toute réutilisation ou redistribution.
