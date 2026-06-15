import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import { adminGetStats } from '../../services/api'

export default function AdminDashboardPage() {
  const [stats, setStats]   = useState(null)
  const [loading, setLoading] = useState(true)
  const [flash, setFlash]   = useState(null)

  useEffect(() => {
    adminGetStats()
      .then((res) => setStats(res.data))
      .catch(() => setFlash({ type: 'error', msg: 'Impossible de charger les statistiques.' }))
      .finally(() => setLoading(false))
  }, [])

  return (
    <Layout>
      <div className="hero-section">
        <h1>Tableau de bord Administrateur</h1>
        <p>Gérez les clubs, tournois, matchs et utilisateurs de la ligue</p>
      </div>

      {flash && (
        <div style={{ padding: '10px 15px', marginBottom: '10px', borderRadius: '5px', background: flash.type === 'success' ? '#d4edda' : '#f8d7da', color: flash.type === 'success' ? '#155724' : '#721c24' }}>
          {flash.msg}
        </div>
      )}

      {loading && <p className="loading-text">Chargement...</p>}

      {stats && (
        <div className="content-grid">
          <Link to="/admin/clubs" style={{ textDecoration: 'none' }}>
            <div className="content-card" style={{ background: 'linear-gradient(135deg,#1b5e20,#2e7d32)', color: 'white', cursor: 'pointer' }}>
              <h2 style={{ color: 'white' }}>⚽ Clubs</h2>
              <p style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{stats.clubs}</p>
              <small style={{ opacity: '.8' }}>Gérer les clubs</small>
            </div>
          </Link>
          <Link to="/admin/tournois" style={{ textDecoration: 'none' }}>
            <div className="content-card" style={{ background: 'linear-gradient(135deg,#0d47a1,#1565c0)', color: 'white', cursor: 'pointer' }}>
              <h2 style={{ color: 'white' }}>🏆 Tournois</h2>
              <p style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{stats.tournois}</p>
              <small style={{ opacity: '.8' }}>Gérer les tournois</small>
            </div>
          </Link>
          <Link to="/admin/matchs" style={{ textDecoration: 'none' }}>
            <div className="content-card" style={{ background: 'linear-gradient(135deg,#e65100,#f57c00)', color: 'white', cursor: 'pointer' }}>
              <h2 style={{ color: 'white' }}>📅 Matchs</h2>
              <p style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{stats.matchs}</p>
              <small style={{ opacity: '.8' }}>Gérer les matchs</small>
            </div>
          </Link>
          <Link to="/admin/utilisateurs" style={{ textDecoration: 'none' }}>
            <div className="content-card" style={{ background: 'linear-gradient(135deg,#4a148c,#6a1b9a)', color: 'white', cursor: 'pointer' }}>
              <h2 style={{ color: 'white' }}>👥 Utilisateurs</h2>
              <p style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{stats.utilisateurs}</p>
              <small style={{ opacity: '.8' }}>Gérer les utilisateurs</small>
            </div>
          </Link>
          <Link to="/admin/actualites" style={{ textDecoration: 'none' }}>
            <div className="content-card" style={{ background: 'linear-gradient(135deg,#2f4858,#33658a)', color: 'white', cursor: 'pointer' }}>
              <h2 style={{ color: 'white' }}>📰 Actualites</h2>
              <p style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{stats.actualites ?? 0}</p>
              <small style={{ opacity: '.8' }}>Gerer les mini-actus</small>
            </div>
          </Link>
        </div>
      )}

      <div className="content-card">
        <h2>Actions rapides</h2>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
          <Link to="/admin/clubs/new" className="btn btn-primary">+ Nouveau club</Link>
          <Link to="/admin/tournois/new" className="btn btn-primary">+ Nouveau tournoi</Link>
          <Link to="/admin/matchs/new" className="btn btn-primary">+ Nouveau match</Link>
          <Link to="/admin/actualites/new" className="btn btn-primary">+ Nouvelle actualite</Link>
        </div>
      </div>
    </Layout>
  )
}
