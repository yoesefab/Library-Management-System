# Journal des décisions

## ADR-011 — Conserver le prototype comme source visuelle

**Statut:** accepté, 2026-08-28.  
**Décision:** la feuille de styles et l’anatomie du prototype restent la référence. Le fichier monolithique d’origine est archivé sous `frontend/src/legacy` et exclu du build; les pages TypeScript réutilisent ses classes au lieu d’introduire des composants génériques.

## ADR-012 — Session cookie et CSRF centralisés

**Statut:** accepté, 2026-08-28.  
**Décision:** toutes les opérations HTTP passent par un client `fetch` unique avec cookie de session, CSRF dynamique, erreurs structurées et annulation.

## ADR-013 — Ne pas inventer les séries de prévision

**Statut:** accepté, 2026-08-28.  
**Décision:** tant que le backend ne fournit pas les points historiques/prédits, le frontend affiche les valeurs et explications réelles sans simuler une courbe.

## ADR-001 — Déploiement monolithique

**Statut:** accepté et précisé par ADR-010, 2026-08-27.  
**Décision:** une API Spring Boot unique.  
**Motif:** transactions stock/commande/import simples et déploiement accessible à un stagiaire. Un découpage en services ne sera envisagé qu'après mesure d'un besoin indépendant.

## ADR-002 — Spring Boot 3.5.16 sur Java 21

**Statut:** accepté.  
**Décision:** dernière maintenance stable 3.5.x observée au démarrage du projet.  
**Motif:** Java 21 LTS, compatibilité mature avec Spring Data, Flyway, Springdoc et Testcontainers. Spring Boot 4.1 est stable mais sa génération et son écosystème sont plus récents; une migration pourra être évaluée après la soutenance.

## ADR-003 — Stock dérivé du journal

**Statut:** accepté.  
**Décision:** pas de colonne mutable `current_stock` au jalon initial; somme des mouvements comme source de vérité.  
**Conséquence:** traçabilité forte; optimiser plus tard par projection ou vue matérialisée seulement avec réconciliation testée.

## ADR-004 — Sessions sécurisées plutôt que token en localStorage

**Statut:** proposé pour le jalon 4.  
**Décision:** cookie `Secure`, `HttpOnly`, `SameSite` et protection CSRF; sessions courtes persistées.  
**Motif:** réduire l'exposition aux vols de jetons par XSS et permettre la révocation. À valider lors de l'implémentation.

## ADR-005 — Import en deux étapes

**Statut:** accepté pour le jalon 6.  
**Décision:** prévalidation sans mutation, puis confirmation idempotente. Le champ CSV `discount` représente un montant absolu MAD par ligne, faute d'indication de pourcentage. Cette hypothèse sera visible dans le modèle d'import.

## ADR-006 — Horodatage et calendrier métier

**Statut:** accepté.  
**Décision:** instants stockés en UTC; date de commande interprétée dans `Africa/Casablanca`; formatage UI dans ce fuseau.  
**Motif:** préserver un ordre global tout en respectant le calendrier commercial marocain.

## ADR-007 — Outils absents de la machine initiale

**Statut:** constaté.  
**Décision:** fournir Maven Wrapper; Docker Engine/Compose reste un prérequis à installer pour PostgreSQL, Testcontainers et la stack. Node 24 installé satisfait Vite 8. Le client `psql` est optionnel si Docker est disponible.

## ADR-008 — Contrat HTTP du catalogue

**Statut:** accepté, 2026-08-27.  
**Décision:** exposer des DTO dédiés sous `/api/products`, avec pagination et filtres serveur. `DELETE` effectue une désactivation logique et ne supprime aucune ligne.  
**Motif:** ne pas exposer les entités JPA, conserver l'historique métier et garder les contrôleurs indépendants de la persistance. Une version de chemin sera ajoutée uniquement si une compatibilité API externe doit être maintenue.

## ADR-009 — PostgreSQL réel en complément de Testcontainers

**Statut:** accepté pour l'environnement initial.  
**Décision:** conserver le test PostgreSQL externe activable par `MAARIF_EXTERNAL_POSTGRES_TEST=true` en complément des tests PostgreSQL 17 Testcontainers désormais exécutables.  
**Motif:** le test externe a détecté une inférence de paramètre PostgreSQL que H2 n'avait pas révélée; Testcontainers fournit maintenant la preuve isolée et reproductible obligatoire.

## ADR-010 — Packages backend organisés par couche

**Statut:** accepté, 2026-08-27.  
**Décision:** organiser le code sous les packages globaux `controller`, `dto`, `model`, `repository`, `service`, `mapper`, `exception` et `config`, sans packages par module métier.  
**Motif:** préférence explicite du porteur du projet et lecture plus directe pour l'apprentissage et la soutenance. Le déploiement reste monolithique; les frontières métier sont maintenues par les services, les responsabilités de classes et les tests.  
**Conséquence:** cette décision remplace le découpage de packages par fonctionnalité initialement envisagé dans ADR-001. Le sens de dépendance `controller -> service -> repository -> model` doit rester contrôlé afin d'éviter un monolithe sans structure.

## ADR-011 — Produit backend-only

**Statut:** accepté, 2026-08-27.  
**Décision:** supprimer le frontend React et livrer l'ensemble des capacités sous forme d'API Spring Boot documentée par OpenAPI/Swagger UI.  
**Motif:** demande explicite du porteur du projet afin de concentrer la soutenance et l'implémentation sur le backend.  
**Conséquence:** les anciennes preuves frontend restent historiques dans les rapports de jalons précédents, mais ne font plus partie du produit courant.

## ADR-012 — Session serveur Spring Security

**Statut:** accepté, 2026-08-27.  
**Décision:** authentification BCrypt avec session courte, cookie `HttpOnly`/`SameSite=Strict` et jeton CSRF en cookie lisible par un client HTTP.  
**Motif:** révocation à la déconnexion et absence de jeton persistant dans un stockage navigateur. En HTTPS, `SESSION_COOKIE_SECURE=true` est obligatoire.

## ADR-013 — Jeu de démonstration déterministe et opt-in

**Statut:** accepté, 2026-08-27.  
**Décision:** versionner un catalogue et une année de ventes entièrement synthétiques; exposer un chargeur idempotent uniquement avec `DEMO_DATA_ENABLED=true` et le rôle administrateur.  
**Motif:** rendre la soutenance reproductible sans dépendre des données ou API de l'entreprise, tout en empêchant le chargement accidentel en production. Le CSV annuel reste importé par le parcours normal afin de prouver validation, checksum, transactions et mouvements de stock.

## Questions différées et réversibles

- Source exacte des coûts d'achat et politique de valorisation (coût courant ou moyen pondéré).
- Définition opérationnelle de stock réservé et disponible si WooCommerce expose des commandes en attente.
- Seuils finaux de `SLOW_MOVING` et `DEAD_STOCK` à valider avec le tuteur métier.
- Politique de stock de sécurité (jours fixes versus variabilité observée).
- Identité visuelle officielle et autorisation d'usage des éléments de marque.
