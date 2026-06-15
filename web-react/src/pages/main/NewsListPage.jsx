import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import { getNews } from '../../services/api'

export default function NewsListPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getNews()
      .then((res) => setItems(res.data ?? []))
      .finally(() => setLoading(false))
  }, [])

  return (
    <Layout>
      <div className="hero-section">
        <h1>Actualites</h1>
        <p>Les dernieres infos du football local</p>
      </div>

      {loading ? <p className="loading-text">Chargement...</p> : null}

      {!loading && items.length === 0 ? (
        <div className="content-card">
          <p>Aucune actualite publiee.</p>
        </div>
      ) : null}

      <div className="content-grid">
        {items.map((item) => (
          <article className="content-card" key={item.id}>
            {item.imageUrl ? <img src={item.imageUrl} alt={item.title} className="news-card-image" /> : null}
            <h2>{item.title}</h2>
            {item.subtitle ? <p className="sidebar-subtitle">{item.subtitle}</p> : null}
            <p>{(item.description ?? '').slice(0, 160)}...</p>
            <Link to={`/actus/${item.id}`} className="btn btn-primary btn-sm">Voir plus</Link>
          </article>
        ))}
      </div>
    </Layout>
  )
}
