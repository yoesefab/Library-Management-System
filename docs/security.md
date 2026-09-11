# Sécurité

## Sécurité du frontend

- Aucun jeton d’authentification n’est écrit dans `localStorage` ou `sessionStorage`.
- Le JWT n’est jamais exposé à JavaScript : il reste dans le cookie HttpOnly `ACCESS_TOKEN` et les requêtes utilisent `credentials: include`.
- Toute mutation hors connexion obtient le jeton CSRF du backend et envoie l’en-tête indiqué par `/api/auth/csrf`.
- Les routes et actions sont adaptées au rôle pour l’ergonomie; les contrôles `@PreAuthorize` backend restent l’autorité.
- Un 401 invalide le cache de session; un 403 mène à l’écran d’accès non autorisé.

## Architecture implémentée

- Spring Security et BCrypt coût 12.
- API stateless avec JWT HS256 de 15 minutes par défaut, sans refresh token.
- Signature, algorithme, issuer, audience, expiration, identifiant, sujet et claims requis sont validés à chaque requête.
- Cookie `ACCESS_TOKEN` HttpOnly, `SameSite=Strict`; `Secure` forcé par le profil `prod` derrière HTTPS.
- Double protection CSRF par cookie `XSRF-TOKEN` et en-tête `X-XSRF-TOKEN` pour les mutations.
- Rôles contrôlés avec `@PreAuthorize`; le backend reste l'autorité.
- Bootstrap administrateur uniquement lorsque email et mot de passe sont fournis par variables d'environnement.
- CORS limité aux origines de développement déclarées; aucun joker avec credentials.
- Actuator limité à `health`, `info` et `metrics`; erreurs sans stack trace.
- Imports limités à 6 Mo et 10 000 lignes, strictement UTF-8 et CSV, checksum SHA-256, schéma exact, champs bornés, validation par ligne et aucun contenu exécuté.
- Limitation locale par adresse pour la connexion, les téléversements et les calculs coûteux, avec `429` et `Retry-After`; utiliser Redis avant de multiplier les instances.
- Chaque réponse porte `X-Request-ID`; les erreurs inattendues sont corrélées côté serveur sans exposer leur détail au client.
- En production, le cookie JWT est toujours `Secure`, Swagger est désactivé et `CORS_ALLOWED_ORIGINS` doit être explicite.
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

Le JWT est stateless : aucun stockage de session ni Redis n’est nécessaire. Une déconnexion efface le cookie du navigateur, mais un jeton déjà volé reste valable jusqu’à son expiration maximale de 15 minutes; la rotation de clé révoque tous les jetons. La limitation locale des connexions devra être distribuée seulement si plusieurs backends sont déployés.

Le chargeur synthétique `/api/admin/demo-data/catalog` exige le rôle administrateur et n'existe que lorsque `DEMO_DATA_ENABLED=true`. Cette variable doit rester à `false` en production.
