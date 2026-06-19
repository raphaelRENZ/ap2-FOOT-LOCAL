# 🏆 Foot-Local - Système de Gestion Intégré de Football

**Application complète et distribuée** pour la gestion de clubs de football avec API REST Symfony, interfaces web et mobile React.

---

## 📋 Vue d'ensemble du projet

Cet écosystème complet comprend :

| Composant | Stack | Statut |
|-----------|-------|--------|
| **Backend API** | Symfony 7.4.3 + JWT + Doctrine ORM | ✅ Production-ready |
| **Frontend Web** | React 19 + Vite + React Router | ✅ Complet |
| **Application Mobile** | Expo + React Native 0.81 | ✅ En développement |
| **Infrastructure** | Docker Compose + MySQL 8.0 | ✅ Configurée |
| **Authentification** | JWT (LexikJWTAuthenticationBundle) | ✅ Sécurisée |
| **Admin Panel** | React avec 18+ endpoints admin | ✅ Fonctionnel |

---

## 🚀 Installation & Démarrage Rapide

### Prérequis

```
PHP 8.2+
Composer
Node.js 18+
npm/yarn
Docker & Docker Compose (optionnel mais recommandé)
```

### Option 1️⃣ : Avec Docker Compose (Recommandé)

```bash
# Cloner et installer les dépendances
composer install
npm install --prefix web-react
npm install --prefix mobile-android

# Démarrer l'infrastructure
docker-compose up -d

# Initialiser la base de données
docker-compose exec php php bin/console doctrine:migrations:migrate

# Vérifier l'installation
# API: http://localhost:8000
# Frontend: http://localhost:5173
```

### Option 2️⃣ : Sans Docker (Développement local)

**Terminal 1 - Backend Symfony:**
```bash
# Installer les dépendances
composer install

# Créer la base de données MySQL
# Éditer .env et configurer DATABASE_URL pour votre MySQL local
# DATABASE_URL="mysql://app:password@127.0.0.1:3306/foot_local?serverVersion=8.0"

# Exécuter les migrations
php bin/console doctrine:migrations:migrate

# Générer les clés JWT (si besoin)
php bin/console lexik:jwt:generate-keypair

# Démarrer le serveur de développement
php -S localhost:8000 -t public
```

**Terminal 2 - Frontend React:**
```bash
cd web-react

# Installer les dépendances
npm install

# Démarrer le dev server (port 5173)
npm run dev
```

**Terminal 3 - Application Mobile (Optionnel):**
```bash
cd mobile-android

npm install
npm start
# Scannez le QR code avec Expo Go sur mobile
```

---

## 📁 Structure du Projet

