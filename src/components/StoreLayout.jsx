import { Link, Outlet } from 'react-router-dom'

function StoreLayout() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <Link className="site-brand" to="/" aria-label="Leegality Store home">
          Leegality Store
        </Link>
      </header>

      <main className="site-main">
        <Outlet />
      </main>
    </div>
  )
}

export default StoreLayout
