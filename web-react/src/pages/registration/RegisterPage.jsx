import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import { register } from '../../services/api'

export default function RegisterPage() {
  const navigate = useNavigate()

  const [email, setEmail]         = useState('')
  const [password, setPassword]   = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName]   = useState('')
  const [error, setError]         = useState('')
  const [loading, setLoading]     = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await register({ email, password, firstName, lastName })
      navigate('/connexion')
    } catch (err) {
      setError(err.message ?? 'Erreur lors de l\'inscription.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout sidebar={false}>
      <div className="auth-container">
        <div className="auth-header">
          <img src="/logo_foot_local-removebg-preview.png" alt="Foot Local Logo" className="auth-logo" />
        </div>

        <h1 className="auth-title">Inscription</h1>
        <p className="auth-subtitle">Rejoignez notre communauté</p>

        {error && <div className="auth-alert">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label htmlFor="firstName">Prénom</label>
            <input
              id="firstName"
              type="text"
              className="auth-input"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          <div className="auth-field">
            <label htmlFor="lastName">Nom</label>
            <input
              id="lastName"
              type="text"
              className="auth-input"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <div className="auth-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="auth-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
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
              required
              minLength={6}
            />
          </div>

          <div className="auth-actions">
            <button className="auth-btn" type="submit" disabled={loading}>
              {loading ? 'Création...' : 'Créer le compte'}
            </button>
          </div>
        </form>

        <p className="auth-help">
          Déjà un compte ?{' '}
          <Link className="auth-link" to="/connexion">Connexion</Link>
        </p>
      </div>
    </Layout>
  )
}
