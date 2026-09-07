# Maarif Analytics

Application complète de suivi des ventes et de gestion prédictive des stocks pour Maarif Culture. Le backend Spring Boot expose l’API sécurisée et `frontend/` contient l’interface React/TypeScript issue du prototype visuellement approuvé.

## Fonctionnalités

- Authentification par session sécurisée, cookie HttpOnly, CSRF et rôles.
- Administration des utilisateurs, paramètres et journal d'audit.
- Catalogue, référentiels, stock calculé depuis les mouvements et invariant de non-négativité.
- Commandes manuelles, transitions de statut et mouvements de vente/retour idempotents.
- Import CSV en deux étapes avec checksum, aperçu et erreurs par ligne.
- KPI filtrables, alertes de stock, prévisions explicables et recommandations.
- Exports CSV protégés contre l'injection et rapport de gestion PDF.
- Jeu annuel synthétique reproductible et chargeur de catalogue administrateur idempotent.
- PostgreSQL, Flyway, OpenAPI, tests JUnit/Testcontainers et Docker Compose.

## Structure

```text
backend/src/main/java/ma/maarifculture/analytics/
├── config/       # sécurité, bootstrap, OpenAPI
├── controller/   # API REST
├── dto/          # contrats HTTP
├── exception/    # erreurs structurées
├── mapper/       # mapping explicite
├── model/        # entités JPA et enums
├── repository/   # Spring Data
└── service/      # règles métier et transactions
```

## Démarrage Docker

```bash
cp .env.example .env
# Remplacer les mots de passe dans .env
docker compose up --build
```

- Santé: <http://localhost:8080/actuator/health>
- Application: <http://localhost:5173>
- Swagger UI: <http://localhost:8080/swagger-ui.html>
- OpenAPI JSON: <http://localhost:8080/v3/api-docs>

Pour mettre à jour une installation Docker existante après récupération du code :

```bash
docker compose up -d --build backend frontend
```

Rechargez ensuite la page. Dans **Produits → Nouveau produit** ou **Modifier**, le champ **Image du produit** accepte JPG, PNG et WebP jusqu’à 5 Mo. Les images sont conservées dans le volume `product-images`, y compris après reconstruction des conteneurs.

La base locale utilise V3 pour les préférences dashboard ; le champ image est ajouté par V4. Ne modifiez pas les migrations déjà appliquées.

## Démarrage local

```bash
DB_URL=jdbc:postgresql://localhost:5432/maarif_analytics \
POSTGRES_USER=maarif POSTGRES_PASSWORD='mot-de-passe-local' \
BOOTSTRAP_ADMIN_EMAIL=admin@example.test \
BOOTSTRAP_ADMIN_PASSWORD='mot-de-passe-fort-local' \
./backend/mvnw -f backend/pom.xml spring-boot:run
```

Obtenir d'abord `/api/auth/csrf`, puis appeler `/api/auth/login`. Le cookie `JSESSIONID` doit être conservé et les mutations suivantes envoient le jeton dans `X-XSRF-TOKEN`.

## Démonstration synthétique

Le chargeur est désactivé par défaut. Avec `DEMO_DATA_ENABLED=true`, un administrateur peut appeler:

```text
POST /api/admin/demo-data/catalog
```

L'appel crée de façon idempotente 15 produits multilingues, leurs référentiels et leurs mouvements de stock initial. Ensuite:

1. prévisualiser `sample-data/sales-invalid.csv` pour montrer les erreurs;
2. prévisualiser puis confirmer `sample-data/sales-valid.csv`;
3. consulter inventaire, dashboard et alertes;
4. générer les prévisions et recommandations;
5. exporter les rapports CSV/PDF.

Le classeur `sample-data/synthetic-demo-data.xlsx` permet d'examiner le catalogue et les ventes avant la démonstration. Toutes ces informations sont fictives.

## Vérification

```bash
./backend/mvnw -f backend/pom.xml verify
POSTGRES_PASSWORD=local-verification-only docker compose config
cd frontend
npm run format:check
npm run lint
npm run typecheck
npm test
npm run build
npm run test:sites
```

V1 est immuable. Toute évolution de schéma utilise une migration Flyway additive. Aucune connexion au site de production n'est effectuée.
