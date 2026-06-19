import { useState } from 'react'
import { deleteMe } from '../services/api'

export default function DeleteAccountModal({ isOpen, onClose, onSuccess }) {
  const [selectedReason, setSelectedReason] = useState('')
  const [comment, setComment] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const reasons = [
    { value: 'no_longer_use', label: 'Je n\'utilise plus l\'application' },
    { value: 'privacy_concerns', label: 'Problèmes de confidentialité' },
    { value: 'too_complex', label: 'L\'application est trop complexe' },
    { value: 'personal', label: 'Raisons personnelles' },
    { value: 'other', label: 'Autre' },
  ]

  const handleDelete = async () => {
    if (!selectedReason) {
      setError('Veuillez sélectionner un motif')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      await deleteMe({
        reason: selectedReason,
        comment: comment || null,
      })

      onSuccess()
    } catch (err) {
      setError(err.message || 'Erreur lors de la suppression du compte')
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Supprimer mon compte</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <p style={{ color: '#991b1b', marginBottom: '1.5rem' }}>
            ⚠️ <strong>Attention :</strong> Cette action est irréversible. Tous vos données seront supprimées.
          </p>

          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="reason-select" style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#1a202c' }}>
              Motif de suppression :
            </label>
            <select
              id="reason-select"
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '1rem',
                backgroundColor: '#ffffff',
                cursor: 'pointer',
              }}
            >
              <option value="">-- Sélectionnez un motif --</option>
              {reasons.map((reason) => (
                <option key={reason.value} value={reason.value}>
                  {reason.label}
                </option>
              ))}
            </select>
          </div>

          {selectedReason === 'other' && (
            <div style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="comment-input" style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#1a202c' }}>
                Commentaire (optionnel) :
              </label>
              <textarea
                id="comment-input"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Dites-nous pourquoi..."
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  backgroundColor: '#ffffff',
                  minHeight: '100px',
                  fontFamily: 'inherit',
                }}
              />
            </div>
          )}

          {error && (
            <div style={{
              padding: '12px 16px',
              backgroundColor: '#fef2f2',
              color: '#991b1b',
              borderLeft: '4px solid #ef4444',
              borderRadius: '8px',
              marginBottom: '1.5rem',
              fontSize: '0.95rem',
            }}>
              {error}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button
            onClick={onClose}
            className="btn btn-secondary"
            disabled={isLoading}
            style={{ cursor: isLoading ? 'not-allowed' : 'pointer' }}
          >
            Annuler
          </button>
          <button
            onClick={handleDelete}
            className="btn btn-danger"
            disabled={isLoading}
            style={{
              backgroundColor: '#dc2626',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            {isLoading ? 'Suppression en cours...' : 'Supprimer définitivement'}
          </button>
        </div>
      </div>
    </div>
  )
}
