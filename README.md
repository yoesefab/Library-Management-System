# Maarif Analytics

Application web de démonstration pour le pilotage du catalogue, des ventes et des stocks de **Maarif Culture**.

Le dépôt contient une API Spring Boot, un client React et une base PostgreSQL. Il permet d’importer des ventes synthétiques, de tracer les mouvements de stock, de calculer des indicateurs, de produire des alertes et prévisions, puis d’exporter des rapports.

> **Important :** les données de `sample-data/` sont fictives. Ne jamais connecter cette application au système de production de Maarif Culture sans autorisation explicite.

## Sommaire

- [Fonctionnalités](#fonctionnalités)
- [Architecture et technologies](#architecture-et-technologies)
- [Sécurité](#sécurité)
- [Démarrage local avec Docker](#démarrage-local-avec-docker)
- [Développement sans la pile complète](#développement-sans-la-pile-complète)
- [Données de démonstration](#données-de-démonstration)
- [Déploiement Hostinger VPS](#déploiement-hostinger-vps)
- [Migrations et persistance](#migrations-et-persistance)
- [Tests et vérifications](#tests-et-vérifications)
- [Dépannage rapide](#dépannage-rapide)
- [Documentation](#documentation)

## Fonctionnalités

### Catalogue et stock

- produits multilingues avec SKU, ISBN, prix, coût, seuil de stock et délai fournisseur;
- catégories hiérarchiques, auteurs, éditeurs et fournisseurs;
- ajout d’images JPG, PNG ou WebP jusqu’à 5 Mo;
- désactivation logique des produits afin de préserver leur historique;
- stock courant dérivé des mouvements, sans modification silencieuse;
- historique paginé des achats, ventes, retours, dommages et corrections.

### Ventes et imports

- création et consultation de commandes;
- transitions de statut avec mouvements de vente ou de retour atomiques;
- import CSV en deux étapes : prévisualisation, puis confirmation;
- validation UTF-8, schéma exact, maximum 10 000 lignes et champs bornés;
- détection des fichiers et commandes déjà traités;
- rapport CSV des lignes rejetées.

### Analyse et décision

- KPI de chiffre d’affaires, commandes, unités et panier moyen;
- valeur et rotation du stock;
- produits les plus vendus et à faible rotation;
- alertes de rupture, stock faible, rotation lente et stock dormant;
- prévisions de demande et recommandations de réapprovisionnement explicables;
- exports d’inventaire en CSV et rapport de gestion en PDF.

### Administration

- comptes utilisateurs actifs ou désactivés;
- rôles administrateur, manager et employé de stock;
- paramètres métier configurables;
- journal d’audit des opérations sensibles.

## Architecture et technologies

Maarif Analytics reste volontairement un **monolithe en couches** adapté à un petit projet et à un déploiement VPS mono-instance.

```text
Navigateur
    │ HTTPS
    ▼
Caddy :80/:443
    │
    ▼
Nginx + React :80 (réseau Docker privé)
    │ /api
    ▼
Spring Boot :8080 (réseau Docker privé)
    │
    ▼
PostgreSQL :5432 (réseau Docker privé)
```

```text
Library-Management-System/
├── backend/                    API Java et migrations Flyway
├── frontend/                   client React/TypeScript et Nginx
├── docs/                       documentation fonctionnelle et technique
├── sample-data/                fichiers exclusivement synthétiques
├── Caddyfile                   reverse proxy HTTPS
├── docker-compose.yml          déploiement Hostinger/VPS
├── docker-compose.dev.yml      surcharge pour le développement local
└── .env.example                variables attendues sans secret réel
```

Le backend suit le sens de dépendance suivant :

```text
controller → service → repository → model
     │           │
     ▼           ▼
    dto        mapper
```

Les contrôleurs restent minces, les transactions et règles métier vivent dans les services, les repositories encapsulent la persistance et les entités JPA ne sont jamais retournées directement par l’API.

| Domaine          | Technologies                                                    |
| ---------------- | --------------------------------------------------------------- |
| Backend          | Java 21, Spring Boot 3, Spring MVC, Spring Security             |
| Données          | Spring Data JPA, Hibernate, PostgreSQL 17, Flyway               |
| Frontend         | React 19, TypeScript, Vite, TanStack Router/Query, Tailwind CSS |
| Authentification | JWT HS256 en cookie HttpOnly et protection CSRF                 |
| Tests            | JUnit, MockMvc, H2, Testcontainers, Vitest, Playwright          |
| Déploiement      | Docker Compose, Caddy, Nginx                                    |

## Sécurité

### Authentification JWT

- `POST /api/auth/login` vérifie l’adresse e-mail, le mot de passe BCrypt et l’état du compte;
- le backend émet un JWT HS256 court dans le cookie `ACCESS_TOKEN`;
- le cookie est `HttpOnly`, `SameSite=Strict` et `Secure` avec le profil `prod`;
- le JWT n’est jamais stocké dans `localStorage` ou `sessionStorage`;
- la signature, l’algorithme, l’issuer, l’audience, l’expiration et les claims requis sont vérifiés;
- l’utilisateur et ses rôles sont rechargés depuis PostgreSQL à chaque requête;
- une modification d’e-mail renouvelle le JWT;
- la déconnexion et le changement de mot de passe suppriment le cookie;
- aucun refresh token n’est utilisé; la durée par défaut de l’access token est de 15 minutes.

Les mutations utilisent également un cookie `XSRF-TOKEN` et l’en-tête `X-XSRF-TOKEN`. Cette protection reste nécessaire parce que le navigateur joint automatiquement le cookie JWT.

Générez toujours une clé différente pour chaque environnement :

```bash
openssl rand -base64 32
```

Placez uniquement le résultat dans `JWT_SECRET` du fichier `.env`. Ne commitez jamais cette valeur.

### Autorisation par rôle

| Capacité                                        | Administrateur | Manager | Employé de stock |
| ----------------------------------------------- | :------------: | :-----: | :--------------: |
| Catalogue et inventaire en lecture              |       ✓        |    ✓    |        ✓         |
| Mouvements de stock et alertes                  |       ✓        |    ✓    |        ✓         |
| Modification du catalogue                       |       ✓        |    ✓    |        —         |
| KPI, commandes, imports, prévisions et rapports |       ✓        |    ✓    |        —         |
| Utilisateurs, paramètres et audit               |       ✓        |    —    |        —         |

L’interface masque les actions indisponibles, mais les annotations `@PreAuthorize` du backend restent l’autorité.

### Protections complémentaires

- limitation locale par adresse pour la connexion, les téléversements et les calculs coûteux;
- CSRF, CORS avec origines explicites et en-têtes HTTP défensifs;
- identifiant `X-Request-ID` sur les réponses;
- validation Bean Validation et rejet des propriétés JSON inconnues;
- erreurs client sans stack trace ni détail SQL;
- images stockées hors du répertoire web avec nom généré et vérification de signature;
- exports CSV protégés contre l’injection de formules.

Le limiteur est adapté à l’unique backend du déploiement Hostinger. Redis n’est pas nécessaire tant que plusieurs instances ne sont pas exécutées.

## Démarrage local avec Docker

### Prérequis

- Docker Engine;
- Docker Compose v2;
- ports locaux `5432`, `8080` et `5173` disponibles.

### 1. Préparer l’environnement

```bash
cp .env.example .env
chmod 600 .env
```

Remplacez au minimum :

- `POSTGRES_PASSWORD`;
- `BOOTSTRAP_ADMIN_EMAIL`;
- `BOOTSTRAP_ADMIN_PASSWORD`;
- `JWT_SECRET`, généré avec `openssl rand -base64 32`.

Pour charger le catalogue synthétique, utilisez `DEMO_DATA_ENABLED=true`. Le mot de passe administrateur doit contenir 12 à 128 caractères, dont une minuscule, une majuscule et un chiffre.

### 2. Démarrer la pile locale

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

La surcharge de développement expose seulement les interfaces loopback et n’exécute pas Caddy.

| Service       | Adresse locale                          |
| ------------- | --------------------------------------- |
| Application   | <http://localhost:5173>                 |
| Santé backend | <http://localhost:8080/actuator/health> |
| Swagger UI    | <http://localhost:8080/swagger-ui.html> |
| OpenAPI       | <http://localhost:8080/v3/api-docs>     |
| PostgreSQL    | `localhost:5432`                        |

### 3. Arrêter la pile

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml down
```

Les volumes sont conservés. N’ajoutez `--volumes` que si vous souhaitez supprimer définitivement la base locale, les images et les certificats.

## Développement sans la pile complète

### PostgreSQL seulement

```bash
POSTGRES_PASSWORD='mot-de-passe-local' docker compose \
  -f docker-compose.yml -f docker-compose.dev.yml up -d db
```

### Backend

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

Le backend écoute sur <http://localhost:8080>. Flyway applique les migrations, puis Hibernate vérifie le schéma sans le modifier.

### Frontend

```bash
cd frontend
pnpm install --frozen-lockfile
pnpm dev
```

Vite écoute sur <http://127.0.0.1:5174> et relaie `/api` vers <http://127.0.0.1:8080>. Une autre API peut être sélectionnée avec :

```bash
MAARIF_API_TARGET='http://127.0.0.1:9090' pnpm dev
```

### Appeler l’API directement

Un client HTTP doit conserver les deux cookies et envoyer le token CSRF lors des mutations :

1. `GET /api/auth/csrf` pour recevoir `XSRF-TOKEN`;
2. `POST /api/auth/login` avec `email` et `password`;
3. conserver le cookie HttpOnly `ACCESS_TOKEN`;
4. envoyer la valeur CSRF dans `X-XSRF-TOKEN` pour les requêtes `POST`, `PUT`, `PATCH` et `DELETE` autres que la connexion.

## Données de démonstration

Le chargeur est disponible uniquement avec `DEMO_DATA_ENABLED=true` et pour un administrateur :

```http
POST /api/admin/demo-data/catalog
```

Il ajoute un catalogue synthétique, les référentiels associés, les images de démonstration et les mouvements de stock initiaux sans recréer les SKU déjà présents.

Parcours conseillé :

1. charger le catalogue de démonstration;
2. prévisualiser `sample-data/sales-invalid.csv`;
3. télécharger et examiner son rapport d’erreurs;
4. prévisualiser puis confirmer `sample-data/sales-valid.csv`;
5. consulter le stock, le dashboard et les alertes;
6. générer une prévision et une recommandation;
7. exporter les rapports CSV et PDF;
8. consulter le journal d’audit.

## Déploiement Hostinger VPS

Le fichier `docker-compose.yml` est prévu pour une instance Hostinger/VPS :

- Caddy est le seul service exposé sur `80/tcp`, `443/tcp` et `443/udp`;
- le frontend, le backend et PostgreSQL restent sur le réseau Docker privé;
- PostgreSQL, les images produit et les certificats Caddy utilisent des volumes persistants;
- tous les services ont un health check et `restart: unless-stopped`;
- les logs Docker sont limités à trois fichiers de 10 Mo par conteneur;
- Caddy obtient et renouvelle automatiquement le certificat du domaine.

Variables obligatoires :

| Variable                   | Description                                          |
| -------------------------- | ---------------------------------------------------- |
| `APP_DOMAIN`               | Domaine pointant vers l’IPv4 du VPS, sans `https://` |
| `ACME_EMAIL`               | Adresse utilisée par Caddy pour les certificats      |
| `POSTGRES_PASSWORD`        | Mot de passe PostgreSQL unique                       |
| `BOOTSTRAP_ADMIN_EMAIL`    | Adresse du premier administrateur                    |
| `BOOTSTRAP_ADMIN_PASSWORD` | Mot de passe initial fort                            |
| `JWT_SECRET`               | Clé Base64 aléatoire d’au moins 256 bits             |

Déploiement :

```bash
cp .env.example .env
chmod 600 .env
# Modifier .env avant de continuer
docker compose config --quiet
docker compose build --pull
docker compose up -d
docker compose ps
```

Le domaine doit pointer vers le VPS et les ports 80/443 doivent être ouverts avant le démarrage de Caddy. La procédure complète, incluant DNS, pare-feu, sauvegarde, restauration, mises à jour et dépannage, se trouve dans [`docs/hostinger-vps-deployment.md`](docs/hostinger-vps-deployment.md).

## Migrations et persistance

Flyway applique automatiquement les migrations de `backend/src/main/resources/db/migration/` au démarrage. Les migrations déjà appliquées sont immuables : toute évolution doit utiliser un nouveau fichier versionné.

Volumes de production :

| Volume           | Contenu                     |
| ---------------- | --------------------------- |
| `postgres-data`  | données PostgreSQL          |
| `product-images` | images des produits         |
| `caddy-data`     | certificats et état ACME    |
| `caddy-config`   | configuration runtime Caddy |

Un volume Docker n’est pas une sauvegarde. Exportez régulièrement PostgreSQL avec `pg_dump`, archivez `product-images`, copiez les sauvegardes hors du VPS et testez leur restauration. Les commandes sont détaillées dans le guide Hostinger.

## Tests et vérifications

### Backend et infrastructure

Depuis la racine :

```bash
./backend/mvnw -f backend/pom.xml verify
POSTGRES_PASSWORD=local-verification-only \
APP_DOMAIN=analytics.example.test \
ACME_EMAIL=admin@example.test \
JWT_SECRET=MDEyMzQ1Njc4OWFiY2RlZjAxMjM0NTY3ODlhYmNkZWY= \
docker compose config
```

`verify` exécute les tests unitaires et les tests d’intégration configurés. Testcontainers et les tests PostgreSQL nécessitent Docker.

### Frontend

```bash
cd frontend
npm run format:check
npm run lint
npm run typecheck
npm test
npm run build
```

Les tests Vitest utilisent Chromium via Playwright. Installez-le si nécessaire :

```bash
npm run test:browser:install
```

## Dépannage rapide

### Le backend ne démarre pas

Vérifiez :

- que `JWT_SECRET` est un Base64 valide représentant au moins 32 octets;
- que le mot de passe bootstrap respecte la politique;
- que PostgreSQL est healthy;
- qu’aucune migration Flyway existante n’a été modifiée;
- que le disque contient assez d’espace.

```bash
docker compose logs --tail=200 backend db
```

### Erreur HTTPS ou certificat

Vérifiez que `APP_DOMAIN` résout vers le VPS, que les ports 80/443 sont libres et que le pare-feu les autorise :

```bash
docker compose logs --tail=200 caddy
```

### Erreur 502

```bash
docker compose ps
docker compose logs --tail=200 caddy frontend backend
```

### Réinitialiser complètement l’environnement local

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml down --volumes
```

Cette commande détruit toutes les données locales. Ne jamais l’utiliser sur le VPS de production.

## Documentation

| Document                                                  | Contenu                               |
| --------------------------------------------------------- | ------------------------------------- |
| [Guide utilisateur](docs/user-guide.md)                   | connexion et parcours métier          |
| [Architecture](docs/architecture.md)                      | couches, flux et décisions techniques |
| [API](docs/api.md)                                        | endpoints et conventions HTTP         |
| [Base de données](docs/database.md)                       | modèle, contraintes et migrations     |
| [Sécurité](docs/security.md)                              | JWT, CSRF, rôles et protections       |
| [Audit sécurité](docs/security-audit.md)                  | évaluation et risques résiduels       |
| [Déploiement](docs/deployment.md)                         | vue générale des conteneurs           |
| [Déploiement Hostinger](docs/hostinger-vps-deployment.md) | procédure VPS complète                |
| [Tests](docs/testing.md)                                  | stratégie et commandes                |
| [Prévisions](docs/forecasting.md)                         | méthodes et limites analytiques       |
| [Définitions des KPI](docs/kpi-definitions.md)            | formules des indicateurs              |
| [Journal de décisions](docs/decision-log.md)              | décisions d’architecture              |

Les changements livrés sont consignés dans [`CHANGELOG.md`](CHANGELOG.md).
