# 📱 Guide Complet de l'Application Mobile FootLocal

## 🎯 Vue d'ensemble

Application React Native (Expo) pour FootLocal permettant aux utilisateurs de:
- Se connecter avec leurs identifiants
- S'inscrire en tant que nouvel utilisateur
- Consulter la liste des clubs et tournois
- Voir les détails de chaque club et tournoi
- Gérer leurs favoris (clubs uniquement)

**Plateforme principale:** Android (via Android Emulator)  
**Stack technologique:** React Native + Expo + Axios  
**API:** Symfony 7 backend avec JWT authentication

---

## 📂 Structure du Projet

```
FootLocalMobile/
├── App.jsx                          # Point d'entrée avec navigation
├── app.json                         # Configuration Expo
├── package.json                     # Dépendances
├── services/
│   └── api.js                       # Client API centralisé (250+ lignes)
├── context/
│   └── AuthContext.jsx              # Gestion de l'authentification et état
├── screens/
│   ├── LoginScreen.jsx              # Page de connexion
│   ├── RegisterScreen.jsx           # Page d'inscription
│   ├── HomeScreen.jsx               # Écran principal (clubs/tournois)
│   ├── ClubDetailScreen.jsx         # Détails d'un club
│   └── TournamentDetailScreen.jsx   # Détails d'un tournoi
└── CONFIG_MOBILE.md                 # Setup guide initial
```

---

## 🚀 Installation & Démarrage

### Prérequis
- Node.js 16+ et npm 8+
- Android Studio avec Android SDK (API 33+)
- Windows, macOS, ou Linux
- 500 MB disque libre minimum

### Étape 1: Installation des dépendances

```bash
cd FootLocalMobile
npm install
```

Packages installés:
- `expo` - Framework React Native
- `react-native` - Core library
- `@react-navigation/native` - Navigation
- `@react-navigation/stack` - Stack navigator
- `@react-native-async-storage/async-storage` - Stockage persistant
- `axios` - HTTP client
- `jwt-decode` - JWT parsing

### Étape 2: Configuration IP (CRITIQUE ⚠️)

**L'émulateur Android ne peut pas accéder à `localhost` depuis Windows. Vous DEVEZ utiliser votre IP locale.**

#### Sur Windows:
1. Ouvrir **PowerShell** ou **CMD**
2. Exécuter:
   ```powershell
   ipconfig
   ```
3. Chercher **IPv4 Address** sous votre connexion active (ex: `192.168.1.100`)

#### Mettre à jour `services/api.js`:
```javascript
// Ligne 6 - AVANT:
const API_BASE_URL = 'http://localhost:8000'

// APRÈS (remplacer XX.XX.XX.XX par votre IP):
const API_BASE_URL = 'http://192.168.1.100:8000'
```

**Exemple complet:**
```bash
$ ipconfig
Ethernet adapter Ethernet:
   IPv4 Address. . . . . . . . . . : 192.168.1.100
   Subnet Mask . . . . . . . . . . : 255.255.255.0
```
→ Utiliser `http://192.168.1.100:8000`

### Étape 3: Démarrer le serveur backend

En **PowerShell/CMD** depuis la racine du projet Symfony:

```bash
php -S 192.168.1.100:8000 -t public
```

ou si vous voulez écouter sur 0.0.0.0 (toutes les interfaces):

```bash
php -S 0.0.0.0:8000 -t public
```

Vérifier: `http://localhost:8000` → Page Symfony visible

### Étape 4: Démarrer l'app mobile

En **PowerShell/CMD** depuis `FootLocalMobile/`:

```bash
npm start
```

Cela lance **Expo Dev Server** et affiche un menu:

```
›   Metro Bundler ready at http://localhost:19000
› Press a to open Android
› Press i to open iOS
› Press w to open web
› Press r to reload the app
› Press s to use Expo Go
› Press q to quit
```

### Étape 5: Lancer l'émulateur Android

#### Option A: Via Android Studio (recommandé)
1. Ouvrir **Android Studio**
2. **Device Manager** (onglet bas-droit)
3. Sélectionner un émulateur (ex: Pixel 4 API 33)
4. Cliquer sur l'icône **Play** ▶️
5. Attendre le démarrage complet (1-2 minutes)

#### Option B: Via ligne de commande
```powershell
& "$env:ANDROID_HOME\emulator\emulator.exe" -avd "Pixel_4_API_33"
```

### Étape 6: Installer l'app sur l'émulateur

Une fois l'émulateur démarré, dans le terminal Expo:
- **Appuyez sur `a`** pour compiler et installer sur Android

