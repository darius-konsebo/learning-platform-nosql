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


### b. Fichier `env.js`

#### Pourquoi est-il important de valider les variables d'environnement au démarrage ? 
Cela permet de s'assurer que toutes les variables essentielles au bon fonctionnement de l'application sont correctement définies. Sans validation, des erreurs inattendues pourraient survenir plus tard dans l'exécution, rendant le débogage plus difficile.

#### Que se passe-t-il si une variable requise est manquante ?  
Si une variable requise est manquante, l'application risque de ne pas fonctionner correctement ou de planter. En validant les variables dès le démarrage, on peut détecter ce problème immédiatement et afficher un message d'erreur clair pour corriger la configuration avant le lancement.

---

### 3. Couche controllers - fichier `courseController.js`

**Quelle est la différence entre un contrôleur et une route ?**  
Un contrôleur est responsable de gérer la logique métier, comme le traitement des données ou les appels aux services. Une route, quant à elle, définit les points d'entrée (endpoints) de l'API et transfère les requêtes au contrôleur approprié.

**Pourquoi séparer la logique métier des routes ?**  
Séparer la logique métier des routes permet de rendre le code plus modulaire, réutilisable et maintenable. Cela facilite également les tests unitaires en isolant les différentes responsabilités.

---

### 4. Couche routes - fichier `courseRoutes.js`

**Pourquoi séparer les routes dans différents fichiers ?**  
Séparer les routes dans différents fichiers permet de structurer le code de manière plus claire et organisée. Cela rend le projet plus facile à maintenir et à étendre, en regroupant les routes liées à une même ressource ou fonctionnalité dans un seul fichier.

**Comment organiser les routes de manière cohérente ?**  
Les routes peuvent être organisées en regroupant les endpoints par ressource ou fonctionnalité. Par exemple, créer des fichiers dédiés pour chaque entité principale, suivre des conventions de nommage claires, et utiliser une structure RESTful pour les endpoints.

---

### 5. Couche services

### a. Fichier `mongoService.js`

**Pourquoi créer des services séparés ?**  
Créer des services séparés permet d'isoler la logique réutilisable et spécifique à une technologie (comme MongoDB) dans des modules dédiés. Cela améliore la modularité, facilite les tests unitaires et permet de changer la logique sous-jacente sans affecter les autres couches de l'application.

### b. Fichier `redisService.js`

**Comment gérer efficacement le cache avec Redis ?**  
Pour gérer efficacement le cache avec Redis, il est important de définir une durée de vie (TTL) pour les clés afin d'éviter une accumulation excessive de données. Utiliser des structures de données adaptées (comme des listes ou des hachages) en fonction des besoins, surveiller les performances et mettre en place une stratégie de cache (comme le cache par expiration ou le cache par invalidation) sont également essentiels.

**Quelles sont les bonnes pratiques pour les clés Redis ?**  
Les bonnes pratiques pour les clés Redis incluent :  
- Utiliser des noms de clés descriptifs et hiérarchiques (par exemple, `user:123:profile`),  
- Limiter la longueur des clés pour des performances optimales,  
- Préfixer les clés avec un identifiant unique si plusieurs applications partagent la même instance Redis,  
- Éviter d'utiliser des caractères spéciaux ou des espaces dans les clés.
