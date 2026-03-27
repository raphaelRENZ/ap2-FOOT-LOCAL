import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import Layout from '../../../components/Layout'
import { adminGetUtilisateurs, adminUpdateUtilisateur } from '../../../services/api'

const EMPTY = { firstName: '', lastName: '', phone: '', isActive: true, isAdmin: false, newPassword: '' }

export default function AdminUserEditPage() {
  const { id }   = useParams()
  const navigate = useNavigate()

  const [form, setForm]     = useState(EMPTY)
  const [email, setEmail]   = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState('')

  useEffect(() => {
    adminGetUtilisateurs()
      .then((res) => {
        const user = (res.data ?? []).find((u) => u.id === parseInt(id))
        if (user) {
          setEmail(user.email)
          setForm({
            firstName:   user.firstName ?? '',
            lastName:    user.lastName ?? '',
            phone:       user.phone ?? '',
            isActive:    user.isActive ?? true,
            isAdmin:     (user.roles ?? []).includes('ROLE_ADMIN'),
            newPassword: '',
          })
        }
      })
      .catch(() => setError('Utilisateur introuvable.'))
      .finally(() => setLoading(false))
  }, [id])

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      const roles = ['ROLE_USER']
      if (form.isAdmin) roles.push('ROLE_ADMIN')
      await adminUpdateUtilisateur(id, { ...form, roles, isActive: form.isActive === true || form.isActive === 'true' || form.isActive === '1' })
      navigate('/admin/utilisateurs')
    } catch (err) {
      setError(err.message ?? 'Erreur lors de la sauvegarde.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Layout>
      <div className="hero-section">
        <h1>👥 Modifier l'utilisateur</h1>
        <p><Link to="/admin/utilisateurs" style={{ color: 'rgba(255,255,255,.8)' }}>← Retour à la liste</Link></p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {loading && <p>Chargement...</p>}

      {!loading && (
        <div className="content-card" style={{ maxWidth: '600px' }}>
          <p style={{ marginBottom: '20px', color: '#555' }}>Email : <strong>{email}</strong></p>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label style={L}>Prénom</label>
                <input name="firstName" value={form.firstName} onChange={handleChange} style={I} />
              </div>
              <div>
                <label style={L}>Nom</label>
                <input name="lastName" value={form.lastName} onChange={handleChange} style={I} />
              </div>
              <div>
                <label style={L}>Téléphone</label>
                <input name="phone" value={form.phone} onChange={handleChange} style={I} />
              </div>
              <div>
                <label style={L}>Actif</label>
                <select name="isActive" value={form.isActive ? '1' : '0'} onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.value === '1' }))} style={I}>
                  <option value="1">Oui</option>
                  <option value="0">Non</option>
                </select>
              </div>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={L}>Rôles</label>
                <div style={{ display: 'flex', gap: '20px', marginTop: '6px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'default', opacity: '.7' }}>
                    <input type="checkbox" checked disabled style={{ width: '16px', height: '16px' }} />
                    Utilisateur (ROLE_USER) — toujours attribué
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <input type="checkbox" name="isAdmin" checked={form.isAdmin} onChange={handleChange} style={{ width: '16px', height: '16px' }} />
                    Administrateur (ROLE_ADMIN)
                  </label>
                </div>
              </div>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={L}>
                  Nouveau mot de passe{' '}
                  <span style={{ fontWeight: 'normal', color: '#888' }}>(laisser vide pour ne pas changer)</span>
                </label>
                <input name="newPassword" type="password" value={form.newPassword} onChange={handleChange} autoComplete="new-password" style={I} />
              </div>
            </div>
            <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Sauvegarde...' : 'Enregistrer'}
              </button>
              <Link to="/admin/utilisateurs" className="btn btn-secondary">Annuler</Link>
            </div>
          </form>
        </div>
      )}
    </Layout>
  )
}

const L = { display: 'block', fontWeight: '600', marginBottom: '4px' }
const I = { width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }
