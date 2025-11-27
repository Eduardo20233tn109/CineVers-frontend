import '../styles/Home.css'
import MovieCard from '../components/MovieCard'

// Placeholder images - you'll replace these with actual movie images
const movies = [
  { id: 1, title: 'Furor', genre: 'Acción, Extrema', rating: 4.5, category: 'Acción' },
  { id: 2, title: 'Lovine Drame', genre: 'Amor, Épico', rating: 4.8, category: 'Familia' },
  { id: 3, title: 'Nueva Oportunidad', genre: 'Comedia', rating: 4.2, category: 'Comedia' },
  { id: 4, title: 'Horror', genre: 'Terror, Moderna', rating: 4.6, category: 'Terror' },
  { id: 5, title: 'Futuro Inteligente', genre: 'Ciencia Ficción', rating: 4.7, category: 'Otro' },
  { id: 6, title: 'Conflicto Familiar', genre: 'Comedia, Familiar', rating: 4.1, category: 'Familia' },
  { id: 7, title: 'Sociedad Total', genre: 'Suspenso, Total', rating: 4.4, category: 'Terror' },
  { id: 8, title: 'Ritmo y Melodía', genre: 'Musical', rating: 4.3, category: 'Otro' },
]

const upcoming = [
  { id: 9, title: 'Superhéroe', genre: 'Estreno en 2 días', category: 'Acción' },
  { id: 10, title: 'Aventura Mágica', genre: 'Estreno en 5 días', category: 'Familia' },
  { id: 11, title: 'Ciencia Ficción', genre: 'Estreno en 1 semana', category: 'Otro' },
]

function Home() {
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
          <button className="btn-tickets">Ver boletos</button>
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
            <button className="filter-btn active">Todos</button>
            <button className="filter-btn">Acción</button>
            <button className="filter-btn">Familia</button>
            <button className="filter-btn">Terror</button>
            <button className="filter-btn">Comedia</button>
            <button className="filter-btn">Otro</button>
          </div>
        </div>
        <div className="movies-grid">
          {movies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>

      {/* Próximamente */}
      <section className="section">
        <h2 className="section-title">Próximamente</h2>
        <div className="upcoming-grid">
          {upcoming.map(movie => (
            <div key={movie.id} className="upcoming-card">
              <div className="upcoming-image">
                <span className="upcoming-icon">🎬</span>
              </div>
              <div className="upcoming-info">
                <h3 className="upcoming-title">{movie.title}</h3>
                <p className="upcoming-genre">{movie.genre}</p>
                <button className="btn-notify">Notificarme</button>
              </div>
            </div>
          ))}
        </div>
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
