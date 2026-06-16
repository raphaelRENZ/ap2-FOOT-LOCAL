import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import DeleteAccountModal from '../../components/DeleteAccountModal'
import { useAuth } from '../../context/AuthContext'

export default function AccountPage() {
  const { profile, isAdmin, logout } = useAuth()
  const navigate = useNavigate()
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const handleDeleteSuccess = () => {
    setIsDeleteModalOpen(false)
    logout()
    navigate('/connexion', { replace: true })
  }

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
              <Link to="/compte/modifier" className="btn btn-primary">Modifier mes informations</Link>
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

      <div style={{ marginTop: '2rem', padding: '2rem', backgroundColor: '#fef2f2', borderRadius: '12px', borderLeft: '4px solid #ef4444' }}>
        <h3 style={{ color: '#991b1b', marginBottom: '1rem' }}>Zone de danger</h3>
        <p style={{ color: '#64748b', marginBottom: '1rem' }}>
          Vous pouvez supprimer votre compte de manière permanente. Cette action est irréversible.
        </p>
        <button
          onClick={() => setIsDeleteModalOpen(true)}
          className="btn btn-danger"
          style={{ backgroundColor: '#dc2626', color: '#ffffff' }}
        >
          Supprimer mon compte
        </button>
      </div>

      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onSuccess={handleDeleteSuccess}
      />
    </Layout>
  )
}
