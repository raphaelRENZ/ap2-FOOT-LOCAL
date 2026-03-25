# 📱 FootLocal Mobile App

Application mobile React Native (Expo) pour FootLocal permettant aux utilisateurs de consulter clubs et tournois de football en local.

## ⚡ Quick Start

```bash
# 1. Installation
npm install

# 2. Configuration (CRITIQUE - voir section ci-dessous)
# Modifier services/api.js line 6 avec votre IP locale

# 3. Lancer le serveur backend
php -S 192.168.1.X.X:8000 -t public     # Depuis la racine Symfony

# 4. Lancer l'app mobile
npm start                                 # Depuis FootLocalMobile/

# 5. Dans les options Expo, appuyer sur [a] pour Android
```

## ⚠️ CONFIGURATION IP (Essentiel!)

L'émulateur Android **ne peut pas** accéder à `localhost://8000`. Vous devez utiliser votre IP locale.

### Étape 1: Trouver votre IP locale (Windows)
```powershell
ipconfig
# Chercher "IPv4 Address" → ex: 192.168.1.100
```

### Étape 2: Mettre à jour `services/api.js`
```javascript
// Ligne 6 - Remplacer:
const API_BASE_URL = 'http://192.168.1.100:8000'  // Votre IP ici!
```

### Étape 3: Tester la connexion
```bash
# Terminal - vérifier que le backend répond
curl http://192.168.1.100:8000/api/test
# → Devrait retourner une réponse JSON
```

## 📂 Structure du Projet

| Fichier/Dossier | Rôle |
|---|---|
| `App.jsx` | Point d'entrée + Navigation principale |
| `services/api.js` | Client API centralisé (300+ lignes) |
| `context/AuthContext.jsx` | Gestion authentification + état global |
| `screens/` | 5 écrans (Login, Register, Home, ClubDetail, TournamentDetail) |
| `MOBILE_APP_GUIDE.md` | Guide complet (70+ sections) |
| `CONFIG_MOBILE.md` | Guide setup initial |

## 🎯 Fonctionnalités

✅ **Authentification**
- Login avec email/password
- Inscription nouvel utilisateur
- Gestion JWT tokens (stockage AsyncStorage)
- Logout sécurisé

✅ **Clubs**
- Liste complète avec scroll infini
- Vue détaillée (ville, stade, fondation, description)
- Système favoris (ajouter/retirer)

✅ **Tournois**
- Liste complète avec filtres (statut)
- Vue détaillée (dates, frais, règlement, contact)
- Badges visuels (statut couleur)

✅ **UX Mobile**
- Pull-to-refresh sur listes
- Navigation stack (back automatique)
- Responsive design (tous les écrans)
- Loading states + error handling

## 🔄 Architecture Navigation

```
Login [non authentifié]
  ↓
  ├→ Register (créer compte)
  └→ Home (après succès)

Home [authentifié]
  ├→ Onglet Clubs
  │   └→ ClubDetail (au-tap)
  ├→ Onglet Tournois
  │   └→ TournamentDetail (au-tap)
  └→ Logout (retour Login)
```

## 📡 Endpoints API Utilisés

| Méthode | Endpoint | Authentifiée | Données |
|---|---|---|---|
| `POST` | `/api/login` | ❌ | email, password |
| `POST` | `/api/register` | ❌ | firstName, lastName, email, password |
| `GET` | `/api/clubs` | ❌ | - |
| `GET` | `/api/clubs/{id}` | ❌ | - |
| `GET` | `/api/tournaments` | ❌ | - |
| `GET` | `/api/tournaments/{id}` | ❌ | - |
| `GET` | `/api/users/me` | ✅ | - |
| `GET` | `/api/users/me/favorites` | ✅ | - |
| `POST` | `/api/users/me/favorites/{clubId}` | ✅ | - |
| `DELETE` | `/api/users/me/favorites/{clubId}` | ✅ | - |

## 🔐 Sécurité

- **Tokens JWT:** Stockés dans AsyncStorage (persistant)
- **Headers:** `Authorization: Bearer {token}` sur requêtes authentifiées
- **HTTPS:** En production (à configurer)
- **Validation:** Client + serveur (backend valide aussi)

## 📋 Prérequis Système

- **Node:** 16+ avec npm 8+
- **Android:** SDK 33+ avec émulateur (~500MB)
- **Disque:** 1GB libre minimum
- **Connexion:** WiFi (même réseau que backend)

## 🚀 Commandes Utiles

```bash
# Installer dépendances
npm install

# Lancer dev server
npm start

# Depuis Expo:
[a] → Android
[w] → Web (debug)
[r] → Reload app
[q] → Quit

# Logs réels temps
npm start -- --no-clear

# Nettoyer tout
npm run clean        # ou: rm -rf node_modules && npm install
expo start --clear   # Réinitialiser cache Metro
```

## 🐛 Dépannage

### Error: "Cannot GET /api/..."
- [ ] Backend runne? → `php -S 192.168.1.X.X:8000 -t public`
- [ ] IP correcte dans `api.js`?
- [ ] Même réseau WiFi que le PC?

### Error: "Network timeout"
- [ ] Vérifier pare-feu (port 8000 ouvert)
- [ ] `curl http://IP:8000` retourne réponse?
- [ ] IP configurée? → Voir section "CONFIGURATION IP"

### Blank screen
- [ ] Attendre 2-3 secondes (premier load)
- [ ] Appuyer `[r]` dans Expo pour recharger
- [ ] Vérifier token dans AsyncStorage (utiliser DevTools)

## 📞 Support

Pour debug approfondi:
1. Vérifier `var/log/dev.log` (backend)
2. Utiliser `adb logcat` (logs Android)
3. Tester manuellement: `curl -X POST http://IP:8000/api/login ...`

## 📝 Fichier de Documentation Complet

Pour une documentation **détaillée et complète** de toutes les fonctionnalités, écrans, et procédures, voir: **[MOBILE_APP_GUIDE.md](./MOBILE_APP_GUIDE.md)** (70+ sections et exemples)

---

**Status:** ✅ Production Ready | **Version:** 1.0 | **Last Updated:** February 2025