```
ap2-FOOT-LOCAL/
│
├── 📂 src/                          # Backend Symfony - Source
│   ├── Controller/
│   │   ├── Api/                     # API Controllers (8 classes)
│   │   │   ├── AuthController.php       # Login, Register, Test endpoints
│   │   │   ├── ApiUserController.php    # Users, Favorites
│   │   │   ├── ApiClubController.php    # Clubs management
│   │   │   ├── ApiTournamentController.php  # Tournaments
│   │   │   ├── ApiPlayerController.php      # Players
│   │   │   ├── ApiFootballMatchController.php  # Matches
│   │   │   ├── ApiAdminController.php    # Admin endpoints (18 routes)
│   │   │   └── ApiRegisterController.php # Registration
│   │   │
│   │   ├── MainController.php       # Accueil + scores
│   │   ├── TournamentController.php  # Pages tournaments
│   │   ├── ClubController.php       # Pages clubs
│   │   ├── ContactController.php    # Contact form
│   │   ├── AccountController.php    # User account
│   │   ├── AdminController.php      # Admin pages
│   │   ├── SecurityController.php   # Security/Auth
│   │   └── RegistrationController.php # Registration pages
│   │
│   ├── Entity/                      # Entités Doctrine ORM
│   │   ├── User.php                 # Utilisateurs (roles, JWT)
│   │   ├── Club.php                 # Clubs (name, stadium, colors)
│   │   ├── Player.php               # Joueurs (position, jersey_number)
│   │   ├── Tournament.php           # Tournois (dates, status)
│   │   └── FootballMatch.php        # Matchs (scores, venue)
│   │
│   ├── Repository/                  # Doctrine Repositories
│   ├── Form/                        # Symfony Forms
│   ├── Service/                     # Services métier
│   ├── DataFixtures/                # Données de test
│   ├── Security/                    # Security components
│   └── Kernel.php
│
├── 📂 config/                       # Configuration Symfony
│   ├── packages/
│   │   ├── security.yaml            # JWT + Firewall API
│   │   ├── doctrine.yaml            # ORM settings
│   │   ├── lexik_jwt_authentication.yaml  # JWT config
│   │   ├── nelmio_cors.yaml         # CORS settings
│   │   └── [autres packages]
│   ├── routes.yaml                  # Routes entry point
│   ├── routes/
│   │   ├── framework.yaml
│   │   ├── security.yaml
│   │   └── web_profiler.yaml
│   ├── services.yaml                # Service definitions
│   └── bundles.php
│
├── 📂 templates/                    # Templates Twig
│   ├── base.html.twig               # Layout principal
│   ├── main/
│   ├── account/
│   ├── admin/
│   ├── club/
│   ├── tournament/
│   ├── contact/
│   ├── registration/
│   ├── security/
│   ├── partials/                    # Composants réutilisables
│   └── emails/
│
├── 📂 migrations/                   # Doctrine Migrations
│   ├── Version20260212154707.php    # Create all tables
│   └── Version20260212155801.php    # Schema updates
│
├── 📂 public/                       # Racine web
│   ├── index.php                    # Entrypoint Symfony
│   └── images/
│
├── 📂 assets/                       # Frontend assets (Webpack Encore)
│   ├── app.js
│   ├── styles/app.css
│   ├── controllers/                 # Stimulus controllers
│   └── vendor/
│
├── 📂 web-react/                    # Frontend React (Production)
│   ├── src/
│   │   ├── App.jsx                  # Composant racine
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── AdminDashboardPage.jsx (+ 6 sous-pages admin)
│   │   │   ├── ClubListPage.jsx
│   │   │   ├── ClubDetailPage.jsx
│   │   │   └── [autres pages]
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── Layout.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── [autres composants]
│   │   ├── services/
│   │   │   └── api.js              # Client HTTP + JWT management
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # Auth state management
│   │   └── App.css
│   ├── vite.config.js              # Vite configuration + proxy
│   ├── package.json
│   └── index.html
│
├── 📂 mobile-android/              # Application Mobile (React Native)
│   ├── src/
│   │   ├── screens/                # Pages mobile
│   │   ├── navigation/             # React Navigation setup
│   │   ├── services/               # API services
│   │   ├── context/                # State management
│   │   └── App.js
│   ├── app.json                    # Expo app.json
│   ├── metro.config.js
│   ├── package.json
│   └── babel.config.js
│
├── 📂 postman/                      # Collections d'API
│   ├── FootLocal_API_Complete.postman_collection.json
│   └── FootLocal_Insomnia.json
│
├── 📂 var/                          # Fichiers runtime Symfony
│   ├── cache/
│   ├── log/
│   └── share/
│
├── 📂 tests/                        # Tests PHPUnit
│   └── bootstrap.php
│
├── 📂 vendor/                       # Dépendances Composer
│
├── 🐳 Docker Files
│   ├── Dockerfile                   # Image PHP 8.2-fpm
│   ├── docker-compose.yaml          # Production config
│   ├── compose.override.yaml        # Dev config
│   └── docker-entrypoint.sh
│
├── 📋 Configuration Files
│   ├── .env                         # Variables d'environnement
│   ├── .env.dev
│   ├── .env.test
│   ├── composer.json                # PHP dependencies
│   ├── phpunit.dist.xml             # PHPUnit config
│   ├── importmap.php                # Asset mapper
│   └── .gitignore
│
└── 📚 Documentation
    ├── README.md                    # Ce fichier
    ├── RAPPORT_PROJET.md            # Rapport détaillé
    └── ANALYSE_COHERENCE_CDC.md     # Analysis CDC


## 🔐 Authentification JWT

### Configuration

Les clés JWT sont générées dans `config/jwt/`:
- `private.pem` : Clé privée pour signer les tokens
- `public.pem` : Clé publique pour valifier les tokens

Durée de vie des tokens : **1 heure**

### Utilisation

1. **Login** : POST `/api/auth/login` avec email/password
2. Récupérer le token dans la réponse
3. Inclure dans les requêtes : `Authorization: Bearer {token}`

## 📡 API Endpoints

### Authentification

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| POST | `/api/auth/login` | Connexion utilisateur | ❌ |
| POST | `/api/auth/register` | Inscription | ❌ |

**Exemple login :**
```json
POST /api/auth/login
{
  "username": "user@example.com",
  "password": "password"
}

