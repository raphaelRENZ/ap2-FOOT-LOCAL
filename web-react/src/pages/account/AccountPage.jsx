import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Layout from '../../components/Layout'
import { useAuth } from '../../context/AuthContext'
import { deleteMyAccount } from '../../services/api'

const deletionReasons = [
  { value: 'Trop de notifications', label: 'Trop de notifications' },
  { value: 'Je n’utilise plus le service', label: 'Je n’utilise plus le service' },
  { value: 'Je souhaite créer un autre compte', label: 'Je souhaite créer un autre compte' },
  { value: 'Préoccupations liées à la confidentialité', label: 'Préoccupations liées à la confidentialité' },
  { value: 'Autre', label: 'Autre' },
]

export default function AccountPage() {
  const { profile, isAdmin, logout } = useAuth()
  const navigate = useNavigate()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [successDialogOpen, setSuccessDialogOpen] = useState(false)
  const [selectedReason, setSelectedReason] = useState('')
  const [details, setDetails] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const selectedReasonLabel = useMemo(() => {
    return deletionReasons.find((reason) => reason.value === selectedReason)?.label ?? ''
  }, [selectedReason])

  function resetDeleteFlow() {
    setDeleteDialogOpen(false)
    setConfirmDialogOpen(false)
    setSelectedReason('')
    setDetails('')
    setError('')
    setSubmitting(false)
  }

  function openDeleteFlow() {
    setError('')
    setDeleteDialogOpen(true)
  }

  function continueToConfirmation() {
    if (!selectedReason) {
      setError('Choisissez une raison avant de continuer.')
      return
    }

    setError('')
    setDeleteDialogOpen(false)
    setConfirmDialogOpen(true)
  }

  async function confirmDeletion() {
    if (!selectedReason) return

    setSubmitting(true)
    setError('')

    try {
      await deleteMyAccount({ reason: selectedReason, details })
      logout()
      setConfirmDialogOpen(false)
      setSuccessDialogOpen(true)
    } catch (exception) {
      setError(exception?.message ?? 'La suppression du compte a échoué.')
      setConfirmDialogOpen(false)
      setDeleteDialogOpen(true)
    } finally {
      setSubmitting(false)
    }
  }

  function handleReturnHome() {
    setSuccessDialogOpen(false)
    navigate('/')
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
            <div className="account-actions" style={{ marginTop: '1rem' }}>
              <button className="btn btn-primary" type="button">Modifier mes informations</button>
              <button className="btn btn-danger" type="button" onClick={openDeleteFlow}>Supprimer mon compte</button>
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

        {deleteDialogOpen && (
          <div className="modal-backdrop" role="presentation" onClick={resetDeleteFlow}>
            <div className="modal-card modal-card-danger" role="dialog" aria-modal="true" aria-labelledby="delete-account-title" onClick={(event) => event.stopPropagation()}>
              <h2 id="delete-account-title">Supprimer mon compte</h2>
              <p className="modal-text">
                Cette action va supprimer définitivement votre compte et envoyer un email de confirmation à <strong>{profile?.email}</strong>.
              </p>

              <div className="modal-section">
                <p className="modal-label">Raison de la suppression</p>
                <div className="reason-list">
                  {deletionReasons.map((reason) => (
                    <label key={reason.value} className={`reason-item ${selectedReason === reason.value ? 'is-selected' : ''}`}>
                      <input
                        type="radio"
                        name="deletionReason"
                        value={reason.value}
                        checked={selectedReason === reason.value}
                        onChange={() => setSelectedReason(reason.value)}
                      />
                      <span>{reason.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="modal-section">
                <label className="modal-label" htmlFor="deletion-details">Ajoutez un commentaire si vous le souhaitez</label>
                <textarea
                  id="deletion-details"
                  className="form-control"
                  value={details}
                  onChange={(event) => setDetails(event.target.value)}
                  placeholder="Dites-nous ce qui pourrait être amélioré..."
                  rows="4"
                />
              </div>

              {error && <p className="modal-error">{error}</p>}

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={resetDeleteFlow}>
                  Annuler
                </button>
                <button type="button" className="btn btn-danger" onClick={continueToConfirmation}>
                  Continuer
                </button>
              </div>
            </div>
          </div>
        )}

        {confirmDialogOpen && (
          <div className="modal-backdrop" role="presentation" onClick={resetDeleteFlow}>
            <div className="modal-card modal-card-danger" role="dialog" aria-modal="true" aria-labelledby="confirm-delete-title" onClick={(event) => event.stopPropagation()}>
              <h2 id="confirm-delete-title">Êtes-vous sûr ?</h2>
              <p className="modal-text">
                Vous êtes sur le point de supprimer définitivement votre compte. Cette action est irréversible.
              </p>

              <div className="modal-summary">
                <p><strong>Raison :</strong> {selectedReasonLabel}</p>
                {details && <p><strong>Détail :</strong> {details}</p>}
              </div>

              {error && <p className="modal-error">{error}</p>}

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => { setConfirmDialogOpen(false); setDeleteDialogOpen(true) }}>
                  Annuler
                </button>
                <button type="button" className="btn btn-danger" onClick={confirmDeletion} disabled={submitting}>
                  {submitting ? 'Suppression...' : 'Confirmer la suppression'}
                </button>
              </div>
            </div>
          </div>
        )}

        {successDialogOpen && (
          <div className="modal-backdrop" role="presentation" onClick={handleReturnHome}>
            <div className="modal-card" role="dialog" aria-modal="true" aria-labelledby="success-delete-title" onClick={(event) => event.stopPropagation()}>
              <h2 id="success-delete-title">Compte supprimé</h2>
              <p className="modal-text">
                Votre compte a bien été supprimé. Un email de confirmation a été envoyé si le service de messagerie est disponible.
              </p>
              <div className="modal-actions">
                <button type="button" className="btn btn-primary" onClick={handleReturnHome}>
                  Retour à l’accueil
                </button>
              </div>
            </div>
          </div>
        )}
    </Layout>
  )
}
