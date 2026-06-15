import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../../../components/Layout'
import { adminDeleteNews, adminGetNews } from '../../../services/api'

export default function AdminNewsPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [flash, setFlash] = useState(null)

  useEffect(() => {
    adminGetNews()
      .then((res) => setItems(res.data ?? []))
      .catch(() => setFlash({ type: 'error', msg: 'Impossible de charger les actualites.' }))
      .finally(() => setLoading(false))
  }, [])

  async function handleDelete(id) {
    if (!confirm('Supprimer cette actualite ?')) return

    try {
      await adminDeleteNews(id)
      setItems((prev) => prev.filter((x) => x.id !== id))
      setFlash({ type: 'success', msg: 'Actualite supprimee.' })
    } catch (e) {
      setFlash({ type: 'error', msg: e.message || 'Erreur de suppression.' })
    }
  }

  return (
    <Layout>
      <div className="hero-section">
        <h1>📰 Gestion des actualites</h1>
        <p><Link to="/admin" style={{ color: 'rgba(255,255,255,.8)' }}>← Tableau de bord</Link></p>
      </div>

      {flash ? (
        <div className={flash.type === 'success' ? 'alert alert-success' : 'alert alert-danger'}>{flash.msg}</div>
      ) : null}

      <div className="content-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h2>Actualites ({items.length})</h2>
          <Link to="/admin/actualites/new" className="btn btn-primary">+ Nouvelle actualite</Link>
        </div>

        {loading ? <p>Chargement...</p> : null}

        {!loading && items.length === 0 ? <p>Aucune actualite pour le moment.</p> : null}

        {!loading && items.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f5f5f5', textAlign: 'left' }}>
                  <th style={TH}>Image</th>
                  <th style={TH}>Titre</th>
                  <th style={TH}>Sous-titre</th>
                  <th style={TH}>Position</th>
                  <th style={TH}>Publie</th>
                  <th style={TH}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={TD}>{item.imageUrl ? <img src={item.imageUrl} alt={item.title} style={{ width: '72px', height: '48px', objectFit: 'cover', borderRadius: '6px' }} /> : '—'}</td>
                    <td style={TD}>{item.title}</td>
                    <td style={TD}>{item.subtitle || '—'}</td>
                    <td style={TD}>{item.position}</td>
                    <td style={TD}>{item.isPublished ? 'Oui' : 'Non'}</td>
                    <td style={{ ...TD, display: 'flex', gap: '6px' }}>
                      <Link to={`/admin/actualites/${item.id}/edit`} className="btn btn-secondary" style={{ fontSize: '.85rem', padding: '4px 10px' }}>Modifier</Link>
                      <button onClick={() => handleDelete(item.id)} className="btn btn-danger" style={{ fontSize: '.85rem', padding: '4px 10px' }}>Supprimer</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </Layout>
  )
}

const TH = { padding: '10px', borderBottom: '2px solid #ddd' }
const TD = { padding: '10px' }
