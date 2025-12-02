import { useState, useEffect } from 'react'
import AdminLayout from '../../components/AdminLayout'
import reportService from '../../services/reportService'

function Ventas() {
  const [salesData, setSalesData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchSalesData()
  }, [])

  const fetchSalesData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await reportService.getSalesSummary()
      setSalesData(response.data || response)
    } catch (err) {
      console.error('Error fetching sales data:', err)
      setError('Error al cargar los datos de ventas')
    } finally {
      setLoading(false)
    }
  }

  // Filter transactions by search term (client-side)
  const filteredTransactions = salesData?.transactions?.filter(transaction =>
    transaction.customer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.movie?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  return (
    <AdminLayout 
      title="Reportes de Ventas" 
      subtitle="Visualiza y analiza las ventas del cine"
    >
      {loading && (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Cargando datos de ventas...</p>
        </div>
      )}
      
      {error && (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#ef4444' }}>
          <p>{error}</p>
          <button onClick={fetchSalesData} className="btn-add" style={{ marginTop: '1rem' }}>
            Reintentar
          </button>
        </div>
      )}
      
      {!loading && !error && salesData && (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#dbeafe' }}>
                <i className="fa-solid fa-dollar-sign" style={{ color: '#1e40af' }}></i>
              </div>
              <div className="stat-info">
                <p className="stat-label">Ventas Totales</p>
                <h3 className="stat-value">${salesData.summary?.totalRevenue?.toLocaleString() || '0'}</h3>
                <p className="stat-change positive">
                  <i className="fa-solid fa-arrow-up"></i> {salesData.summary?.growth || '0'}% vs mes anterior
                </p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#fef3c7' }}>
                <i className="fa-solid fa-ticket" style={{ color: '#d97706' }}></i>
              </div>
              <div className="stat-info">
                <p className="stat-label">Boletos Vendidos</p>
                <h3 className="stat-value">{salesData.summary?.totalTickets?.toLocaleString() || '0'}</h3>
                <p className="stat-change positive">
                  <i className="fa-solid fa-arrow-up"></i> {salesData.summary?.ticketGrowth || '0'}% vs mes anterior
                </p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#dcfce7' }}>
                <i className="fa-solid fa-film" style={{ color: '#15803d' }}></i>
              </div>
              <div className="stat-info">
                <p className="stat-label">Película Más Vendida</p>
                <h3 className="stat-value" style={{ fontSize: '1.2rem' }}>
                  {salesData.summary?.topMovie || 'N/A'}
                </h3>
                <p className="stat-change">{salesData.summary?.topMovieTickets || '0'} boletos</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#fce7f3' }}>
                <i className="fa-solid fa-chart-line" style={{ color: '#be185d' }}></i>
              </div>
              <div className="stat-info">
                <p className="stat-label">Promedio por Venta</p>
                <h3 className="stat-value">${salesData.summary?.averageSale?.toFixed(2) || '0'}</h3>
                <p className="stat-change">Ticket promedio</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3>Transacciones Recientes</h3>
              <button className="btn-add">
                <i className="fa-solid fa-file-excel"></i> Exportar a Excel
              </button>
            </div>
            
            <div className="filters-container">
              <input 
                type="text" 
                className="search-bar" 
                placeholder="Buscar transacción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <table className="data-table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Película</th>
                  <th>Tipo de Compra</th>
                  <th>Horario</th>
                  <th>Monto</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>
                      No se encontraron transacciones
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((transaction, index) => (
                    <tr key={transaction._id || index}>
                      <td>{transaction.customer || 'N/A'}</td>
                      <td>{transaction.movie || 'N/A'}</td>
                      <td>
                        <span className="status-badge" style={{ background: '#dbeafe', color: '#1e40af' }}>
                          {transaction.type || 'Compra'}
                        </span>
                      </td>
                      <td>{transaction.schedule || 'N/A'}</td>
                      <td><strong>${transaction.amount?.toFixed(2) || '0.00'}</strong></td>
                      <td>{transaction.date ? new Date(transaction.date).toLocaleDateString() : 'N/A'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </AdminLayout>
  )
}

export default Ventas
