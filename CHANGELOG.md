# Journal des changements

Toutes les évolutions notables sont consignées ici selon l'esprit de Keep a Changelog.

## [Non publié]

- Migration de la fiche produit vers les composants shadcn/ui : cartes d’indicateurs et d’informations, badges d’état, tableau des ventes, alerte de confirmation et dialogue accessible de désactivation.

- Alignement de la page Utilisateurs sur Produits : même tableau partagé, filtres à facettes multisélection, recherche instantanée, tri des colonnes, menu Affichage, sélection et pagination ; suppression de la carte et de la barre de filtres spécifique.

- Filtres serveur des utilisateurs par rôle et statut, tri global par nom/e-mail, réinitialisation, actualisation et choix de 10 à 100 lignes par page ; comptage et pagination après filtrage.

- Ajout de la page Utilisateurs de `prototype2`, réservée aux administrateurs : recherche paginée, création, modification du profil/rôle, activation/désactivation et mot de passe facultatif en modification via les API réelles. Tests des autorisations backend par rôle et prise en compte du statut inactif à la création.

- Migration de la fiche commande de `prototype2` vers les cartes, boutons, badges, alertes et dialogue shadcn ; suppression des mouvements en bas de page, conservation de l’annulation backend et affichage de ses erreurs.
- Alignement des comparaisons en bas des cartes d’indicateurs de `prototype2`.
- Affichage mensuel des courbes du tableau de bord de `prototype2` sur les douze mois de démonstration.
- Correction des répartitions du tableau de bord par catégorie et langue afin qu'elles affichent les exemplaires vendus, conformément à leurs libellés.
- Autorisation des origines locales du prototype sur le port 5174 afin que l'authentification et les appels API fonctionnent depuis l'interface active.
- Correction des axes des courbes pour les données réelles et du chargement des lignes de commande dans `prototype2`.

### Prototype 2 shadcn-admin

- Ajout de `prototype2`, clone adapté de `satnaing/shadcn-admin`, avec les parcours complets du prototype Maarif Analytics remontés dans son shell responsive et son routage TanStack.
- Conservation des données synthétiques marocaines, des montants en MAD, des dates `Africa/Casablanca`, des permissions simulées et des interactions métier du prototype approuvé.
- Ajout d’une connexion, d’une navigation, d’un profil et de libellés français cohérents avec l’identité Maarif Culture.

### Réorganisation du prototype

- Séparation du monolithe React `prototypes/maarif-analytics-login/src/App.jsx` en fichiers de pages, layout authentifié et modules partagés, sans modification du rendu ni des parcours existants.
- Mutualisation des filtres du tableau de bord et des rapports afin de préserver le rendu autonome de chaque page après l’extraction.
- Simplification de la page de connexion du prototype en une vue centrée contenant uniquement le formulaire, sans le panneau d’aperçu des états.
- Suppression du bloc démonstratif des états de données au bas du tableau de bord du prototype.
- Remplacement du menu de période par un sélecteur de plage de dates avec deux calendriers, saisie directe, raccourcis et validation explicite.
- Remplacement des filtres natifs Catégorie, Langue, Auteur et Éditeur par des sélecteurs shadcn fondés sur Base UI.
- Adoption du bouton shadcn fondé sur Base UI pour l’action de réinitialisation des filtres du tableau de bord et des rapports.
- Ajout d’un avatar shadcn fondé sur Base UI avec initiales de secours dans l’identité de l’utilisatrice de la barre supérieure.
- Transformation de l’identité de l’utilisatrice en menu de profil accessible regroupant Administration, Alertes et Déconnexion, avec suppression de l’action de déconnexion séparée.

### Restauration du prototype

- Restauration non destructive de la version complète de `prototypes/maarif-analytics-login` à partir de la référence visuelle locale préservée, avec ses écrans finaux, ses états système, sa documentation QA et ses artefacts manquants.

### Réparation du frontend approuvé

- Ajout manuel et non destructif de la configuration shadcn/ui, reliée aux tokens visuels Maarif et limitée aux primitives réellement utilisées.
- Restauration des écrans de connexion, catalogue produits, formulaire produit, inventaire et tableau de bord sans changement de structure visuelle approuvée.
- Extraction du dialogue de mouvement de stock, des filtres, graphiques et tables du dashboard, de la navigation administrative et des primitives accessibles partagées.
- Remplacement des dialogues manuels de confirmation, commande et création d’utilisateur par Radix/shadcn avec gestion du focus, fermeture clavier et libellés accessibles.
- Correction des bornes de dates du dashboard et des rapports selon `Africa/Casablanca`, avec filtres backend auteur et éditeur.
- Adoption des primitives Button, Input, Label, Textarea, Select, Checkbox, Form, Card, Table, Badge, Alert, Dialog, Alert Dialog, Tabs, Tooltip, Skeleton, Sonner et Pagination sur les workflows réparés.
- Suppression des dépendances shadcn installées mais inutilisées et séparation des bundles React, Radix, Query et graphiques.
- Mise à jour corrective de Vite 6.4.2 vers 6.4.3 ; `npm audit --omit=dev` ne signale plus aucune vulnérabilité.
- Ajout de tests de régression pour produits, inventaire, dashboard, import CSV, alertes, prévision de repli et téléchargements de rapports.
- Documentation des capacités backend absentes au lieu de simuler une réactivation produit, une courbe de prévision ou un historique global de stock.

### Frontend React connecté

