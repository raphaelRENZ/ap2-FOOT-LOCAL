import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import { getTournaments } from '../../services/api'

function TournamentAvatar({ tournoi }) {
  const initials = tournoi.name
    ? tournoi.name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
    : '?'
  if (tournoi.logo) {
    return (
      <img
        src={tournoi.logo}
        alt={tournoi.name}
        style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', marginBottom: 8, border: '2px solid #dbe7db' }}
      />
    )
  }
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: 44, height: 44, borderRadius: '50%', background: '#134b2a',
      color: '#fff', fontWeight: '700', fontSize: 15, marginBottom: 8,
    }}>{initials}</span>
  )
}

export default function TournamentListPage() {
  const [tournois, setTournois] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')

  useEffect(() => {
    getTournaments()
      .then((res) => setTournois(res.data ?? []))
      .catch(() => setError('Impossible de charger les tournois.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <Layout>
      <div className="hero-section">
        <h1>Liste des tournois</h1>
      </div>

      {loading && <p className="loading-text">Chargement...</p>}
      {error   && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && (
        tournois.length > 0 ? (
          <div className="content-grid">
            {tournois.map((tournoi) => (
              <div key={tournoi.id} className="content-card" style={{ textAlign: 'center' }}>
                <TournamentAvatar tournoi={tournoi} />
                <h2>{tournoi.name}</h2>
                {tournoi.season && <p><em>Saison {tournoi.season}</em></p>}
                {tournoi.startDate && <p>Date de début : {tournoi.startDate}</p>}
                <p className="tournament-status">{tournoi.status}</p>
                <Link to={`/tournois/${tournoi.id}`} className="btn btn-primary">
                  Voir les infos
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="content-card">
            <p>Aucun tournoi disponible pour le moment.</p>
          </div>
        )
      )}
    </Layout>
  )
}
