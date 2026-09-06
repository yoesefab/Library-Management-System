# Maarif Analytics — Prototype 2

Deuxième prototype de l’interface Maarif Analytics, construit à partir de
[shadcn-admin](https://github.com/satnaing/shadcn-admin) et adapté à l’identité
visuelle et aux parcours métier déjà validés dans
`prototypes/maarif-analytics-login`.

## Parcours disponibles

- connexion française et shell authentifié responsive ;
- tableau de bord, produits, création/modification et fiche produit ;
- inventaire et mouvements de stock ;
- commandes et fiche commande ;
- imports de ventes et historique ;
- alertes, prévisions, rapports et administration.

Les données restent synthétiques, les montants sont affichés en MAD et les
dates métier utilisent `Africa/Casablanca`.
Le menu de profil reste accessible dans la barre latérale, sans avatar dans
la barre de navigation supérieure des pages métier.
Le logo et le nom de l’application dans la barre latérale sont statiques,
sans sélecteur ni ajout d’équipe.

La sélection de produits affiche la barre flottante native du dépôt amont en bas
de l’écran : compteur, effacement, export CSV et désactivation avec confirmation
(administrateur et gestionnaire uniquement). Les actions concernent les produits
sélectionnés correspondant aux filtres courants, toutes pages confondues. La
désactivation est enregistrée par l’API et conserve le stock et l’historique.

La même barre est disponible pour l’inventaire, les commandes et les alertes,
avec compteur, effacement et export CSV des lignes sélectionnées correspondant
aux filtres courants (toutes pages confondues). Pour les alertes, l’acquittement
ne concerne que les nouvelles alertes et la résolution que les alertes encore
ouvertes ; une confirmation liste les éléments concernés. Ces changements sont
enregistrés par l’API et ne modifient jamais le stock. Les mouvements récents restent en
lecture seule et les autres tableaux ne sont pas modifiés.

Le catalogue produits reprend la structure de la page Tasks du dépôt amont
et réutilise ses composants `DataTableToolbar`, `DataTableColumnHeader` et
`DataTablePagination`. Les filtres, le tri, la sélection et la pagination
fonctionnent sur les données synthétiques locales. Le menu Affichage permet
d’afficher notamment l’auteur et la catégorie. La colonne Seuil est retirée ;
les cellules conservent leur alignement natif.
Les statuts Actif et Désactivé utilisent le composant Badge natif shadcn.
Le badge Désactivé utilise la variante `destructive`.
Le badge Actif utilise `bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300`.
Les actions de création, consultation, modification et désactivation conservent les
permissions du prototype ; la désactivation est persistée par l’API.
La création produit s’ouvre dans un dialogue natif au-dessus du catalogue,
sur le modèle du formulaire utilisateur amont. La validation du SKU, des prix
et des champs obligatoires ainsi que l’avertissement d’abandon sont conservés.
Le formulaire utilise deux colonnes sur grand écran, une description pleine
largeur et une seule colonne sur mobile.
L’enregistrement crée le produit par l’API ; la modification des produits
existants conserve sa page dédiée.

La même structure native est utilisée pour l’inventaire, les mouvements,
les commandes, les alertes, l’historique des imports et le journal d’audit.
Le dashboard conserve uniquement les indicateurs et graphiques, sans tableaux.
Ses cartes reprennent le balisage et les classes du dashboard shadcn-admin :
titres et icônes en en-tête, valeurs en gras, comparaisons atténuées et grille
responsive pour six indicateurs (sans panier moyen), avec des cartes compactes.
Les graphiques utilisent les couleurs du thème.
Le composant partagé `RecordsTable` reprend les primitives et contrôles Tasks,
sans styles CSS de tableau hérités. Les tables de détail produit/commande,
l’aperçu des ventes et les erreurs d’import utilisent aussi ces composants.
Les listes proposent recherche, filtres à facettes, tri, affichage des colonnes
et pagination ; les tables de consultation n’ajoutent pas de sélection inutile.
Les actions et confirmations existantes sont conservées. Les modifications de
stock, commandes et alertes sont persistées par les services backend.

## Développement local

Les mouvements de stock utilisent un dialogue shadcn
adaptatif en clair/sombre. Le mouvement exige une raison, une quantité valide
et une confirmation ; le stock négatif reste interdit et chaque modification
produit son mouvement persistant.
La page Commandes permet la consultation et l’export, sans création manuelle.

Les statuts des tableaux partagent le composant StatusBadge : succès en vert,
avertissement en ambre, information en bleu, expédition en ciel, préparation et
brouillon en violet, échec en rouge doux. Les classes suivent le modèle shadcn
`bg-*-50/text-*-700` et `dark:bg-*-950/dark:text-*-300` ; les libellés restent visibles.
La période des commandes se sélectionne à côté de la recherche du tableau.
Rapports utilise une barre de recherche et des filtres compacts avec recherche
dans les options. Les tableaux partagent les dimensions et espacements des
primitives shadcn Table ; les lignes contenant du texte long peuvent grandir.
Le lien **Settings** ouvre les paramètres existants sur `/administration`.

Le journal d’audit est disponible sur la page **Logs** (`/logs`), accessible
dans la section Gouvernance de la barre latérale. Administration présente
directement les paramètres système.

Prévisions, Rapports et Administration partagent désormais les composants
shadcn et les thèmes clair/sombre. La recherche des prévisions accepte le
clavier ; les filtres et le choix de rapport restent verrouillés pendant la
génération. Les paramètres, exports et actions administratives conservent leur
comportement persistant et leurs validations existantes.

Le parcours d’import des ventes utilise les composants shadcn et les couleurs
du thème pour ses cinq étapes (téléversement, validation, aperçu, confirmation,
résultats), en mode clair et sombre. La prévisualisation et la confirmation
utilisent le traitement d’import backend.

```bash
pnpm install
pnpm dev
```

Le serveur Vite écoute sur `http://127.0.0.1:5174` et relaie `/api` vers
`http://127.0.0.1:8080`. La cible peut être remplacée avec
`MAARIF_API_TARGET`. L’authentification utilise la session HTTP et le jeton CSRF
du backend ; les espaces métier lisent et modifient les données par l’API.

Vérifications principales :

```bash
pnpm format:check
pnpm lint
pnpm test
pnpm build
```

Sur le poste Ubuntu 26.04 actuel, les tests navigateur sont bloqués par
l’absence du Chromium headless attendu par Playwright. L’installateur de
cette version ne prend pas encore ce système en charge. Les interactions
du catalogue ont également été vérifiées dans le navigateur de développement.

## Base amont

Le code de base reste distribué selon la licence MIT du projet original. Les
informations amont sont conservées ci-dessous.

---

# Shadcn Admin Dashboard

Admin Dashboard UI crafted with Shadcn and Vite. Built with responsiveness and accessibility in mind.

![alt text](public/images/shadcn-admin.png)

[![Sponsored by Clerk](https://img.shields.io/badge/Sponsored%20by-Clerk-5b6ee1?logo=clerk)](https://go.clerk.com/GttUAaK)

I've been creating dashboard UIs at work and for my personal projects. I always wanted to make a reusable collection of dashboard UI for future projects; and here it is now. While I've created a few custom components, some of the code is directly adapted from ShadcnUI examples.

> This is not a starter project (template) though. I'll probably make one in the future.

## Features

- Light/dark mode
- Responsive
- Accessible
- With built-in Sidebar component
- Global search command
- 10+ pages
- Extra custom components
- RTL support

<details>
<summary>Customized Components (click to expand)</summary>

This project uses Shadcn UI components, but some have been slightly modified for better RTL (Right-to-Left) support and other improvements. These customized components differ from the original Shadcn UI versions.

If you want to update components using the Shadcn CLI (e.g., `npx shadcn@latest add <component>`), it's generally safe for non-customized components. For the listed customized ones, you may need to manually merge changes to preserve the project's modifications and avoid overwriting RTL support or other updates.

> If you don't require RTL support, you can safely update the 'RTL Updated Components' via the Shadcn CLI, as these changes are primarily for RTL compatibility. The 'Modified Components' may have other customizations to consider.

### Modified Components

- scroll-area
- sonner
- separator

### RTL Updated Components

- alert-dialog
- calendar
- command
- dialog
- dropdown-menu
- select
- table
- sheet
- sidebar
- switch

**Notes:**

- **Modified Components**: These have general updates, potentially including RTL adjustments.
- **RTL Updated Components**: These have specific changes for RTL language support (e.g., layout, positioning).
- For implementation details, check the source files in `src/components/ui/`.
- All other Shadcn UI components in the project are standard and can be safely updated via the CLI.

</details>

## Tech Stack

**UI:** [ShadcnUI](https://ui.shadcn.com) (TailwindCSS + RadixUI)

**Build Tool:** [Vite](https://vitejs.dev/)

**Routing:** [TanStack Router](https://tanstack.com/router/latest)

**Type Checking:** [TypeScript](https://www.typescriptlang.org/)

**Linting/Formatting:** [ESLint](https://eslint.org/) & [Prettier](https://prettier.io/)

**Icons:** [Lucide Icons](https://lucide.dev/icons/), [Tabler Icons](https://tabler.io/icons) (Brand icons only)

**Auth (partial):** [Clerk](https://go.clerk.com/GttUAaK)

## Run Locally

Clone the project

```bash
  git clone https://github.com/satnaing/shadcn-admin.git
```

Go to the project directory

```bash
  cd shadcn-admin
```

Install dependencies

```bash
  pnpm install
```

Start the server

```bash
  pnpm run dev
```

## Sponsoring this project ❤️

If you find this project helpful or use this in your own work, consider [sponsoring me](https://github.com/sponsors/satnaing) to support development and maintenance. You can [buy me a coffee](https://buymeacoffee.com/satnaing) as well. Don’t worry, every penny helps. Thank you! 🙏

For questions or sponsorship inquiries, feel free to reach out at [satnaingdev@gmail.com](mailto:satnaingdev@gmail.com).

### Current Sponsor

- [Clerk](https://go.clerk.com/GttUAaK) - authentication and user management for the modern web

## Author

Crafted with 🤍 by [@satnaing](https://github.com/satnaing)

## License

Licensed under the [MIT License](https://choosealicense.com/licenses/mit/)

La fiche commande utilise les composants shadcn pour son résumé responsive, son statut et son dialogue d’annulation. Elle se termine par les articles et le total, sans panneau de mouvements. L’annulation attend la réponse du backend, affiche les erreurs dans le dialogue et respecte le rôle de la session.

Vérification de la fiche commande (6 septembre 2026) : build TypeScript/Vite, lint et formatage validés, ainsi que Maven verify et la configuration Compose. La suite navigateur de prototype2 a été arrêtée après plusieurs minutes sans résultat. Dans frontend, formatage, lint, typage, build et tests Sites passent ; le test d’inventaire ayant dépassé son délai passe à la relance isolée. Le parcours E2E est ignoré faute de variables E2E_EMAIL/E2E_PASSWORD. La prévisualisation locale ouvre la connexion ; la fiche authentifiée reste à vérifier visuellement.

La page `/users` remplace la démonstration amont par la gestion réelle des utilisateurs. Le lien Utilisateurs est visible pour les administrateurs uniquement ; les autres rôles ne chargent aucune liste et reçoivent un message d’accès réservé. Les comptes proviennent de `/api/admin/users`. Le formulaire permet de créer un compte, modifier son profil et son rôle, activer/désactiver son accès et définir un nouveau mot de passe (12 à 128 caractères). Un mot de passe vide en modification conserve celui existant. Les erreurs du backend restent visibles dans le formulaire.

La page Utilisateurs suit la même structure que Produits : en-tête compact, tableau partagé sans carte englobante, recherche instantanée, filtres Rôle/Statut à facettes multisélection, tri dans les en-têtes, menu Affichage, cases de sélection et pagination native. Toutes les pages de comptes sont chargées via l’API administrateur avant le filtrage local, comme pour les autres listes, afin que recherche et compteurs couvrent tous les utilisateurs. Les paramètres serveur existants restent disponibles pour les autres clients.

Vérification de l’alignement Utilisateurs/Produits : build, lint, formatage et 11 tests ciblés (tableau partagé, gestion des comptes, chargement complet) validés. Maven verify, configuration Compose et vérifications frontend (formatage, lint, typage, tests unitaires, build et Sites) passent. Le test E2E est ignoré faute de variables de connexion locales.
