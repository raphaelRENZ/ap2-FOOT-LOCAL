const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '')

// Token stocké en mémoire uniquement (jamais dans localStorage/sessionStorage)
// pour éviter les attaques XSS.
let _token = null

export function setApiToken(token) {
  _token = token
}

function authHeaders() {
  if (!_token) return {}
  return { Authorization: `Bearer ${_token}` }
}

async function safeFetch(url, options) {
  try {
    return await fetch(url, options)
  } catch {
    throw new Error("Impossible de joindre l'API. Vérifiez que Symfony est démarré sur http://127.0.0.1:8000.")
  }
}

async function parseJson(response) {
  const contentType = response.headers.get('Content-Type') ?? ''
  if (!contentType.includes('application/json')) {
    if (!response.ok) {
      throw new Error(`Erreur ${response.status} : le serveur Symfony n'est pas joignable ou a renvoyé une page HTML. Vérifiez que le serveur tourne sur le port 8000.`)
    }
    return {}
  }
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.message ?? data.detail ?? data.error ?? 'Identifiants incorrects.')
  }
  return data
}

async function apiFetch(path, options = {}) {
  const response = await safeFetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...authHeaders(), ...(options.headers ?? {}) },
    ...options,
  })
  return parseJson(response)
}

// ── Auth ──────────────────────────────────────────────────────────────

export async function login(email, password) {
  const response = await safeFetch(`${API_BASE_URL}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  return parseJson(response)
}

export async function register(data) {
  return apiFetch('/api/register', { method: 'POST', body: JSON.stringify(data) })
}

export async function getMe(token) {
  const response = await safeFetch(`${API_BASE_URL}/api/users/me`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  })
  return parseJson(response)
}

// ── Clubs publics ─────────────────────────────────────────────────────

export async function getClubs() {
  return apiFetch('/api/clubs')
}

export async function getClubDetail(id) {
  return apiFetch(`/api/clubs/${id}`)
}

// ── Matchs publics ────────────────────────────────────────────────────

export async function getMatches() {
  return apiFetch('/api/matches')
}

export async function getMatchesByStatus(status) {
  return apiFetch(`/api/matches/status/${status}`)
}

// ── Tournois publics ──────────────────────────────────────────────────

export async function getTournaments() {
  return apiFetch('/api/tournaments')
}

export async function getTournamentDetail(id) {
  return apiFetch(`/api/tournaments/${id}`)
}

// ── Favoris ───────────────────────────────────────────────────────────

export async function getFavorites() {
  return apiFetch('/api/users/me/favorites')
}

export async function addFavorite(clubId) {
  return apiFetch(`/api/users/me/favorites/${clubId}`, { method: 'POST' })
}

export async function removeFavorite(clubId) {
  return apiFetch(`/api/users/me/favorites/${clubId}`, { method: 'DELETE' })
}

// ── Admin – Stats ─────────────────────────────────────────────────────

export async function adminGetStats() {
  return apiFetch('/api/admin/stats')
}

// ── Admin – Clubs ─────────────────────────────────────────────────────

export async function adminGetClubs() {
  return apiFetch('/api/admin/clubs')
}

export async function adminCreateClub(data) {
  return apiFetch('/api/admin/clubs', { method: 'POST', body: JSON.stringify(data) })
}

export async function adminUpdateClub(id, data) {
  return apiFetch(`/api/admin/clubs/${id}`, { method: 'PUT', body: JSON.stringify(data) })
}

export async function adminDeleteClub(id) {
  return apiFetch(`/api/admin/clubs/${id}`, { method: 'DELETE' })
}

// ── Admin – Tournois ──────────────────────────────────────────────────

export async function adminGetTournois() {
  return apiFetch('/api/admin/tournois')
}

export async function adminCreateTournoi(data) {
  return apiFetch('/api/admin/tournois', { method: 'POST', body: JSON.stringify(data) })
}

export async function adminUpdateTournoi(id, data) {
  return apiFetch(`/api/admin/tournois/${id}`, { method: 'PUT', body: JSON.stringify(data) })
}

export async function adminDeleteTournoi(id) {
  return apiFetch(`/api/admin/tournois/${id}`, { method: 'DELETE' })
}

// ── Admin – Matchs ────────────────────────────────────────────────────

export async function adminGetMatchs() {
  return apiFetch('/api/admin/matchs')
}

export async function adminCreateMatch(data) {
  return apiFetch('/api/admin/matchs', { method: 'POST', body: JSON.stringify(data) })
}

export async function adminUpdateMatch(id, data) {
  return apiFetch(`/api/admin/matchs/${id}`, { method: 'PUT', body: JSON.stringify(data) })
}

export async function adminDeleteMatch(id) {
  return apiFetch(`/api/admin/matchs/${id}`, { method: 'DELETE' })
}

// ── Admin – Utilisateurs ──────────────────────────────────────────────

export async function adminGetUtilisateurs() {
  return apiFetch('/api/admin/utilisateurs')
}

export async function adminUpdateUtilisateur(id, data) {
  return apiFetch(`/api/admin/utilisateurs/${id}`, { method: 'PUT', body: JSON.stringify(data) })
}

export async function adminDeleteUtilisateur(id) {
  return apiFetch(`/api/admin/utilisateurs/${id}`, { method: 'DELETE' })
}