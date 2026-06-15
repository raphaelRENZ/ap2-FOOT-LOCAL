import Header from './Header'
import Sidebar from './Sidebar'

export default function Layout({ children, sidebar }) {
  const hasSidebar = sidebar !== false

  return (
    <>
      <Header />
      <div className={`container ${hasSidebar ? '' : 'no-sidebar'}`.trim()}>
        <main className="main-content">
          {children}
        </main>
        {hasSidebar ? <Sidebar>{sidebar}</Sidebar> : null}
      </div>
      <footer className="main-footer">
        <p>&copy; La Maison des Ligues</p>
      </footer>
    </>
  )
}
