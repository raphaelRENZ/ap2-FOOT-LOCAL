import axios from 'axios'
import * as SecureStore from 'react-native-keychain'
import jwtDecode from 'jwt-decode'

const API_BASE_URL = 'http://192.168.1.100:8000' // Remplacez par votre IP locale!

let token = null

export async function setToken(newToken) {
  token = newToken
  if (newToken) {
    await SecureStore.setGenericPassword('token', newToken)
  } else {
    await SecureStore.resetGenericPassword()
  }
}

export async function getToken() {
  if (token) return token
  const credentials = await SecureStore.getGenericPassword()
  if (credentials) {
    token = credentials.password
    return token
  }
  return null
}

export async function login(email, password) {
  const response = await axios.post(`${API_BASE_URL}/api/login`, {
    email,
    password,
  })
  await setToken(response.data.token)
  return response.data
}

export async function getMe() {
  const authToken = await getToken()
  const response = await axios.get(`${API_BASE_URL}/api/users/me`, {
    headers: { Authorization: `Bearer ${authToken}` },
  })
  return response.data
}