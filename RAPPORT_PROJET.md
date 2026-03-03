# 📊 Rapport de Projet - Foot-Loca API

**Date :** 3 Mars 2026  
**Type :** Application web de gestion de clubs de football  
**Architecture :** Backend API REST + Frontend React

---

## 🎯 Objectif du Projet

Développer une application complète permettant de :
- Gérer des clubs de football et leurs joueurs
- Suivre les matches et tournois
- Permettre aux utilisateurs de marquer des clubs en favoris
- Fournir une API REST sécurisée consommable par différents clients (web, mobile)

---

## 🛠️ Technologies Implémentées

### Backend
- **Framework :** Symfony 7.x (PHP)
- **ORM :** Doctrine
- **Authentification :** JWT (LexikJWTAuthenticationBundle)
- **Base de données :** SQLite
- **Serveur dev :** PHP Built-in Server (127.0.0.1:8000)

### Frontend
- **Framework :** React 18
- **Build Tool :** Vite 7.3
- **Serveur dev :** Vite Dev Server (localhost:5173)
- **Communication API :** Fetch API

---

## 📝 Étapes de Réalisation

### 1️⃣ Configuration Backend (Symfony)

**Installation des dépendances :**
```bash
composer require lexik/jwt-authentication-bundle
composer require symfony/maker-bundle --dev
composer require doctrine/orm
```

**Génération des clés JWT :**
```bash
php bin/console lexik:jwt:generate-keypair
```
- Clés stockées dans `config/jwt/`
- Durée de vie : 1 heure
- Algorithme : RS256

**Configuration sécurité :**
- Modification de `config/packages/security.yaml`
- Protection des routes par JWT
- Configuration du firewall API

### 2️⃣ Création du Modèle de Données

**Entités créées :**

1. **User** (Utilisateur)
   - Email, password, roles
   - Relation ManyToMany avec Club (favoris)

2. **Club** (Club de football)
   - Name, city, stadium, foundedYear
   - Relation OneToMany avec Player
   - Relation ManyToMany avec User

3. **Player** (Joueur)
   - FirstName, lastName, position, jerseyNumber
   - Relation ManyToOne avec Club

4. **Tournament** (Tournoi)
   - Name, startDate, endDate, location
   - Relation OneToMany avec FootballMatch

5. **FootballMatch** (Match)
   - HomeTeam, awayTeam, matchDate, status
   - HomeScore, awayScore
   - Relation ManyToOne avec Tournament

**Migrations :**
```bash
php bin/console make:migration
php bin/console doctrine:migrations:migrate
```

### 3️⃣ Développement des Contrôleurs API

#### ApiAuthController
- `POST /api/auth/login` : Authentification utilisateur
- `POST /api/auth/register` : Inscription nouvel utilisateur
- Retourne un token JWT valide 1 heure

#### ApiUserController
- `GET /api/users/me` : Profil utilisateur authentifié
- `GET /api/users/me/favorites` : Liste des clubs favoris
- `POST /api/users/me/favorites/{id}` : Ajouter un club aux favoris
- `DELETE /api/users/me/favorites/{id}` : Retirer un club des favoris

#### ApiClubController
- `GET /api/clubs` : Liste de tous les clubs (publique)
- `GET /api/clubs/{id}` : Détail d'un club avec ses joueurs (protégée)

#### ApiFootballMatchController
- `GET /api/matches` : Liste des matches
- `GET /api/matches?status=live` : Matches en cours
- `GET /api/matches?status=scheduled` : Matches à venir
- `GET /api/matches?status=finished` : Matches terminés

#### ApiTournamentController
- `GET /api/tournaments` : Liste des tournois (protégée)
- `GET /api/tournaments/{id}` : Détail tournoi avec matches (protégée)

### 4️⃣ Création du Frontend React

**Scaffolding :**
```bash
npm create vite@latest web-react -- --template react
cd web-react
npm install
```

**Fichiers créés :**

1. **src/services/api.js** : Client API centralisé
   - Fonctions d'authentification (login, register, logout)
   - Gestion du token dans localStorage
   - Helper `authHeaders()` pour JWT
   - Fonctions CRUD pour toutes les ressources

2. **src/App.jsx** : Composant principal
   - Gestion des vues (Login, Account, Clubs, Favorites, Matches, Tournaments)
   - State management avec useState
   - Navigation entre les vues
   - Affichage conditionnel selon authentification

3. **src/App.css** : Styles complets
   - Design moderne et responsive
   - Boutons stylisés
   - Cards pour clubs/matches/tournois
   - Mise en page avec flexbox/grid

4. **vite.config.js** : Configuration
   - Proxy `/api` vers `http://127.0.0.1:8000`
   - Évite les problèmes CORS en développement

### 5️⃣ Connexion Frontend-Backend

**Étapes d'intégration :**

1. Configuration du proxy Vite pour les appels API
2. Création du service API avec gestion du token JWT
3. Implémentation du flow d'authentification complet
4. Connexion de toutes les vues aux endpoints API
5. Gestion des états de chargement et erreurs

### 6️⃣ Fonctionnalités Implémentées

✅ **Authentification complète**
- Login avec email/password
- Register pour nouveaux utilisateurs
- Stockage sécurisé du token JWT
- Logout avec nettoyage du token
- Redirection automatique si non authentifié

✅ **Gestion des clubs**
- Liste complète des clubs
- Détail d'un club avec tous ses joueurs
- Recherche/filtrage de joueurs par nom
- Affichage des informations (ville, stade, année de fondation)

✅ **Système de favoris**
- Ajout de clubs aux favoris
- Retrait de clubs des favoris
- Vue dédiée aux clubs favoris
- Synchronisation avec le backend

✅ **Gestion des matches**
- Liste de tous les matches
- Filtrage par statut (programmés/en cours/terminés)
- Affichage des scores pour les matches terminés
- Informations de date et lieu

✅ **Organisation de tournois**
- Liste de tous les tournois
- Vue détaillée d'un tournoi
- Liste des matches du tournoi
- Informations de période et localisation

✅ **Interface utilisateur**
- Design moderne et responsive
- Navigation intuitive
- Feedback visuel (loading states)
- Gestion des erreurs affichées

---

## 🐛 Problèmes Rencontrés et Solutions

### Problème 1 : Favoris ne fonctionnaient pas
**Cause :** Les requêtes API pour les favoris n'incluaient pas le token JWT  
**Solution :** Création d'une fonction `authHeaders()` centralisée retournant `{Authorization: "Bearer {token}"}`  
**Fichiers modifiés :** `web-react/src/services/api.js`

### Problème 2 : Erreurs CORS en développement
**Cause :** Frontend (localhost:5173) et Backend (127.0.0.1:8000) sur ports différents  
**Solution :** Configuration du proxy Vite pour rediriger `/api` vers le backend  
**Fichiers modifiés :** `web-react/vite.config.js`

### Problème 3 : Cache Symfony corrompu
**Cause :** Modifications de configuration non prises en compte  
**Solution :** Nettoyage régulier avec `php bin/console cache:clear`

### Problème 4 : Tests PowerShell avec curl
**Cause :** Syntaxe curl incompatible avec PowerShell  
**Solution :** Utilisation de `Invoke-RestMethod` natif PowerShell

---

## 📊 Statistiques du Projet

### Backend API
- **Contrôleurs :** 5 (Auth, User, Club, Match, Tournament)
- **Endpoints :** 13 routes API
- **Entités :** 5 (User, Club, Player, Tournament, FootballMatch)
- **Repositories :** 5
- **Authentification :** JWT avec expiration 1h

### Frontend React
- **Composants :** 1 composant principal (App.jsx)
- **Vues :** 7 (Login, Account, Clubs, Favorites, Matches, Tournaments, Club Detail)
- **Services :** 1 client API centralisé
- **Fonctions API :** 11 fonctions

### Build Production
```
dist/index.html                   0.46 kB
dist/assets/index-R4eRMDky.css    2.69 kB
dist/assets/index-DPpw8zT9.js   203.50 kB (gzipped: 63.19 kB)
```

---

## 🚀 Résultats et Livrables

### ✅ Objectifs Atteints

1. **API REST complète et fonctionnelle**
   - Tous les endpoints implémentés et testés
   - Authentification JWT opérationnelle
   - Sécurité des routes sensibles

2. **Frontend React moderne**
   - Interface utilisateur complète
   - Toutes les fonctionnalités connectées à l'API
   - Build de production optimisé

3. **Intégration réussie**
   - Communication frontend-backend fonctionnelle
   - Gestion du token JWT transparente
   - Pas d'erreurs CORS

