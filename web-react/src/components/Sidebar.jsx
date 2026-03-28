import { useLocation } from 'react-router-dom'

export default function Sidebar({ children }) {
  const location = useLocation()

  // Liste des pages où la sidebar ne doit PAS s'afficher
  const hiddenOnPaths = ['/connexion', '/inscription']

  // Si la page actuelle est dans la liste, on n'affiche rien
  if (hiddenOnPaths.includes(location.pathname)) {
    return null
  }

  // Contenu par défaut si aucun contenu spécifique n'est fourni
  const defaultContent = (
    <>
      <div className="sidebar-item">
        <h3>Info 1</h3>
        <p>Placeholder info</p>
      </div>
      <div className="sidebar-item">
        <h3>Info 2</h3>
        <p>Placeholder info</p>
      </div>
      <div className="sidebar-item">
        <h3>Info 3</h3>
        <p>Placeholder info</p>
      </div>
    </>
  )

  return (
    <aside className="sidebar">
      {/* Affiche le contenu spécifique s'il existe, sinon le contenu par défaut */}
      {children ?? defaultContent}
    </aside>
  )
}
