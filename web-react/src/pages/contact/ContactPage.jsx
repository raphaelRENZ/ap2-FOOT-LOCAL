import { useState } from 'react'
import Layout from '../../components/Layout'

const sidebarContent = (
  <div className="sidebar-item">
    <h3>Nos coordonnées</h3>
    <p><strong>123 Rue du Football</strong></p>
    <p>Téléphone : 03 00 00 00 00</p>
    <p>Email : <a href="mailto:contact@footlocal.fr">contact@footlocal.fr</a></p>
  </div>
)

export default function ContactPage() {
  const [nom, setNom]         = useState('')
  const [email, setEmail]     = useState('')
  const [objet, setObjet]     = useState('') // 1. Ajout du state pour l'objet
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    // Simulation d'envoi
    setSuccess(true)
    setNom('')
    setEmail('')
    setObjet('') // 2. On vide le champ objet après l'envoi
    setMessage('')
  }

  return (
    <Layout sidebar={sidebarContent}>
      <div className="hero-section">
        <h1>Nous contacter</h1>
      </div>

      {success && (
        <div className="alert alert-success">
          Votre message a bien été envoyé !
        </div>
      )}

      <div className="content-card">
        <h2>Formulaire de contact</h2>
        <form onSubmit={handleSubmit}>
          {/* Rubrique Nom */}
          <div className="mb-3">
            <label htmlFor="nom" className="form-label">Nom</label>
            <input
              type="text"
              className="form-control"
              id="nom"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              required
            />
          </div>

          {/* Rubrique Email */}
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

        {/* Rubrique Objet (Menu déroulant) */}
<div className="mb-3">
  <label htmlFor="objet" className="form-label">Objet de votre message</label>
  <select
    className="form-select" // On utilise form-select pour le style Bootstrap
    id="objet"
    value={objet}
    onChange={(e) => setObjet(e.target.value)}
    required
  >
    {/* Option vide par défaut */}
    <option value="" disabled>-- Choisissez un motif --</option>
    
    {/* Tes différents choix */}
    <option value="Information">Demande d'information</option>
    <option value="Club">Question sur un club</option>
    <option value="Tournoi">Problème avec un tournoi</option>
    <option value="Technique">Signaler un bug technique</option>
    <option value="Autre">Autre demande</option>
  </select>
</div>

          {/* Rubrique Message */}
          <div className="mb-3">
            <label htmlFor="message" className="form-label">Message</label>
            <textarea
              className="form-control"
              id="message"
              rows="5"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary">Envoyer</button>
        </form>
      </div>
    </Layout>
  )
}