import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import Layout from '../../../components/Layout'
import { adminGetTournois, adminCreateTournoi, adminUpdateTournoi } from '../../../services/api'

const EMPTY = { name: '', season: '', location: '', startDate: '', endDate: '', status: 'upcoming', description: '' }

export default function AdminTournoiFormPage() {
  const { id }    = useParams()
  const isEdit    = Boolean(id)
  const navigate  = useNavigate()

  const [form, setForm]     = useState(EMPTY)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState('')

  useEffect(() => {
    if (!isEdit) return
    adminGetTournois()
      .then((res) => {
        const t = (res.data ?? []).find((t) => t.id === parseInt(id))
        if (t) setForm({ ...EMPTY, ...t, startDate: t.startDate ?? '', endDate: t.endDate ?? '' })
      })
      .catch(() => setError('Tournoi introuvable.'))
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
        await adminUpdateTournoi(id, form)
      } else {
        await adminCreateTournoi(form)
      }
      navigate('/admin/tournois')
    } catch (err) {
      setError(err.message ?? 'Erreur lors de la sauvegarde.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Layout>
      <div className="hero-section">
        <h1>🏆 {isEdit ? 'Modifier le tournoi' : 'Nouveau tournoi'}</h1>
        <p><Link to="/admin/tournois" style={{ color: 'rgba(255,255,255,.8)' }}>← Retour à la liste</Link></p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {loading && <p>Chargement...</p>}

      {!loading && (
        <div className="content-card" style={{ maxWidth: '700px' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={L}>Nom du tournoi *</label>
                <input name="name" value={form.name} onChange={handleChange} required style={I} />
              </div>
              <div>
                <label style={L}>Saison</label>
                <input name="season" value={form.season} onChange={handleChange} placeholder="ex: 2024-2025" style={I} />
              </div>
              <div>
                <label style={L}>Lieu</label>
                <input name="location" value={form.location} onChange={handleChange} style={I} />
              </div>
              <div>
                <label style={L}>Date de début</label>
                <input name="startDate" type="date" value={form.startDate} onChange={handleChange} style={I} />
              </div>
              <div>
                <label style={L}>Date de fin</label>
                <input name="endDate" type="date" value={form.endDate} onChange={handleChange} style={I} />
              </div>
              <div>
                <label style={L}>Statut</label>
                <select name="status" value={form.status} onChange={handleChange} style={I}>
                  <option value="upcoming">À venir</option>
                  <option value="ongoing">En cours</option>
                  <option value="completed">Terminé</option>
                  <option value="cancelled">Annulé</option>
                </select>
              </div>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={L}>Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows="4" style={{ ...I, resize: 'vertical' }} />
              </div>
            </div>
            <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Sauvegarde...' : (isEdit ? 'Enregistrer' : 'Créer le tournoi')}
              </button>
              <Link to="/admin/tournois" className="btn btn-secondary">Annuler</Link>
            </div>
          </form>
        </div>
      )}
    </Layout>
  )
}

const L = { display: 'block', fontWeight: '600', marginBottom: '4px' }
const I = { width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }
