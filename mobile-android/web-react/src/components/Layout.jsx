import Header from './Header'
import Sidebar from './Sidebar'

export default function Layout({ children, sidebar }) {
  return (
    <>
      <Header />
      <div className="container">
        <main className="main-content">
          {children}
        </main>
        <Sidebar>{sidebar}</Sidebar>
      </div>
      <footer className="main-footer">
        <p>&copy; La Maison des Ligues</p>
      </footer>
    </>
  )
}
