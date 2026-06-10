import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import Layout from '../../../components/Layout'
import { adminGetClubs, adminCreateClub, adminUpdateClub } from '../../../services/api'
import { useAuth } from '../../../context/AuthContext'

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? ''
const EMPTY = { name: '', city: '', country: 'France', stadium: '', colors: '', foundedYear: '', logo: '', description: '' }
const labelStyle = { display: 'block', fontWeight: '600', marginBottom: '4px' }
const inputStyle  = { width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }

export default function AdminClubFormPage() {
  const { id }    = useParams()
  const isEdit    = Boolean(id)
  const navigate  = useNavigate()
  const { token } = useAuth()

  const [form, setForm]             = useState(EMPTY)
  const [loading, setLoading]       = useState(isEdit)
  const [saving, setSaving]         = useState(false)
  const [error, setError]           = useState('')
  const [uploading, setUploading]   = useState(false)
  const [uploadError, setUploadError] = useState('')

  useEffect(() => {
    if (!isEdit) return
    adminGetClubs()
      .then((res) => {
        const club = (res.data ?? []).find((c) => c.id === parseInt(id))
        if (club) setForm({ ...EMPTY, ...club, foundedYear: club.foundedYear ?? '' })
      })
      .catch(() => setError('Club introuvable.'))
      .finally(() => setLoading(false))
  }, [id, isEdit])

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadError('')
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('logo', file)
      const headers = token ? { Authorization: `Bearer ${token}` } : {}
      const res = await fetch(`${API_BASE}/api/admin/upload/club-logo`, { method: 'POST', headers, body: fd })
      const json = await res.json()
      if (!res.ok) throw new Error(json.message ?? 'Erreur upload')
      setForm((prev) => ({ ...prev, logo: json.url }))
    } catch (err) {
      setUploadError(err.message ?? "Erreur lors de l'upload.")
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      if (isEdit) {
        await adminUpdateClub(id, form)
      } else {
        await adminCreateClub(form)
      }
      navigate('/admin/clubs')
    } catch (err) {
      setError(err.message ?? 'Erreur lors de la sauvegarde.')
    } finally {
      setSaving(false)
    }
  }

  const logoSrc = form.logo
    ? (form.logo.startsWith('http') ? form.logo : `${API_BASE}${form.logo}`)
    : null

  return (
    <Layout>
      <div className="hero-section">
        <h1>⚽ {isEdit ? 'Modifier le club' : 'Nouveau club'}</h1>
        <p><Link to="/admin/clubs" style={{ color: 'rgba(255,255,255,.8)' }}>← Retour à la liste</Link></p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {loading && <p>Chargement...</p>}

      {!loading && (
        <div className="content-card" style={{ maxWidth: '700px' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={labelStyle}>Nom du club *</label>
                <input name="name" value={form.name} onChange={handleChange} required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Ville</label>
                <input name="city" value={form.city} onChange={handleChange} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Pays</label>
                <input name="country" value={form.country} onChange={handleChange} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Stade</label>
                <input name="stadium" value={form.stadium} onChange={handleChange} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Couleurs</label>
                <input name="colors" value={form.colors} onChange={handleChange} placeholder="ex: rouge et blanc" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Année de fondation</label>
                <input name="foundedYear" value={form.foundedYear} onChange={handleChange} type="number" min="1800" max="2100" style={inputStyle} />
              </div>
              <div style={{ gridColumn: '1/-1', background: '#f8fdf8', border: '1px dashed #a3c9a8', borderRadius: 8, padding: 16 }}>
                <p style={{ margin: '0 0 12px', fontWeight: 700, color: '#134b2a', fontSize: 15 }}>Logo du club</p>

                {logoSrc && (
                  <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
                    <img src={logoSrc} alt="Aperçu" style={{ height: 72, width: 72, borderRadius: '50%', objectFit: 'cover', border: '3px solid #1f6e3a' }} />
                    <div>
                      <p style={{ margin: 0, fontWeight: 600, color: '#1f6e3a' }}>Logo actuel</p>
                      <button type="button" onClick={() => setForm((p) => ({ ...p, logo: '' }))}
                        style={{ background: 'none', border: 'none', color: '#b91c1c', cursor: 'pointer', fontWeight: 700, padding: 0 }}>
                        ✕ Supprimer
                      </button>
                    </div>
                  </div>
                )}

                <label style={labelStyle}>📁 Importer depuis votre ordinateur</label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
                  onChange={handleFileChange}
                  disabled={uploading}
                  style={{ display: 'block', marginBottom: 6 }}
                />
                {uploading && <p style={{ color: '#1f6e3a', margin: '4px 0' }}>⏳ Upload en cours...</p>}
                {uploadError && <p style={{ color: '#b91c1c', margin: '4px 0' }}>{uploadError}</p>}

                <label style={{ ...labelStyle, marginTop: 14 }}>🔗 Ou coller une URL d'image</label>
                <input
                  name="logo"
                  value={form.logo ?? ''}
                  onChange={handleChange}
                  placeholder="https://exemple.com/logo.png"
                  style={inputStyle}
                />
                <p style={{ margin: '4px 0 0', fontSize: 12, color: '#667f70' }}>
                  Formats acceptés : JPG, PNG, GIF, WEBP, SVG — max 2 Mo
                </p>
              </div>

              <div style={{ gridColumn: '1/-1' }}>
                <label style={labelStyle}>Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="4"
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </div>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn btn-primary" disabled={saving || uploading}>
                {saving ? 'Sauvegarde...' : (isEdit ? 'Enregistrer' : 'Créer le club')}
              </button>
              <Link to="/admin/clubs" className="btn btn-secondary">Annuler</Link>
            </div>
          </form>
        </div>
      )}
    </Layout>
  )
}
