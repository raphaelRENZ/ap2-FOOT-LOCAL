import { createContext, useContext, useState, useEffect } from 'react'

const TOKEN_KEY = 'footlocal_token'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(!!localStorage.getItem(TOKEN_KEY))

  useEffect(() => {
    if (!token) {
      setProfile(null)
      setLoading(false)
      return
    }

    setLoading(true)
    fetch('/api/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Token invalide')
        return res.json()
      })
      .then((data) => setProfile(data))
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY)
        setToken(null)
        setProfile(null)
      })
      .finally(() => setLoading(false))
  }, [token])

  function login(newToken) {
    localStorage.setItem(TOKEN_KEY, newToken)
    setLoading(true)
    setToken(newToken)
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
    setProfile(null)
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
