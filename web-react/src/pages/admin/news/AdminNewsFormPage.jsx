import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Layout from '../../../components/Layout'
import { adminCreateNews, adminGetNews, adminUpdateNews } from '../../../services/api'

const EMPTY = { title: '', subtitle: '', description: '', imageUrl: '', position: 1, isPublished: true }

export default function AdminNewsFormPage() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const [form, setForm] = useState(EMPTY)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEdit) {
      setLoading(false)
      return
    }

    adminGetNews()
      .then((res) => {
        const found = (res.data ?? []).find((x) => x.id === parseInt(id, 10))
        if (!found) {
          setError('Actualite introuvable.')
          return
        }

        setForm({
          title: found.title ?? '',
          subtitle: found.subtitle ?? '',
          description: found.description ?? '',
          imageUrl: found.imageUrl ?? '',
          position: found.position ?? 1,
          isPublished: !!found.isPublished,
        })
      })
      .catch((e) => setError(e.message || 'Erreur de chargement.'))
      .finally(() => setLoading(false))
  }, [id, isEdit])

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSaving(true)

    try {
      const payload = {
        ...form,
        position: Number(form.position) || 1,
      }

      if (isEdit) {
        await adminUpdateNews(id, payload)
      } else {
        await adminCreateNews(payload)
      }

      navigate('/admin/actualites')
    } catch (err) {
      setError(err.message || 'Erreur lors de la sauvegarde.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Layout>
      <div className="hero-section">
        <h1>📰 {isEdit ? 'Modifier actualite' : 'Nouvelle actualite'}</h1>
        <p><Link to="/admin/actualites" style={{ color: 'rgba(255,255,255,.8)' }}>← Retour a la liste</Link></p>
      </div>

      {error ? <div className="alert alert-danger">{error}</div> : null}
      {loading ? <p>Chargement...</p> : null}

      {!loading ? (
        <div className="content-card" style={{ maxWidth: '760px' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gap: '12px' }}>
              <div>
                <label style={L}>Titre *</label>
                <input name="title" value={form.title} onChange={handleChange} required style={I} />
              </div>

              <div>
                <label style={L}>Sous-titre</label>
                <input name="subtitle" value={form.subtitle} onChange={handleChange} style={I} />
              </div>

              <div>
                <label style={L}>Image (URL)</label>
                <input name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="https://..." style={I} />
              </div>

              <div>
                <label style={L}>Description complete *</label>
                <textarea name="description" value={form.description} onChange={handleChange} required rows={8} style={I} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={L}>Position (1,2,3...)</label>
                  <input type="number" min={1} name="position" value={form.position} onChange={handleChange} style={I} />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '24px' }}>
                  <input id="isPublished" type="checkbox" name="isPublished" checked={form.isPublished} onChange={handleChange} />
                  <label htmlFor="isPublished">Publiee</label>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Sauvegarde...' : (isEdit ? 'Enregistrer' : 'Creer actualite')}
              </button>
              <Link to="/admin/actualites" className="btn btn-secondary">Annuler</Link>
            </div>
          </form>
        </div>
      ) : null}
    </Layout>
  )
}

const L = { display: 'block', fontWeight: '600', marginBottom: '4px' }
const I = { width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }
