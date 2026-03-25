# 📱 Configuration App Mobile Foot Local

## ⚙️ Configuration Initiale

### 1. Installer les dépendances

```bash
cd FootLocalMobile
npm install
```

### 2. Configurer l'IP du serveur

Le serveur Symfony tourne sur `localhost:8000` sur votre PC.  
L'émulateur Android ne peut **pas** accéder à `localhost` depuis Windows.

**Trouvez votre IP locale:**

```powershell
ipconfig
```

Cherchez `Adresse IPv4` (exemple: `192.168.1.100`)

**Modifiez `services/api.js` ligne 6:**

```javascript
// ❌ AVANT
const API_BASE_URL = 'http://localhost:8000'

// ✅ APRÈS
const API_BASE_URL = 'http://192.168.1.100:8000'  // Remplacez 192.168.1.100 par votre IP
```

### 3. Démarrer le serveur Symfony

```bash
# Terminal 1: Serveur Symfony
cd ap2-FOOT-LOCAL
php -S localhost:8000 -t public
```

### 4. Lancer l'app mobile

```bash
# Terminal 2: App mobile
cd FootLocalMobile
npm start
```

Une fois que vous voyez le menu Expo:

```
i - Ouvrir sur iOS
a - Ouvrir sur Android
w - Web
r - Recharger
```

**Tapez `a`** pour ouvrir sur l'émulateur Android

---

## 📁 Structure du Projet

```
FootLocalMobile/
├── screens/           # Écrans de l'application
│   ├── LoginScreen.jsx
│   ├── RegisterScreen.jsx
│   ├── HomeScreen.jsx
│   └── ...
├── services/          # Services API
│   └── api.js         # Client API avec axios
├── context/           # Contextes React
│   └── AuthContext.jsx # Gestion authentification
├── App.jsx            # Navigation principale
└── app.json           # Configuration Expo
```

---

## 🔄 Flux Authentification

### Scénario 1: Nouvel utilisateur (sans compte)

```
[Login] --"S'inscrire"--> [Register] --"S'inscrire"--> [Confirmation email]
                                           ↓
                          Utilisateur reçoit email
                                           ↓
                          Confirme email (lien dans mail)
                                           ↓
                           [Login] --login--> [Home]
```

### Scénario 2: Utilisateur existant

```
[Login] --email/password--> [Home]
```

### Scénario 3: Utilisateur connecté quitte l'app

```
App redémarre → Token rechargé depuis AsyncStorage → [Home] directe
```

---

## 🔐 Sécurité

- ✅ Token stocké dans AsyncStorage (local sur le téléphone)
- ✅ Authentification JWT
- ✅ Vérification email requise
- ✅ Gestion des sessions

---

## 🐛 Troubleshooting

### L'app ne connecte pas au serveur

**Vérifiez:**

1. Le serveur PHP tourne: `php -S localhost:8000 -t public`
2. L'IP est correcte dans `services/api.js`
3. Le firewall Windows autorise le trafic sur le port 8000
4. L'émulateur peut pinger votre PC:
   ```bash
   adb shell ping 192.168.1.100
   ```

### Erreur "Network Error"

- Assurez-vous que l'IP est valide (ex: `192.168.x.x`)
- Essayez `adb reverse tcp:8000 tcp:8000` pour faire un tunnel

### L'émulateur ne démarre pas

```bash
# Vérifier les émulateurs disponibles
emulator -list-avds

# Démarrer l'émulateur manuellement
emulator -avd <nom_de_l_emulateur>
```

---

## 📝 Notes Importantes

1. **Email de vérification:** Après inscription, un email de vérification est envoyé. En développement, vérifiez les logs du serveur.

2. **Token JWT:** Le token expire après 1 heure. À chaque expiration, l'utilisateur doit se reconnecter.

3. **AsyncStorage:** Les données sensibles sont stockées sur le téléphone. L'émulateur les perd au redémarrage.

4. **IP Locale:** Si vous travaillez en WiFi, utilisez l'IP WiFi. Si en USB, utilisez l'IP du PC Windows.

---

## 🚀 Prochaines Étapes

Les écrans suivants peuvent être implémentés:

- [ ] `ClubDetailScreen.jsx` - Détail d'un club
- [ ] `TournamentDetailScreen.jsx` - Détail d'un tournoi
- [ ] `ProfileScreen.jsx` - Profil utilisateur
- [ ] `FavoritesScreen.jsx` - Clubs favoris
- [ ] Bottom Tab Navigation pour multi-screens

---

## 📞 Support

Pour toute question, consultez:

- [`SECURITY_FIX.md`](SECURITY_FIX.md) - Sécurité API
- [`CORRECTIONS_SECURITE.md`](CORRECTIONS_SECURITE.md) - Problèmes résolus
- Logs Expo: Visibles dans le terminal
- Logs Symfony: `var/log/dev.log`

---

**Créé:** 23 Mars 2026  
**Framework:** React Native (Expo)  
**API:** Symfony 7 avec JWT
