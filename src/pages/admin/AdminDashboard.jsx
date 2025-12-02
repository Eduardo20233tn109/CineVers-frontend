import AdminLayout from '../../components/AdminLayout'

function AdminDashboard() {
  return (
    <AdminLayout 
      title="Panel de Administración" 
      subtitle="Bienvenido al sistema de gestión CineVers"
    >
      <div className="stats-grid">
        <div className="stat-card">
          <h4>Total de Películas</h4>
          <div className="stat-value">24</div>
          <div className="stat-change positive">
            <i className="fa-solid fa-arrow-trend-up"></i> +3 este mes
          </div>
        </div>
        
        <div className="stat-card">
          <h4>Salas Activas</h4>
          <div className="stat-value">8</div>
          <div className="stat-change neutral">
            <i className="fa-solid fa-minus"></i> Sin cambios
          </div>
        </div>
        
        <div className="stat-card">
          <h4>Clientes Registrados</h4>
          <div className="stat-value">1,247</div>
          <div className="stat-change positive">
            <i className="fa-solid fa-arrow-trend-up"></i> +52 esta semana
          </div>
        </div>
        
        <div className="stat-card">
          <h4>Ventas del Día</h4>
          <div className="stat-value">$12,450</div>
          <div className="stat-change positive">
            <i className="fa-solid fa-arrow-trend-up"></i> +15% vs ayer
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>Acceso Rápido</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <a href="/admin/peliculas" style={{ textDecoration: 'none' }}>
            <div className="stat-card">
              <i className="fa-solid fa-film" style={{ fontSize: '2rem', color: '#8b5cf6', marginBottom: '0.5rem' }}></i>
              <h4>Gestionar Películas</h4>
            </div>
          </a>
          <a href="/admin/salas" style={{ textDecoration: 'none' }}>
            <div className="stat-card">
              <i className="fa-solid fa-couch" style={{ fontSize: '2rem', color: '#8b5cf6', marginBottom: '0.5rem' }}></i>
              <h4>Gestionar Salas</h4>
            </div>
          </a>
          <a href="/admin/clientes" style={{ textDecoration: 'none' }}>
            <div className="stat-card">
              <i className="fa-solid fa-users" style={{ fontSize: '2rem', color: '#8b5cf6', marginBottom: '0.5rem' }}></i>
              <h4>Ver Clientes</h4>
            </div>
          </a>
          <a href="/admin/ventas" style={{ textDecoration: 'none' }}>
            <div className="stat-card">
              <i className="fa-solid fa-chart-line" style={{ fontSize: '2rem', color: '#8b5cf6', marginBottom: '0.5rem' }}></i>
              <h4>Reportes de Ventas</h4>
            </div>
          </a>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminDashboard
