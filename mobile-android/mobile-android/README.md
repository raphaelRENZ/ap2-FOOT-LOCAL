# Foot Local Mobile

Projet Expo Go de l'application mobile.

## Demarrage

```bash
npm install
npm run start
```

Le script `start` lance Expo/Metro sur le port `8081`.

## Versions

- Expo SDK 56
- React Native 0.85
- React 19.2.3

## API Symfony

L'application consomme l'API Symfony du projet principal sur le port `8000`.
Le port `8081` sert uniquement a Expo/Metro, pas aux routes `/api`.

Sur telephone physique, le backend doit ecouter sur le reseau local :

```bash
symfony server:start --no-tls --allow-http --allow-all-ip --port=8000
```

Alternative si vous utilisez le serveur PHP integre :

```bash
php -S 0.0.0.0:8000 -t public public/index.php
```

Vous pouvez forcer l'URL API si la detection automatique ne convient pas :

```powershell
$env:EXPO_PUBLIC_API_BASE_URL="http://10.74.3.247:8000"
npm run start
```

Depuis le telephone, testez aussi `http://10.74.3.247:8000/api/test` dans le navigateur.
