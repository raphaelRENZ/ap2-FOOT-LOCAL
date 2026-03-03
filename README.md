# Foot-Loca - Système de Gestion de Clubs de Football

Application complète de gestion de clubs de football avec API REST Symfony et interface React.

## 📋 Vue d'ensemble

Ce projet comprend :
- **Backend API** : Symfony 7.x avec authentification JWT
- **Frontend Web** : React 18 + Vite
- **Base de données** : SQLite
- **Authentification** : JWT (JSON Web Tokens) avec LexikJWTAuthenticationBundle

## 🚀 Installation

### Prérequis

- PHP 8.1+
- Composer
- Node.js 18+
- npm ou yarn

### 1. Backend API (Symfony)

```bash
cd api-symfony/ap2-FOOT-LOCAL

# Installer les dépendances
composer install

# Configurer les clés JWT
php bin/console lexik:jwt:generate-keypair

# Créer la base de données
php bin/console doctrine:database:create
php bin/console doctrine:migrations:migrate

# Charger les données de test (optionnel)
php bin/console doctrine:fixtures:load

# Démarrer le serveur
php -S 127.0.0.1:8000 -t public
```

### 2. Frontend React

```bash
cd web-react

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev

# Build pour production
npm run build
```

## 📁 Structure du Projet

```
foot-loca/
├── api-symfony/ap2-FOOT-LOCAL/     # Backend Symfony
│   ├── config/                      # Configuration Symfony
│   │   ├── packages/security.yaml   # Configuration JWT
│   │   └── routes.yaml
│   ├── src/
│   │   ├── Controller/Api/          # Contrôleurs API
│   │   │   ├── ApiAuthController.php
│   │   │   ├── ApiClubController.php
│   │   │   ├── ApiFootballMatchController.php
│   │   │   ├── ApiTournamentController.php
│   │   │   └── ApiUserController.php
│   │   ├── Entity/                  # Entités Doctrine
│   │   │   ├── User.php
│   │   │   ├── Club.php
│   │   │   ├── Player.php
│   │   │   ├── Tournament.php
│   │   │   └── FootballMatch.php
│   │   └── Repository/              # Repositories
│   └── var/data/foot_local.db      # Base SQLite
│
└── web-react/                       # Frontend React
    ├── src/
    │   ├── App.jsx                  # Composant principal
    │   ├── App.css                  # Styles globaux
    │   └── services/api.js          # Client API
    ├── vite.config.js               # Configuration Vite
    └── package.json
```

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
| GET | `/api/clubs` | Liste des clubs | ❌ |
| GET | `/api/clubs/{id}` | Détail club + joueurs | ✅ |

**Exemple réponse club :**
```json
{
  "id": 1,
  "name": "FC Barcelona",
  "city": "Barcelona",
  "stadium": "Camp Nou",
  "players": [
    {
      "id": 1,
      "firstName": "Lionel",
      "lastName": "Messi",
      "position": "Attaquant",
      "jerseyNumber": 10
    }
  ]
}
```

### Matches

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/api/matches` | Liste des matches | ❌ |
| GET | `/api/matches?status=live` | Matches en cours | ❌ |
| GET | `/api/matches?status=scheduled` | Matches à venir | ❌ |
| GET | `/api/matches?status=finished` | Matches terminés | ❌ |

**Statuts disponibles :** `scheduled`, `live`, `finished`

### Tournois

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/api/tournaments` | Liste des tournois | ✅ |
| GET | `/api/tournaments/{id}` | Détail + matches | ✅ |

## 💻 Frontend React

### Services API

Le fichier `src/services/api.js` contient toutes les fonctions d'appel API :

```javascript
// Authentification
login(username, password)
register(email, password)
logout()

// Clubs
getClubs()
getClubDetail(id)

// Favoris
getFavorites()
addFavorite(clubId)
removeFavorite(clubId)

// Matches
getMatches(status)

// Tournois
getTournaments()
getTournamentDetail(id)
```

### Configuration Proxy

Vite est configuré pour proxifier `/api` vers `http://127.0.0.1:8000` :

```javascript
// vite.config.js
export default {
  server: {
    proxy: {
      '/api': 'http://127.0.0.1:8000'
    }
  }
}
```

### Vues disponibles

1. **Login** : Formulaire de connexion
2. **Account** : Profil utilisateur
3. **Clubs** : Liste des clubs avec bouton favoris
4. **Favorites** : Clubs favoris de l'utilisateur
5. **Matches** : Liste des matches avec filtres (scheduled/live/finished)
6. **Tournaments** : Liste et détails des tournois
7. **Club Detail** : Détail d'un club avec ses joueurs

## 🎮 Guide de Démarrage

### Démarrer les deux serveurs

**Terminal 1 - Backend API :**
```bash
cd api-symfony/ap2-FOOT-LOCAL
php -S 127.0.0.1:8000 -t public
```

**Terminal 2 - Frontend React :**
```bash
cd web-react
npm run dev
```

### Accès

- **API Backend** : http://127.0.0.1:8000
- **Frontend React** : http://localhost:5173

### Credentials de test

```
Email: user@example.com
Password: password
```

## 🔧 Commandes Utiles

### Backend

```bash
# Nettoyer le cache
php bin/console cache:clear

# Créer une migration
php bin/console make:migration

# Exécuter les migrations
php bin/console doctrine:migrations:migrate

# Vider et recharger la BDD
php bin/console doctrine:schema:drop --force
php bin/console doctrine:schema:create
php bin/console doctrine:fixtures:load
```

### Frontend

```bash
# Lancer le dev server
npm run dev

# Build de production
npm run build

# Preview du build
npm run preview

# Linter
npm run lint
```

## 🛠️ Technologies Utilisées

### Backend
- **Symfony 7.x** : Framework PHP
- **Doctrine ORM** : Gestion de la base de données
- **LexikJWTAuthenticationBundle** : Authentification JWT
- **SQLite** : Base de données légère

### Frontend
- **React 18** : Bibliothèque UI
- **Vite 7.3** : Build tool rapide
- **Fetch API** : Requêtes HTTP

## 📊 Modèle de Données

### User (Utilisateur)
- id, email, password
- roles (ROLE_USER, ROLE_ADMIN)
- favoriteClubs (ManyToMany avec Club)

### Club
- id, name, city, stadium, foundedYear
- players (OneToMany avec Player)
- favoritedBy (ManyToMany avec User)

### Player (Joueur)
- id, firstName, lastName, position, jerseyNumber
- club (ManyToOne avec Club)

### Tournament (Tournoi)
- id, name, startDate, endDate, location
- matches (OneToMany avec FootballMatch)

### FootballMatch (Match)
- id, homeTeam, awayTeam, matchDate
- status (scheduled, live, finished)
- homeScore, awayScore
- tournament (ManyToOne avec Tournament)

## 🔒 Sécurité

### Protections implémentées

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
