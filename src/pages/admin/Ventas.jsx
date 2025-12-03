import { useState, useEffect, useRef } from 'react'
import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import AdminLayout from '../../components/AdminLayout'
import reportService from '../../services/reportService'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

function Ventas() {
  const [salesData, setSalesData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  // Refs for charts to capture images
  const lineChartRef = useRef(null)
  const barChartRef = useRef(null)
  const doughnutChartRef = useRef(null)

  useEffect(() => {
    fetchSalesData()
  }, [])

  const fetchSalesData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await reportService.generateReport()
      setSalesData(response.report || response)
    } catch (err) {
      console.error('Error fetching sales data:', err)
      setError('Error al cargar los datos de ventas')
    } finally {
      setLoading(false)
    }
  }

  // Prepare chart data
  const salesByDateChartData = salesData?.salesByDate ? {
    labels: salesData.salesByDate.map(item => new Date(item.date).toLocaleDateString('es-MX', { month: 'short', day: 'numeric' })),
    datasets: [
      {
        label: 'Ventas ($)',
        data: salesData.salesByDate.map(item => item.totalSales),
        borderColor: 'rgb(139, 92, 246)',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        tension: 0.4,
      },
    ],
  } : null

  const salesByMovieChartData = salesData?.salesByMovie ? {
    labels: salesData.salesByMovie.slice(0, 5).map(item => item.title),
    datasets: [
      {
        label: 'Boletos Vendidos',
        data: salesData.salesByMovie.slice(0, 5).map(item => item.totalTickets),
        backgroundColor: [
          'rgba(139, 92, 246, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
        ],
      },
    ],
  } : null

  const salesByTypeChartData = salesData?.salesByType ? {
    labels: ['Compra', 'Reserva'],
    datasets: [
      {
        data: [
          salesData.salesByType.compra?.count || 0,
          salesData.salesByType.reserva?.count || 0,
        ],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(59, 130, 246, 0.8)',
        ],
      },
    ],
  } : null

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  }

  const exportToExcel = async () => {
    if (!salesData) return

    const workbook = new ExcelJS.Workbook()
    workbook.creator = 'CineVerse System'
    workbook.created = new Date()

    // --- HOJA 1: RESUMEN ---
    const summarySheet = workbook.addWorksheet('Resumen')
    
    // Título
    summarySheet.mergeCells('A1:C1')
    const titleCell = summarySheet.getCell('A1')
    titleCell.value = 'REPORTE DE VENTAS - CINEVERSE'
    titleCell.font = { name: 'Arial', size: 16, bold: true, color: { argb: 'FFFFFFFF' } }
    titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4F46E5' } }
    titleCell.alignment = { horizontal: 'center' }

    summarySheet.getCell('A2').value = 'Fecha de generación:'
    summarySheet.getCell('B2').value = new Date().toLocaleDateString('es-MX')

    // Tabla de Resumen
    summarySheet.getCell('A4').value = 'RESUMEN GENERAL'
    summarySheet.getCell('A4').font = { bold: true, size: 12 }

    const summaryHeaders = ['Métrica', 'Valor']
    const summaryRows = [
      ['Total de Ventas', `$${salesData.summary?.totalSales?.toLocaleString() || 0}`],
      ['Total de Boletos', salesData.summary?.totalTickets?.toLocaleString() || 0],
      ['Total de Transacciones', salesData.summary?.totalBookings || 0],
      ['Precio Promedio', `$${salesData.summary?.averageTicketPrice?.toFixed(2) || 0}`],
    ]

    addStyledTable(summarySheet, 5, summaryHeaders, summaryRows)

    // Tabla Compras vs Reservas
    summarySheet.getCell('A11').value = 'COMPRAS VS RESERVAS'
    summarySheet.getCell('A11').font = { bold: true, size: 12 }

    const typeHeaders = ['Tipo', 'Cantidad', 'Total ($)']
    const typeRows = [
      ['Compras', salesData.salesByType?.compra?.count || 0, `$${salesData.salesByType?.compra?.total?.toLocaleString() || 0}`],
      ['Reservas', salesData.salesByType?.reserva?.count || 0, `$${salesData.salesByType?.reserva?.total?.toLocaleString() || 0}`],
    ]

    addStyledTable(summarySheet, 12, typeHeaders, typeRows)

    // Ajustar columnas
    summarySheet.columns = [
      { width: 25 }, { width: 20 }, { width: 20 }
    ]

    // --- HOJA 2: VENTAS POR PELÍCULA ---
    const movieSheet = workbook.addWorksheet('Ventas por Película')
    
    movieSheet.mergeCells('A1:E1')
    const movieTitle = movieSheet.getCell('A1')
    movieTitle.value = 'DETALLE DE VENTAS POR PELÍCULA'
    movieTitle.font = { name: 'Arial', size: 14, bold: true, color: { argb: 'FFFFFFFF' } }
    movieTitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0EA5E9' } }
    movieTitle.alignment = { horizontal: 'center' }

    const movieHeaders = ['Película', 'Género', 'Boletos', 'Transacciones', 'Total Ventas ($)']
    const movieRows = salesData.salesByMovie?.map(m => [
      m.title, m.genre, m.totalTickets, m.bookings, m.totalSales
    ]) || []

    // Totales
    const totalTickets = movieRows.reduce((sum, row) => sum + row[2], 0)
    const totalBookings = movieRows.reduce((sum, row) => sum + row[3], 0)
    const totalSales = movieRows.reduce((sum, row) => sum + row[4], 0)
    
    movieRows.push(['TOTALES', '', totalTickets, totalBookings, totalSales])

    addStyledTable(movieSheet, 3, movieHeaders, movieRows)

    movieSheet.columns = [
      { width: 35 }, { width: 15 }, { width: 15 }, { width: 15 }, { width: 20 }
    ]

    // --- HOJA 3: GRÁFICAS ---
    const chartsSheet = workbook.addWorksheet('Gráficas')
    chartsSheet.getCell('A1').value = 'VISUALIZACIÓN DE DATOS'
    chartsSheet.getCell('A1').font = { size: 16, bold: true }

    // Capturar y agregar gráficas
    if (lineChartRef.current) {
      const imageId = workbook.addImage({
        base64: lineChartRef.current.toBase64Image(),
        extension: 'png',
      })
      chartsSheet.addImage(imageId, {
        tl: { col: 0, row: 2 },
        ext: { width: 600, height: 300 }
      })
      chartsSheet.getCell('A2').value = 'Tendencia de Ventas'
    }

    if (barChartRef.current) {
      const imageId = workbook.addImage({
        base64: barChartRef.current.toBase64Image(),
        extension: 'png',
      })
      chartsSheet.addImage(imageId, {
        tl: { col: 0, row: 20 },
        ext: { width: 600, height: 300 }
      })
      chartsSheet.getCell('A20').value = 'Top 5 Películas'
    }

    if (doughnutChartRef.current) {
      const imageId = workbook.addImage({
        base64: doughnutChartRef.current.toBase64Image(),
        extension: 'png',
      })
      chartsSheet.addImage(imageId, {
        tl: { col: 8, row: 2 },
        ext: { width: 400, height: 300 }
      })
      chartsSheet.getCell('I2').value = 'Distribución de Compras'
    }

    // Generar archivo
    const buffer = await workbook.xlsx.writeBuffer()
    const fileName = `Reporte_Ventas_CineVerse_${new Date().toISOString().split('T')[0]}.xlsx`
    saveAs(new Blob([buffer]), fileName)
  }

  // Helper para tablas con estilo
  const addStyledTable = (sheet, startRow, headers, rows) => {
    // Headers
    const headerRow = sheet.getRow(startRow)
    headerRow.values = headers
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } }
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF374151' } }
      cell.alignment = { horizontal: 'center' }
      cell.border = { bottom: { style: 'medium' } }
    })

    // Rows
    rows.forEach((rowData, index) => {
      const row = sheet.getRow(startRow + 1 + index)
      row.values = rowData
      
      // Estilo alternado
      if (index % 2 !== 0) {
        row.eachCell((cell) => {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF3F4F6' } }
        })
      }

      // Bordes
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          right: { style: 'thin', color: { argb: 'FFE5E7EB' } }
        }
        // Alinear números a la derecha
        if (typeof cell.value === 'number' || (typeof cell.value === 'string' && cell.value.startsWith('$'))) {
          cell.alignment = { horizontal: 'right' }
        }
      })
    })
  }

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
                <h3 className="stat-value">${salesData.summary?.totalSales?.toLocaleString() || '0'}</h3>
                <p className="stat-change">
                  {salesData.summary?.totalBookings || '0'} transacciones
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
                <p className="stat-change">
                  Promedio: ${salesData.summary?.averageTicketPrice?.toFixed(2) || '0'}
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
                  {salesData.salesByMovie?.[0]?.title || 'N/A'}
                </h3>
                <p className="stat-change">{salesData.salesByMovie?.[0]?.totalTickets || '0'} boletos</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#fce7f3' }}>
                <i className="fa-solid fa-chart-line" style={{ color: '#be185d' }}></i>
              </div>
              <div className="stat-info">
                <p className="stat-label">Compras vs Reservas</p>
                <h3 className="stat-value">
                  {salesData.salesByType?.compra?.count || 0} / {salesData.salesByType?.reserva?.count || 0}
                </h3>
                <p className="stat-change">Compras / Reservas</p>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            {salesByDateChartData && (
              <div className="card">
                <div className="card-header">
                  <h3>Ventas por Fecha</h3>
                </div>
                <div style={{ height: '300px', padding: '1rem' }}>
                  <Line ref={lineChartRef} data={salesByDateChartData} options={chartOptions} />
                </div>
              </div>
            )}

            {salesByMovieChartData && (
              <div className="card">
                <div className="card-header">
                  <h3>Top 5 Películas</h3>
                </div>
                <div style={{ height: '300px', padding: '1rem' }}>
                  <Bar ref={barChartRef} data={salesByMovieChartData} options={chartOptions} />
                </div>
              </div>
            )}

            {salesByTypeChartData && (
              <div className="card">
                <div className="card-header">
                  <h3>Compras vs Reservas</h3>
                </div>
                <div style={{ height: '300px', padding: '1rem' }}>
                  <Doughnut ref={doughnutChartRef} data={salesByTypeChartData} options={chartOptions} />
                </div>
              </div>
            )}
          </div>

          <div className="card">
            <div className="card-header">
              <h3>Ventas por Película</h3>
              <button className="btn-add" onClick={exportToExcel}>
                <i className="fa-solid fa-file-excel"></i> Exportar a Excel
              </button>
            </div>
            
            <table className="data-table">
              <thead>
                <tr>
                  <th>Película</th>
                  <th>Género</th>
                  <th>Boletos</th>
                  <th>Transacciones</th>
                  <th>Total Ventas</th>
                </tr>
              </thead>
              <tbody>
                {salesData.salesByMovie?.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>
                      No hay datos de ventas
                    </td>
                  </tr>
                ) : (
                  salesData.salesByMovie?.map((movie, index) => (
                    <tr key={index}>
                      <td><strong>{movie.title}</strong></td>
                      <td>
                        <span className="status-badge" style={{ background: '#f3f4f6', color: '#374151' }}>
                          {movie.genre}
                        </span>
                      </td>
                      <td>{movie.totalTickets}</td>
                      <td>{movie.bookings}</td>
                      <td><strong>${movie.totalSales.toFixed(2)}</strong></td>
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
