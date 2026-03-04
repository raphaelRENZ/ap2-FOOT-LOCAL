import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../../../components/Layout'
import { adminGetMatchs, adminDeleteMatch } from '../../../services/api'

const STATUS_LABELS = { scheduled: 'Planifié', live: 'En direct', finished: 'Terminé', postponed: 'Reporté', cancelled: 'Annulé' }
const STATUS_COLORS = { scheduled: '#17a2b8', live: '#dc3545', finished: '#6c757d', postponed: '#fd7e14', cancelled: '#6c757d' }

export default function AdminMatchsPage() {
  const [matchs, setMatchs] = useState([])
  const [loading, setLoading] = useState(true)
  const [flash, setFlash]   = useState(null)

  useEffect(() => {
    adminGetMatchs()
      .then((res) => setMatchs(res.data ?? []))
      .catch(() => setFlash({ type: 'error', msg: 'Impossible de charger les matchs.' }))
      .finally(() => setLoading(false))
  }, [])

  async function handleDelete(id) {
    if (!confirm('Supprimer ce match ?')) return
    try {
      await adminDeleteMatch(id)
      setMatchs((prev) => prev.filter((m) => m.id !== id))
      setFlash({ type: 'success', msg: 'Match supprimé.' })
    } catch (err) {
      setFlash({ type: 'error', msg: err.message ?? 'Erreur.' })
    }
  }

  return (
    <Layout>
      <div className="hero-section">
        <h1>📅 Gestion des matchs</h1>
        <p><Link to="/admin" style={{ color: 'rgba(255,255,255,.8)' }}>← Tableau de bord</Link></p>
      </div>

      {flash && (
        <div style={{ padding: '10px 15px', marginBottom: '10px', borderRadius: '5px', background: flash.type === 'success' ? '#d4edda' : '#f8d7da', color: flash.type === 'success' ? '#155724' : '#721c24' }}>
          {flash.msg}
        </div>
      )}

      <div className="content-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h2>Liste des matchs ({matchs.length})</h2>
          <Link to="/admin/matchs/new" className="btn btn-primary">+ Nouveau match</Link>
        </div>

        {loading && <p>Chargement...</p>}
        {!loading && matchs.length === 0 && <p style={{ color: '#666' }}>Aucun match enregistré.</p>}

        {!loading && matchs.length > 0 && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f5f5f5', textAlign: 'left' }}>
                  {['Date', 'Domicile', 'Score', 'Extérieur', 'Lieu', 'Tournoi', 'Statut', 'Actions'].map((h) => (
                    <th key={h} style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {matchs.map((m) => (
                  <tr key={m.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '10px' }}>{m.matchDate ? new Date(m.matchDate).toLocaleString('fr-FR') : '—'}</td>
                    <td style={{ padding: '10px', fontWeight: 'bold' }}>{m.homeTeam?.name ?? m.homeTeam}</td>
                    <td style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold', fontSize: '1.1rem' }}>
                      {m.homeScore != null && m.awayScore != null ? `${m.homeScore} - ${m.awayScore}` : 'vs'}
                    </td>
                    <td style={{ padding: '10px', fontWeight: 'bold' }}>{m.awayTeam?.name ?? m.awayTeam}</td>
                    <td style={{ padding: '10px' }}>{m.venue ?? '—'}</td>
                    <td style={{ padding: '10px' }}>{m.tournament?.name ?? '—'}</td>
                    <td style={{ padding: '10px' }}>
                      <span style={{ background: STATUS_COLORS[m.status] ?? '#aaa', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '.82rem' }}>
                        {STATUS_LABELS[m.status] ?? m.status}
                      </span>
                    </td>
                    <td style={{ padding: '10px', display: 'flex', gap: '6px' }}>
                      <Link to={`/admin/matchs/${m.id}/edit`} className="btn btn-secondary" style={{ fontSize: '.85rem', padding: '4px 10px' }}>Modifier</Link>
                      <button
                        onClick={() => handleDelete(m.id)}
                        style={{ background: '#dc3545', color: 'white', border: 'none', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '.85rem' }}
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  )
}
