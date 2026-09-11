# Contribuer à Maarif Analytics

Merci de votre intérêt pour le projet. Avant de proposer une modification, ouvrez une issue décrivant le besoin, le comportement attendu et la manière de le vérifier.

## Installation

1. Forkez puis clonez le dépôt.
2. Copiez `.env.example` vers `.env` et remplacez toutes les valeurs d'exemple.
3. Démarrez la pile avec `docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build`.
4. Créez une branche courte depuis la branche principale.

N'utilisez que des données fictives et ne commitez jamais `.env`, mot de passe, jeton, secret ou donnée personnelle réelle.

## Principes de développement

- Écrivez le code et les noms techniques en anglais, et les textes visibles par l'utilisateur en français.
- Conservez l'architecture backend `controller -> service -> repository -> model` et échangez des DTO avec l'API.
- Placez les règles métier et les transactions dans les services.
- Utilisez `BigDecimal` pour les montants et UTC pour les instants persistés.
- Ajoutez une migration Flyway au lieu de modifier une migration déjà publiée.
- Enregistrez chaque variation de stock sous forme de mouvement.
- Testez l'autorisation backend pour chaque rôle concerné.
- Préservez l'identité visuelle existante du frontend.
- Documentez tout changement notable dans `CHANGELOG.md`.

Consultez aussi [`AGENTS.md`](AGENTS.md), [`docs/architecture.md`](docs/architecture.md) et [`docs/testing.md`](docs/testing.md) avant une contribution importante.

## Vérifications

Depuis la racine :

```bash
./backend/mvnw -f backend/pom.xml verify
POSTGRES_PASSWORD=local-verification-only docker compose config
```

Pour tout changement frontend :

```bash
cd frontend
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm knip
```

Les tests Testcontainers et navigateur nécessitent Docker et Chromium. Signalez clairement toute vérification non exécutée et sa raison.

## Pull requests

Une pull request doit rester ciblée et inclure :

- un titre décrivant le résultat pour l'utilisateur;
- un résumé des choix réalisés;
- les tests exécutés et leurs résultats;
- les captures d'écran utiles pour un changement visible;
- les impacts éventuels sur la sécurité, les données, la migration ou le déploiement.
