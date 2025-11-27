import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import '../styles/BookTicket.css'

// Mock movie data - in a real app this would come from an API
const movieData = {
  1: { title: 'DART', banner: 'dart-banner' },
  2: { title: 'Lovine Drame', banner: 'lovine-banner' },
  3: { title: 'Nueva Oportunidad', banner: 'nueva-banner' },
  4: { title: 'Horror', banner: 'horror-banner' },
  5: { title: 'Futuro Inteligente', banner: 'futuro-banner' },
  6: { title: 'Conflicto Familiar', banner: 'conflicto-banner' },
  7: { title: 'Sociedad Total', banner: 'sociedad-banner' },
  8: { title: 'Ritmo y Melodía', banner: 'ritmo-banner' },
}

const showtimes = {
  premium: [
    { time: '14:30', available: 45 },
    { time: '17:15', available: 32 },
    { time: '20:00', available: 28 },
  ],
  vip: [
    { time: '15:00', available: 28 },
    { time: '18:30', available: 15 },
    { time: '21:45', available: 22 },
  ]
}

function BookTicket() {
  const { movieId } = useParams()
  const navigate = useNavigate()
  const [selectedShowtime, setSelectedShowtime] = useState(null)
  
  const movie = movieData[movieId] || { title: 'DART', banner: 'dart-banner' }

  const handleShowtimeClick = (roomType, time) => {
    setSelectedShowtime({ roomType, time })
  }

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
            <a href="#" className="nav-link">Cartelera</a>
            <a href="#" className="nav-link">Próximamente</a>
            <a href="#" className="nav-link">Promociones</a>
            <a href="#" className="nav-link">Dulcería</a>
          </nav>
          <div className="header-right">
            <button className="btn-tickets">Mis boletos</button>
            <div className="user-avatar">
              <span>👤</span>
            </div>
          </div>
        </div>
      </header>

      {/* Movie Banner */}
      <section className="movie-banner">
        <div className="banner-overlay"></div>
        <div className="banner-content">
          <h1 className="movie-title">{movie.title}</h1>
        </div>
      </section>

      {/* Showtimes Section */}
      <section className="showtimes-section">
        <h2 className="section-title">Horarios Disponibles</h2>
        
        {/* Premium Room */}
        <div className="room-card">
          <div className="room-header">
            <div className="room-info">
              <h3 className="room-name">Sala Premium</h3>
              <span className="room-badge imax">IMAX</span>
            </div>
            <div className="room-details">
              <span className="seats-available">Asientos disponibles: 45</span>
              <span className="price">$250 MXN</span>
            </div>
          </div>
          <div className="showtimes-grid">
            {showtimes.premium.map((slot, index) => (
              <button
                key={index}
                className={`showtime-btn ${selectedShowtime?.roomType === 'premium' && selectedShowtime?.time === slot.time ? 'selected' : ''}`}
                onClick={() => handleShowtimeClick('premium', slot.time)}
              >
                {slot.time}
              </button>
            ))}
          </div>
        </div>

        {/* VIP Room */}
        <div className="room-card">
          <div className="room-header">
            <div className="room-info">
              <h3 className="room-name">Sala VIP</h3>
              <span className="room-badge vip">4DX</span>
            </div>
            <div className="room-details">
              <span className="seats-available">Asientos disponibles: 28</span>
              <span className="price">$350 MXN</span>
            </div>
          </div>
          <div className="showtimes-grid">
            {showtimes.vip.map((slot, index) => (
              <button
                key={index}
                className={`showtime-btn ${selectedShowtime?.roomType === 'vip' && selectedShowtime?.time === slot.time ? 'selected' : ''}`}
                onClick={() => handleShowtimeClick('vip', slot.time)}
              >
                {slot.time}
              </button>
            ))}
          </div>
        </div>

        {/* Continue Button */}
        {selectedShowtime && (
          <div className="continue-section">
            <button 
              className="btn-continue"
              onClick={() => navigate(`/seat-selection/${movieId}/${selectedShowtime.time}`)}
            >
              Continuar con la compra
            </button>
          </div>
        )}
      </section>
    </div>
  )
}

export default BookTicket
