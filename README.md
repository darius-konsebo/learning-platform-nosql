# Projet de fin de module NoSQL

## I. Réponses aux questions des commentaires

### 1. Fichier environnement `env`

#### Quelles sont les informations sensibles à ne jamais committer ?
Les informations sensibles à ne jamais committer incluent :
- Identifiants de connexion (username, password).
- Clés API pour des services tiers.
- URLs de connexion aux bases de données.
- Certificats ou clés privées.
- Toute autre information confidentielle ou spécifique à l’environnement.

#### Pourquoi utiliser des variables d'environnement ?
Les variables d'environnement permettent :
- De séparer la configuration du code pour gérer facilement les différences entre les environnements.
- De protéger les informations sensibles en ne les incluant pas directement dans le code source.
- De faciliter le déploiement en permettant de personnaliser une application sans modifier le code source.
- De suivre les bonnes pratiques de sécurité en minimisant les risques de compromission.

---

### 2. Couche config  

### a. Fichier `db.js`

#### Pourquoi créer un module séparé pour les connexions aux bases de données ?
Créer un module séparé pour les connexions aux bases de données permet de centraliser la logique de connexion, ce qui facilite la maintenance et la réutilisation du code. Cela suit également le principe de séparation des responsabilités (Single Responsibility Principle), en isolant les connexions des autres couches de l'application. En cas de changement dans la configuration ou dans le type de base de données, seules les modifications dans ce module seront nécessaires.

#### Comment gérer proprement la fermeture des connexions ?
La fermeture propre des connexions implique d'écouter les événements tels que `SIGINT` (arrêt du processus) ou `SIGTERM` (arrêt du service) pour exécuter des fonctions de nettoyage. Cela peut être réalisé en appelant les méthodes appropriées des clients, comme `mongoClient.close()` pour MongoDB et `redisClient.quit()` pour Redis, afin de libérer les ressources et éviter les fuites de mémoire ou les connexions inutilisées.

