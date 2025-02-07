# Projet de fin de module NoSQL

---

## Introduction

Ce projet est une application backend pour une plateforme d'apprentissage en ligne, développée avec Node.js, MongoDB, et Redis. L'objectif principal est de fournir une architecture modulaire, maintenable et performante, permettant de gérer les cours, les étudiants, et les statistiques associées. L'application suit une organisation en couches, incluant des fichiers de configuration, des services, des contrôleurs, et des routes, afin de respecter les principes de séparation des responsabilités et de réutilisabilité du code.

En utilisant des bases de données comme MongoDB pour le stockage persistant et Redis pour le cache, ce projet met en œuvre des pratiques modernes pour assurer des performances optimales et une gestion efficace des données. L'infrastructure est conçue pour être évolutive, avec une validation stricte des variables d'environnement et une gestion robuste des connexions aux bases de données.

Ce projet s'inscrit dans une démarche d'apprentissage et de développement de compétences en architecture logicielle et en bonnes pratiques backend, tout en offrant une base solide pour la création d'une plateforme fonctionnelle.

---

## I. Réponses aux questions des commentaires

### 1. Fichier environnement `.env`

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


### 2. Fichier `.gitignore`

Le fichier `.gitignore` doit être complété avec des exclusions spécifiques au projet afin d'éviter de versionner des fichiers inutiles ou sensibles.


### 3. Couche config  

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


### 4. Couche controllers - fichier `courseController.js`

**Quelle est la différence entre un contrôleur et une route ?**  
Un contrôleur est responsable de gérer la logique métier, comme le traitement des données ou les appels aux services. Une route, quant à elle, définit les points d'entrée (endpoints) de l'API et transfère les requêtes au contrôleur approprié.

**Pourquoi séparer la logique métier des routes ?**  
Séparer la logique métier des routes permet de rendre le code plus modulaire, réutilisable et maintenable. Cela facilite également les tests unitaires en isolant les différentes responsabilités.


### 5. Couche routes - fichier `courseRoutes.js`

**Pourquoi séparer les routes dans différents fichiers ?**  
Séparer les routes dans différents fichiers permet de structurer le code de manière plus claire et organisée. Cela rend le projet plus facile à maintenir et à étendre, en regroupant les routes liées à une même ressource ou fonctionnalité dans un seul fichier.

**Comment organiser les routes de manière cohérente ?**  
Les routes peuvent être organisées en regroupant les endpoints par ressource ou fonctionnalité. Par exemple, créer des fichiers dédiés pour chaque entité principale, suivre des conventions de nommage claires, et utiliser une structure RESTful pour les endpoints.


### 6. Couche services

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


### 7. Fichier `app.js`

**Comment organiser le point d'entrée de l'application ?**  
Le point d'entrée de l'application doit être organisé de manière à initialiser les différentes parties de l'application de façon claire et modulaire. Cela inclut :  
- La configuration des variables d'environnement,  
- L'import des modules essentiels comme les routes et les middlewares,  
- L'initialisation des connexions aux bases de données,  
- La configuration des gestionnaires d'erreurs globales et des signaux système (par exemple, `SIGTERM`).

**Quelle est la meilleure façon de gérer le démarrage de l'application ?**  
La meilleure façon de gérer le démarrage est de suivre une approche asynchrone pour gérer les connexions aux bases de données et d'autres services externes. Cela inclut :  
- Utiliser des blocs `try-catch` pour capturer et gérer les erreurs lors du démarrage,  
- S'assurer que toutes les dépendances critiques (comme les connexions aux bases de données) sont opérationnelles avant de lancer le serveur,  
- Ajouter une gestion propre des erreurs et des interruptions (comme `SIGTERM`) pour fermer les connexions et libérer les ressources proprement.

---

## II. Implémentation des TODO

Les fonctions des différentes couches telles que `config`, `controllers`, `routes`, `services` et le fichier `app.js` afin de configurer l'environnement, gérer les services (`MongoDB` et `Redis`) et d'assurer les opération CRUD pour les étudiants et les cours.

---

## III. Tests des fonctionnalités

### 1. Lancement de l'application

Pour lancer l'application backend, suivre les étapes ci-dessous :

**a. Installer les dépendances** :
   - S'assurer d'être dans le répertoire du projet.
   - Installer toutes les dépendances nécessaires en exécutant la commande suivante :
     ```bash
     npm install
     ```

