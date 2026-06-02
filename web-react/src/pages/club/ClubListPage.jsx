import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import { getClubs } from '../../services/api'

export default function ClubListPage() {
  const [clubs, setClubs]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState('')

  useEffect(() => {
    getClubs()
      .then((res) => setClubs(res.data ?? []))
      .catch(() => setError('Impossible de charger les clubs.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <Layout>
      <div className="hero-section">
        <h1>Liste des clubs</h1>
        <p>Découvrez tous les clubs inscrits dans notre ligue et consultez leurs informations détaillées.</p>
      </div>

      {loading && <p className="loading-text">Chargement...</p>}
      {error   && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && (
        clubs.length > 0 ? (
          <div className="content-card">
            <table className="table mt-4">
              <thead>
                <tr>
                  <th>Nom du club</th>
                  <th>Ville</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {clubs.map((club) => (
                  <tr key={club.id}>
                    <td>{club.name}</td>
                    <td>{club.city ?? '—'}</td>
                    <td>
                      <Link to={`/clubs/${club.id}`} className="btn btn-sm btn-primary">
                        Voir détails
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="content-card">
            <p>Aucun club enregistré pour le moment.</p>
          </div>
        )
      )}
    </Layout>
  )
}
