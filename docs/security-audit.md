# Audit sécurité, fiabilité et préparation à la production

Date de l'audit initial : 2026-09-09. Cet état a été rédigé **avant** les corrections applicatives de cet audit.

## Périmètre et architecture inspectés

- Backend : Java 21, Spring Boot 3.5, Spring MVC, Spring Security, Spring Data JPA/Hibernate, Flyway et PostgreSQL 17. Point d'entrée : `MaarifAnalyticsApplication`.
- Authentification : session serveur `JSESSIONID`, BCrypt et jeton CSRF double-submit. Aucun JWT ni jeton de rafraîchissement n'est utilisé.
- API : contrôleurs sous `/api` (authentification, administration, catalogue, produits/images, stocks, commandes, imports, alertes, prévisions, tableaux de bord, rapports et paramètres); Actuator expose uniquement health/info.
- Frontend : React 19, TypeScript, Vite, appels API avec cookies de session et en-tête CSRF.
- Données : PostgreSQL, schéma géré par les migrations Flyway `V1` à `V4`; H2 et Testcontainers dans les tests.
- Exécution : images Docker multi-stage, Docker Compose et Nginx. Aucun manifeste Kubernetes, pipeline CI ou configuration cloud n'est présent.
- Recherche de secrets : seuls les exemples d'environnement sont suivis par Git; aucune valeur d'un éventuel fichier local `.env` n'a été lue ou affichée.

## État initial et plan de correction

| # | Exigence | État initial | Priorité | Zones examinées, risque, preuve et correction recommandée |
|---:|---|---|---|---|
| 1 | Authentification | PARTIAL | High | `SecurityConfiguration`, `AuthController`, `CustomUserDetailsService`, `BootstrapAdminConfiguration`, client de session. La session, sa fixation et les comptes actifs sont gérés, sans identifiants par défaut, mais la connexion n'est pas limitée et la session existante n'est pas explicitement invalidée après changement de mot de passe. Ajouter limitation, audit des échecs et révocation de session. |
| 2 | Autorisation | PASS | High | Tous les contrôleurs métier portent des règles `@PreAuthorize`; administration et paramètres sont réservés à l'administrateur et les DTO évitent l'exposition JPA. Les ressources sont globales à l'organisation, donc aucune propriété utilisateur n'est attendue. Maintenir des tests par rôle. |
| 3 | Sécurité des endpoints | PARTIAL | High | La règle par défaut est authentifiée et CSRF protège les mutations. Swagger est toutefois public et plusieurs identifiants de chemin ne sont pas contraints positivement. Restreindre la documentation API et valider systématiquement les chemins. |
| 4 | Validation/sanitation des entrées | PARTIAL | High | Bean Validation est utilisée de manière inégale; certains paramètres de pagination, textes et dates n'ont aucune borne, et Jackson accepte les champs inconnus. Compléter les contraintes, normaliser les textes et rejeter les propriétés inattendues. |
| 5 | Sécurité JWT | NOT APPLICABLE | Low | Aucun JWT n'est créé, validé ou stocké : l'application utilise exclusivement une session serveur avec cookie. Ne pas introduire de JWT sans besoin produit. |
| 6 | Protection contre les injections | PASS | High | Les repositories utilisent JPQL paramétré ou les méthodes Spring Data; aucun shell, moteur de template serveur, LDAP ou évaluation de code n'est utilisé. Les exports CSV neutralisent aussi les préfixes de formule. Continuer à utiliser ces API sûres. |
| 7 | Sécurité des mots de passe | PARTIAL | Critical | BCrypt coût 12 et minimum de 12 caractères existent, aucun hash n'est renvoyé. Il manque une politique homogène, une longueur maximale à la connexion, un contrôle de complexité et une défense brute-force. Centraliser une contrainte de mot de passe et limiter les tentatives. |
| 8 | Limitation de débit | FAIL | Critical | Aucun filtre ou service de limitation n'existe pour login, import, images ou calculs coûteux. Ajouter des limites par identité et adresse, réponses 429 et en-têtes; prévoir Redis pour plusieurs instances. |
| 9 | CORS | PARTIAL | High | Origines locales explicites et credentials activés, mais valeurs codées en dur et méthodes trop larges sur toutes les routes. Externaliser une allowlist obligatoire en production et réduire les en-têtes/méthodes. |
| 10 | Variables/secrets | PARTIAL | Critical | Le mot de passe PostgreSQL est requis par Spring/Compose et `.env` est ignoré; le profil et le cookie sécurisé ne sont pas transmis au conteneur backend, et des valeurs de confort restent valides en production. Ajouter validation de démarrage/profil, exemples sans secret utilisable et transmission explicite. |
| 11 | Données sensibles dans les réponses | PARTIAL | High | Les utilisateurs passent par DTO sans hash; cependant les journaux d'audit exposent l'e-mail et les erreurs d'import peuvent restituer des valeurs fournies. Réduire les journaux à l'identifiant et masquer/tronquer les valeurs rejetées. |
| 12 | Gestion des erreurs | PARTIAL | High | Les erreurs de validation/intégrité sont cohérentes et Spring masque stack traces/messages. Aucun handler de dernier recours ni identifiant de corrélation n'empêche une réponse framework incohérente. Ajouter traitement générique journalisé et corrélation. |
| 13 | Téléversements | PARTIAL | High | Les images ont taille, signatures magiques, type, noms UUID et stockage hors webroot; les CSV n'ont ni contrôle MIME/extension, ni limite de lignes/champs. Ajouter validation CSV stricte, bornes et détection de contenu; documenter l'antimalware en production. |
| 14 | Sécurité base de données | PARTIAL | Critical | Requêtes paramétrées et migrations contrôlées; Compose publie PostgreSQL sur toutes les interfaces et ne force ni TLS ni rôle distinct de migration. Lier le port local à loopback, retirer l'exposition en production et documenter TLS/moindre privilège. |
| 15 | Performance base de données | PARTIAL | High | Pagination majoritaire et index de base présents. `findAll()` dans le rafraîchissement d'alertes, listes analytiques non bornées et quelques relations paresseuses risquent scans/N+1. Ajouter index complémentaires/bornes et supprimer les paramètres de pagination non validés. |
| 16 | Intégrité des données | PARTIAL | High | Contraintes FK/unique/check et transactions couvrent commandes/stock; concurrence possible lors des confirmations d'import et alertes, et les e-mails/SKU uniques sont sensibles à la casse au niveau DB. Ajouter contraintes/index fonctionnels et verrouillage/idempotence. |
| 17 | Validation API | PARTIAL | High | DTO et format d'erreur existent, mais content-type, champs JSON inconnus, intervalles de date, pagination et clés de paramètres sont incomplets. Durcir Jackson, bornes globales et validations métier. |
| 18 | Journalisation/monitoring | PARTIAL | High | Audit métier et health Actuator existent. Il manque logs structurés de requête, request ID, métriques exposées et journalisation sécurisée des erreurs/événements suspects. Ajouter filtre de corrélation, logs sans données sensibles et Prometheus. |
| 19 | Tests automatisés | PARTIAL | High | Tests unitaires, MVC, intégration PostgreSQL et E2E frontend existent, notamment par rôle et pour images. La limitation, les en-têtes, champs inconnus, erreurs génériques, CSV hostile et configuration production ne sont pas couverts. Ajouter des régressions dédiées. |
| 20 | Configuration production | PARTIAL | Critical | Conteneur backend non-root, images multi-stage, healthchecks et erreurs masquées. TLS/HSTS/proxy, timeouts, arrêt gracieux, pool, docs API, CSP Nginx et profil production ne sont pas durcis. Ajouter un profil de production fail-fast et des en-têtes/timeouts conteneur. |

## Critères de clôture

La matrice finale dans ce document ne passera à `PASS` que pour les contrôles vérifiés par tests ou configuration concrète. Les obligations dépendant de l'infrastructure (TLS de terminaison, Redis partagé, antivirus, rotation et rôle PostgreSQL de migration) resteront explicitement `PARTIAL` avec une étape manuelle.

