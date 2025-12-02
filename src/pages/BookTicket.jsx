import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import ProgressStepper from '../components/ProgressStepper'
import bookingService from '../services/bookingService'
import '../styles/BookTicket.css'

function BookTicket() {
  const { movieId } = useParams()
  const navigate = useNavigate()
  const [movie, setMovie] = useState(null)
  const [schedules, setSchedules] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedSchedule, setSelectedSchedule] = useState(null)

  useEffect(() => {
    fetchMovieAndSchedules()
  }, [movieId])

  const fetchMovieAndSchedules = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await bookingService.getSchedules(movieId)
      setMovie(response.movie)
      setSchedules(response.schedules || [])
    } catch (err) {
      console.error('Error fetching schedules:', err)
      setError('Error al cargar los horarios. Verifica que el backend esté corriendo.')
    } finally {
      setLoading(false)
    }
  }

  const handleScheduleClick = (schedule) => {
    setSelectedSchedule(schedule)
  }

  const handleContinue = () => {
    if (selectedSchedule) {
      // Use _id or id depending on what the backend returns
      const scheduleId = selectedSchedule._id || selectedSchedule.id
      console.log('Selected schedule:', selectedSchedule)
      console.log('Schedule ID:', scheduleId)
      navigate(`/seat-selection/${movieId}/${scheduleId}`)
    }
  }

  // Group schedules by room
  const schedulesByRoom = schedules.reduce((acc, schedule) => {
    const roomKey = schedule.room || 'Sala General'
    if (!acc[roomKey]) {
      acc[roomKey] = []
    }
    acc[roomKey].push(schedule)
    return acc
  }, {})

  return (
    <div className="book-ticket-container">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo" onClick={() => navigate('/home')}>
            <span className="logo-icon">🎬</span>
            <span className="logo-text">CineVers</span>
          </div>
          <nav className="nav">
            <a href="/home" className="nav-link">Cartelera</a>
            <a href="#" className="nav-link">Próximamente</a>
            <a href="#" className="nav-link">Promociones</a>
          </nav>
          <div className="header-right">
            <button className="btn-tickets">Mis boletos</button>
            <div className="user-avatar">
              <span>👤</span>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Stepper */}
      <ProgressStepper currentStep={1} />

      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando horarios...</p>
        </div>
      )}

      {error && (
        <div className="error-container">
          <i className="fa-solid fa-exclamation-circle"></i>
          <p>{error}</p>
          <button onClick={fetchMovieAndSchedules} className="retry-btn">
            Reintentar
          </button>
        </div>
      )}

      {!loading && !error && movie && (
        <>
          {/* Movie Banner */}
          <section className="movie-banner">
            <div className="banner-overlay"></div>
            <div className="banner-content">
              <h1 className="movie-title">{movie.title}</h1>
              <div className="movie-meta">
                <span>{movie.genre}</span>
                <span>{movie.classification}</span>
                <span>{movie.duration} min</span>
              </div>
            </div>
          </section>

          {/* Showtimes Section */}
          <section className="showtimes-section">
            <h2 className="section-title">Horarios Disponibles</h2>
            
            {Object.keys(schedulesByRoom).length === 0 ? (
              <div className="empty-state">
                <i className="fa-solid fa-calendar-xmark"></i>
                <p>No hay horarios disponibles para esta película</p>
              </div>
            ) : (
              Object.entries(schedulesByRoom).map(([room, roomSchedules]) => (
                <div key={room} className="room-card">
                  <div className="room-header">
                    <div className="room-info">
                      <h3 className="room-name">{room}</h3>
                      <span className={`room-badge ${roomSchedules[0]?.roomType?.toLowerCase()}`}>
                        {roomSchedules[0]?.roomType || '2D'}
                      </span>
                    </div>
                    <div className="room-details">
                      <span className="seats-available">
                        Asientos disponibles: {roomSchedules[0]?.availableSeats || 0}
                      </span>
                      <span className="price">${roomSchedules[0]?.price || 0} MXN</span>
                    </div>
                  </div>
                  <div className="showtimes-grid">
                    {roomSchedules.map((schedule) => (
                      <button
                        key={schedule._id}
                        className={`showtime-btn ${selectedSchedule?._id === schedule._id ? 'selected' : ''} ${schedule.availableSeats === 0 ? 'disabled' : ''}`}
                        onClick={() => handleScheduleClick(schedule)}
                        disabled={schedule.availableSeats === 0}
                      >
                        {schedule.time}
                        {schedule.availableSeats === 0 && <span className="sold-out">Agotado</span>}
                      </button>
                    ))}
                  </div>
                </div>
              ))
            )}

            {/* Continue Button */}
            {selectedSchedule && (
              <div className="continue-section">
                <button 
                  className="btn-continue"
                  onClick={handleContinue}
                >
                  Continuar con la compra
                </button>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  )
}

export default BookTicket
