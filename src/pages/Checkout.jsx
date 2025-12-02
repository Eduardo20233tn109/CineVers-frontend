import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import ProgressStepper from '../components/ProgressStepper'
import bookingService from '../services/bookingService'
import authService from '../services/authService'
import paymentService from '../services/paymentService'
import '../styles/Checkout.css'

function Checkout() {
  const { movieId } = useParams()
  const navigate = useNavigate()
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [acceptPromotions, setAcceptPromotions] = useState(false)
  
  // Card Form State
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: ''
  })
  
  // Get data from sessionStorage
  const [orderData, setOrderData] = useState(null)
  const [selectedSeats, setSelectedSeats] = useState([])
  const [scheduleId, setScheduleId] = useState(null)

  useEffect(() => {
    loadOrderData()
  }, [])

  const loadOrderData = () => {
    try {
      const seats = JSON.parse(sessionStorage.getItem('selectedSeats') || '[]')
      const storedMovieId = sessionStorage.getItem('movieId')
      const storedScheduleId = sessionStorage.getItem('scheduleId')
      const movieData = JSON.parse(sessionStorage.getItem('movieData') || '{}')
      const scheduleData = JSON.parse(sessionStorage.getItem('scheduleData') || '{}')
      
      if (seats.length === 0 || !storedMovieId || !storedScheduleId) {
        navigate('/home')
        return
      }

      setSelectedSeats(seats)
      setScheduleId(storedScheduleId)
      
      // Calculate totals - use schedule price
      const pricePerSeat = scheduleData.price || 0
      const subtotal = seats.length * pricePerSeat
      const serviceCharge = 50
      const total = subtotal + serviceCharge

      setOrderData({
        movie: movieData,
        schedule: scheduleData,
        seats,
        subtotal,
        serviceCharge,
        total
      })
    } catch (err) {
      console.error('Error loading order data:', err)
      navigate('/home')
    }
  }

  const handleCardInputChange = (e) => {
    const { name, value } = e.target
    setCardData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!acceptTerms) {
      setError('Debes aceptar los términos y condiciones')
      return
    }

    if (paymentMethod !== 'card') {
      setError('Por el momento solo aceptamos pagos con tarjeta')
      return
    }

    // Basic validation
    if (!cardData.cardNumber || !cardData.expiry || !cardData.cvv || !cardData.cardName) {
      setError('Por favor completa todos los datos de la tarjeta')
      return
    }

    try {
      setLoading(true)
      setError(null)

      // 1. Parse Expiry Date
      const [expMonth, expYear] = cardData.expiry.split('/')
      if (!expMonth || !expYear || expMonth.length !== 2 || expYear.length !== 2) {
        throw new Error('Fecha de vencimiento inválida (MM/AA)')
      }

      // 2. Save Card first to get ID
      const cardPayload = {
        cardNumber: cardData.cardNumber.replace(/\s/g, ''),
        cardholderName: cardData.cardName,
        expirationMonth: expMonth,
        expirationYear: `20${expYear}`,
        cardType: 'credito', // Defaulting to credito for simplicity, logic could be added to detect
        alias: `Tarjeta ${cardData.cardNumber.slice(-4)}`
      }

      const cardResponse = await paymentService.saveCard(cardPayload)
      
      if (!cardResponse.success || !cardResponse.paymentMethod?.id) {
        throw new Error('Error al procesar la tarjeta')
      }

      const paymentMethodId = cardResponse.paymentMethod.id

      // 3. Finalize Purchase
      const purchaseData = {
        movieId,
        scheduleId,
        seatIds: selectedSeats.map(s => s._id), // Changed to seatIds
        paymentMethodId, // Changed to paymentMethodId
        type: 'compra',
      }

      const response = await bookingService.purchase(purchaseData)
      
      if (response.success) {
        // Store booking ID for digital ticket
        sessionStorage.setItem('bookingId', response.booking._id)
        sessionStorage.removeItem('selectedSeats')
        sessionStorage.removeItem('movieId')
        sessionStorage.removeItem('scheduleId')
        sessionStorage.removeItem('movieData')
        sessionStorage.removeItem('scheduleData')
        
        // Show success message and redirect to home
        alert('¡Compra exitosa! Tus boletos han sido enviados a tu correo electrónico.')
        navigate('/home')
      }
    } catch (err) {
      console.error('Purchase error:', err)
      setError(err.response?.data?.message || err.message || 'Error al procesar el pago. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  if (!orderData) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando...</p>
      </div>
    )
  }

  const user = authService.getCurrentUser()

  return (
    <div className="checkout-container">
      <header className="header">
        <div className="header-content">
          <div className="logo" onClick={() => navigate('/home')}>
            <span className="logo-icon">🎬</span>
            <span className="logo-text">CineVers</span>
          </div>
          <nav className="nav">
            <a href="/home" className="nav-link">Cartelera</a>
          </nav>
          <div className="user-avatar">
            <span>👤</span>
          </div>
        </div>
      </header>

      <ProgressStepper currentStep={4} />

      {error && (
        <div className="error-banner">
          <i className="fa-solid fa-exclamation-circle"></i>
          <span>{error}</span>
        </div>
      )}

      <div className="checkout-layout">
        <div className="left-section">
          {/* Order Summary */}
          <div className="section-card">
            <h2 className="section-title">Resumen de tu Compra</h2>
            
            <div className="movie-summary">
              <div className="movie-poster">
                <span className="poster-icon">🎬</span>
              </div>
              <div className="movie-details">
                <h3 className="movie-name">{orderData.movie.title || 'Película'}</h3>
                <p className="movie-info">🗓️ {orderData.schedule.date ? new Date(orderData.schedule.date).toLocaleDateString() : 'N/A'}</p>
                <p className="movie-info">🕐 {orderData.schedule.time || 'N/A'}</p>
                <p className="movie-info">🎭 {orderData.schedule.room || 'N/A'}</p>
                <p className="movie-info">💺 Asientos: {selectedSeats.map(s => `${s.row}${s.column || s.number}`).join(', ')}</p>
              </div>
            </div>

            <div className="order-details">
              <h3 className="subsection-title">Detalles del Pedido</h3>
              <div className="order-item">
                <span>{selectedSeats.length} x Boleto{selectedSeats.length > 1 ? 's' : ''}</span>
                <span>${orderData.subtotal.toFixed(2)}</span>
              </div>
              <div className="order-item">
                <span>Servicio en línea</span>
                <span>${orderData.serviceCharge.toFixed(2)}</span>
              </div>
              <div className="order-total">
                <span>Total</span>
                <span>${orderData.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="section-card">
            <h2 className="section-title">Método de Pago</h2>
            
            <div className="payment-methods">
              <div 
                className={`payment-option ${paymentMethod === 'card' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('card')}
              >
                <div className="payment-icon">💳</div>
                <div className="payment-info">
                  <h4>Tarjeta de Crédito/Débito</h4>
                  <p>Visa, Mastercard, American Express</p>
                </div>
              </div>

              <div 
                className={`payment-option ${paymentMethod === 'paypal' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('paypal')}
                style={{ opacity: 0.5, cursor: 'not-allowed' }}
              >
                <div className="payment-icon">🅿️</div>
                <div className="payment-info">
                  <h4>PayPal</h4>
                  <p>No disponible temporalmente</p>
                </div>
              </div>

              <div 
                className={`payment-option ${paymentMethod === 'oxxo' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('oxxo')}
                style={{ opacity: 0.5, cursor: 'not-allowed' }}
              >
                <div className="payment-icon">🏪</div>
                <div className="payment-info">
                  <h4>OXXO</h4>
                  <p>No disponible temporalmente</p>
                </div>
              </div>
            </div>

            {paymentMethod === 'card' && (
              <form className="payment-form">
                <div className="form-group">
                  <label>Número de Tarjeta</label>
                  <input 
                    type="text" 
                    name="cardNumber"
                    value={cardData.cardNumber}
                    onChange={handleCardInputChange}
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Vencimiento</label>
                    <input 
                      type="text" 
                      name="expiry"
                      value={cardData.expiry}
                      onChange={handleCardInputChange}
                      placeholder="MM/AA"
                      maxLength="5"
                    />
                  </div>
                  <div className="form-group">
                    <label>CVV</label>
                    <input 
                      type="text" 
                      name="cvv"
                      value={cardData.cvv}
                      onChange={handleCardInputChange}
                      placeholder="123"
                      maxLength="3"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Nombre del Titular</label>
                  <input 
                    type="text" 
                    name="cardName"
                    value={cardData.cardName}
                    onChange={handleCardInputChange}
                    placeholder="Juan Pérez"
                  />
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Right Side - Contact Info */}
        <div className="right-section">
          <div className="section-card">
            <h2 className="section-title">Información de Contacto</h2>
            
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Email</label>
                <input 
                  type="email" 
                  placeholder="usuario@gmail.com"
                  defaultValue={user?.email}
                  readOnly
                />
              </div>

              <div className="form-group">
                <label>Teléfono</label>
                <input 
                  type="tel" 
                  placeholder="55 1234 5678"
                />
              </div>

              <div className="form-group">
                <label>Promociones</label>
                <div className="promo-input">
                  <input 
                    type="text" 
                    placeholder="Código promocional"
                  />
                  <button type="button" className="btn-apply">Aplicar</button>
                </div>
              </div>

              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input 
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                  />
                  <span>Acepto los términos y condiciones</span>
                </label>
              </div>

              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input 
                    type="checkbox"
                    checked={acceptPromotions}
                    onChange={(e) => setAcceptPromotions(e.target.checked)}
                  />
                  <span>Quiero recibir promociones por email</span>
                </label>
              </div>

              <button 
                type="submit" 
                className="btn-checkout"
                disabled={!acceptTerms || loading}
              >
                {loading ? 'Procesando...' : `💳 Finalizar Compra - $${orderData.total.toFixed(2)}`}
              </button>

              <p className="payment-note">
                Pago seguro con cifrado SSL
              </p>
              <div className="payment-logos">
                <span>💳</span>
                <span>🔒</span>
                <span>✓</span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
