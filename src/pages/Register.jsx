import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Clapperboard } from 'lucide-react'
import authService from '../services/authService'
import '../styles/Register.css'

function Register() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    if (formData.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres')
      return
    }

    setLoading(true)

    try {
      // Register user
      await authService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      })
      
      // Auto login after registration
      const loginResponse = await authService.login(formData.email, formData.password)
      
      if (loginResponse.success) {
        navigate('/')
      } else {
        navigate('/login')
      }
    } catch (err) {
      console.error('Registration error:', err)
      if (err.response?.data?.message) {
        setError(err.response.data.message)
      } else {
        setError('Error al registrar usuario. Intenta de nuevo.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <div className="logo-icon">
            <Clapperboard size={48} color="#ec4899" />
          </div>
          <h1 className="logo-text">CineVers</h1>
          <p className="register-subtitle">Crea tu cuenta para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-group">
            <input
              type="text"
              name="name"
              placeholder="Nombre completo"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Correo electrónico"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Contraseña (mínimo 8 caracteres)"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirmar contraseña"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="form-input"
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Creando cuenta...' : 'Registrarse'}
          </button>

          <p className="login-link">
            ¿Ya tienes cuenta? <Link to="/login">Inicia Sesión</Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Register
