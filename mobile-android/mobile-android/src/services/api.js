import Constants from 'expo-constants';
import { Platform } from 'react-native';

const DEFAULT_API_PORT = '8000';

function normalizeBaseUrl(url) {
  return String(url).trim().replace(/\/+$/, '');
}

function getExtraConfig() {
  return {
    ...(Constants.manifest?.extra || {}),
    ...(Constants.manifest2?.extra?.expoClient?.extra || {}),
    ...(Constants.expoConfig?.extra || {}),
  };
}

function getHostFromUri(uri) {
  if (!uri || typeof uri !== 'string') {
    return null;
  }

  const withoutScheme = uri.replace(/^[a-z][a-z0-9+.-]*:\/\//i, '');
  const hostWithPort = withoutScheme.split('/')[0];

  if (hostWithPort.startsWith('[')) {
    return hostWithPort.slice(1, hostWithPort.indexOf(']'));
  }

  return hostWithPort.split(':')[0] || null;
}

function getExpoDevHost() {
  return [
    Constants.expoConfig?.hostUri,
    Constants.expoGoConfig?.debuggerHost,
    Constants.manifest?.debuggerHost,
    Constants.manifest2?.extra?.expoGo?.debuggerHost,
  ].map(getHostFromUri).find(Boolean);
}

export function getApiBaseUrl() {
  const extraConfig = getExtraConfig();
  const envApiBaseUrl = typeof process !== 'undefined'
    ? process.env?.EXPO_PUBLIC_API_BASE_URL
    : undefined;
  const configuredApiBaseUrl = envApiBaseUrl || extraConfig.apiBaseUrl;

  if (configuredApiBaseUrl) {
    return normalizeBaseUrl(configuredApiBaseUrl);
  }

  const apiPort = String(
    extraConfig.apiPort
    || (typeof process !== 'undefined' ? process.env?.EXPO_PUBLIC_API_PORT : undefined)
    || DEFAULT_API_PORT
  );
  const host = getExpoDevHost();

  if (host && host !== 'localhost' && host !== '127.0.0.1') {
    return `http://${host}:${apiPort}`;
  }

  if (Platform.OS === 'android') {
    return `http://10.0.2.2:${apiPort}`;
  }

  return `http://127.0.0.1:${apiPort}`;
}

export const API_BASE_URL = getApiBaseUrl();

let authToken = null;

export function setAuthToken(token) {
  authToken = token;
}

async function parseJson(response) {
  const text = await response.text();
  let body = {};
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = { message: text };
    }
  }

  if (!response.ok) {
    throw new Error(body.message || body.error || `Erreur ${response.status}`);
  }

  return body;
}

async function apiFetch(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    ...(options.headers || {}),
  };

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
    });
  } catch (error) {
    const details = error?.message ? ` (${error.message})` : '';
    throw new Error(
      `Impossible de joindre l'API Symfony sur ${API_BASE_URL}${details}. `
      + 'Sur telephone physique, lance le backend avec: '
      + 'symfony server:start --no-tls --allow-http --allow-all-ip --port=8000, '
      + 'puis verifie que le pare-feu Windows autorise le port 8000.'
    );
  }

  return parseJson(response);
}

export async function login(email, password) {
  const firstTry = await apiFetch('/api/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  if (firstTry?.token) {
    return firstTry;
  }

  return apiFetch('/api/login_check', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function register(payload) {
  return apiFetch('/api/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function getMe() {
  return apiFetch('/api/users/me');
}

export async function getMatches() {
  return apiFetch('/api/matches');
}

export async function getMatchesByStatus(status) {
  return apiFetch(`/api/matches/status/${status}`);
}

export async function getClubs() {
  return apiFetch('/api/clubs');
}

export async function getTournaments() {
  return apiFetch('/api/tournaments');
}

export async function getFavorites() {
  return apiFetch('/api/users/me/favorites');
}

export async function addFavorite(clubId) {
  return apiFetch(`/api/users/me/favorites/${clubId}`, { method: 'POST' });
}

export async function removeFavorite(clubId) {
  return apiFetch(`/api/users/me/favorites/${clubId}`, { method: 'DELETE' });
}

export async function adminSendNotification({ title, message, recipients = 'all' }) {
  return apiFetch('/api/admin/notifications', {
    method: 'POST',
    body: JSON.stringify({ title, message, recipients }),
  });
}