- Déplacement du prototype approuvé vers `frontend/` et conservation de sa feuille de styles et de ses artefacts visuels.
- Extraction en TypeScript du routeur, du layout, de l’authentification, des pages métier, des formulaires et des composants partagés.
- Intégration des domaines Spring Boot avec TanStack Query, client CSRF/session et erreurs structurées.
- Ajout de Vitest/Testing Library, Playwright, ESLint, Prettier, TypeScript et d’un service frontend Docker/Nginx.

### Ajouté

- Prototype responsive de la page de connexion Maarif Analytics, avec validations accessibles, affichage du mot de passe, chargement et erreur d’authentification.
- Mise en page authentifiée du prototype avec navigation latérale responsive, barre supérieure, commandes récentes en MAD et alertes de stock synthétiques.
- Tableau de bord de gestion responsive avec filtres partagés, sept KPI, tendances du chiffre d’affaires et des commandes, répartitions des ventes, performances produits, risques de stock et états de chargement, vide et erreur.
- Catalogue produits responsive du prototype avec recherche simulée côté serveur, filtres catégorie/langue/statut, pagination, table multilingue en MAD et actions conditionnées par rôle.
- Pages de création et modification d’un produit avec champs bibliographiques, commerciaux, stock et fournisseur, validation accessible, avertissement de modifications non enregistrées et retours de sauvegarde.
- Fiche produit responsive avec informations bibliographiques, prix, fournisseur, stock, ventes récentes, mouvements, prévision et recommandation de réapprovisionnement, ainsi que des actions conditionnées par rôle.
- Page de gestion d’inventaire responsive avec recherche, filtres de stock/catégorie/langue, pagination, valorisation en MAD, saisie validée des mouvements et historique récent.
- Formulaire de mouvement de stock enrichi avec six types métier, raison obligatoire, calcul du stock résultant, prévention du stock négatif et confirmation en deux étapes.
- Page de gestion des commandes avec recherche simulée côté serveur, filtres période/statut/source, pagination, montants en MAD, consultation et création de brouillon manuel.
- Fiche de commande avec récapitulatif, lignes détaillées, mouvements de stock associés et annulation autorisée avec confirmation et réintégration traçable.
- Parcours d’import CSV des ventes en cinq étapes avec dépôt de fichier, colonnes attendues, validation, avertissement de doublon, aperçu des erreurs par ligne, confirmation, progression, statistiques finales et rapport d’erreurs téléchargeable.
- Historique paginé des imports CSV avec empreintes de fichiers, volumes traités, statuts, horodatages Africa/Casablanca, détail des erreurs et rapports téléchargeables.
- Page d’alertes de stock avec filtres métier, sévérités, explications, actions suggérées, pagination, acquittement et résolution confirmés avec retour utilisateur.
- Page de prévisions avec recherche produit, demande hebdomadaire historique et prévue, méthode et métrique d’erreur, hypothèses, limites et recommandation de réapprovisionnement explicitement non automatique.
- Page de rapports avec filtres partagés, cinq rapports métier, exports CSV/PDF, progression de génération, confirmation de réussite et erreur récupérable.
- Page d’administration des utilisateurs avec recherche, filtres rôle/statut, pagination, création validée et confirmations sensibles pour les rôles, l’état du compte et les mots de passe.
- Page d’administration système avec paramètres métier validés, sauvegarde avec retour utilisateur et journal d’audit non sensible filtrable et paginé.
- États authentifiés simples pour accès non autorisé et page introuvable, avec actions de retour vers le catalogue ou le tableau de bord.
- Fondation du monorepo backend, frontend, documentation et infrastructure locale.
- Schéma PostgreSQL initial versionné avec Flyway.
- Endpoint backend de présentation de la plateforme et health check Actuator.
- Écran frontend de fondation et tests smoke.
- Docker Compose, Dockerfiles et modèle de variables d'environnement.
- Mapping JPA du catalogue: catégories, auteurs, éditeurs, fournisseurs et produits.
- Repositories Spring Data paginables et chargement explicite du graphe catalogue.
- Tests de domaine du catalogue et tests d'intégration PostgreSQL Testcontainers.
- API produits avec DTO, validation, erreurs structurées, pagination, filtres et désactivation logique.
- Test de parcours HTTP transactionnel sur PostgreSQL réel.
- Page française de catalogue avec recherche, filtre langue, création et états accessibles.
- API et page de gestion des catégories, auteurs, éditeurs et fournisseurs.
- Modification préremplie et désactivation confirmée des produits dans l'interface.
- Catalogue synthétique multilingue de 15 produits, classeur de lecture et 52 semaines de ventes saisonnières.
- Chargeur administrateur idempotent des référentiels, produits et stocks initiaux, activé explicitement par environnement.
- Test HTTP de bout en bout couvrant connexion, données synthétiques, import invalide/valide, idempotence, KPI, alertes, prévisions, recommandation et rapports.
- Réexécution du parcours complet sur PostgreSQL 17 Testcontainers.

### Modifié

- Réorganisation du backend en packages globaux par couche, sans changement du schéma PostgreSQL ni du contrat HTTP.
- Passage du produit en backend-only et suppression récupérable du frontend.
- Ajout de Spring Security, utilisateurs/rôles, audit, inventaire, commandes, imports CSV, KPI, alertes, prévisions, recommandations et rapports.
- Ajout de la migration additive V2 pour les paramètres applicatifs et le contenu temporaire des aperçus d'import.
- Comptage des lignes d'import corrigé pour distinguer lignes rejetées et erreurs multiples; rejet des lignes de commande incohérentes ou des produits dupliqués.
- Construction de l'image backend simplifiée pour éviter la résolution hors ligne des dépendances optionnelles de plugins Maven.
