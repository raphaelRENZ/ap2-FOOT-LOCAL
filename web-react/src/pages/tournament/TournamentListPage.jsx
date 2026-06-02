import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import { getTournaments } from '../../services/api'

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
        <p>Consultez la liste des tournois en cours et à venir pour ne manquer aucune compétition.</p>
      </div>

      {loading && <p className="loading-text">Chargement...</p>}
      {error   && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && (
        tournois.length > 0 ? (
          <div className="content-grid">
            {tournois.map((tournoi) => (
              <div key={tournoi.id} className="content-card">
                <h2>{tournoi.name}</h2>
                {tournoi.season && <p><em>Saison {tournoi.season}</em></p>}
                {tournoi.startDate && <p>Date de début : {tournoi.startDate}</p>}
                <p className="tournament-status">{tournoi.status}</p>
                <Link to={`/tournois/${tournoi.id}`} className="btn btn-primary">
                  Voir les détails
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
