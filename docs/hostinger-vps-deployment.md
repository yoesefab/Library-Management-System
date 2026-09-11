# Déploiement sur un VPS Hostinger

Cette procédure déploie une seule instance de Maarif Analytics avec Docker Compose. Elle utilise Caddy pour HTTPS, Nginx pour le frontend, Spring Boot pour l’API et PostgreSQL pour les données. Redis n’est pas nécessaire pour cette installation mono-instance.

Le fichier `docker-compose.yml` est la configuration VPS. Le fichier optionnel `docker-compose.dev.yml` sert uniquement au développement local et ne doit pas être ajouté à la commande Hostinger.

## Architecture et ports

| Service             | Port interne |                Port publié | Persistance                  |
| ------------------- | -----------: | -------------------------: | ---------------------------- |
| Caddy               |      80, 443 | 80/tcp, 443/tcp et 443/udp | `caddy-data`, `caddy-config` |
| Frontend Nginx      |           80 |                      aucun | aucune                       |
| Backend Spring Boot |         8080 |                      aucun | `product-images`             |
| PostgreSQL          |         5432 |                      aucun | `postgres-data`              |

Seul Caddy est accessible depuis Internet. PostgreSQL, le backend et le frontend communiquent sur le réseau privé créé automatiquement par Compose.

## 1. Préparer le domaine et le VPS

1. Dans la zone DNS du domaine, créer un enregistrement `A` pour le sous-domaine choisi vers l’adresse IPv4 publique du VPS. Ajouter un enregistrement `AAAA` uniquement si IPv6 est correctement configuré.
2. Attendre la propagation DNS et vérifier que le domaine résout vers le VPS.
3. Dans le pare-feu Hostinger, autoriser `22/tcp` depuis les adresses d’administration et `80/tcp`, `443/tcp`, `443/udp` depuis Internet. Ne pas ouvrir `5432` ni `8080`.
4. Installer Docker Engine et Docker Compose, ou activer Docker Manager sur le VPS Hostinger.

Caddy obtient et renouvelle automatiquement le certificat. Les ports 80 et 443 doivent être libres et le domaine doit déjà pointer vers le VPS.

## 2. Préparer les variables

```bash
git clone <URL_DU_DEPOT> maarif-analytics
cd maarif-analytics
cp .env.example .env
chmod 600 .env
```

Modifier `.env` et fournir au minimum :

- `APP_DOMAIN` : domaine sans `https://`, par exemple `analytics.example.com`;
- `ACME_EMAIL` : adresse recevant les notifications de certificat;
- `POSTGRES_PASSWORD` : secret aléatoire long et unique;
- `JWT_SECRET` : clé aléatoire générée avec `openssl rand -base64 32`;
- `BOOTSTRAP_ADMIN_EMAIL` et `BOOTSTRAP_ADMIN_PASSWORD` : premier compte administrateur.

Le mot de passe administrateur doit comporter 12 à 128 caractères, avec au moins une minuscule, une majuscule et un chiffre. Aucune clé d’API externe n’est requise. Conserver `JWT_SECRET` hors du dépôt; sa rotation déconnecte tous les utilisateurs.

## 3. Valider et démarrer

```bash
docker compose config --quiet
docker compose build --pull
docker compose up -d
docker compose ps
```

Au premier démarrage, Flyway applique automatiquement les migrations versionnées avant que l’API accepte le trafic. Ne jamais modifier une migration déjà appliquée; ajouter une nouvelle migration pour toute évolution du schéma.

Vérifier ensuite :

```bash
curl --fail --show-error "https://${APP_DOMAIN}/api/platform"
docker compose exec backend curl --fail --silent http://localhost:8080/actuator/health
docker compose logs --tail=100 caddy frontend backend db
```

Le compte bootstrap n’est créé que s’il n’existe pas déjà. Après sa création, retirer `BOOTSTRAP_ADMIN_PASSWORD` de `.env` et redémarrer le backend; conserver le mot de passe dans un gestionnaire de mots de passe.

