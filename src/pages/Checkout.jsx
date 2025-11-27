import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import '../styles/Checkout.css'

function Checkout() {
  const { movieId } = useParams()
  const navigate = useNavigate()
  
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [acceptPromotions, setAcceptPromotions] = useState(false)

  // Mock order data
  const orderData = {
    movie: {
      title: 'Acción Extrema',
      date: '15 de Enero 2024',
      time: '19:30 hrs',
      room: 'Sala 3 - VIP',
      seats: 'Asientos: F7, F8'
    },
    items: [
      { description: '2 x Boleto VIP', amount: 740.00 },
      { description: 'Servicio en línea', amount: 15.00 }
    ],
    total: 255.00
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle payment submission
    console.log('Processing payment...')
  }

  return (
    <div className="checkout-container">
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
          <div className="user-avatar">
            <span>👤</span>
          </div>
        </div>
      </header>

      {/* Progress Stepper */}
      <div className="progress-stepper">
        <div className="step completed">
          <div className="step-icon">✓</div>
          <span className="step-label">Seleccionar Película</span>
        </div>
        <div className="step-line completed"></div>
        <div className="step completed">
          <div className="step-icon">✓</div>
          <span className="step-label">Horario y Sala</span>
        </div>
        <div className="step-line completed"></div>
        <div className="step completed">
          <div className="step-icon">✓</div>
          <span className="step-label">Asientos</span>
        </div>
        <div className="step-line active"></div>
        <div className="step active">
          <div className="step-icon">4</div>
          <span className="step-label">Confirmar Compra</span>
        </div>
      </div>

      <div className="checkout-layout">
        {/* Left Side - Order Summary & Payment */}
        <div className="left-section">
          {/* Order Summary */}
          <div className="section-card">
            <h2 className="section-title">Resumen de tu Compra</h2>
            
            <div className="movie-summary">
              <div className="movie-poster">
                <span className="poster-icon">🎬</span>
              </div>
              <div className="movie-details">
                <h3 className="movie-name">{orderData.movie.title}</h3>
                <p className="movie-info">🗓️ {orderData.movie.date}</p>
                <p className="movie-info">🕐 {orderData.movie.time}</p>
                <p className="movie-info">🎭 {orderData.movie.room}</p>
                <p className="movie-info">💺 {orderData.movie.seats}</p>
              </div>
            </div>

            <div className="order-details">
              <h3 className="subsection-title">Detalles del Pedido</h3>
              {orderData.items.map((item, index) => (
                <div key={index} className="order-item">
                  <span>{item.description}</span>
                  <span>${item.amount.toFixed(2)}</span>
                </div>
              ))}
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
              >
                <div className="payment-icon">🅿️</div>
                <div className="payment-info">
                  <h4>PayPal</h4>
                  <p>Paga de forma segura con PayPal</p>
                </div>
              </div>

              <div 
                className={`payment-option ${paymentMethod === 'oxxo' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('oxxo')}
              >
                <div className="payment-icon">🏪</div>
                <div className="payment-info">
                  <h4>OXXO</h4>
                  <p>Paga en cualquier tienda OXXO</p>
                </div>
              </div>
            </div>

            {/* Card Payment Form */}
            {paymentMethod === 'card' && (
              <form className="payment-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Número de Tarjeta</label>
                  <input 
                    type="text" 
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Vencimiento</label>
                    <input 
                      type="text" 
                      placeholder="MM/AA"
                      maxLength="5"
                    />
                  </div>
                  <div className="form-group">
                    <label>CVV</label>
                    <input 
                      type="text" 
                      placeholder="123"
                      maxLength="3"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Nombre del Titular</label>
                  <input 
                    type="text" 
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
            
            <form className="contact-form">
              <div className="form-group">
                <label>Email</label>
                <input 
                  type="email" 
                  placeholder="usuario@gmail.com"
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
                disabled={!acceptTerms}
              >
                💳 Finalizar Compra - ${orderData.total.toFixed(2)}
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
