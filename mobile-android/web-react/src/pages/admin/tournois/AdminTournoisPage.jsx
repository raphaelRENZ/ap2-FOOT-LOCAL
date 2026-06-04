import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../../../components/Layout'
import { adminGetTournois, adminDeleteTournoi } from '../../../services/api'

const STATUS_LABELS = { upcoming: 'À venir', ongoing: 'En cours', completed: 'Terminé', cancelled: 'Annulé' }
const STATUS_COLORS = { upcoming: '#17a2b8', ongoing: '#28a745', completed: '#6c757d', cancelled: '#dc3545' }

export default function AdminTournoisPage() {
  const [tournois, setTournois] = useState([])
  const [loading, setLoading]   = useState(true)
  const [flash, setFlash]       = useState(null)

  useEffect(() => {
    adminGetTournois()
      .then((res) => setTournois(res.data ?? []))
      .catch(() => setFlash({ type: 'error', msg: 'Impossible de charger les tournois.' }))
      .finally(() => setLoading(false))
  }, [])

  async function handleDelete(id) {
    if (!confirm('Supprimer ce tournoi ?')) return
    try {
      await adminDeleteTournoi(id)
      setTournois((prev) => prev.filter((t) => t.id !== id))
      setFlash({ type: 'success', msg: 'Tournoi supprimé.' })
    } catch (err) {
      setFlash({ type: 'error', msg: err.message ?? 'Erreur lors de la suppression.' })
    }
  }

  return (
    <Layout>
      <div className="hero-section">
        <h1>🏆 Gestion des tournois</h1>
        <p><Link to="/admin" style={{ color: 'rgba(255,255,255,.8)' }}>← Tableau de bord</Link></p>
      </div>

      {flash && (
        <div style={{ padding: '10px 15px', marginBottom: '10px', borderRadius: '5px', background: flash.type === 'success' ? '#d4edda' : '#f8d7da', color: flash.type === 'success' ? '#155724' : '#721c24' }}>
          {flash.msg}
        </div>
      )}

      <div className="content-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h2>Liste des tournois ({tournois.length})</h2>
          <Link to="/admin/tournois/new" className="btn btn-primary">+ Nouveau tournoi</Link>
        </div>

        {loading && <p>Chargement...</p>}
        {!loading && tournois.length === 0 && <p style={{ color: '#666' }}>Aucun tournoi enregistré.</p>}

        {!loading && tournois.length > 0 && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f5f5f5', textAlign: 'left' }}>
                  {['Nom', 'Saison', 'Lieu', 'Début', 'Fin', 'Statut', 'Actions'].map((h) => (
                    <th key={h} style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tournois.map((t) => (
                  <tr key={t.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '10px', fontWeight: 'bold' }}>{t.name}</td>
                    <td style={{ padding: '10px' }}>{t.season ?? '—'}</td>
                    <td style={{ padding: '10px' }}>{t.location ?? '—'}</td>
                    <td style={{ padding: '10px' }}>{t.startDate ?? '—'}</td>
                    <td style={{ padding: '10px' }}>{t.endDate ?? '—'}</td>
                    <td style={{ padding: '10px' }}>
                      <span style={{ background: STATUS_COLORS[t.status] ?? '#aaa', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '.82rem' }}>
                        {STATUS_LABELS[t.status] ?? t.status}
                      </span>
                    </td>
                    <td style={{ padding: '10px', display: 'flex', gap: '6px' }}>
                      <Link to={`/admin/tournois/${t.id}/edit`} className="btn btn-secondary" style={{ fontSize: '.85rem', padding: '4px 10px' }}>Modifier</Link>
                      <button
                        onClick={() => handleDelete(t.id)}
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