## État final après remédiation

| # | Exigence | État final | Preuve de remédiation ou risque restant |
|---:|---|---|---|
| 1 | Authentification | PASS | Limitation de connexion, JWT court en cookie HttpOnly, comptes actifs rechargés à chaque requête et suppression du cookie après changement du mot de passe. |
| 2 | Autorisation | PASS | Autorisation serveur par rôle conservée sur tous les domaines métier. |
| 3 | Sécurité des endpoints | PASS | Authentification par défaut, CSRF, Swagger authentifié (et désactivé en production), méthodes explicites et identifiants critiques validés. |
| 4 | Validation/sanitation des entrées | PASS | Contraintes complétées, champs JSON inconnus rejetés et entrées CSV bornées/strictes. |
| 5 | Sécurité JWT | PASS | JWT HS256 avec clé Base64 d’au moins 256 bits, algorithme imposé, issuer, audience, expiration, sujet, identifiant et claims requis validés; aucun token n’est renvoyé dans le JSON ou stocké par JavaScript. |
| 6 | Protection contre les injections | PASS | JPQL paramétré, aucun interpréteur de commande, exports CSV neutralisés. |
| 7 | Sécurité des mots de passe | PASS | BCrypt 12, longueur 12–128, complexité homogène, messages de connexion non distinctifs et limitation brute-force. |
| 8 | Limitation de débit | PARTIAL | Limites et réponses 429 couvertes par un test unitaire sur une instance. Un stockage Redis et une clé d'identité normalisée restent requis avant un déploiement horizontal. |
| 9 | CORS | PASS | Allowlist externalisée, wildcard refusé et origine obligatoire en production. |
| 10 | Variables/secrets | PASS | Secrets absents du dépôt, mot de passe DB requis et profil/variables désormais propagés par Compose. |
| 11 | Données sensibles dans les réponses | PASS | DTO sans hash/token; valeurs CSV rejetées nettoyées et tronquées; audit nominatif réservé aux administrateurs. |
| 12 | Gestion des erreurs | PASS | Réponse générique de dernier recours, stack trace uniquement côté serveur et identifiant de requête corrélé. |
| 13 | Téléversements | PARTIAL | Images et CSV vérifient taille/type/signature ou encodage, format, noms et bornes. L'antimalware nécessite le choix d'un service externe avant production. |
| 14 | Sécurité base de données | PARTIAL | Port DB lié au loopback et requêtes sûres. TLS, rôle applicatif distinct du rôle Flyway et règles réseau relèvent de l'infrastructure cible non spécifiée. |
| 15 | Performance base de données | PARTIAL | Pagination bornée et nouveaux index ajoutés. Les traitements analytiques/rafraîchissement globaux devront être mesurés avec le volume de production avant une refonte justifiée. |
| 16 | Intégrité des données | PASS | Valeurs métier normalisées sous contraintes uniques et verrou pessimiste de confirmation d'import. |
| 17 | Validation API | PASS | JSON strict, pagination/identifiants bornés, erreurs cohérentes et limites multipart/CSV. |
| 18 | Journalisation/monitoring | PASS | Request ID, événements de limitation sans identifiant brut, erreurs serveur, health/info/metrics. |
| 19 | Tests automatisés | PARTIAL | Régressions dédiées à la limitation/request ID et à la validation JWT ajoutées; la suite backend n’a pas pu être exécutée car Maven Central est bloqué et Docker est absent. |
| 20 | Configuration production | PASS | Profil `prod`, cookie JWT Secure, secret obligatoire, Swagger coupé, proxy/headers/timeouts, images non-root, no-new-privileges et health checks. |

Les états `PARTIAL` restants sont des **blocages de décision ou d'environnement**, pas des corrections à deviner : choix et exploitation de Redis, fournisseur/politique antimalware, topologie TLS/rôles PostgreSQL, volumes réels/SLO analytiques, et exécution CI avec Maven/Docker disponibles.
