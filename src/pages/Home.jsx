import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import bookingService from '../services/bookingService'
import MovieCard from '../components/MovieCard'
import '../styles/Home.css'

import authService from '../services/authService'

function Home() {
  const navigate = useNavigate()
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('Todos')

  useEffect(() => {
    fetchMovies()
  }, [])

  const fetchMovies = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await bookingService.getMoviesWithSchedules()
      setMovies(response.data || response.movies || [])
    } catch (err) {
      console.error('Error fetching movies:', err)
      setError('Error al cargar las películas')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await authService.logout()
    navigate('/')
  }

  const filteredMovies = selectedCategory === 'Todos' 
    ? movies 
    : movies.filter(movie => movie.genre === selectedCategory)

  return (
    <div className="home-container">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">🎬</span>
            <span className="logo-text">CineVers</span>
          </div>
          <nav className="nav">
            <a href="#" className="nav-link active">Cartelera</a>
            <a href="#" className="nav-link">Proximamente</a>
          </nav>
          <div className="header-actions">
            <button className="btn-tickets">Ver boletos</button>
            <button className="btn-logout" onClick={handleLogout} title="Cerrar Sesión">
              <i className="fa-solid fa-right-from-bracket"></i>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">Vive la magia del cine</h1>
            <p className="hero-subtitle">
              Descubre los últimos estrenos y disfruta de la mejor experiencia cinematográfica
            </p>
            <div className="hero-buttons">
              <button className="btn-hero-primary">Ver Cartelera</button>
              <button className="btn-hero-secondary">Proximamente</button>
            </div>
          </div>
          <div className="hero-image">
            <div className="cinema-placeholder">
              <span className="cinema-icon">🎭</span>
            </div>
          </div>
        </div>
      </section>

      {/* En Cartelera */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">En Cartelera</h2>
          <div className="filters">
            <button 
              className={`filter-btn ${selectedCategory === 'Todos' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('Todos')}
            >
              Todos
            </button>
            <button 
              className={`filter-btn ${selectedCategory === 'Acción' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('Acción')}
            >
              Acción
            </button>
            <button 
              className={`filter-btn ${selectedCategory === 'Familia' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('Familia')}
            >
              Familia
            </button>
            <button 
              className={`filter-btn ${selectedCategory === 'Terror' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('Terror')}
            >
              Terror
            </button>
            <button 
              className={`filter-btn ${selectedCategory === 'Comedia' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('Comedia')}
            >
              Comedia
            </button>
            <button 
              className={`filter-btn ${selectedCategory === 'Otro' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('Otro')}
            >
              Otro
            </button>
          </div>
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <p>Cargando películas...</p>
          </div>
        )}

        {error && (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#ef4444' }}>
            <p>{error}</p>
            <button onClick={fetchMovies} style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: '#8b5cf6', color: 'white', borderRadius: '8px' }}>
              Reintentar
            </button>
          </div>
        )}

        {!loading && !error && (
          <div className="movies-grid">
            {filteredMovies.map(movie => (
              <MovieCard key={movie._id || movie.id} movie={movie} />
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <span className="logo-icon">🎬</span>
              <span className="logo-text">CineVers</span>
            </div>
            <p className="footer-tagline">La mejor experiencia cinematográfica</p>
          </div>
          <div className="footer-section">
            <h4 className="footer-heading">Películas</h4>
            <a href="#" className="footer-link">En Cartelera</a>
            <a href="#" className="footer-link">Proximamente</a>
            <a href="#" className="footer-link">Preventas</a>
          </div>
          <div className="footer-section">
            <h4 className="footer-heading">Servicios</h4>
            <a href="#" className="footer-link">Dulcería</a>
            <a href="#" className="footer-link">Preventas</a>
            <a href="#" className="footer-link">Membresías</a>
          </div>
          <div className="footer-section">
            <h4 className="footer-heading">Contacto</h4>
            <p className="footer-contact">📧 info@cinemax.com</p>
            <p className="footer-contact">📞 (777) 123-4567</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home

