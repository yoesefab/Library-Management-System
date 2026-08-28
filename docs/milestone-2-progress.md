# Rapport de progression du jalon 2 — Persistance catalogue

**Date:** 2026-08-27  
**Statut:** catalogue JPA et première tranche verticale produits terminés; validation Docker/Testcontainers en attente de l'installation administrateur locale.

## Réalisé

- Entités JPA `Category`, `Author`, `Publisher`, `Supplier` et `Product`.
- Association plusieurs-à-plusieurs produit/auteur via `product_author`.
- Relations `LAZY`, graphe explicite pour la lecture catalogue complète et repositories paginables.
- Validation locale des textes, prix décimaux, coûts, seuils et délais.
- Timestamps produits/fournisseurs gérés en UTC avec callbacks JPA.
- Tests unitaires du domaine catalogue.
- Test PostgreSQL Testcontainers avec migration, graphe relationnel, recherche paginée et unicité SKU.
- Test PostgreSQL externe permettant une preuve réelle lorsque Docker est indisponible.
- API produits avec DTO, création, lecture, modification, désactivation logique, pagination et filtres serveur.
- Erreurs JSON structurées et validation Bean Validation.
- Page React française de catalogue avec recherche, filtre langue, pagination, formulaire et états explicites.
- API paginées de catégories, auteurs, éditeurs et fournisseurs avec contrôle d'unicité.
- Page française de gestion des référentiels et rattachement de ceux-ci aux produits.
- Modification préremplie et désactivation confirmée depuis la table produits.
- Backend réorganisé en packages globaux par couche (`controller`, `dto`, `model`, `repository`, `service`, `mapper`, `exception`, `config`) sans modifier le schéma ou les routes HTTP.

## Preuves obtenues

- PostgreSQL Ubuntu 18.6 démarré sans privilèges sur `127.0.0.1:55432`.
- Flyway V1: `installed_rank=1`, `version=1`, `success=true`.
- Les six tables catalogue attendues existent.
- Hibernate `ddl-auto=validate` accepte le schéma.
- Le test externe insère et relit le graphe catalogue complet avec succès.
- Backend: 15 tests rapides réussis; 2 intégrations API/persistance réussies sur PostgreSQL réel.
- Frontend: 6 tests Vitest et 3 tests Playwright réussis; lint et build réussis.
- Le test API PostgreSQL a détecté puis permis de corriger une incompatibilité de typage de paramètre nullable absente sous H2.

## Blocage restant

Docker Engine 29.7.2 et Compose 5.5.0 sont installés. Le compte figure dans le groupe `docker`, mais le processus Codex actuel a été lancé avant cette attribution et reçoit encore `permission denied` sur `/var/run/docker.sock`. Une fermeture/réouverture de session est nécessaire. Les deux tests Testcontainers restent donc ignorés dans ce processus précis.

## Condition de clôture

1. Fermer puis rouvrir Codex ou la session utilisateur afin de recharger le groupe `docker`.
2. Exécuter `docker compose config` puis `docker compose up --build`.
3. Exécuter `./backend/mvnw -f backend/pom.xml verify` et confirmer que `CatalogPersistenceIT` exécute 2 tests sans skip.
4. Vérifier health, UI et OpenAPI sur la stack Compose.

L'authentification reste volontairement hors de cette tranche. Le prochain travail catalogue porte sur les référentiels associés et l'édition/désactivation dans l'interface; Docker/Testcontainers doit être clôturé dès installation.