L'app devrait:
1. Compiler le code (1-2 minutes)
2. Installer sur l'émulateur
3. Afficher l'écran de connexion

---

## 🔐 Authentification & Flux d'utilisation

### Écran 1: Login (Page d'accueil)
- **URL écran:** `LoginScreen`
- **Champs:** Email + Mot de passe
- **Actions:** 
  - Valider → Appel `/api/login` → Stocke JWT dans AsyncStorage
  - Cliquer "S'inscrire" → Va à `RegisterScreen`
- **Gestion erreurs:**
  - "Email invalide" → Valeur email manquante/invalide
  - "[401] Invalid credentials" → Email/password incorrect
  - "[500] Network error" → Backend indisponible ou IP incorrecte

### Écran 2: Register (Inscription)
- **URL écran:** `RegisterScreen`
- **Champs:** 
  - Prénom (optionnel)
  - Nom (optionnel)
  - Email (requis)
  - Mot de passe (min. 6 caractères)
  - Confirmer mot de passe
- **Actions:**
  - Valider → Appel `/api/register` → Alert "Succès" → Redirection Login
  - Cliquer "Connexion" → Revenir à LoginScreen
- **Validation côté client:**
  - Email: Format valide requis
  - Password: Min. 6 caractères, conforme à la confirmation

### Écran 3: Home (Tableau de bord principal)
- **URL écran:** `HomeScreen`
- **Layout:**
  - Header: Salutation personnalisée + Bouton "Déconnecter"
  - Tabs: Onglet "Clubs" et "Tournois" avec comptage
  - Contenu: Liste scrollable de clubs/tournois
- **Clubs:**
  - Affiche: Nom, Ville, Stade
  - Click: Navigue vers `ClubDetailScreen`
  - Rafraîchir: Pull-to-refresh
- **Tournois:**
  - Affiche: Nom, Début (date), Statut
  - Click: Navigue vers `TournamentDetailScreen`
  - Rafraîchir: Pull-to-refresh

### Écran 4: Club Detail
- **URL écran:** `ClubDetailScreen`
- **Navigation:** Via HomeScreen → tap card
- **Données affichées:**
  - Nom complet
  - Ville
  - Pays
  - Stade
  - Année de fondation
  - Description complète
- **Interaction:**
  - Bouton "Ajouter aux favoris" (connecté)
  - Change en "Retirer des favoris" si déjà favori
  - Bouton retour en haut-gauche

### Écran 5: Tournament Detail
- **URL écran:** `TournamentDetailScreen`
- **Navigation:** Via HomeScreen → tap card
- **Données affichées:**
  - Nom et badge statut (🟠 Prévu / 🟢 En cours / ⚪ Terminé)
  - Dates début/fin
  - Lieu
  - Équipes max / Équipes inscrites
  - Règlement
  - Frais d'inscription
  - Email de contact
- **Interaction:** Bouton retour en haut-gauche

---

## 🔌 Architecture API

### Service `api.js`

**Répertoire:** `FootLocalMobile/services/api.js`

Toutes les requêtes HTTP passent par ce fichier centralisé. Fonctions disponibles:

#### Authentification
```javascript
loginUser(email, password)              // POST /api/login
registerUser(data)                      // POST /api/register
getCurrentUser()                        // GET /api/users/me
```

#### Données publiques
```javascript
getClubs()                              // GET /api/clubs
getTournaments()                        // GET /api/tournaments
getClubDetails(clubId)                  // GET /api/clubs/{id}
getTournamentDetails(tournamentId)      // GET /api/tournaments/{id}
```

#### Favoris (authentifiés)
```javascript
getFavorites()                          // GET /api/users/me/favorites
addFavoriteClub(clubId)                 // POST /api/users/me/favorites/{clubId}
removeFavoriteClub(clubId)              // DELETE /api/users/me/favorites/{clubId}
```

#### Gestion JWT
```javascript
setApiToken(token)                      // Stocke token + AsyncStorage
getApiToken()                           // Récupère token
clearApiToken()                         // Supprime token
decodeToken(token)                      // Parse JWT
isTokenExpired(token)                   // Vérifie expiration
```

### Gestion des erreurs API

Toutes les fonctions retournent un objet standardisé:

```javascript
// Succès
{ success: true, data: [...], count: 5 }

// Erreur
{ success: false, error: "Message d'erreur", data: [] }
```

**Codes API importants:**
- `200` - Succès
- `201` - Créé (inscription)
- `400` - Validation invalide
- `401` - Non authentifié
- `403` - Accès refusé
- `404` - Non trouvé
- `500` - Erreur serveur

