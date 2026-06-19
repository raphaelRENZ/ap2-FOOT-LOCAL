import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'footlocal.token';

async function isSecureStoreAvailable() {
  try {
    return await SecureStore.isAvailableAsync();
  } catch {
    return false;
  }
}

export async function getStoredToken() {
  const secureAvailable = await isSecureStoreAvailable();

  if (secureAvailable) {
    try {
      const secureToken = await SecureStore.getItemAsync(TOKEN_KEY);
      if (secureToken) return secureToken;

      // Migration douce: récupère l'ancien token AsyncStorage puis le déplace en SecureStore.
      const legacyToken = await AsyncStorage.getItem(TOKEN_KEY);
      if (legacyToken) {
        await SecureStore.setItemAsync(TOKEN_KEY, legacyToken);
        await AsyncStorage.removeItem(TOKEN_KEY);
        return legacyToken;
      }
    } catch {
      // Fallback ci-dessous.
    }
  }

  return AsyncStorage.getItem(TOKEN_KEY);
}

export async function setStoredToken(token) {
  const secureAvailable = await isSecureStoreAvailable();

  if (secureAvailable) {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
      await AsyncStorage.removeItem(TOKEN_KEY);
      return;
    } catch {
      // Fallback ci-dessous.
    }
  }

  await AsyncStorage.setItem(TOKEN_KEY, token);
}

export async function removeStoredToken() {
  const secureAvailable = await isSecureStoreAvailable();

  if (secureAvailable) {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    } catch {
      // On nettoie aussi AsyncStorage dans tous les cas.
    }
  }

  await AsyncStorage.removeItem(TOKEN_KEY);
}