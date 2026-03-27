import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Header() {
  const { token, isAdmin, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <header className="main-header">
      <div className="header-logo">
        <Link to="/" className="logo-link">
          <img
            src="/logo_foot_local-removebg-preview.png"
            alt="Maison des Ligues - Foot Local"
            className="logo-img"
          />
        </Link>
      </div>

      <nav className="header-nav">
        <Link to="/tournois" className="nav-btn">Tournois</Link>
        <Link to="/clubs" className="nav-btn">Club</Link>
        <Link to="/contact" className="nav-btn">Contact</Link>
        {token ? (
          <>
            <Link to="/compte" className="nav-btn">Compte</Link>
            {isAdmin && (
              <Link to="/admin" className="nav-btn nav-btn-admin">Admin</Link>
            )}
            <button onClick={handleLogout} className="nav-btn nav-btn-logout">
              Déconnexion
            </button>
          </>
        ) : (
          <Link to="/connexion" className="nav-btn">Connexion</Link>
        )}
      </nav>
    </header>
  )
}
