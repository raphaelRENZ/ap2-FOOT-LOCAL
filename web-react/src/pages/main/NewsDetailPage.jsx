import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Layout from '../../components/Layout'
import { getNewsDetail } from '../../services/api'

export default function NewsDetailPage() {
  const { id } = useParams()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getNewsDetail(id)
      .then((res) => setItem(res.data))
      .catch((e) => setError(e.message || 'Actualite introuvable.'))
      .finally(() => setLoading(false))
  }, [id])

  return (
    <Layout>
      {loading ? <p className="loading-text">Chargement...</p> : null}
      {!loading && error ? <div className="alert alert-danger">{error}</div> : null}

      {item ? (
        <article className="content-card">
          {item.imageUrl ? <img src={item.imageUrl} alt={item.title} className="news-detail-image" /> : null}
          <h1 style={{ marginBottom: '0.5rem' }}>{item.title}</h1>
          {item.subtitle ? <p className="sidebar-subtitle" style={{ marginBottom: '1rem' }}>{item.subtitle}</p> : null}
          <p style={{ whiteSpace: 'pre-wrap' }}>{item.description}</p>
          <div style={{ marginTop: '1rem' }}>
            <Link to="/actus" className="btn btn-secondary btn-sm">Retour aux actualites</Link>
          </div>
        </article>
      ) : null}
    </Layout>
  )
}