Réponse:
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### Utilisateurs

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/api/users/me` | Profil utilisateur | ✅ |
| GET | `/api/users/me/favorites` | Liste des favoris | ✅ |
| POST | `/api/users/me/favorites/{clubId}` | Ajouter favori | ✅ |
| DELETE | `/api/users/me/favorites/{clubId}` | Retirer favori | ✅ |

### Clubs

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/api/clubs` | Liste de tous les clubs | ❌ |
| GET | `/api/clubs/{id}` | Détail d'un club + joueurs | ✅ |
| POST | `/api/clubs` | Créer un club | ✅ |
| PUT | `/api/clubs/{id}` | Modifier un club | ✅ |
| DELETE | `/api/clubs/{id}` | Supprimer un club | ✅ |

**Exemple réponse club :**
```json
{
  "id": 1,
  "name": "FC Barcelona",
  "city": "Barcelona",
  "stadium": "Camp Nou",
  "colors": "Blaugrana",
  "foundedYear": 1899,
  "players": [
    {
      "id": 1,
      "firstName": "Lionel",
      "lastName": "Messi",
      "position": "Attaquant",
      "jerseyNumber": 10,
      "height": 170,
      "weight": 72
    }
  ]
}
```

### Joueurs

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/api/players` | Liste des joueurs | ❌ |
| GET | `/api/players/{id}` | Détails d'un joueur | ❌ |
| POST | `/api/players` | Créer un joueur | ✅ |
| PUT | `/api/players/{id}` | Modifier un joueur | ✅ |
| DELETE | `/api/players/{id}` | Supprimer un joueur | ✅ |

### Matches

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/api/matches` | Liste des matches | ❌ |
| GET | `/api/matches/{id}` | Détails d'un match | ❌ |
| GET | `/api/matches?status=scheduled` | Matches à venir | ❌ |
| GET | `/api/matches?status=live` | Matches en cours | ❌ |
| GET | `/api/matches?status=finished` | Matches terminés | ❌ |
| POST | `/api/matches` | Créer un match | ✅ |
| PUT | `/api/matches/{id}` | Modifier un match | ✅ |
| DELETE | `/api/matches/{id}` | Supprimer un match | ✅ |

**Statuts disponibles:** `scheduled`, `live`, `finished`

### Tournois

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/api/tournaments` | Liste des tournois | ✅ |
| GET | `/api/tournaments/{id}` | Détail + matches | ✅ |
| POST | `/api/tournaments` | Créer un tournoi | ✅ |
| PUT | `/api/tournaments/{id}` | Modifier un tournoi | ✅ |
| DELETE | `/api/tournaments/{id}` | Supprimer un tournoi | ✅ |

### Admin API (18 endpoints)

**⚠️ Requiert: `Authorization: Bearer {token}` + rôle `ROLE_ADMIN`**

#### Statistiques
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/admin/stats` | Statistiques générales |

#### Gestion des Clubs
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/admin/clubs` | Tous les clubs (admin view) |
| POST | `/api/admin/clubs` | Créer un club (admin) |
| PUT | `/api/admin/clubs/{id}` | Modifier un club (admin) |
| DELETE | `/api/admin/clubs/{id}` | Supprimer un club (admin) |

#### Gestion des Tournois
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/admin/tournois` | Tous les tournois (admin view) |
| POST | `/api/admin/tournois` | Créer un tournoi (admin) |
| PUT | `/api/admin/tournois/{id}` | Modifier un tournoi (admin) |
| DELETE | `/api/admin/tournois/{id}` | Supprimer un tournoi (admin) |

