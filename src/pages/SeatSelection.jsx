import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import '../styles/SeatSelection.css'

// Mock movie data
const movieData = {
  1: { title: 'Acción Extrema', showtime: '19:30', date: '15 Dec, 2024', room: 'Sala 1' },
  2: { title: 'Lovine Drame', showtime: '18:00', date: '15 Dec, 2024', room: 'Sala 2' },
}

// Seat pricing
const PRICING = {
  regular: 250,
  premium: 350,
  serviceCharge: 50
}

// Generate seat grid
const generateSeats = () => {
  const rows = ['A', 'B', 'C', 'D', 'E']
  const seatsPerRow = 12
  const seats = []
  
  rows.forEach((row, rowIndex) => {
    for (let i = 1; i <= seatsPerRow; i++) {
      let status = 'available'
      let type = 'regular'
      
      // Set some seats as occupied (mock data)
      if ((rowIndex === 0 && [2, 3].includes(i)) || 
          (rowIndex === 1 && [7].includes(i)) ||
          (rowIndex === 2 && [4, 9].includes(i))) {
        status = 'occupied'
      }
      
      // Set middle seats in rows B, C, D as VIP
      if ([1, 2, 3].includes(rowIndex) && i >= 5 && i <= 8) {
        type = 'vip'
      }
      
      seats.push({
        id: `${row}${i}`,
        row,
        number: i,
        status,
        type
      })
    }
  })
  
  return seats
}

function SeatSelection() {
  const { movieId } = useParams()
  const navigate = useNavigate()
  const movie = movieData[movieId] || movieData[1]
  
  const [seats, setSeats] = useState(generateSeats())
  const [selectedSeats, setSelectedSeats] = useState([])

  const handleSeatClick = (seatId) => {
    const seat = seats.find(s => s.id === seatId)
    
    if (seat.status === 'occupied') return
    
    if (selectedSeats.includes(seatId)) {
      // Deselect
      setSelectedSeats(selectedSeats.filter(id => id !== seatId))
    } else {
      // Select
      setSelectedSeats([...selectedSeats, seatId])
    }
  }

  const getSelectedSeatsInfo = () => {
    const selected = seats.filter(s => selectedSeats.includes(s.id))
    const regularCount = selected.filter(s => s.type === 'regular').length
    const vipCount = selected.filter(s => s.type === 'vip').length
    
    return {
      regularCount,
      vipCount,
      regularTotal: regularCount * PRICING.regular,
      vipTotal: vipCount * PRICING.premium,
      total: (regularCount * PRICING.regular) + (vipCount * PRICING.premium) + PRICING.serviceCharge
    }
  }

  const seatInfo = getSelectedSeatsInfo()
  const rows = ['A', 'B', 'C', 'D', 'E']

  return (
    <div className="seat-selection-container">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo" onClick={() => navigate('/home')}>
            <span className="logo-icon">🎬</span>
            <span className="logo-text">CineVers</span>
          </div>
          <div className="header-info">
            <h2 className="movie-title-header">{movie.title}</h2>
            <p className="showtime-info">Sala 1 • {movie.showtime}</p>
          </div>
          <div className="timer">
            <span>Tiempo restante: 14:57</span>
          </div>
        </div>
      </header>

      <div className="selection-layout">
        {/* Seat Grid Section */}
        <div className="seat-grid-section">
          {/* Screen Indicator */}
          <div className="screen-container">
            <div className="screen">PANTALLA</div>
          </div>

          {/* Seat Grid */}
          <div className="seats-grid">
            {rows.map((row) => (
              <div key={row} className="seat-row">
                <span className="row-label">{row}</span>
                <div className="row-seats">
                  {seats
                    .filter(seat => seat.row === row)
                    .map(seat => (
                      <button
                        key={seat.id}
                        className={`seat ${seat.type} ${seat.status} ${selectedSeats.includes(seat.id) ? 'selected' : ''}`}
                        onClick={() => handleSeatClick(seat.id)}
                        disabled={seat.status === 'occupied'}
                      >
                      </button>
                    ))}
                </div>
                <span className="row-label">{row}</span>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="seat-legend">
            <div className="legend-item">
              <div className="legend-seat available"></div>
              <span>Disponible</span>
            </div>
            <div className="legend-item">
              <div className="legend-seat selected"></div>
              <span>Seleccionado</span>
            </div>
            <div className="legend-item">
              <div className="legend-seat occupied"></div>
              <span>Ocupado</span>
            </div>
            <div className="legend-item">
              <div className="legend-seat vip"></div>
              <span>VIP</span>
            </div>
          </div>
        </div>

        {/* Purchase Summary Sidebar */}
        <div className="summary-sidebar">
          <h3 className="summary-title">Resumen de Compra</h3>
          
          <div className="summary-section">
            <div className="summary-item">
              <span className="label">Película:</span>
              <span className="value">{movie.title}</span>
            </div>
            <div className="summary-item">
              <span className="label">Fecha:</span>
              <span className="value">{movie.date}</span>
            </div>
            <div className="summary-item">
              <span className="label">Hora:</span>
              <span className="value">{movie.showtime}</span>
            </div>
            <div className="summary-item">
              <span className="label">Sala:</span>
              <span className="value">{movie.room}</span>
            </div>
          </div>

          <div className="summary-section">
            <h4 className="section-subtitle">Asientos Seleccionados</h4>
            {selectedSeats.length === 0 ? (
              <p className="no-seats">Ningún asiento seleccionado</p>
            ) : (
              <div className="selected-seats-list">
                {selectedSeats.map(seatId => (
                  <span key={seatId} className="seat-tag">{seatId}</span>
                ))}
              </div>
            )}
          </div>

          <div className="summary-section pricing">
            {seatInfo.regularCount > 0 && (
              <div className="price-item">
                <span>Asientos regulares:</span>
                <span>${seatInfo.regularCount}</span>
              </div>
            )}
            {seatInfo.vipCount > 0 && (
              <div className="price-item">
                <span>Asientos premium:</span>
                <span>${seatInfo.vipCount}</span>
              </div>
            )}
            {selectedSeats.length > 0 && (
              <div className="price-item">
                <span>Cargos por servicio:</span>
                <span>${PRICING.serviceCharge}</span>
              </div>
            )}
            <div className="price-item total">
              <span>Total:</span>
              <span>${selectedSeats.length > 0 ? seatInfo.total : 0}</span>
            </div>
          </div>

          <button 
            className="btn-continue"
            disabled={selectedSeats.length === 0}
            onClick={() => navigate(`/checkout/${movieId}`)}
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  )
}

export default SeatSelection
