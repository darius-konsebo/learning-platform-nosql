# Projet de fin de module NoSQL

## I. Réponses aux questions des commentaires

### 1. Fichier environnement \.env

#### Question 1 : Quelles sont les informations sensibles à ne jamais committer ?
Les informations sensibles à ne jamais committer incluent :
- Identifiants de connexion (username, password).
- Clés API pour des services tiers.
- URLs de connexion aux bases de données.
- Certificats ou clés privées.
- Toute autre information confidentielle ou spécifique à l’environnement.

---

#### Question 2 : Pourquoi utiliser des variables d'environnement ?
Les variables d'environnement permettent :
1. De séparer la configuration du code pour gérer facilement les différences entre les environnements.
2. De protéger les informations sensibles en ne les incluant pas directement dans le code source.
3. De faciliter le déploiement en permettant de personnaliser une application sans modifier le code source.
4. De suivre les bonnes pratiques de sécurité en minimisant les risques de compromission.