#### Gestion des Matches
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/admin/matchs` | Tous les matches (admin view) |
| POST | `/api/admin/matchs` | Créer un match (admin) |
| PUT | `/api/admin/matchs/{id}` | Modifier un match (admin) |
| DELETE | `/api/admin/matchs/{id}` | Supprimer un match (admin) |

#### Gestion des Utilisateurs
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/admin/utilisateurs` | Tous les utilisateurs (admin view) |
| PUT | `/api/admin/utilisateurs/{id}` | Modifier un utilisateur (admin) |
| DELETE | `/api/admin/utilisateurs/{id}` | Supprimer un utilisateur (admin) |

---

## 📱 Application Mobile (Expo/React Native)

L'application mobile offre une expérience native sur iOS et Android.

### Démarrage

```bash
cd mobile-android

# Installation des dépendances
npm install

# Démarrer le serveur de développement
npm start

# Scannez le QR code avec:
# - Expo Go (pour développement)
# - Build APK/IPA (pour production)
```

### Technologies

- **Expo 54.0** : Framework React Native
- **React Native 0.81** : Plateforme mobile
- **React Navigation** : Navigation cross-stack
- **AsyncStorage** : Stockage local des données
- **Notifications** : Notifications push (expo-notifications)

### Fonctionnalités mobiles

- ✅ Authentification JWT
- ✅ Affichage des clubs et joueurs
- ✅ Suivi des matchs en temps réel
- ✅ Gestion des favoris
- ✅ Notifications push pour les matchs importants

### Build pour Production

**Android (APK/AAB):**
```bash
eas build --platform android
```

**iOS (IPA):**
```bash
eas build --platform ios
```

---

## 🐳 Docker & Infrastructure

### Configuration Docker Compose

Le projet inclut une configuration complète pour développement et production:

```yaml
# docker-compose.yaml
services:
  php:
    image: php:8.2-fpm
    container_name: foot-local-php
    environment:
      DATABASE_URL: "mysql://app:!ChangeMe!@database:3306/app"
    volumes:
      - .:/var/www/html
    depends_on:
      - database

  database:
    image: mysql:8.0
    container_name: foot-local-db
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: app
      MYSQL_USER: app
      MYSQL_PASSWORD: !ChangeMe!
    volumes:
      - database_data:/var/lib/mysql

  nginx:
    image: nginx:latest
    ports:
      - "8000:80"
    volumes:
      - .:/var/www/html

volumes:
  database_data:
```

### Commandes Docker

```bash
# Démarrer les services
docker-compose up -d

# Voir les logs
docker-compose logs -f

# Accéder au container PHP
docker-compose exec php bash

# Exécuter des commandes Symfony
docker-compose exec php php bin/console doctrine:migrations:migrate

# Arrêter les services
docker-compose down
```

### Variables d'environnement (.env)

```bash
APP_ENV=dev
APP_SECRET=<secret_key>

# Base de données
DATABASE_URL="mysql://app:password@database:3306/foot_local?serverVersion=8.0"

# JWT
JWT_SECRET_KEY=%kernel.project_dir%/config/jwt/private.pem
JWT_PUBLIC_KEY=%kernel.project_dir%/config/jwt/public.pem
JWT_PASSPHRASE=<passphrase>

# CORS
CORS_ALLOW_ORIGIN=^https?://(localhost|127\.0\.0\.1)(:[0-9]+)?$
```

---

## 💻 Frontend React

### Architecture

Le frontend utilise React 19 avec une architecture modulaire:

```
web-react/src/
├── App.jsx                  # Composant racine + routing
├── pages/                   # Pages (route=1 page)
│   ├── HomePage.jsx
│   ├── LoginPage.jsx
│   ├── ClubListPage.jsx
│   ├── ClubDetailPage.jsx
│   ├── AdminDashboardPage.jsx
│   ├── AdminClubsPage.jsx
│   ├── AdminTournamentsPage.jsx
│   ├── AdminMatchesPage.jsx
│   └── ...
├── components/              # Composants réutilisables
│   ├── Header.jsx
│   ├── Sidebar.jsx
│   ├── Layout.jsx
│   ├── ProtectedRoute.jsx
│   └── ...
├── services/
│   └── api.js              # Client HTTP centralisé
├── context/
│   └── AuthContext.jsx     # State management auth
└── App.css
```

### Configuration Vite

```javascript
// vite.config.js
export default {
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      }
    }
  }
}
```

