import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function ProtectedRoute({ children }) {
  const { token, loading } = useAuth()

  if (loading) return <div className="loading">Chargement...</div>
  if (!token) return <Navigate to="/connexion" replace />

  return children
}

export function AdminRoute({ children }) {
  const { token, isAdmin, loading } = useAuth()

  if (loading) return <div className="loading">Chargement...</div>
  if (!token) return <Navigate to="/connexion" replace />
  if (!isAdmin) return <Navigate to="/" replace />

  return children
}
