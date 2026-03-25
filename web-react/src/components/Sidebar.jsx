export default function Sidebar({ children }) {
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
      {children ?? defaultContent}
    </aside>
  )
}