4. **Documentation complète**
   - README.md détaillé avec exemples
   - Instructions d'installation
   - Guide de démarrage

### 📦 Livrables

1. **Code source complet**
   - Backend : `api-symfony/ap2-FOOT-LOCAL/`
   - Frontend : `web-react/`

2. **Base de données SQLite** avec schéma complet
   - Fichier : `api-symfony/ap2-FOOT-LOCAL/var/data/foot_local.db`

3. **Build de production**
   - Dossier : `web-react/dist/`
   - Prêt pour déploiement

4. **Documentation**
   - README.md : Guide complet
   - RAPPORT_PROJET.md : Ce rapport

---

## 🎓 Compétences Démontrées

### Backend (Symfony)
✅ Configuration et architecture Symfony  
✅ Doctrine ORM et gestion de base de données  
✅ Authentification JWT (LexikJWT)  
✅ Création d'API REST  
✅ Sérialisation JSON  
✅ Gestion des relations entity (OneToMany, ManyToMany)  
✅ Repositories et queries personnalisées  

### Frontend (React)
✅ Composants React avec hooks (useState)  
✅ Appels API avec Fetch  
✅ Gestion d'état (authentication state)  
✅ Routing conditionnel (navigation)  
✅ Gestion du localStorage  
✅ Styling CSS moderne  

### DevOps & Outils
✅ Vite (build tool moderne)  
✅ Configuration proxy pour CORS  
✅ Build et optimisation production  
✅ Debugging API (PowerShell, console)  
✅ Git (versioning implicite)  

---

## 🔮 Évolutions Possibles

### Court terme
- [ ] Application mobile (React Native / Expo)
- [ ] Pagination des résultats API
- [ ] Recherche avancée (fulltext)
- [ ] Upload d'images (logos, photos)

### Moyen terme
- [ ] Dashboard administrateur
- [ ] Statistiques et graphiques
- [ ] Système de notifications
- [ ] Commentaires et évaluations
- [ ] WebSocket pour live scores

### Long terme
- [ ] Support multi-langues (i18n)
- [ ] Mode sombre/clair
- [ ] PWA (Progressive Web App)
- [ ] Tests automatisés (PHPUnit, Jest)
- [ ] CI/CD Pipeline
- [ ] Déploiement Docker
- [ ] CDN pour assets statiques

---

## 💡 Recommandations

### Pour la production

1. **Sécurité**
   - Passer à PostgreSQL/MySQL (SQLite limité en prod)
   - Configurer HTTPS obligatoire
   - Ajouter rate limiting sur API
   - Implémenter refresh tokens JWT

2. **Performance**
   - Activer le cache HTTP (Varnish/Redis)
   - Optimiser les queries Doctrine
   - CDN pour assets React
   - Compression Gzip/Brotli

3. **Monitoring**
   - Logs centralisés (ELK Stack)
   - APM (Application Performance Monitoring)
   - Alertes sur erreurs critiques
   - Analytics utilisateurs

4. **Tests**
   - Tests unitaires backend (PHPUnit)
   - Tests fonctionnels API (Postman/Newman)
   - Tests e2e frontend (Cypress/Playwright)
   - Tests de charge (K6/JMeter)

---

## 📞 Informations Pratiques

### Accès Local
- **API Backend :** http://127.0.0.1:8000
- **Frontend React :** http://localhost:5173

### Credentials de Test
```
Email: user@example.com
Password: password
```

### Commandes de Démarrage

**Backend:**
```bash
cd api-symfony/ap2-FOOT-LOCAL
php -S 127.0.0.1:8000 -t public
```

**Frontend:**
```bash
cd web-react
npm run dev
```

---

## 📈 Conclusion

Le projet **Foot-Loca** représente une application complète et fonctionnelle démontrant :

✅ La maîtrise de Symfony pour créer des API REST professionnelles  
✅ L'intégration d'authentification JWT sécurisée  
✅ Le développement d'interfaces React modernes  
✅ La résolution de problèmes techniques (CORS, JWT, cache)  
✅ La capacité à documenter proprement un projet  

L'application est **prête pour une évolution** vers une version mobile ou des fonctionnalités avancées, avec une base solide et bien structurée.

---

**Rapport généré le :** 3 Mars 2026  
**Statut du projet :** ✅ Fonctionnel et documenté
