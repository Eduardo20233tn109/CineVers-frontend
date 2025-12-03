import { useNavigate } from 'react-router-dom'
import { Star, Film } from 'lucide-react'
import '../styles/MovieCard.css'
import authService from '../services/authService'

function MovieCard({ movie }) {
  const navigate = useNavigate()
  
  const handleBuyClick = () => {
    if (authService.isAuthenticated()) {
      navigate(`/book-ticket/${movie._id || movie.id}`)
    } else {
      navigate('/login')
    }
  }
  
  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} size={14} className="star filled" fill="#fbbf24" color="#fbbf24" />)
    }
    if (hasHalfStar) {
      // Lucide doesn't have half-star easily without custom SVG or partial fill, 
      // so we'll use a filled star with different opacity or just a star for now.
      // For simplicity in this iteration, let's use a Star with a specific class.
      stars.push(<Star key="half" size={14} className="star half" fill="url(#half)" color="#fbbf24" />) 
      // Actually, let's just use a full star for simplicity or maybe a smaller one.
      // Better yet, let's just render full stars for now to avoid complexity with SVG gradients for half stars
      // Or just render it as filled but maybe different color? Let's stick to simple stars.
       stars.push(<Star key="half" size={14} className="star filled" fill="#fbbf24" color="#fbbf24" style={{ opacity: 0.5 }} />)
    }
    const emptyStars = 5 - Math.ceil(rating)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} size={14} className="star" color="#4b5563" />)
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
            <Film size={48} color="rgba(255,255,255,0.3)" />
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
        <button className="btn-buy" onClick={handleBuyClick}>
          Comprar Boletos
        </button>
      </div>
    </div>
  )
}

export default MovieCard