### Service API

Centralisé dans `src/services/api.js`:

```javascript
// Authentification
await api.login(email, password)
await api.register(email, password)
await api.logout()

// Clubs
await api.getClubs()
await api.getClubDetail(id)

// Favoris
await api.getFavorites()
await api.addFavorite(clubId)
await api.removeFavorite(clubId)

// Matches
await api.getMatches(status)  // status: 'scheduled', 'live', 'finished'

// Tournois
await api.getTournaments()
await api.getTournamentDetail(id)

// Admin
await api.getAdminStats()
await api.getAdminClubs()
// ... etc (18 endpoints admin)
```

### Vues disponibles

1. **HomePage** - Accueil avec scores en direct
2. **LoginPage** - Formulaire de connexion
3. **ClubListPage** - Liste des clubs avec favoris
4. **ClubDetailPage** - Détails club + joueurs
5. **TournamentPage** - Détails tournoi + matches
6. **AccountPage** - Profil utilisateur
7. **FavoritesPage** - Clubs favoris
8. **AdminDashboardPage** - Tableau de bord admin
9. **AdminClubsPage** - Gestion des clubs
10. **AdminTournamentsPage** - Gestion des tournois
11. **AdminMatchesPage** - Gestion des matches
12. **AdminUsersPage** - Gestion des utilisateurs

### Scripts disponibles

```bash
npm run dev          # Lancer le dev server
npm run build        # Build production
npm run preview      # Prévisualiser le build
npm run lint         # Linter
```

---

## 🔧 Commandes Utiles

### Backend (Symfony)

```bash
# Cache
php bin/console cache:clear
php bin/console cache:warmup

# Migrations Doctrine
php bin/console make:migration          # Générer une migration
php bin/console doctrine:migrations:migrate   # Exécuter les migrations
php bin/console doctrine:migrations:status    # Voir le statut

# Base de données
php bin/console doctrine:database:create
php bin/console doctrine:database:drop --force
php bin/console doctrine:schema:update --force
php bin/console doctrine:fixtures:load

# JWT
php bin/console lexik:jwt:generate-keypair

# Debug
php bin/console debug:router           # Voir toutes les routes
php bin/console debug:config           # Voir la configuration

# Tests
php bin/phpunit
php bin/phpunit --filter=TestName
```

### Frontend (React)

```bash
npm run dev          # Dev server (port 5173)
npm run build        # Production build
npm run preview      # Prévisualiser le build
npm run lint         # ESLint
```

### Commandes générales

```bash
# Installation
composer install
npm install --prefix web-react
npm install --prefix mobile-android

# Démarrage complet
docker-compose up -d && \
docker-compose exec php php bin/console doctrine:migrations:migrate && \
npm run dev --prefix web-react
```

---

## 🛠️ Stack Technique

### Backend
- **PHP 8.2** - Langage
- **Symfony 7.4** - Framework
- **Doctrine ORM 3.6** - Mapping relationnel
- **MySQL 8.0** - Base de données
- **JWT** - Authentification stateless
- **CORS** - Communication frontend-backend

### Frontend Web
- **React 19** - UI framework
- **Vite 7.3** - Build tool
- **React Router 7** - Routing client
- **Fetch API** - Requêtes HTTP

### Frontend Mobile
- **Expo 54** - Framework React Native
- **React Native 0.81** - Plateforme mobile
- **React Navigation** - Navigation mobile
- **AsyncStorage** - Persistence mobile

### Infrastructure
- **Docker** - Containerization
- **Docker Compose** - Orchestration
- **MySQL 8.0** - SGBD

---

## 📊 Modèle de Données

### User (Utilisateur)
```
- id (PK)
- email (unique)
- password (bcrypt)
- avatar (URL)
- roles (JSON array: ROLE_USER, ROLE_ADMIN)
- created_at
- updated_at
- Relation: ManyToMany(favoriteClubs)
```

### Club
```
- id (PK)
- name
- city
- stadium
- colors
- founded_year
- Relation: OneToMany(players)
- Relation: ManyToMany(favoritedBy users)
```

### Player
```
- id (PK)
- firstName
- lastName
- position (enum: attaquant, milieu, défenseur, gardien)
- jerseyNumber
- height (cm)
- weight (kg)
- Relation: ManyToOne(club)
```

