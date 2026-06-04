import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import Layout from '../../../components/Layout'
import { adminGetMatchs, adminCreateMatch, adminUpdateMatch, adminGetClubs, adminGetTournois } from '../../../services/api'

const EMPTY = { homeTeam: '', awayTeam: '', homeScore: '', awayScore: '', matchDate: '', venue: '', status: 'scheduled', tournament: '' }

export default function AdminMatchFormPage() {
  const { id }   = useParams()
  const isEdit   = Boolean(id)
  const navigate = useNavigate()

  const [form, setForm]       = useState(EMPTY)
  const [clubs, setClubs]     = useState([])
  const [tournois, setTournois] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState('')

  useEffect(() => {
    Promise.all([
      adminGetClubs(),
      adminGetTournois(),
      isEdit ? adminGetMatchs() : Promise.resolve(null),
    ])
      .then(([clubsRes, tournoisRes, matchsRes]) => {
        setClubs(clubsRes.data ?? [])
        setTournois(tournoisRes.data ?? [])
        if (isEdit && matchsRes) {
          const m = (matchsRes.data ?? []).find((m) => m.id === parseInt(id))
          if (m) {
            setForm({
              homeTeam:  m.homeTeam?.id ?? m.homeTeam ?? '',
              awayTeam:  m.awayTeam?.id ?? m.awayTeam ?? '',
              homeScore: m.homeScore ?? '',
              awayScore: m.awayScore ?? '',
              matchDate: m.matchDate ?? '',
              venue:     m.venue ?? '',
              status:    m.status ?? 'scheduled',
              tournament: m.tournament?.id ?? '',
            })
          }
        }
      })
      .catch(() => setError('Erreur de chargement.'))
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
        await adminUpdateMatch(id, form)
      } else {
        await adminCreateMatch(form)
      }
      navigate('/admin/matchs')
    } catch (err) {
      setError(err.message ?? 'Erreur lors de la sauvegarde.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Layout>
      <div className="hero-section">
        <h1>📅 {isEdit ? 'Modifier le match' : 'Nouveau match'}</h1>
        <p><Link to="/admin/matchs" style={{ color: 'rgba(255,255,255,.8)' }}>← Retour à la liste</Link></p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {loading && <p>Chargement...</p>}

      {!loading && (
        <div className="content-card" style={{ maxWidth: '700px' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label style={L}>Équipe domicile *</label>
                <select name="homeTeam" value={form.homeTeam} onChange={handleChange} required style={I}>
                  <option value="">-- Choisir --</option>
                  {clubs.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label style={L}>Équipe extérieure *</label>
                <select name="awayTeam" value={form.awayTeam} onChange={handleChange} required style={I}>
                  <option value="">-- Choisir --</option>
                  {clubs.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label style={L}>Score domicile</label>
                <input name="homeScore" type="number" min="0" value={form.homeScore} onChange={handleChange} style={I} />
              </div>
              <div>
                <label style={L}>Score extérieur</label>
                <input name="awayScore" type="number" min="0" value={form.awayScore} onChange={handleChange} style={I} />
              </div>
              <div>
                <label style={L}>Date et heure *</label>
                <input name="matchDate" type="datetime-local" value={form.matchDate} onChange={handleChange} required style={I} />
              </div>
              <div>
                <label style={L}>Lieu / Stade</label>
                <input name="venue" value={form.venue} onChange={handleChange} style={I} />
              </div>
              <div>
                <label style={L}>Statut</label>
                <select name="status" value={form.status} onChange={handleChange} style={I}>
                  <option value="scheduled">Planifié</option>
                  <option value="live">En direct</option>
                  <option value="finished">Terminé</option>
                  <option value="postponed">Reporté</option>
                  <option value="cancelled">Annulé</option>
                </select>
              </div>
              <div>
                <label style={L}>Tournoi</label>
                <select name="tournament" value={form.tournament} onChange={handleChange} style={I}>
                  <option value="">-- Aucun --</option>
                  {tournois.map((t) => <option key={t.id} value={t.id}>{t.name} ({t.season ?? t.status})</option>)}
                </select>
              </div>
            </div>
            <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Sauvegarde...' : (isEdit ? 'Enregistrer' : 'Créer le match')}
              </button>
              <Link to="/admin/matchs" className="btn btn-secondary">Annuler</Link>
            </div>
          </form>
        </div>
      )}
    </Layout>
  )
}

const L = { display: 'block', fontWeight: '600', marginBottom: '4px' }
const I = { width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }
