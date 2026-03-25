import React, { createContext, useContext, useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {
  setApiToken,
  getApiToken,
  clearApiToken,
  getCurrentUser,
  isTokenExpired,
} from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Charger le token au démarrage
  useEffect(() => {
    async function restoreToken() {
      try {
        setLoading(true)
        const storedToken = await getApiToken()

        if (storedToken) {
          // Vérifier si le token a expiré
          if (isTokenExpired(storedToken)) {
            await clearApiToken()
            setToken(null)
            setUser(null)
            setIsAuthenticated(false)
          } else {
            // Token valide, charger les données utilisateur
            setToken(storedToken)
            await setApiToken(storedToken)

            const userData = await getCurrentUser()
            if (userData) {
              setUser(userData)
              setIsAuthenticated(true)
            }
          }
        }
      } catch (error) {
        console.error('Token restore error:', error)
        setToken(null)
        setUser(null)
        setIsAuthenticated(false)
      } finally {
        setLoading(false)
      }
    }

    restoreToken()
  }, [])

  async function login(newToken, userData = null) {
    try {
      setToken(newToken)
      setIsAuthenticated(true)

      if (userData) {
        setUser(userData)
      } else {
        // Récupérer les données utilisateur si non fourni
        const data = await getCurrentUser()
        setUser(data)
      }

      await setApiToken(newToken)
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  async function logout() {
    try {
      setToken(null)
      setUser(null)
      setIsAuthenticated(false)
      await clearApiToken()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return context
}
