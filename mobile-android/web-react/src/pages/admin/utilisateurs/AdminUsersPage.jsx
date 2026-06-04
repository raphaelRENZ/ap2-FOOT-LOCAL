import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../../../components/Layout'
import { adminGetUtilisateurs, adminDeleteUtilisateur } from '../../../services/api'
import { useAuth } from '../../../context/AuthContext'

export default function AdminUsersPage() {
  const { profile: me } = useAuth()
  const [users, setUsers]   = useState([])
  const [loading, setLoading] = useState(true)
  const [flash, setFlash]   = useState(null)

  useEffect(() => {
    adminGetUtilisateurs()
      .then((res) => setUsers(res.data ?? []))
      .catch(() => setFlash({ type: 'error', msg: 'Impossible de charger les utilisateurs.' }))
      .finally(() => setLoading(false))
  }, [])

  async function handleDelete(id) {
    if (!confirm('Supprimer cet utilisateur ?')) return
    try {
      await adminDeleteUtilisateur(id)
      setUsers((prev) => prev.filter((u) => u.id !== id))
      setFlash({ type: 'success', msg: 'Utilisateur supprimé.' })
    } catch (err) {
      setFlash({ type: 'error', msg: err.message ?? 'Erreur.' })
    }
  }

  return (
    <Layout>
      <div className="hero-section">
        <h1>👥 Gestion des utilisateurs</h1>
        <p><Link to="/admin" style={{ color: 'rgba(255,255,255,.8)' }}>← Tableau de bord</Link></p>
      </div>

      {flash && (
        <div style={{ padding: '10px 15px', marginBottom: '10px', borderRadius: '5px', background: flash.type === 'success' ? '#d4edda' : '#f8d7da', color: flash.type === 'success' ? '#155724' : '#721c24' }}>
          {flash.msg}
        </div>
      )}

      <div className="content-card">
        <h2 style={{ marginBottom: '15px' }}>Liste des utilisateurs ({users.length})</h2>

        {loading && <p>Chargement...</p>}
        {!loading && users.length === 0 && <p style={{ color: '#666' }}>Aucun utilisateur enregistré.</p>}

        {!loading && users.length > 0 && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f5f5f5', textAlign: 'left' }}>
                  {['Nom', 'Email', 'Rôles', 'Actif', 'Vérifié', 'Actions'].map((h) => (
                    <th key={h} style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '10px', fontWeight: 'bold' }}>
                      {user.firstName ?? ''} {user.lastName ?? ''}
                      {me?.id === user.id && (
                        <span style={{ fontSize: '.75rem', background: '#6c757d', color: 'white', padding: '1px 6px', borderRadius: '10px', marginLeft: '4px' }}>vous</span>
                      )}
                    </td>
                    <td style={{ padding: '10px' }}>{user.email}</td>
                    <td style={{ padding: '10px' }}>
                      {(user.roles ?? []).map((role) => (
                        <span key={role} style={{ background: role === 'ROLE_ADMIN' ? '#dc3545' : '#17a2b8', color: 'white', padding: '1px 7px', borderRadius: '10px', fontSize: '.8rem', marginRight: '2px' }}>
                          {role === 'ROLE_ADMIN' ? 'Admin' : 'User'}
                        </span>
                      ))}
                    </td>
                    <td style={{ padding: '10px', color: user.isActive ? '#28a745' : '#dc3545' }}>
                      {user.isActive ? '✓' : '✗'}
                    </td>
                    <td style={{ padding: '10px', color: user.isVerified ? '#28a745' : '#dc3545' }}>
                      {user.isVerified ? '✓' : '✗'}
                    </td>
                    <td style={{ padding: '10px', display: 'flex', gap: '6px' }}>
                      <Link to={`/admin/utilisateurs/${user.id}/edit`} className="btn btn-secondary" style={{ fontSize: '.85rem', padding: '4px 10px' }}>Modifier</Link>
                      {me?.id !== user.id && (
                        <button
                          onClick={() => handleDelete(user.id)}
                          style={{ background: '#dc3545', color: 'white', border: 'none', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '.85rem' }}
                        >
                          Supprimer
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  )
}
