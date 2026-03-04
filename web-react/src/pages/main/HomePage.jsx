import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'

export default function HomePage() {
  return (
    <Layout>
      <section className="hero-section">
        <h1>Accueil</h1>
        <p>Bienvenue sur le portail du football local</p>
      </section>

      <div className="content-grid">
        <div className="content-card">
          <h2>Actu Foot</h2>
          <p>Retrouvez toutes les dernières actualités du football local et régional.</p>
        </div>

        <div className="content-card">
          <h2>Prochains Matchs</h2>
          <p>Calendrier des rencontres à venir dans votre région.</p>
        </div>

        <div className="content-card">
          <h2>Résultats</h2>
          <p>Consultez les scores et résultats des dernières rencontres.</p>
        </div>

        <div className="content-card">
          <h2>Classements</h2>
          <p>Suivez le classement de votre équipe favorite.</p>
        </div>
      </div>
    </Layout>
  )
}
