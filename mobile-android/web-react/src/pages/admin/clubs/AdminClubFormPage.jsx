import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import Layout from '../../../components/Layout'
import { adminGetClubs, adminCreateClub, adminUpdateClub } from '../../../services/api'

const EMPTY = { name: '', city: '', country: 'France', stadium: '', colors: '', foundedYear: '', description: '' }

export default function AdminClubFormPage() {
  const { id }    = useParams()
  const isEdit    = Boolean(id)
  const navigate  = useNavigate()

  const [form, setForm]     = useState(EMPTY)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState('')

  useEffect(() => {
    if (!isEdit) return
    adminGetClubs()
      .then((res) => {
        const club = (res.data ?? []).find((c) => c.id === parseInt(id))
        if (club) setForm({ ...EMPTY, ...club, foundedYear: club.foundedYear ?? '' })
      })
      .catch(() => setError('Club introuvable.'))
      .finally(() => setLoading(false))
  }, [id, isEdit])

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      if (isEdit) {
        await adminUpdateClub(id, form)
      } else {
        await adminCreateClub(form)
      }
      navigate('/admin/clubs')
    } catch (err) {
      setError(err.message ?? 'Erreur lors de la sauvegarde.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Layout>
      <div className="hero-section">
        <h1>⚽ {isEdit ? 'Modifier le club' : 'Nouveau club'}</h1>
        <p><Link to="/admin/clubs" style={{ color: 'rgba(255,255,255,.8)' }}>← Retour à la liste</Link></p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {loading && <p>Chargement...</p>}

      {!loading && (
        <div className="content-card" style={{ maxWidth: '700px' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={labelStyle}>Nom du club *</label>
                <input name="name" value={form.name} onChange={handleChange} required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Ville</label>
                <input name="city" value={form.city} onChange={handleChange} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Pays</label>
                <input name="country" value={form.country} onChange={handleChange} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Stade</label>
                <input name="stadium" value={form.stadium} onChange={handleChange} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Couleurs</label>
                <input name="colors" value={form.colors} onChange={handleChange} placeholder="ex: rouge et blanc" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Année de fondation</label>
                <input name="foundedYear" value={form.foundedYear} onChange={handleChange} type="number" min="1800" max="2100" style={inputStyle} />
              </div>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={labelStyle}>Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows="4" style={{ ...inputStyle, resize: 'vertical' }} />
              </div>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Sauvegarde...' : (isEdit ? 'Enregistrer' : 'Créer le club')}
              </button>
              <Link to="/admin/clubs" className="btn btn-secondary">Annuler</Link>
            </div>
          </form>
        </div>
      )}
    </Layout>
  )
}

const labelStyle = { display: 'block', fontWeight: '600', marginBottom: '4px' }
const inputStyle  = { width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }
