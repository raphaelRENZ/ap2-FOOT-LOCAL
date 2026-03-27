import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import { getFavorites, removeFavorite } from '../../services/api'

export default function FavorisPage() {
  const [favoris, setFavoris] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  useEffect(() => {
    getFavorites()
      .then((res) => setFavoris(res.data ?? []))
      .catch(() => setError('Impossible de charger les favoris.'))
      .finally(() => setLoading(false))
  }, [])

  async function handleRetirer(clubId) {
    try {
      await removeFavorite(clubId)
      setFavoris((prev) => prev.filter((c) => c.id !== clubId))
    } catch {
      setError('Erreur lors de la suppression.')
    }
  }

  return (
    <Layout>
      <div className="hero-section">
        <h1>Mes clubs favoris</h1>
      </div>

      {loading && <p className="loading-text">Chargement...</p>}
      {error   && <div className="alert alert-danger">{error}</div>}

      {!loading && (
        favoris.length > 0 ? (
          <div className="content-card">
            <table className="table mt-4">
              <thead>
                <tr>
                  <th>Club</th>
                  <th>Notifications activées</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {favoris.map((club) => (
                  <tr key={club.id}>
                    <td>
                      <Link to={`/clubs/${club.id}`}>{club.name}</Link>
                    </td>
                    <td>
                      <span className="badge bg-secondary">Non configuré</span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleRetirer(club.id)}
                      >
                        Retirer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="content-card">
            <p>Vous n'avez pas encore de clubs favoris.</p>
            <Link to="/clubs" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Parcourir les clubs
            </Link>
          </div>
        )
      )}
    </Layout>
  )
}
