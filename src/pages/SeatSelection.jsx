import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Clapperboard } from 'lucide-react'
import ProgressStepper from '../components/ProgressStepper'
import bookingService from '../services/bookingService'
import '../styles/SeatSelection.css'

function SeatSelection() {
  const { movieId, showtimeId } = useParams()
  const navigate = useNavigate()
  
  const [movie, setMovie] = useState(null)
  const [schedule, setSchedule] = useState(null)
  const [seats, setSeats] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedSeats, setSelectedSeats] = useState([])

  useEffect(() => {
    fetchSeats()
  }, [movieId, showtimeId])

  const fetchSeats = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await bookingService.getSeats(movieId, showtimeId)
      setMovie(response.movie)
      setSchedule(response.schedule)
      setSeats(response.seats || [])
    } catch (err) {
      console.error('Error fetching seats:', err)
      setError('Error al cargar los asientos')
    } finally {
      setLoading(false)
    }
  }

  const handleSeatClick = (seat) => {
    if (['ocupado', 'reservado', 'occupied', 'reserved'].includes(seat.status)) return
    
    if (selectedSeats.find(s => s._id === seat._id)) {
      setSelectedSeats(selectedSeats.filter(s => s._id !== seat._id))
    } else {
      setSelectedSeats([...selectedSeats, seat])
    }
  }

  const calculateTotal = () => {
    const subtotal = selectedSeats.reduce((sum, seat) => sum + (seat.price || schedule?.price || 0), 0)
    const serviceCharge = selectedSeats.length > 0 ? 50 : 0
    return subtotal + serviceCharge
  }

  const handleContinue = async () => {
    if (selectedSeats.length > 0) {
      try {
        setLoading(true)
        // Reserve seats on backend
        await bookingService.selectSeats({
          movieId,
          scheduleId: showtimeId,
          seatIds: selectedSeats.map(s => s._id)
        })

        // Store selected seats, movie, and schedule in sessionStorage for checkout
        sessionStorage.setItem('selectedSeats', JSON.stringify(selectedSeats))
        sessionStorage.setItem('movieId', movieId)
        sessionStorage.setItem('scheduleId', showtimeId)
        sessionStorage.setItem('movieData', JSON.stringify(movie))
        sessionStorage.setItem('scheduleData', JSON.stringify(schedule))
        
        navigate(`/checkout/${movieId}`)
      } catch (err) {
        console.error('Error reserving seats:', err)
        setError(err.response?.data?.message || 'Error al reservar los asientos. Intenta de nuevo.')
        // Refresh seats to show current status
        fetchSeats()
      } finally {
        setLoading(false)
      }
    }
  }

  // Group seats by row
  const seatsByRow = seats.reduce((acc, seat) => {
    const row = seat.row || 'A'
    if (!acc[row]) acc[row] = []
    acc[row].push(seat)
    return acc
  }, {})

  const rows = Object.keys(seatsByRow).sort()

  return (
    <div className="seat-selection-container">
      <header className="header">
        <div className="header-content">
          <div className="logo" onClick={() => navigate('/')}>
            <Clapperboard size={28} color="#ec4899" />
            <span className="logo-text">CineVers</span>
          </div>
          {movie && (
            <div className="header-info">
              <h2 className="movie-title-header">{movie.title}</h2>
              <p className="showtime-info">
                {schedule?.room} • {schedule?.time}
              </p>
            </div>
          )}
        </div>
      </header>

      <ProgressStepper currentStep={3} />

      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando asientos...</p>
        </div>
      )}

      {error && (
        <div className="error-container">
          <i className="fa-solid fa-exclamation-circle"></i>
          <p>{error}</p>
          <button onClick={fetchSeats} className="retry-btn">Reintentar</button>
        </div>
      )}

      {!loading && !error && movie && (
        <div className="selection-layout">
          <div className="seat-grid-section">
            <div className="screen-container">
              <div className="screen">PANTALLA</div>
            </div>

            <div className="seats-grid">
              {rows.map((row) => (
                <div key={row} className="seat-row">
                  <span className="row-label">{row}</span>
                  <div className="row-seats">
                    {seatsByRow[row].map((seat) => {
                      // Map backend status (spanish) to frontend class (english)
                      const statusClass = 
                        seat.status === 'ocupado' ? 'occupied' : 
                        seat.status === 'reservado' ? 'occupied' : 
                        seat.status === 'disponible' ? 'available' :
                        seat.status;

                      const isUnavailable = ['ocupado', 'reservado', 'occupied', 'reserved'].includes(seat.status);
                      
                      // Determine if VIP (Row A is VIP)
                      const isVip = seat.row === 'A';
                      const seatType = isVip ? 'vip' : (seat.type || 'regular');

                      return (
                        <button
                          key={seat._id}
                          className={`seat ${seatType} ${statusClass} ${
                            selectedSeats.find(s => s._id === seat._id) ? 'selected' : ''
                          }`}
                          onClick={() => handleSeatClick({ ...seat, type: seatType })}
                          disabled={isUnavailable}
                          title={`${row}${seat.number} ${isVip ? '(VIP)' : ''} - ${seat.status}`}
                        />
                      )
                    })}
                  </div>
                  <span className="row-label">{row}</span>
                </div>
              ))}
            </div>

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

          <div className="summary-sidebar">
            <h3 className="summary-title">Resumen de Compra</h3>
            
            <div className="summary-section">
              <div className="summary-item">
                <span className="label">Película:</span>
                <span className="value">{movie.title}</span>
              </div>
              <div className="summary-item">
                <span className="label">Fecha:</span>
                <span className="value">
                  {schedule?.date ? new Date(schedule.date).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div className="summary-item">
                <span className="label">Hora:</span>
                <span className="value">{schedule?.time}</span>
              </div>
              <div className="summary-item">
                <span className="label">Sala:</span>
                <span className="value">{schedule?.room}</span>
              </div>
            </div>

            <div className="summary-section">
              <h4 className="section-subtitle">Asientos Seleccionados</h4>
              {selectedSeats.length === 0 ? (
                <p className="no-seats">Ningún asiento seleccionado</p>
              ) : (
                <div className="selected-seats-list">
                  {selectedSeats.map(seat => (
                    <span key={seat._id} className="seat-tag">
                      {seat.row}{seat.number}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="summary-section pricing">
              {selectedSeats.length > 0 && (
                <>
                  <div className="price-item">
                    <span>Asientos ({selectedSeats.length}):</span>
                    <span>${selectedSeats.length * (schedule?.price || 0)}</span>
                  </div>
                  <div className="price-item">
                    <span>Cargos por servicio:</span>
                    <span>$50</span>
                  </div>
                  <div className="price-item total">
                    <span>Total:</span>
                    <span>${calculateTotal()}</span>
                  </div>
                </>
              )}
            </div>

            <button 
              className="btn-continue"
              disabled={selectedSeats.length === 0}
              onClick={handleContinue}
            >
              Continuar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default SeatSelection
