import { createContext, useContext, useState, useEffect } from 'react'
import { setApiToken, getMe } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  // Le token est stocké uniquement en mémoire React (jamais en localStorage)
  // pour prévenir le vol de token par XSS.
  const [token, setToken] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!token) {
      setApiToken(null)
      setProfile(null)
      setLoading(false)
      return
    }

    setApiToken(token)
    setLoading(true)
    getMe(token)
      .then((data) => setProfile(data?.data ?? data))
      .catch(() => {
        setToken(null)
        setProfile(null)
        setApiToken(null)
      })
      .finally(() => setLoading(false))
  }, [token])

  function login(newToken) {
    setApiToken(newToken)  // mise à jour immédiate pour les appels API suivants
    setToken(newToken)
  }

  function logout() {
    setToken(null)
    setProfile(null)
    setApiToken(null)
  }

  const isAdmin = Array.isArray(profile?.roles) && profile.roles.includes('ROLE_ADMIN')

  return (
    <AuthContext.Provider value={{ token, profile, loading, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
