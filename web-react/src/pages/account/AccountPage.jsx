import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import { useAuth } from '../../context/AuthContext'

export default function AccountPage() {
  const { profile, isAdmin } = useAuth()

  return (
    <Layout>
      <div className="hero-section">
        <h1>Mon compte</h1>
      </div>

      <div className="content-card">
        <h2>Informations personnelles</h2>
        {profile ? (
          <>
            {(profile.firstName || profile.lastName) && (
              <p><strong>Nom complet :</strong> {profile.firstName} {profile.lastName}</p>
            )}
            <p><strong>Email :</strong> {profile.email}</p>
            {profile.phone && (
              <p><strong>Téléphone :</strong> {profile.phone}</p>
            )}
            <div style={{ marginTop: '1rem' }}>
              <button className="btn btn-primary">Modifier mes informations</button>
            </div>
          </>
        ) : (
          <p>Chargement du profil...</p>
        )}
      </div>

      <div className="content-grid">
        <div className="content-card">
          <h2>Mes clubs favoris</h2>
          <p>Gérez vos clubs préférés et activez les notifications.</p>
          <Link to="/compte/favoris" className="btn btn-primary">Accéder</Link>
        </div>

        {isAdmin && (
          <div className="content-card" style={{ borderLeft: '4px solid #1b5e20' }}>
            <h2>Dashboard Admin</h2>
            <p>Gérez les clubs, tournois, matchs et utilisateurs.</p>
            <Link to="/admin" className="btn btn-primary">Accéder au dashboard</Link>
          </div>
        )}
      </div>
    </Layout>
  )
}
