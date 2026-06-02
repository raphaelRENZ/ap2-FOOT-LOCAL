import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import { useAuth } from '../../context/AuthContext'
import { login as apiLogin } from '../../services/api'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate   = useNavigate()

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await apiLogin(email, password)
      login(res.token)
      // Décoder le payload JWT pour connaître les rôles sans attendre /api/me
      try {
        const payload = JSON.parse(atob(res.token.split('.')[1]))
        const roles = payload.roles ?? []
        navigate(roles.includes('ROLE_ADMIN') ? '/admin' : '/compte')
      } catch {
        navigate('/compte')
      }
    } catch (err) {
      setError(err.message ?? 'Identifiants incorrects.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout hideSidebar={true}>
      <div className="auth-container">
        <h1 className="auth-title">Connexion</h1>

        {error && <div className="auth-alert">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="auth-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              autoFocus
            />
          </div>

          <div className="auth-field">
            <label htmlFor="password">Mot de passe</label>
            <input
              id="password"
              type="password"
              className="auth-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <div className="auth-actions">
            <button className="auth-btn" type="submit" disabled={loading}>
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </div>
        </form>

        <p className="auth-help">
          Pas encore de compte ?{' '}
          <Link className="auth-link" to="/inscription">Inscription</Link>
        </p>
      </div>
    </Layout>
  )
}
