# Note de cadrage

## Identité

**Titre académique:** Conception et développement d’une plateforme intelligente de suivi des ventes et de gestion prédictive des stocks pour la librairie Maarif Culture  
**Produit:** Maarif Analytics  
**Contexte:** projet de stage de génie logiciel à l'ENSET Mohammedia, Casablanca, Maroc.

## Problème

Les ventes, le stock, les alertes et les décisions de réapprovisionnement doivent être reliés dans un même flux traçable. Le produit doit permettre: importer les ventes, produire les mouvements de stock exactement une fois, calculer les indicateurs, détecter les risques, prévoir la demande, expliquer une recommandation et exporter un rapport.

## Objectifs mesurables

- Garantir une piste d'audit pour 100 % des changements de stock.
- Rendre un réimport du même fichier et d'une même commande idempotent.
- Fournir les KPI filtrables sur une plage de dates commune.
- Produire des alertes, prévisions et recommandations accompagnées d'une explication lisible.
- Permettre une démonstration complète avec des données synthétiques multilingues.
- Couvrir les règles critiques par des tests automatisés backend, sécurité, API et PostgreSQL.

## Hors périmètre initial

- Écriture vers le site WooCommerce de production.
- Achat automatique auprès d'un fournisseur.
- Microservice Python ou modèle d'IA opaque.
- Données personnelles de clients réels.
- Comptabilité générale ou gestion de caisse complète.

## Critères de réussite de la soutenance

Une démonstration reproductible illustre le flux complet, les rôles, l'idempotence, la traçabilité du stock et l'explicabilité des prévisions. Les décisions sont reliées aux exigences, au schéma, aux tests et aux limites connues.

## État

Au jalon 1, seule la fondation exécutable, le schéma initial et la documentation de conception sont livrés. Les comportements métier sont planifiés, pas encore implémentés.
