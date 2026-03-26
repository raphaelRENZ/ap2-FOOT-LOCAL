import Constants from 'expo-constants';

const extraApiBaseUrl = Constants.expoConfig?.extra?.apiBaseUrl;
const API_BASE_URL = extraApiBaseUrl || 'http://10.0.2.2:8000';

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

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

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
