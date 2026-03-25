import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import jwtDecode from 'jwt-decode'

// ⚠️ REMPLACER par votre IP locale (ipconfig sur Windows)
// Exemple: http://192.168.1.100:8000
const API_BASE_URL = 'http://localhost:8000'

let _token = null

// ════════════════════════════════════════════════════════════════════════
// TOKEN MANAGEMENT
// ════════════════════════════════════════════════════════════════════════

export async function setApiToken(token) {
  _token = token
  if (token) {
    await AsyncStorage.setItem('token', token)
  } else {
    await AsyncStorage.removeItem('token')
  }
}

export async function getApiToken() {
  if (_token) return _token
  const stored = await AsyncStorage.getItem('token')
  if (stored) _token = stored
  return stored
}

export async function clearApiToken() {
  _token = null
  await AsyncStorage.removeItem('token')
}

// ════════════════════════════════════════════════════════════════════════
// AUTHENTICATION
// ════════════════════════════════════════════════════════════════════════

export async function loginUser(email, password) {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/login`, {
      email,
      password,
    })
    
    if (response.data?.token) {
      await setApiToken(response.data.token)
      return {
        success: true,
        token: response.data.token,
        user: response.data.user || null,
      }
    }
    
    return {
      success: false,
      error: 'No token received',
    }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || error.message || 'Login failed',
    }
  }
}

export async function registerUser(email, password, firstName = '', lastName = '') {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/register`, {
      email,
      password,
      firstName,
      lastName,
    })
    
    return {
      success: true,
      message: 'Registration successful. Please check your email to verify your account.',
      user: response.data?.user || null,
    }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || error.message || 'Registration failed',
    }
  }
}

// ════════════════════════════════════════════════════════════════════════
// USER DATA
// ════════════════════════════════════════════════════════════════════════

export async function getCurrentUser() {
  try {
    const token = await getApiToken()
    if (!token) return null

    const response = await axios.get(`${API_BASE_URL}/api/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    return response.data?.data || response.data || null
  } catch (error) {
    console.error('Get current user error:', error.message)
    return null
  }
}

// ════════════════════════════════════════════════════════════════════════
// CLUBS (PUBLIC - pas besoin d'auth pour lister)
// ════════════════════════════════════════════════════════════════════════

export async function getClubs() {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/clubs`)
    return {
      success: true,
      data: response.data?.data || [],
      total: response.data?.total || 0,
    }
  } catch (error) {
    console.error('Get clubs error:', error.message)
    return {
      success: false,
      error: error.message || 'Failed to fetch clubs',
      data: [],
    }
  }
}

export async function getClubDetails(clubId) {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/clubs/${clubId}`)
    return {
      success: true,
      data: response.data?.data || response.data || null,
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to fetch club details',
    }
  }
}

// ════════════════════════════════════════════════════════════════════════
// TOURNAMENTS (PUBLIC)
// ════════════════════════════════════════════════════════════════════════

export async function getTournaments() {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/tournaments`)
    return {
      success: true,
      data: response.data?.data || [],
      total: response.data?.total || 0,
    }
  } catch (error) {
    console.error('Get tournaments error:', error.message)
    return {
      success: false,
      error: error.message || 'Failed to fetch tournaments',
      data: [],
    }
  }
}

export async function getTournamentDetails(tournamentId) {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/tournaments/${tournamentId}`)
    return {
      success: true,
      data: response.data?.data || response.data || null,
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to fetch tournament details',
    }
  }
}

// ════════════════════════════════════════════════════════════════════════
// FAVORITES (REQUIRES AUTH)
// ════════════════════════════════════════════════════════════════════════

export async function addFavoriteClub(clubId) {
  try {
    const token = await getApiToken()
    if (!token) return { success: false, error: 'Not authenticated' }

    const response = await axios.post(
      `${API_BASE_URL}/api/users/me/favorites/${clubId}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    )

    return {
      success: true,
      message: response.data?.message || 'Added to favorites',
    }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || error.message || 'Failed to add favorite',
    }
  }
}

export async function removeFavoriteClub(clubId) {
  try {
    const token = await getApiToken()
    if (!token) return { success: false, error: 'Not authenticated' }

    const response = await axios.delete(
      `${API_BASE_URL}/api/users/me/favorites/${clubId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )

    return {
      success: true,
      message: response.data?.message || 'Removed from favorites',
    }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || error.message || 'Failed to remove favorite',
    }
  }
}

export async function getFavorites() {
  try {
    const token = await getApiToken()
    if (!token) return { success: false, error: 'Not authenticated', data: [] }

    const response = await axios.get(`${API_BASE_URL}/api/users/me/favorites`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    return {
      success: true,
      data: response.data?.data || [],
      count: response.data?.count || 0,
    }
  } catch (error) {
    console.error('Get favorites error:', error.message)
    return {
      success: false,
      error: error.message || 'Failed to fetch favorites',
      data: [],
    }
  }
}

// ════════════════════════════════════════════════════════════════════════
// CLUB DETAILS
// ════════════════════════════════════════════════════════════════════════

export async function getClubDetails(clubId) {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/clubs/${clubId}`)
    return {
      success: true,
      data: response.data?.data || response.data,
    }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || error.message || 'Failed to fetch club details',
    }
  }
}

// ════════════════════════════════════════════════════════════════════════
// TOURNAMENT DETAILS
// ════════════════════════════════════════════════════════════════════════

export async function getTournamentDetails(tournamentId) {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/tournaments/${tournamentId}`)
    return {
      success: true,
      data: response.data?.data || response.data,
    }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || error.message || 'Failed to fetch tournament details',
    }
  }
}

// ════════════════════════════════════════════════════════════════════════
// UTILITY
// ════════════════════════════════════════════════════════════════════════

export function decodeToken(token) {
  try {
    return jwtDecode(token)
  } catch (error) {
    console.error('Decode token error:', error.message)
    return null
  }
}

export function isTokenExpired(token) {
  const decoded = decodeToken(token)
  if (!decoded || !decoded.exp) return true
  return decoded.exp * 1000 < Date.now()
}
