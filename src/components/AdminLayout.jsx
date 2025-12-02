import { Link, useLocation, useNavigate } from 'react-router-dom'
import authService from '../services/authService'
import '../styles/Admin.css'

function AdminLayout({ children, title, subtitle }) {
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await authService.logout()
    navigate('/login')
  }

  const isActive = (path) => {
    return location.pathname === path ? 'active' : ''
  }

  const currentUser = authService.getCurrentUser()
  const userName = currentUser.name || 'Admin Principal'
  const userEmail = currentUser.email || 'admin@cinevers.com'

  return (
    <div className="dashboard-body">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand">
          <span><i className="fa-solid fa-crown"></i></span> CineVers Admin
        </div>
        <nav>
          <Link to="/admin/peliculas" className={`nav-item ${isActive('/admin/peliculas')}`}>
            <i className="fa-solid fa-film"></i> Películas
          </Link>
          <Link to="/admin/salas" className={`nav-item ${isActive('/admin/salas')}`}>
            <i className="fa-solid fa-couch"></i> Salas
          </Link>
          <Link to="/admin/clientes" className={`nav-item ${isActive('/admin/clientes')}`}>
            <i className="fa-solid fa-users"></i> Clientes
          </Link>
          <Link to="/admin/trabajadores" className={`nav-item ${isActive('/admin/trabajadores')}`}>
            <i className="fa-solid fa-id-card"></i> Trabajadores
          </Link>
          <Link to="/admin/administradores" className={`nav-item ${isActive('/admin/administradores')}`}>
            <i className="fa-solid fa-user-shield"></i> Administradores
          </Link>
          <Link to="/admin/ventas" className={`nav-item ${isActive('/admin/ventas')}`}>
            <i className="fa-solid fa-chart-line"></i> Ventas
          </Link>
        </nav>
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="nav-item logout-btn" style={{ width: '100%', border: 'none', background: 'none', textAlign: 'left' }}>
            <i className="fa-solid fa-right-from-bracket"></i> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Header */}
        <header className="top-header">
          <div className="header-title">
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>
          <div className="user-profile">
            <i className="fa-regular fa-bell" style={{ color: '#6b7280', fontSize: '1.2rem', cursor: 'pointer' }}></i>
            <div className="avatar">
              <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=random`} alt="Admin" />
            </div>
            <div style={{ fontSize: '0.875rem' }}>
              <div style={{ fontWeight: 600 }}>{userName}</div>
              <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>{userEmail}</div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="content-area">
          {children}
        </div>
      </main>
    </div>
  )
}

export default AdminLayout
