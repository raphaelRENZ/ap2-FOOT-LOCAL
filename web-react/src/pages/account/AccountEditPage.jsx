import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Layout from '../../components/Layout'
import { useAuth } from '../../context/AuthContext'
import { updateMe } from '../../services/api'

const EMPTY = {
  firstName: '',
  lastName: '',
  phone: '',
  birthDate: '',
  avatar: '',
}

export default function AccountEditPage() {
  const navigate = useNavigate()
  const { profile, refreshProfile } = useAuth()

  const [form, setForm] = useState(EMPTY)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!profile) return
    setForm({
      firstName: profile.firstName ?? '',
      lastName: profile.lastName ?? '',
      phone: profile.phone ?? '',
      birthDate: profile.birthDate ?? '',
      avatar: profile.avatar ?? '',
    })
    setLoading(false)
  }, [profile])

  function handleChange(event) {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSaving(true)

    try {
      const updated = await updateMe(form)
      if (refreshProfile) {
        await refreshProfile()
      }
      navigate('/compte', { replace: true, state: { profileUpdated: updated } })
    } catch (err) {
      setError(err.message ?? 'Erreur lors de la sauvegarde.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Layout>
      <div className="hero-section">
        <h1>Modifier mes informations</h1>
        <p>Mettez à jour vos informations personnelles.</p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {loading && <p>Chargement...</p>}

      {!loading && (
        <div className="content-card" style={{ maxWidth: '700px' }}>
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field">
              <label htmlFor="firstName">Prénom</label>
              <input id="firstName" name="firstName" className="auth-input" value={form.firstName} onChange={handleChange} />
            </div>

            <div className="auth-field">
              <label htmlFor="lastName">Nom</label>
              <input id="lastName" name="lastName" className="auth-input" value={form.lastName} onChange={handleChange} />
            </div>

            <div className="auth-field">
              <label htmlFor="phone">Téléphone</label>
              <input id="phone" name="phone" className="auth-input" value={form.phone} onChange={handleChange} />
            </div>

            <div className="auth-field">
              <label htmlFor="birthDate">Date de naissance</label>
              <input id="birthDate" name="birthDate" type="date" className="auth-input" value={form.birthDate} onChange={handleChange} />
            </div>

            <div className="auth-field">
              <label htmlFor="avatar">Avatar URL</label>
              <input id="avatar" name="avatar" className="auth-input" value={form.avatar} onChange={handleChange} />
            </div>

            <div className="auth-actions" style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
              <button type="submit" className="auth-btn" disabled={saving}>
                {saving ? 'Enregistrement...' : 'Enregistrer'}
              </button>
              <Link to="/compte" className="btn btn-secondary">Annuler</Link>
            </div>
          </form>
        </div>
      )}
    </Layout>
  )
}