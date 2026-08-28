# Maarif Analytics — frontend

Interface React 19/TypeScript connectée au monolithe Spring Boot. Le rendu reprend le prototype visuellement approuvé ; shadcn/ui fournit les primitives accessibles sans imposer son apparence par défaut.

## Architecture

- `src/app/` : fournisseurs, routeur et cache TanStack Query.
- `src/api/` : client HTTP partagé et clients métier conformes à OpenAPI.
- `src/components/ui/` : primitives shadcn/ui adaptées aux tokens Maarif.
- `src/components/{charts,feedback,forms,layout,navigation,tables}/` : composants applicatifs réutilisables.
- `src/pages/` : écrans routés et orchestrateurs de requêtes.
- `src/styles/tokens.css` : pont entre les tokens approuvés et les variables shadcn.
- `src/test/` et `e2e/` : support Vitest/Testing Library et parcours Playwright.

Les routes publiques et protégées sont décrites dans [`docs/frontend-route-api-mapping.md`](../docs/frontend-route-api-mapping.md). Elles n’utilisent pas de préfixe `/app`.

## Développement local

```bash
npm ci
npm run dev
```

Le proxy Vite transmet `/api` à `http://127.0.0.1:8080`. `VITE_API_BASE_URL` permet de sélectionner une autre API. L’authentification repose sur un cookie de session HttpOnly et un jeton CSRF ; aucun secret n’est stocké dans `localStorage`.

## Vérification

```bash
npm run format:check
npm run lint
npm run typecheck
npm test
npm run build
npm run test:sites
E2E_EMAIL='compte-local' E2E_PASSWORD='secret-local' npm run test:e2e
```

Le test E2E requiert uniquement un compte de la pile synthétique locale. Aucun identifiant n’est versionné.

## Limites backend rendues explicitement

- L’API permet de désactiver un produit, mais pas de le réactiver.
- L’inventaire n’expose pas de recherche ni de filtres serveur ; les filtres de la page s’appliquent donc à la page chargée et l’interface le précise.
- L’historique de mouvements n’est exposé que par produit, sans flux global consolidé.
- La prévision expose un résultat et son explication, mais pas les points historiques/prédits nécessaires à la courbe du prototype. Aucune série n’est simulée.
