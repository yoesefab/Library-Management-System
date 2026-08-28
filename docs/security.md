# Sécurité

## Sécurité du frontend

- Aucun jeton d’authentification n’est écrit dans `localStorage` ou `sessionStorage`.
- La session repose sur `JSESSIONID` HttpOnly et les requêtes utilisent `credentials: include`.
- Toute mutation hors connexion obtient le jeton CSRF du backend et envoie l’en-tête indiqué par `/api/auth/csrf`.
- Les routes et actions sont adaptées au rôle pour l’ergonomie; les contrôles `@PreAuthorize` backend restent l’autorité.
- Un 401 invalide le cache de session; un 403 mène à l’écran d’accès non autorisé.

## Architecture implémentée

- Spring Security et BCrypt coût 12.
- Session serveur courte (30 minutes par défaut), fixation de session neutralisée à la connexion.
- Cookie `JSESSIONID` HttpOnly, `SameSite=Strict`; `Secure` activable et obligatoire derrière HTTPS.
- Double protection CSRF par cookie `XSRF-TOKEN` et en-tête `X-XSRF-TOKEN` pour les mutations.
- Rôles contrôlés avec `@PreAuthorize`; le backend reste l'autorité.
- Bootstrap administrateur uniquement lorsque email et mot de passe sont fournis par variables d'environnement.
- CORS limité aux origines de développement déclarées; aucun joker avec credentials.
- Actuator limité à `health` et `info`; erreurs sans stack trace.
- Imports limités à 10 Mo, checksum SHA-256, validation par ligne et aucun contenu exécuté.
- Exports neutralisant les cellules commençant par `=`, `+`, `-` ou `@`.
- Audit sans mot de passe, cookie ou token.

## Matrice d'accès

| Capacité | Administrateur | Manager | Employé stock |
|---|---:|---:|---:|
| Utilisateurs, rôles, paramètres, audit | oui | non | non |
| Indicateurs financiers, imports, commandes, prévisions, rapports | oui | oui | non |
| Catalogue en lecture et inventaire | oui | oui | oui |
| Modification catalogue/référentiels | oui | oui | non |
| Correction produisant un stock négatif | oui, avec motif | non | non |

## Limites assumées

Les sessions sont en mémoire du processus: adaptées à une instance locale unique, elles sont invalidées lors d'un redémarrage et ne se partagent pas entre plusieurs réplicas. Une persistance Spring Session JDBC sera nécessaire avant un déploiement horizontal. La limitation de tentatives de connexion reste à ajouter avant exposition Internet; l'application n'est actuellement destinée qu'au réseau de démonstration local.

Le chargeur synthétique `/api/admin/demo-data/catalog` exige le rôle administrateur et n'existe que lorsque `DEMO_DATA_ENABLED=true`. Cette variable doit rester à `false` en production.
