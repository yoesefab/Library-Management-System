# Architecture

## Architecture frontend

Le client vit dans `frontend/`. `src/app/router.tsx` déclare les routes et les gardes de rôle; `AppLayout` conserve le shell latéral approuvé. `AuthProvider` restaure `/api/auth/me` au chargement. Les modules de `src/api` sont les seules portes d’entrée HTTP et les pages les consomment avec TanStack Query. Les DTO Java sont reflétés explicitement dans `src/types/api.ts`; aucune entité JPA n’est exposée.

Les états de formulaire locaux restent dans React Hook Form et Zod. Les données serveur, la pagination et l’invalidation vivent dans TanStack Query. Les calculs KPI, stock, commandes, prévisions et recommandations restent exclusivement côté backend.

## Style retenu

Maarif Analytics est un monolithe backend en couches déployé comme une API Spring Boot avec PostgreSQL. Swagger UI fournit le client de démonstration technique. Les transactions de commande, import et stock restent locales et atomiques.

```mermaid
flowchart TB
    Browser[Swagger UI / client HTTP] -->|HTTPS JSON + cookie HttpOnly| API[Spring Boot API]
    API --> Services[Services métier transactionnels]
    Services --> Repositories[Repositories Spring Data]
    Repositories --> DB[(PostgreSQL)]
    API --> Files[Exports / rapports locaux]
```

## Couches backend

| Package | Responsabilité | Dépendances principales |
|---|---|---|
| `controller` | Endpoints HTTP, validation d'entrée et statuts HTTP | DTO, services |
| `dto` | Contrats d'entrée/sortie de l'API | types Java simples |
| `service` | Règles métier, cas d'utilisation et transactions | repositories, modèles, mappers |
| `repository` | Requêtes et persistance Spring Data | modèles |
| `model` | Entités JPA et invariants locaux | Jakarta Persistence/Validation |
| `mapper` | Conversion explicite modèle/DTO | modèles, DTO |
| `exception` | Erreurs métier et réponse HTTP structurée | DTO |
| `config` | Configuration technique Spring/OpenAPI | infrastructure |

Le sens principal des dépendances est `controller -> service -> repository -> model`. Un contrôleur ne contacte jamais directement un repository et aucune entité JPA n'est exposée comme contrat HTTP. Les fonctionnalités restent séparées par leurs services et leurs noms de classes plutôt que par des packages métier imbriqués.

### Catalogue implémenté au jalon 2

Les entités catalogue résident dans `model`, leurs interfaces Spring Data dans `repository`, leurs règles transactionnelles dans `service`, leurs conversions dans `mapper`, leurs contrats validés dans `dto` et leurs endpoints dans `controller`. Les référentiels disposent de listes paginées et de créations contrôlées; le produit les référence par identifiant. Le contrôleur reste mince et la désactivation remplace toute suppression physique d'un produit.

## Flux d'import cible

```mermaid
sequenceDiagram
    actor M as Manager
    participant UI as Client HTTP
    participant I as ImportService
    participant DB as PostgreSQL
    participant S as SalesService
    participant V as InventoryService
    M->>UI: Charger CSV
    UI->>I: Prévalidation
    I->>I: Headers, lignes, checksum
    I-->>UI: Aperçu + erreurs
    M->>UI: Confirmer
    UI->>I: Confirmer importJob
    I->>DB: Verrouiller/vérifier checksum
    loop commandes valides
        I->>S: Upsert idempotent par source+référence
        S->>V: Appliquer vente si transition vers COMPLETED
        V->>DB: Mouvement SALE unique
    end
    I->>DB: Finaliser compteurs et audit
    I-->>UI: Résultat
```

## Authentification JWT

```mermaid
sequenceDiagram
    actor U as Utilisateur
    participant B as Navigateur
    participant A as API Spring Security
    participant D as JwtDecoder
    U->>B: Email + mot de passe
    B->>A: POST /api/auth/login + jeton CSRF
    A->>A: Vérifier hash et état actif
    A->>A: Signer JWT HS256 court
    A-->>B: Cookie ACCESS_TOKEN Secure HttpOnly SameSite + profil
    B->>A: Requête avec cookie + CSRF si mutation
    A->>D: Vérifier signature, algorithme, issuer, audience et expiration
    A->>A: Recharger l’utilisateur actif et ses rôles
    A-->>B: Réponse autorisée ou 401/403
```

## Déploiement cible

```mermaid
flowchart LR
    User[Poste utilisateur] -->|HTTPS| Proxy[Reverse proxy]
    Proxy --> Web[Frontend statique]
    Proxy --> API[Spring Boot]
    API --> PG[(PostgreSQL)]
    API --> Volume[(Exports contrôlés)]
```

## Décisions transversales

- UTC pour les instants persistés; `Africa/Casablanca` pour les dates métier et présentations.
- Agrégats/calculs financiers uniquement au backend.
- Identifiants techniques `bigint`; références métier explicites et contraintes uniques.
- Stock courant dérivé de la somme des mouvements; une projection optimisée ne sera ajoutée qu'avec invariant et réconciliation.
- Base HTTP `/api`; une version de chemin sera introduite seulement si un contrat public ou une rupture de compatibilité la justifie. L'endpoint `/api/platform` reste un diagnostic non sensible.
