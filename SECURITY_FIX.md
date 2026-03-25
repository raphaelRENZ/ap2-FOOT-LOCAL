# 🔒 Corrections de Sécurité - Foot Local

## Actions Réalisées

### 1. ✅ Fermeture par défaut de l'API (`/api`)
**Fichier:** `config/packages/security.yaml`

**Avant:** Les endpoints `/api/players`, `/api/clubs`, `/api/tournaments` étaient publics avec `PUBLIC_ACCESS`.

**Après:** 
- `PUBLIC_ACCESS` supprimé des endpoints sensibles
- Seuls `/api/login`, `/api/register`, `/api/test` restent publics
- Tous les autres endpoints `/api` nécessitent `IS_AUTHENTICATED_FULLY`
- Politique **whitelist** (ouverture explicite) au lieu de **blacklist**

### 2. ✅ Protection des données sensibles joueurs
**Fichier:** `src/Controller/Api/ApiPlayerController.php`

**Changement:** Ajout de `#[IsGranted('ROLE_ADMIN')]` sur la route `GET /api/players/{id}` pour protéger:
- Date de naissance (`birthDate`)
- Taille (`height`)
- Poids (`weight`)  
- Pied préféré (`preferredFoot`)

### 3. ✅ Réactivation du flux de vérification email
**Fichier:** `src/Controller/RegistrationController.php`

**Avant:**
```php
$user->setIsVerified(true);           // ❌ Bypasse vérification
$security->login($user, ...);         // ❌ Login auto sans email
```

**Après:**
```php
// ✅ Supprimé: setIsVerified(true)
// ✅ Supprimé: login automatique
// ✅ Envoi d'email de confirmation réactivé
$this->emailVerifier->sendEmailConfirmation(
    'app_verify_email', 
    $user,
    (new TemplatedEmail())->from(...)->to(...)
);
```

Les utilisateurs doivent maintenant confirmer leur email avant de pouvoir se connecter.

### 4. ✅ Stockage sécurisé du token JWT (React)
**Fichiers:** 
- `web-react/src/context/AuthContext.jsx`
- `web-react/src/services/api.js`

**Implémentation correcte trouvée:**
- ✅ Token stocké **en mémoire uniquement** (pas en `localStorage`)
- ✅ Stockage perdra le token à chaque rechargement (accepté pour sécurité >= commodité)
- ✅ Protégé contre les attaques XSS

```javascript
// ✅ Bon: Mémoire uniquement
let _token = null
```

### 5. ⚠️ Secrets JWT dans le dépôt (ACTION REQUISE)

**Problème critère:** La `JWT_PASSPHRASE` est en dur dans `.env` commité.

**Action requise:**
```bash
# Régénérer les clés JWT
php bin/console lexik:jwt:generate-keypair --overwrite

# Copier la passphrase générée dans `.env.local` (NON commité)
# NE JAMAIS la mettre dans .env commité
```

**Pour la production:**
```bash
# Générer une nouvelle passphrase sécurisée
openssl rand -hex 32

# Créer `.env.prod.local` avec:
JWT_PASSPHRASE=<VOTRE_PASSPHRASE_SECURISEE>
```

---

## 🔐 Configuration d'Environnement Sécurisée

### Fichiers à Créer/Modifier

**1. `.env.local` (à ajouter à `.gitignore`)**
```dotenv
# Secrets de développement local uniquement
JWT_PASSPHRASE=<passphrase générée>
DATABASE_URL=mysql://...
MAILER_DSN=...
```

**2. `.gitignore` - Ajouter:**
```
.env.local
.env.*.local
config/jwt/private.pem
config/jwt/public.pem
```

**3. `.env` - Retirer les secrets:**
```dotenv
# ❌ NE PAS mettre de vraies passphrases
# ✅ Utiliser des valeurs par défaut:
JWT_PASSPHRASE=${JWT_PASSPHRASE:-}
```

---

## 🚀 Déploiement en Production

### Avant le déploiement:

1. **Régénérer les clés JWT** (ne jamais réutiliser celles de dev)
   ```bash
   php bin/console lexik:jwt:generate-keypair
   ```

2. **Créer `.env.prod.local`** sur le serveur (non versionné)
   ```dotenv
   APP_ENV=prod
   JWT_PASSPHRASE=<SECURELY_GENERATED_PASSPHRASE>
   DATABASE_URL=<PROD_DB>
   ```

3. **Copier les clés** générées vers le serveur (via scp, pas via git)

4. **Vérifier `.gitignore`** pour exclure config/jwt/ en prod si nécessaire

---

## ✅ Checklist de Sécurité

- [x] API fermée par défaut
- [x] Endpoints publics explicites
- [x] Données sensibles protégées
- [x] Vérification email réactivée
- [x] Token stocké en mémoire (React)
- [ ] Secrets sortis du .env commité
- [ ] Clés JWT régénérées pour prod
- [ ] .gitignore mis à jour
- [ ] Tests d'authentification passés

---

## 🔍 Vérification des Corrections

### Tester la sécurité des endpoints:

```bash
# ✅ Public - Doit retourner du JSON
curl http://localhost:8000/api/test

# ✅ Public - Login avec email/password
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@footlocal.com","password":"admin1234"}'

# ❌ Passé protection - Doit retourner 401 sans JWT
curl http://localhost:8000/api/players

# ✅ Avec JWT - Doit retourner les joueurs
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/players
```

---

## 📚 Ressources Sécurité

- [Symfony Security Best Practices](https://symfony.com/doc/current/security.html)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [JWT.io](https://jwt.io/) - Debugging JWT tokens
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
