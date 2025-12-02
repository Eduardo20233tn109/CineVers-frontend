import { useNavigate } from 'react-router-dom'
import '../styles/MovieCard.css'

function MovieCard({ movie }) {
  const navigate = useNavigate()
  
  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="star filled">★</span>)
    }
    if (hasHalfStar) {
      stars.push(<span key="half" className="star half">★</span>)
    }
    const emptyStars = 5 - Math.ceil(rating)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star">★</span>)
    }
    return stars
  }

  // Calculate rating from 0-5 based on classification or default to 4.5
  const getRating = () => {
    // You can adjust this logic based on your backend data
    return movie.rating || 4.5
  }

  return (
    <div className="movie-card">
      <div className="movie-image">
        {movie.image ? (
          <img src={movie.image} alt={movie.title} className="movie-poster-img" />
        ) : (
          <div className="movie-placeholder">
            <span className="movie-icon">🎬</span>
          </div>
        )}
        <div className="movie-rating-badge">
          <span className="rating-number">{getRating()}</span>
        </div>
      </div>
      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
        <p className="movie-genre">{movie.genre}</p>
        <div className="movie-stars">
          {renderStars(getRating())}
        </div>
        <button className="btn-buy" onClick={() => navigate(`/book-ticket/${movie._id || movie.id}`)}>
          Comprar Boletos
        </button>
      </div>
    </div>
  )
}

export default MovieCard

