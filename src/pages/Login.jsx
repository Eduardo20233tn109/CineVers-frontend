import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { Clapperboard } from 'lucide-react'
import authService from '../services/authService'
import '../styles/Login.css'

function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await authService.login(email, password)
      
      if (response.success) {
        // Redirect based on role or previous location
        const userRole = response.user.role
        const from = location.state?.from?.pathname || '/'
        
        if (userRole === 'gerente' || userRole === 'taquilla') {
          navigate('/admin/dashboard')
        } else {
          navigate(from)
        }
      }
    } catch (err) {
      console.error('Login error:', err)
      
      // Handle different error types
      if (err.response?.data?.message) {
        setError(err.response.data.message)
      } else if (err.response?.status === 401) {
        setError('Correo o contraseña incorrectos')
      } else if (!err.response) {
        setError('No se pudo conectar con el servidor. Verifica que el backend esté corriendo.')
      } else {
        setError('Error al iniciar sesión. Intenta de nuevo.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo-icon">
            <Clapperboard size={48} color="#ec4899" />
          </div>
          <h1 className="logo-text">CineVers</h1>
          <p className="login-subtitle">Inicia sesión para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-group">
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              required
              disabled={loading}
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
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>

          <p className="register-link">
            ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Login
