import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import { getClubDetail } from '../../services/api'

export default function ClubDetailPage() {
  const { id } = useParams()
  const [club, setClub]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState('')

  useEffect(() => {
    getClubDetail(id)
      .then((res) => setClub(res.data))
      .catch(() => setError('Club introuvable.'))
      .finally(() => setLoading(false))
  }, [id])

  return (
    <Layout>
      {loading && <p className="loading-text">Chargement...</p>}
      {error   && <div className="alert alert-danger">{error}</div>}

      {club && (
        <>
          <div className="hero-section" style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            {club.logo ? (
              <img src={club.logo} alt={club.name} style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '3px solid #1f6e3a' }} />
            ) : (
              <span style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: 64, height: 64, borderRadius: '50%', background: '#1f6e3a',
                color: '#fff', fontWeight: '700', fontSize: 22,
              }}>
                {club.name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()}
              </span>
            )}
            <h1>{club.name}</h1>
          </div>

          <div className="content-card">
            <h2>Informations</h2>
            {club.city && <p><strong>Ville :</strong> {club.city}{club.country ? ` (${club.country})` : ''}</p>}
            {club.stadium && <p><strong>Stade :</strong> {club.stadium}</p>}
            {club.colors && <p><strong>Couleurs :</strong> {club.colors}</p>}
            {club.founded_year && <p><strong>Fondé en :</strong> {club.founded_year}</p>}
            {club.description && <p><strong>Description :</strong> {club.description}</p>}
          </div>

          <div className="content-card">
            <h2>Liste des joueurs</h2>
            {club.players && club.players.length > 0 ? (
              <table className="table">
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Prénom</th>
                    <th>Poste</th>
                    <th>N°</th>
                  </tr>
                </thead>
                <tbody>
                  {club.players.map((joueur) => (
                    <tr key={joueur.id}>
                      <td>{joueur.lastName}</td>
                      <td>{joueur.firstName}</td>
                      <td>{joueur.position}</td>
                      <td>{joueur.jerseyNumber}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>Aucun joueur enregistré pour ce club.</p>
            )}
          </div>

          <div style={{ marginTop: '1rem' }}>
            <Link to="/clubs" className="btn btn-secondary">← Retour à la liste</Link>
          </div>
        </>
      )}
    </Layout>
  )
}
