# Plan d'implémentation backend

Chaque jalon doit former une tranche cohérente, garder l'application exécutable et mettre à jour tests, documentation et changelog.

| Jalon | Résultat attendu | Porte de sortie principale |
|---:|---|---|
| 1 | Fondation dépôt, architecture, schéma, builds et santé | builds/tests smoke verts; stack Compose validée dès Docker disponible |
| 2 | Mapping JPA du catalogue et preuve PostgreSQL | migration V1 et `CatalogPersistenceIT` exécutés sur Testcontainers |
| 3 | Socle API réutilisable, erreurs et pagination | contrats DTO et erreurs testés |
| 4 | Authentification et autorisation | matrice rôles/endpoints, tests 401/403/CSRF |
| 5 | Catalogue et inventaire traçable | invariant de non-négativité et timeline validés |
| 6 | Commandes et import CSV en deux étapes | tests de transition et idempotence concurrents |
| 7 | KPI filtrés | formules rapprochées d'un jeu de référence |
| 8 | Alertes et analyse de stock | explications, acquittement/résolution audités |
| 9 | Prévisions et réapprovisionnement | comparaison MAE/baseline/fallback testée |
| 10 | Exports et rapports | CSV anti-injection et PDF visuellement vérifié |
| 11 | WooCommerce lecture seule, seulement si autorisé | reprise, pagination, logs et déduplication |
| 12 | Durcissement sécurité et performance | audit de dépendances et charge ciblée |
| 13 | Déploiement et documentation finale | installation reproductible et restauration testée |
| 14 | Préparation de soutenance | scénario chronométré, slides, questions et limites |

## État actuel

Les capacités backend des jalons 1 à 10 sont implémentées dans une première version cohérente et testée. WooCommerce reste optionnel et non connecté, conformément à l'interdiction de toucher la production sans autorisation. Les prochaines activités sont le durcissement (limitation de connexion, tests de concurrence/charge, analyse de dépendances), l'enrichissement des données synthétiques et la préparation de soutenance.
