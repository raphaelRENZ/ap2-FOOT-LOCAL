import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute'

// Pages publiques
import HomePage               from './pages/main/HomePage'
import LoginPage              from './pages/security/LoginPage'
import RegisterPage           from './pages/registration/RegisterPage'
import ClubListPage           from './pages/club/ClubListPage'
import ClubDetailPage         from './pages/club/ClubDetailPage'
import TournamentListPage     from './pages/tournament/TournamentListPage'
import TournamentDetailPage   from './pages/tournament/TournamentDetailPage'
import ContactPage            from './pages/contact/ContactPage'

// Pages protégées (utilisateur connecté)
import AccountPage  from './pages/account/AccountPage'
import FavorisPage  from './pages/account/FavorisPage'

// Pages admin
import AdminDashboardPage   from './pages/admin/AdminDashboardPage'
import AdminClubsPage       from './pages/admin/clubs/AdminClubsPage'
import AdminClubFormPage    from './pages/admin/clubs/AdminClubFormPage'
import AdminTournoisPage    from './pages/admin/tournois/AdminTournoisPage'
import AdminTournoiFormPage from './pages/admin/tournois/AdminTournoiFormPage'
import AdminMatchsPage      from './pages/admin/matchs/AdminMatchsPage'
import AdminMatchFormPage   from './pages/admin/matchs/AdminMatchFormPage'
import AdminUsersPage       from './pages/admin/utilisateurs/AdminUsersPage'
import AdminUserEditPage    from './pages/admin/utilisateurs/AdminUserEditPage'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Publiques */}
          <Route path="/"            element={<HomePage />} />
          <Route path="/connexion"   element={<LoginPage />} />
          <Route path="/inscription" element={<RegisterPage />} />
          <Route path="/clubs"       element={<ClubListPage />} />
          <Route path="/clubs/:id"   element={<ClubDetailPage />} />
          <Route path="/tournois"    element={<TournamentListPage />} />
          <Route path="/tournois/:id" element={<TournamentDetailPage />} />
          <Route path="/contact"     element={<ContactPage />} />

          {/* Protégées (utilisateur connecté) */}
          <Route path="/compte" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
          <Route path="/compte/favoris" element={<ProtectedRoute><FavorisPage /></ProtectedRoute>} />

          {/* Admin */}
          <Route path="/admin" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
          <Route path="/admin/clubs" element={<AdminRoute><AdminClubsPage /></AdminRoute>} />
          <Route path="/admin/clubs/new" element={<AdminRoute><AdminClubFormPage /></AdminRoute>} />
          <Route path="/admin/clubs/:id/edit" element={<AdminRoute><AdminClubFormPage /></AdminRoute>} />
          <Route path="/admin/tournois" element={<AdminRoute><AdminTournoisPage /></AdminRoute>} />
          <Route path="/admin/tournois/new" element={<AdminRoute><AdminTournoiFormPage /></AdminRoute>} />
          <Route path="/admin/tournois/:id/edit" element={<AdminRoute><AdminTournoiFormPage /></AdminRoute>} />
          <Route path="/admin/matchs" element={<AdminRoute><AdminMatchsPage /></AdminRoute>} />
          <Route path="/admin/matchs/new" element={<AdminRoute><AdminMatchFormPage /></AdminRoute>} />
          <Route path="/admin/matchs/:id/edit" element={<AdminRoute><AdminMatchFormPage /></AdminRoute>} />
          <Route path="/admin/utilisateurs" element={<AdminRoute><AdminUsersPage /></AdminRoute>} />
          <Route path="/admin/utilisateurs/:id/edit" element={<AdminRoute><AdminUserEditPage /></AdminRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App