**b. Vérifier les prérequis** :
   - **Node.js** : S'assurer que Node.js est installé sur la machine. Vérifier la version de Node.js en exécutant la commande suivante :
     ```bash
     node -v
     ```
     Si Node.js n'est pas installé, le télécharger et l'installer à partir du site officiel : [Node.js](https://nodejs.org/).

   - **MongoDB** : L'application nécessite une base de données MongoDB. S'assurer que MongoDB est installé et en cours d'exécution. 
    
     Si MongoDB n'est pas installé, suivre les instructions sur le site officiel : [Installation de MongoDB](https://www.mongodb.com/try/download/community).

   - **Redis** : L'application utilise Redis pour la gestion du cache. S'assurer que Redis est installé et en cours d'exécution. Vérifier l'état de Redis en exécutant la commande suivante :
     ```bash
     redis-server --version
     ```
     Si Redis n'est pas installé, suivre les instructions sur le site officiel : [Installation de Redis](https://redis.io/download).

**c. Démarrer le serveur Redis** :
   - Avant de lancer l'application, s'assurer que le serveur Redis est bien activé. Pour démarrer Redis, exécuter la commande suivante :
     ```bash
     redis-server
     ```
     Cette commande démarre le serveur Redis sur le port par défaut (6379). Laisser ce terminal ouvert pendant toute la durée de l'exécution de l'application.

**d. Lancer l'application** :
   - Une fois que toutes les dépendances sont installées et que les services MongoDB et Redis sont en fonctionnement, l'application peut être démarrée en exécutant la commande suivante :
     ```bash
     npm start
     ```
   - Cette commande démarre le serveur de l'application backend et l'écoute sur le port spécifié dans le fichier de configuration (généralement `port 3000`). Un message indiquant que l'application est en cours d'exécution et prête à recevoir des requêtes doit s'afficher.


![Image1](Captures_d'écran/Connexion_établie.png)


### 2. Tests avec Jest pour les opérations CRUD

Pour garantir le bon fonctionnement des différentes opérations CRUD dans l'application, des tests unitaires ont été implémentés en utilisant **Jest**, un framework de test populaire pour les applications JavaScript. Ces tests permettent de vérifier que chaque fonctionnalité, comme la création, la lecture, la mise à jour et la suppression des données, fonctionne correctement et de manière fiable.

#### a. Installation de Jest

Pour commencer à utiliser Jest dans un projet, l'installer d'abord en tant que dépendance de développement. Si ce n'est pas déjà fait, installer Jest en exécutant la commande suivante dans le terminal à la racine du projet :

```bash
 npm install --save-dev jest
```
Ensuite, configurer un script dans le package.json pour exécuter les tests. Ajouter ou modifier la section scripts comme suit :

```json
"scripts": {
  "test": "jest"
},"jest": {
    "testEnvironment": "node"
  }
```
Cela permet de lancer les tests avec la commande suivante :

```bash 
npm test
```
#### b. Mise en place de la couche mock pour les tests
Lorsqu'on effectue des tests unitaires, il est souvent nécessaire de simuler certaines dépendances externes, comme la base de données ou les appels réseau, afin d'éviter d'interagir avec les ressources réelles pendant les tests. C'est là que la couche mock (ici `_mock_`) entre en jeu.
Dans Jest, la fonction `jest.mock()` peut être utilisée pour créer des mocks de modules ou de services. Cela permet de tester les fonctionnalités sans avoir besoin de se connecter réellement à la base de données. Vous pouvez également utiliser `jest.fn()` pour créer des fonctions simulées avec un comportement personnalisé pour les tests.

#### c. Création des fichiers de tests
Une fois les mocks définis, les tests peuvent être écrits en utilisant les assertions fournies par Jest. Les tests avec Jest doivent être définis dans des fichiers ayant l'extension `.test.js`. Ces fichiers sont généralement situés dans un répertoire tests (ici `_test_`) ou au même niveau que les fichiers du code source.

#### d. Exécution des tests
Une fois que les tests sont écrits, les exécuter avec la commande suivante :

```bash 
npm test
```
Cela lance Jest, qui trouve tous les fichiers `.test.js` dans le projet et exécute les tests qu'ils contiennent. Jest fournira un rapport détaillant les tests réussis et échoués, avec des informations sur les erreurs éventuelles, ce qui permet de facilement identifier et corriger les problèmes dans le code.

### 3. Scénario de tests

Dans ce projet, les tests ont été effectués d'abord avec l'élément `student` en utilisant le fichier `studentController.test.js` avec Jest. Comme le montre l'image ci-dessous, tous les éléments ont été testés avec succès et sont entièrement fonctionnels :

![Image2](Captures_d'écran/Jest_students.png)

Le fichier `courseController.test.js` a ensuite été créé et testé avec succès. Les résultats du test sont illustrés dans l'image ci-dessous :

![Image3](Captures_d'écran/Jest_all.png)

---

## Conclusion

Ce projet de plateforme d'apprentissage en ligne illustre l'implémentation réussie d'une architecture modulaire et performante basée sur Node.js, MongoDB, et Redis. L'approche adoptée privilégie la séparation des responsabilités, l'optimisation des performances via un cache, et une organisation claire des couches applicatives.

L'utilisation de Jest pour les tests unitaires et d'intégration garantit une validation rapide et fiable des fonctionnalités. Sa simplicité, sa compatibilité avec Node.js, et ses outils avancés, tels que les mocks, en font un choix idéal pour assurer la robustesse et la maintenabilité du projet.

Ce projet offre une base solide pour intégrer de nouvelles fonctionnalités, améliorer les performances, ou préparer la mise en production sur le cloud, tout en appliquant des principes modernes de développement backend.

---

## À propos de l'auteur

Ce projet a été développé par KONSEBO Wendbénédo Albéric Darius, élève ingénieur en Informatique à l'Ecole Normale Supérieure de l'Enseignement Technique (ENSET) de Mohammedia

### Coordonnées
- **Nom :** KONSEBO Wendbénédo Albéric Darius
- **Email :** [dariuskonsebo@gmail.com]
- **LinkedIn :** [link](https://www.linkedin.com/in/wendb%C3%A9n%C3%A9do-alb%C3%A9ric-darius-konsebo-aa5439258/)
- **GitHub :** [git](https://github.com/darius-konsebo)

N'hésitez pas à me contacter pour toute question ou suggestion liée à ce projet.