## 4. Mises à jour

Avant chaque mise à jour, effectuer une sauvegarde. Puis :

```bash
git pull --ff-only
docker compose config --quiet
docker compose build --pull
docker compose up -d --remove-orphans
docker compose ps
```

Le déploiement mono-instance peut provoquer une courte interruption pendant le remplacement des conteneurs.

## 5. Sauvegarde simple

Créer un répertoire lisible uniquement par l’administrateur :

```bash
install -d -m 700 backups
docker compose exec -T db sh -c \
  'pg_dump --username="$POSTGRES_USER" --dbname="$POSTGRES_DB" --format=custom' \
  > "backups/maarif-$(date -u +%Y%m%dT%H%M%SZ).dump"
```

Sauvegarder aussi le volume `product-images`, qui contient les images produit :

```bash
docker run --rm \
  --volume maarif-analytics_product-images:/source:ro \
  --volume "$PWD/backups:/backup" \
  alpine:3 tar -czf "/backup/product-images-$(date -u +%Y%m%dT%H%M%SZ).tar.gz" -C /source .
```

Le nom du volume est visible avec `docker volume ls` et peut différer si le nom du projet Compose est personnalisé. Copier régulièrement les fichiers `.dump` et `.tar.gz` hors du VPS par SFTP ou vers un stockage de sauvegarde fourni par l’hébergeur. Ne pas considérer les volumes Docker comme des sauvegardes.

Test de restauration dans une base vide, pendant une fenêtre de maintenance :

```bash
docker compose stop backend
cat backups/maarif-YYYYMMDDTHHMMSSZ.dump | docker compose exec -T db sh -c \
  'pg_restore --username="$POSTGRES_USER" --dbname="$POSTGRES_DB" --clean --if-exists'
docker compose up -d backend frontend caddy
```

Une restauration écrase des données : toujours tester d’abord sur un VPS ou une base temporaire.

## 6. Logs et exploitation

Tous les services écrivent vers la sortie standard. Docker conserve trois fichiers de 10 Mo par conteneur afin d’éviter de remplir le disque.

```bash
docker compose logs -f --tail=200
docker system df
df -h
```

Les health checks et `restart: unless-stopped` redémarrent les processus défaillants. Ils ne remplacent ni une sauvegarde ni une supervision externe. Pour un petit projet, une sonde HTTP Hostinger ou UptimeRobot sur `https://<domaine>/api/platform` suffit.

## 7. Dépannage

### Le certificat HTTPS n’est pas créé

- vérifier les enregistrements DNS avec `getent hosts "$APP_DOMAIN"`;
- vérifier que les ports 80 et 443 sont ouverts et non utilisés par Apache/Nginx installé sur l’hôte;
- consulter `docker compose logs caddy`;
- ne pas placer un autre proxy Cloudflare en mode incorrect pendant la première émission.

### Le backend reste unhealthy

```bash
docker compose logs backend db
docker compose exec db pg_isready --username="$POSTGRES_USER" --dbname="$POSTGRES_DB"
```

Vérifier `POSTGRES_PASSWORD`, l’espace disque et les erreurs Flyway. Ne pas lancer `flyway repair` ou supprimer un volume sans comprendre et sauvegarder les données.

### Erreur 502

Vérifier successivement `docker compose ps`, la santé du backend, puis les logs `frontend` et `caddy`. Le frontend ne démarre qu’après la santé du backend, et Caddy après celle du frontend.

### Tous les utilisateurs sont déconnectés

Les JWT sont stateless et survivent aux redémarrages tant que `JWT_SECRET` ne change pas. Une rotation ou perte de cette clé invalide tous les cookies existants. Redis n’est pas nécessaire, même pour plusieurs backends, si toutes les instances partagent la même clé via un gestionnaire de secrets; le limiteur de débit devra toutefois devenir distribué.

## 8. Arrêt

```bash
docker compose down
```

Ne jamais ajouter `--volumes` en production : cette option supprime les données PostgreSQL, les images et les certificats Caddy.
