import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Login.css'

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    // Simple validation
    if (email && password) {
      navigate('/home')
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo-icon">🎬</div>
          <h1 className="logo-text">CineVers</h1>
          <p className="login-subtitle">Inicia sesión para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <button type="submit" className="btn-primary">
            Iniciar Sesión
          </button>

          <button type="button" className="btn-google">
            <span className="google-icon">G</span>
            Continuar con Google
          </button>

          <p className="register-link">
            ¿No tienes cuenta? <a href="#">Regístrate</a>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Login
