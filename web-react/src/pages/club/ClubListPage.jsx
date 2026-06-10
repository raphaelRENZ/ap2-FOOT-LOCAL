import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import { getClubs } from '../../services/api'

function ClubAvatar({ club }) {
  const initials = club.name
    ? club.name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
    : '?'
  if (club.logo) {
    return (
      <img
        src={club.logo}
        alt={club.name}
        style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', marginRight: 10, border: '2px solid #dbe7db', flexShrink: 0 }}
      />
    )
  }
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: 36, height: 36, borderRadius: '50%', background: '#1f6e3a',
      color: '#fff', fontWeight: '700', fontSize: 13, marginRight: 10, flexShrink: 0,
    }}>{initials}</span>
  )
}

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
                    <td style={{ display: 'flex', alignItems: 'center' }}>
                      <ClubAvatar club={club} />
                      {club.name}
                    </td>
                    <td>{club.city ?? '—'}</td>
                    <td>
                      <Link to={`/clubs/${club.id}`} className="btn btn-sm btn-primary">
                        Voir les infos
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
