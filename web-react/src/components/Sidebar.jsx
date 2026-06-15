import { useEffect, useState } from 'react'
import { getNews } from '../services/api'

export default function Sidebar({ children }) {
  const [items, setItems] = useState([])
  const [expandedId, setExpandedId] = useState(null)

  useEffect(() => {
    getNews(3)
      .then((res) => setItems(res.data ?? []))
      .catch(() => setItems([]))
  }, [])

  function toggle(id) {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  const defaultContent = items.length > 0 ? (
    <>
      {items.map((item) => {
        const isOpen = expandedId === item.id
        return (
          <div className="sidebar-item" key={item.id} style={{ transition: 'all .3s' }}>
            {item.imageUrl ? <img src={item.imageUrl} alt={item.title} className="sidebar-news-image" /> : null}
            <h3>{item.title}</h3>
            {item.subtitle ? <p className="sidebar-subtitle">{item.subtitle}</p> : null}
            {isOpen ? (
              <p style={{ marginTop: '0.5rem', color: '#444', lineHeight: '1.5', whiteSpace: 'pre-wrap', fontSize: '.9rem' }}>{item.description}</p>
            ) : null}
            <button
              onClick={() => toggle(item.id)}
              className="btn btn-primary btn-sm"
              style={{ marginTop: '0.5rem' }}
            >
              {isOpen ? 'Voir moins' : 'Voir plus'}
            </button>
          </div>
        )
      })}
    </>
  ) : (
    <div className="sidebar-item">
      <h3>Actualites</h3>
      <p>Aucune actualite publiee pour le moment.</p>
    </div>
  )

  return (
    <aside className="sidebar">
      {children ?? defaultContent}
    </aside>
  )
}