### Tournament
```
- id (PK)
- name
- startDate
- endDate
- location
- status (enum: scheduled, ongoing, finished)
- Relation: OneToMany(matches)
```

### FootballMatch
```
- id (PK)
- homeTeam (club)
- awayTeam (club)
- matchDate
- status (enum: scheduled, live, finished)
- homeScore
- awayScore
- venue
- Relation: ManyToOne(tournament)
```

---

## 🔒 Sécurité

### Protections implémentées

- ✅ **JWT stateless** - Pas de session serveur
- ✅ **CORS configuré** - Contrôle des origines autorisées
- ✅ **Firewall API** - Protection des routes sensibles
- ✅ **Password hashing** - Bcrypt pour les mots de passe
- ✅ **Validation des données** - Symfony validators
- ✅ **Role-based access** - ROLE_USER, ROLE_ADMIN
- ✅ **HTTPS ready** - Compatible HTTPS en production

### Configuration JWT

```yaml
# config/packages/lexik_jwt_authentication.yaml
lexik_jwt_authentication:
  secret_key: '%env(JWT_SECRET_KEY)%'
  public_key: '%env(JWT_PUBLIC_KEY)%'
  pass_phrase: '%env(JWT_PASSPHRASE)%'
  token_ttl: 3600  # 1 heure
```

### Firewall de sécurité

```yaml
# config/packages/security.yaml
security:
  firewalls:
    login:
      pattern: ^/api/login
      stateless: true
      json_login:
        check_path: /api/login
        username_path: email
        password_path: password
    
    api:
      pattern: ^/api
      stateless: true
      jwt: ~
  
  access_control:
    - { path: ^/api/admin, roles: ROLE_ADMIN }
    - { path: ^/api, roles: IS_AUTHENTICATED_FULLY }
```

---

## 📖 Documentation Supplémentaire

- [RAPPORT_PROJET.md](RAPPORT_PROJET.md) - Rapport complet du projet
- [ANALYSE_COHERENCE_CDC.md](ANALYSE_COHERENCE_CDC.md) - Analyse du cahier des charges
- [Postman Collections](postman/) - Collections API testables

---

## ✅ Checklist de Déploiement

- [ ] Configurer `.env` pour production
- [ ] Générer les clés JWT: `php bin/console lexik:jwt:generate-keypair`
- [ ] Exécuter les migrations: `php bin/console doctrine:migrations:migrate`
- [ ] Build React: `npm run build --prefix web-react`
- [ ] Configurer HTTPS/SSL
- [ ] Configurer les backups de base de données
- [ ] Mettre en place les logs centralisés
- [ ] Configurer les notifications email
- [ ] Tester l'authentification JWT
- [ ] Vérifier les CORS pour les domaines de production

---

## 📞 Support

Pour toute question ou bug, consultez:
- `RAPPORT_PROJET.md` pour l'architecture globale
- `ANALYSE_COHERENCE_CDC.md` pour les spécifications
- Collections Postman pour tester l'API
- Logs Symfony: `var/log/prod.log`
- id (PK)
- name
- startDate
- endDate
- location
- status (enum: scheduled, ongoing, finished)
- Relation: OneToMany(matches)
```

### FootballMatch
```
- id (PK)
- homeTeam (club)
- awayTeam (club)
- matchDate
- status (enum: scheduled, live, finished)
- homeScore
- awayScore
- venue
- Relation: ManyToOne(tournament)
```

---

## 🔒 Sécurité

### Protections implémentées

- ✅ **JWT stateless** - Pas de session serveur
- ✅ **CORS configuré** - Contrôle des origines autorisées
- ✅ **Firewall API** - Protection des routes sensibles
- ✅ **Password hashing** - Bcrypt pour les mots de passe
- ✅ **Validation des données** - Symfony validators
- ✅ **Role-based access** - ROLE_USER, ROLE_ADMIN
- ✅ **HTTPS ready** - Compatible HTTPS en production

### Configuration JWT

```yaml
# config/packages/lexik_jwt_authentication.yaml
lexik_jwt_authentication:
  secret_key: '%env(JWT_SECRET_KEY)%'
  public_key: '%env(JWT_PUBLIC_KEY)%'
  pass_phrase: '%env(JWT_PASSPHRASE)%'
  token_ttl: 3600  # 1 heure
