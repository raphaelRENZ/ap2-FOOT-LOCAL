const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

export const TOKEN_KEY = 'footlocal_token'

export function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

function authHeaders() {
  const token = getToken()

  if (!token) {
    return {}
  }

  return {
    Authorization: `Bearer ${token}`,
  }
}

async function parseJson(response) {
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.message ?? 'Erreur API')
  }
  return data
}

export async function login(email, password) {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  return parseJson(response)
}

export async function getClubs() {
  const response = await fetch(`${API_BASE_URL}/api/clubs`, {
    method: 'GET',
  })

  return parseJson(response)
}

export async function getClubDetail(id) {
  const response = await fetch(`${API_BASE_URL}/api/clubs/${id}`, {
    method: 'GET',
  })

  return parseJson(response)
}

export async function getMatches() {
  const response = await fetch(`${API_BASE_URL}/api/matches`, {
    method: 'GET',
  })

  return parseJson(response)
}

export async function getMatchesByStatus(status) {
  const response = await fetch(`${API_BASE_URL}/api/matches/status/${status}`, {
    method: 'GET',
  })

  return parseJson(response)
}

export async function getFavorites() {
  const response = await fetch(`${API_BASE_URL}/api/users/me/favorites`, {
    method: 'GET',
    headers: {
      ...authHeaders(),
    },
  })

  return parseJson(response)
}

export async function addFavorite(clubId) {
  const response = await fetch(`${API_BASE_URL}/api/users/me/favorites/${clubId}`, {
    method: 'POST',
    headers: {
      ...authHeaders(),
    },
  })

  return parseJson(response)
}

export async function removeFavorite(clubId) {
  const response = await fetch(`${API_BASE_URL}/api/users/me/favorites/${clubId}`, {
    method: 'DELETE',
    headers: {
      ...authHeaders(),
    },
  })

  return parseJson(response)
}

export async function getTournaments() {
  const response = await fetch(`${API_BASE_URL}/api/tournaments`, {
    method: 'GET',
  })

  return parseJson(response)
}

export async function getTournamentDetail(id) {
  const response = await fetch(`${API_BASE_URL}/api/tournaments/${id}`, {
    method: 'GET',
  })

  return parseJson(response)
}

export async function getMe(token) {
  const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return parseJson(response)
}