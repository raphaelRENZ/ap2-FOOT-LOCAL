import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../../../components/Layout'
import { adminGetClubs, adminDeleteClub } from '../../../services/api'

export default function AdminClubsPage() {
  const [clubs, setClubs]   = useState([])
  const [loading, setLoading] = useState(true)
  const [flash, setFlash]   = useState(null)

  useEffect(() => {
    adminGetClubs()
      .then((res) => setClubs(res.data ?? []))
      .catch(() => setFlash({ type: 'error', msg: 'Impossible de charger les clubs.' }))
      .finally(() => setLoading(false))
  }, [])

  async function handleDelete(id) {
    if (!confirm('Supprimer ce club ?')) return
    try {
      await adminDeleteClub(id)
      setClubs((prev) => prev.filter((c) => c.id !== id))
      setFlash({ type: 'success', msg: 'Club supprimé.' })
    } catch (err) {
      setFlash({ type: 'error', msg: err.message ?? 'Erreur lors de la suppression.' })
    }
  }

  return (
    <Layout>
      <div className="hero-section">
        <h1>⚽ Gestion des clubs</h1>
        <p><Link to="/admin" style={{ color: 'rgba(255,255,255,.8)' }}>← Tableau de bord</Link></p>
      </div>

      {flash && (
        <div style={{ padding: '10px 15px', marginBottom: '10px', borderRadius: '5px', background: flash.type === 'success' ? '#d4edda' : '#f8d7da', color: flash.type === 'success' ? '#155724' : '#721c24' }}>
          {flash.msg}
        </div>
      )}

      <div className="content-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h2>Liste des clubs ({clubs.length})</h2>
          <Link to="/admin/clubs/new" className="btn btn-primary">+ Nouveau club</Link>
        </div>

        {loading && <p>Chargement...</p>}

        {!loading && clubs.length === 0 && <p style={{ color: '#666' }}>Aucun club enregistré.</p>}

        {!loading && clubs.length > 0 && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f5f5f5', textAlign: 'left' }}>
                  <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Nom</th>
                  <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Ville</th>
                  <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Stade</th>
                  <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Couleurs</th>
                  <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Fondé</th>
                  <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {clubs.map((club) => (
                  <tr key={club.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '10px', fontWeight: 'bold' }}>{club.name}</td>
                    <td style={{ padding: '10px' }}>{club.city ?? '—'}</td>
                    <td style={{ padding: '10px' }}>{club.stadium ?? '—'}</td>
                    <td style={{ padding: '10px' }}>{club.colors ?? '—'}</td>
                    <td style={{ padding: '10px' }}>{club.foundedYear ?? '—'}</td>
                    <td style={{ padding: '10px', display: 'flex', gap: '6px' }}>
                      <Link to={`/admin/clubs/${club.id}/edit`} className="btn btn-secondary" style={{ fontSize: '.85rem', padding: '4px 10px' }}>
                        Modifier
                      </Link>
                      <button
                        onClick={() => handleDelete(club.id)}
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