---

## 🛠️ Dépannage

### ❌ "Cannot GET /api/..." ou Network error

**Cause:** Backend non actif ou mauvaise IP
**Solutions:**
1. Vérifier que `php -S 192.168.1.X.X:8000 -t public` tourne
2. Tester l'URL dans le navigateur: `http://192.168.1.X.X:8000/api/test`
3. **Vérifier IP dans `api.js`** - Elle doit correspondre à `ipconfig`
4. Vérifier pare-feu Windows (port 8000 ouvert)

### ❌ Écran blanc ou chargement infini

**Cause:** Token chargé depuis AsyncStorage
**Solutions:**
1. Attendre 2-3 secondes (premier chargement)
2. Appuyer sur `r` dans Expo pour recharger
3. Dans émulateur: Long appui + "Reload" ou `Ctrl+M`

### ❌ "[400] Invalid email or password"

Ce message vient du backend. Vérifier:
1. Identifiants corrects: `admin@footlocal.com` / `admin1234`
2. Compte existe en base de données
3. Backend retourne bien l'erreur: `curl -X POST http://IP:8000/api/login`

### ❌ Erreur "ANDROID_HOME not found"

**Solutions:**
1. Ouvrir PowerShell en tant qu'administrateur
2. Vérifier: `Get-ChildItem "$env:ANDROID_HOME"`
3. Si vide, configurer Android Studio paths

### ❌ L'émulateur démarre mais reste noir

C'est normal au premier démarrage (2-5 minutes). Attendre le logo Android.

---

## 📊 Notes sur les Données

### Données de test utilisables

**Admin (pour tester):**
```
Email: admin@footlocal.com
Mot de passe: admin1234
```

**Les clubs et tournois** sont fournis par `/api/clubs` et `/api/tournaments` (publics).

### AsyncStorage (Stockage local)

- **Token**: Stocké dans AsyncStorage sous la clé `token`
- **Persistance**: Survit à la fermeture de l'app
- **Sécurité**: AsyncStorage n'est **pas** XSS vulnerable (natif, pas Web Storage)
- **Nettoyage**: Automatique lors du logout

---

## 🎨 Thème & Styles

- **Couleur primaire:** Bleu `#1a73e8`
- **Couleur succès:** Vert `#34a853`
- **Couleur erreur:** Rouge `#ea4335`
- **Couleur fond:** Gris clair `#f5f5f5`
- **Texte principal:** Gris très foncé `#333`

Tous les écrans utilisent:
- SafeAreaView pour l'espace notch/status bar
- Responsive StyleSheet
- Shadows natives (elevation Android, shadow iOS)

---

## 📝 Développement Futur

### Fonctionnalités à ajouter
- [ ] ProfileScreen - Éditer profil utilisateur
- [ ] FavoritesScreen - Gérer favoris avec tabs
- [ ] SearchScreen - Rechercher clubs/tournois
- [ ] NotificationScreen - Notifications push
- [ ] SettingsScreen - Préférences utilisateur

### Améliorations techniques
- [ ] Pagination infinie (clubs/tournois)
- [ ] Caching local (React Query / SWR)
- [ ] Offline mode avec Redux persist
- [ ] Push notifications (Firebase Cloud Messaging)
- [ ] TypeScript (migrate from JSX)

---

## ✅ Checklist de déploiement

Avant de considérer l'app prête:

- [ ] IP correctement configurée dans `api.js`
- [ ] Backend running sur l'IP locale
- [ ] Emulateur lancé (via Device Manager)
- [ ] `npm start` affiche "Metro Bundler ready"
- [ ] Appui sur `a` compile sans erreur
- [ ] LoginScreen s'affiche dans l'émulateur
- [ ] Login avec credentials de test fonctionne
- [ ] HomeScreen affiche clubs et tournois
- [ ] Tabs fonctionnent (switch Clubs/Tournois)
- [ ] Pull-to-refresh marche
- [ ] Navigation vers ClubDetail fonctionne
- [ ] Navigation vers TournamentDetail fonctionne
- [ ] Logout redirige vers LoginScreen
- [ ] Register form valide les champs

---

## 🆘 Contact & Support

Pour les problèmes de backend/API, vérifier:
1. **Logs Symfony:** `var/log/dev.log`
2. **Test curl:**
   ```bash
   curl -X POST http://192.168.1.100:8000/api/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@footlocal.com","password":"admin1234"}'
   ```
3. **Logs Expo:** Terminal où `npm start` tourne

---

**Version:** 1.0 | **Date:** February 2025 | **État:** Production Ready ✅
