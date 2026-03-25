import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import { getTournamentDetail } from '../../services/api'

export default function TournamentDetailPage() {
  const { id } = useParams()
  const [tournoi, setTournoi] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  useEffect(() => {
    getTournamentDetail(id)
      .then((res) => setTournoi(res.data))
      .catch(() => setError('Tournoi introuvable.'))
      .finally(() => setLoading(false))
  }, [id])

  const matchsAVenir   = tournoi?.matches?.filter((m) => m.status === 'scheduled' || m.status === 'upcoming') ?? []
  const anciensMatchs  = tournoi?.matches?.filter((m) => m.status === 'finished') ?? []

  return (
    <Layout>
      {loading && <p className="loading-text">Chargement...</p>}
      {error   && <div className="alert alert-danger">{error}</div>}

      {tournoi && (
        <>
          <div className="hero-section">
            <h1>{tournoi.name}</h1>
            {tournoi.startDate && (
              <p><strong>Date de début :</strong> {tournoi.startDate}</p>
            )}
          </div>

          {tournoi.description && (
            <div className="content-card">
              <p>{tournoi.description}</p>
            </div>
          )}

          <div className="content-card">
            <h2>Matchs à venir</h2>
            {matchsAVenir.length > 0 ? (
              <ul className="list-group">
                {matchsAVenir.map((match) => (
                  <li key={match.id} className="list-group-item">
                    <strong>{match.homeTeam}</strong> vs <strong>{match.awayTeam}</strong>
                    {match.matchDate && ` — ${match.matchDate}`}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Aucun match à venir pour le moment.</p>
            )}
          </div>

          <div className="content-card">
            <h2>Anciens matchs</h2>
            {anciensMatchs.length > 0 ? (
              <ul className="list-group">
                {anciensMatchs.map((match) => (
                  <li key={match.id} className="list-group-item">
                    <strong>{match.homeTeam}</strong> vs <strong>{match.awayTeam}</strong>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Aucun match passé pour le moment.</p>
            )}
          </div>

          <div style={{ marginTop: '1rem' }}>
            <Link to="/tournois" className="btn btn-secondary">← Retour à la liste</Link>
          </div>
        </>
      )}
    </Layout>
  )
}
