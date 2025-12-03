import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Lock, Save, Clapperboard, LogOut } from 'lucide-react'
import authService from '../services/authService'
import '../styles/Profile.css'

function Profile() {
  const navigate = useNavigate()
  const [user, setUser] = useState({
    name: '',
    email: '',
    phone: ''
  })
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const data = await authService.getProfile()
      if (data.success) {
        setUser({
          name: data.user.name,
          email: data.user.email,
          phone: data.user.phone || ''
        })
      }
    } catch (err) {
      console.error('Error loading profile:', err)
      if (!authService.isAuthenticated()) {
        navigate('/login')
      }
    }
  }

  const handleInfoChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value })
  }

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value })
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      const updateData = {
        name: user.name,
        phone: user.phone
      }

      // Only add password fields if user is trying to change it
      if (passwords.newPassword) {
        if (passwords.newPassword !== passwords.confirmPassword) {
          setMessage({ type: 'error', text: 'Las nuevas contraseñas no coinciden' })
          setLoading(false)
          return
        }
        if (passwords.newPassword.length < 8) {
          setMessage({ type: 'error', text: 'La contraseña debe tener al menos 8 caracteres' })
          setLoading(false)
          return
        }
        if (!passwords.currentPassword) {
          setMessage({ type: 'error', text: 'Debes ingresar tu contraseña actual' })
          setLoading(false)
          return
        }
        
        updateData.currentPassword = passwords.currentPassword
        updateData.newPassword = passwords.newPassword
      }

      const response = await authService.updateProfile(updateData)
      
      if (response.success) {
        setMessage({ type: 'success', text: 'Perfil actualizado correctamente' })
        // Clear password fields
        setPasswords({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
      }
    } catch (err) {
      console.error('Update error:', err)
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.message || 'Error al actualizar el perfil' 
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    authService.logout()
    navigate('/login')
  }

  return (
    <div className="profile-container">
      <header className="header">
        <div className="header-content">
          <div className="logo" onClick={() => navigate('/')}>
            <Clapperboard size={32} color="#ec4899" />
            <span className="logo-text">CineVers</span>
          </div>
          <nav className="nav">
            <a href="/" className="nav-link">Cartelera</a>
          </nav>
          <div className="header-actions">
            <button className="btn-logout" onClick={handleLogout}>
              <LogOut size={18} /> Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              <User size={48} color="white" />
            </div>
            <h1>Mi Perfil</h1>
            <p>{user.email}</p>
          </div>

          {message.text && (
            <div className={`message-banner ${message.type}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="profile-form">
            <div className="form-section">
              <h3>Información Personal</h3>
              <div className="form-group">
                <label>Nombre Completo</label>
                <input
                  type="text"
                  name="name"
                  value={user.name}
                  onChange={handleInfoChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Teléfono</label>
                <input
                  type="tel"
                  name="phone"
                  value={user.phone}
                  onChange={handleInfoChange}
                  placeholder="Opcional"
                />
              </div>
            </div>

            <div className="form-section">
              <h3>Cambiar Contraseña</h3>
              <div className="form-group">
                <label>Contraseña Actual</label>
                <div className="input-with-icon">
                  <Lock size={18} />
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwords.currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="Solo si deseas cambiarla"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Nueva Contraseña</label>
                <div className="input-with-icon">
                  <Lock size={18} />
                  <input
                    type="password"
                    name="newPassword"
                    value={passwords.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Mínimo 8 caracteres"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Confirmar Nueva Contraseña</label>
                <div className="input-with-icon">
                  <Lock size={18} />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwords.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="Confirma tu nueva contraseña"
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="btn-save" disabled={loading}>
              <Save size={20} />
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Profile