```

### Firewall de sécurité

```yaml
# config/packages/security.yaml
security:
  firewalls:
    login:
      pattern: ^/api/login
      stateless: true
      json_login:
        check_path: /api/login
        username_path: email
        password_path: password
    
    api:
      pattern: ^/api
      stateless: true
      jwt: ~
  
  access_control:
    - { path: ^/api/admin, roles: ROLE_ADMIN }
    - { path: ^/api, roles: IS_AUTHENTICATED_FULLY }
```

---

## 📖 Documentation Supplémentaire

- [RAPPORT_PROJET.md](RAPPORT_PROJET.md) - Rapport complet du projet
- [ANALYSE_COHERENCE_CDC.md](ANALYSE_COHERENCE_CDC.md) - Analyse du cahier des charges
- [Postman Collections](postman/) - Collections API testables

---

## ✅ Checklist de Déploiement

- [ ] Configurer `.env` pour production
- [ ] Générer les clés JWT: `php bin/console lexik:jwt:generate-keypair`
- [ ] Exécuter les migrations: `php bin/console doctrine:migrations:migrate`
- [ ] Build React: `npm run build --prefix web-react`
- [ ] Configurer HTTPS/SSL
- [ ] Configurer les backups de base de données
- [ ] Mettre en place les logs centralisés
- [ ] Configurer les notifications email
- [ ] Tester l'authentification JWT
- [ ] Vérifier les CORS pour les domaines de production

---

## 📞 Support

Pour toute question ou bug, consultez:
- `RAPPORT_PROJET.md` pour l'architecture globale
- `ANALYSE_COHERENCE_CDC.md` pour les spécifications
- Collections Postman pour tester l'API
- Logs Symfony: `var/log/prod.log`

1. **JWT Authentication** : Tokens signés et vérifiés
2. **Password Hashing** : Bcrypt avec Symfony UserPasswordHasher
3. **CORS** : Géré via proxy Vite en développement
4. **Route Protection** : Middleware JWT sur les routes sensibles

### Routes protégées

- `/api/users/me/*` : Profil et favoris
- `/api/clubs/{id}` : Détail club
- `/api/tournaments` : Liste et détails tournois

### Routes publiques

- `/api/auth/login` et `/api/auth/register`
- `/api/clubs` : Liste des clubs
- `/api/matches` : Liste des matches

## 🐛 Debugging

### Logs Symfony
```bash
tail -f var/log/dev.log
```

### Tester l'API avec PowerShell
```powershell
# Login
$response = Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/auth/login" -Method POST -Body (@{username="user@example.com"; password="password"} | ConvertTo-Json) -ContentType "application/json"
$token = $response.token

# Requête authentifiée
Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/users/me" -Method GET -Headers @{Authorization="Bearer $token"}
```

## 🎯 Fonctionnalités Principales

✅ **Authentification complète** (Login/Register/Logout)  
✅ **Gestion des clubs** (Liste, détails, joueurs)  
✅ **Système de favoris** (Ajouter/Retirer des clubs favoris)  
✅ **Gestion des matches** (Filtrage par statut)  
✅ **Organisation de tournois** (Détails et matches associés)  
✅ **Recherche de joueurs** (Par nom dans un club)  
✅ **Interface responsive** (CSS moderne)  
✅ **Build optimisé** (Production ready)

## 📝 Notes de Développement

### Problèmes résolus

1. **Favoris ne fonctionnaient pas** : Ajout de `authHeaders()` pour inclure le token JWT dans toutes les requêtes protégées
2. **CORS en développement** : Configuration du proxy Vite pour `/api`
3. **Cache Symfony** : Nettoyage régulier avec `cache:clear`

### Améliorations futures possibles

- Application mobile (React Native/Expo)
- Pagination des résultats
- Recherche avancée (clubs, joueurs, tournois)
- Statistiques et classements
- Upload d'images (logos clubs, photos joueurs)
- Notifications temps réel (WebSocket)
- Système de commentaires
- Role-based access (admin dashboard)
- Déploiement avec Docker

## 📄 Licence

Projet personnel - 2026

## 👤 Auteur

Développé dans le cadre d'un projet d'apprentissage Symfony + React.
