import { useState, useEffect } from 'react'
import AdminLayout from '../../components/AdminLayout'
import Modal from '../../components/Modal'
import userService from '../../services/userService'

function Clientes() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('Estado')
  
  // Modal states
  const [viewModal, setViewModal] = useState({ isOpen: false, client: null })
  const [editModal, setEditModal] = useState({ isOpen: false, client: null })
  const [statusModal, setStatusModal] = useState({ isOpen: false, client: null })
  const [addModal, setAddModal] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    status: 'activo'
  })

  useEffect(() => {
    fetchClients()
  }, [statusFilter])

  const fetchClients = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const filters = {
        role: 'cliente', // Only fetch clients
      }
      
      if (statusFilter !== 'Estado') {
        filters.status = statusFilter.toLowerCase()
      }
      
      const response = await userService.getAllUsers(filters)
      setClients(response.users || [])
    } catch (err) {
      console.error('Error fetching clients:', err)
      setError('Error al cargar los clientes')
    } finally {
      setLoading(false)
    }
  }

  // Filter by search term (client-side)
  const filteredClients = clients.filter(client =>
    client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleView = async (client) => {
    try {
      const response = await userService.getUserById(client.id)
      setViewModal({ isOpen: true, client: response.user, bookings: response.bookings })
    } catch (err) {
      console.error('Error fetching client details:', err)
      alert('Error al cargar los detalles del cliente')
    }
  }

  const handleEdit = (client) => {
    setFormData({
      name: client.name,
      email: client.email,
      phone: client.phone || '',
      status: client.status
    })
    setEditModal({ isOpen: true, client })
  }

  const handleToggleStatus = (client) => {
    setStatusModal({ isOpen: true, client })
  }

  const handleAdd = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      status: 'activo'
    })
    setAddModal(true)
  }

  const handleSubmitEdit = async (e) => {
    e.preventDefault()
    try {
      await userService.updateUser(editModal.client.id, formData)
      setEditModal({ isOpen: false, client: null })
      fetchClients()
    } catch (err) {
      console.error('Error updating client:', err)
      alert(err.response?.data?.message || 'Error al actualizar el cliente')
    }
  }

  const handleSubmitAdd = async (e) => {
    e.preventDefault()
    if (formData.password.length < 8) {
      alert('La contraseña debe tener al menos 8 caracteres')
      return
    }
    try {
      await userService.createClient(formData)
      setAddModal(false)
      fetchClients()
    } catch (err) {
      console.error('Error creating client:', err)
      alert(err.response?.data?.message || 'Error al crear el cliente')
    }
  }

  const handleConfirmStatusChange = async () => {
    try {
      const newStatus = statusModal.client.status === 'activo' ? 'inactivo' : 'activo'
      await userService.updateUserStatus(statusModal.client.id, newStatus)
      setStatusModal({ isOpen: false, client: null })
      fetchClients()
    } catch (err) {
      console.error('Error changing status:', err)
      alert('Error al cambiar el estado del cliente')
    }
  }

  return (
    <AdminLayout 
      title="Base de Datos de Clientes" 
      subtitle="Gestiona la información de todos los clientes registrados"
    >
      <div className="card">
        <div className="card-header">
          <h3>Lista de Clientes</h3>
          <button className="btn-add" onClick={handleAdd}>
            <i className="fa-solid fa-plus"></i> Agregar Cliente
          </button>
        </div>
        
        <div className="filters-container">
          <input 
            type="text" 
            className="search-bar" 
            placeholder="Buscar cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select 
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option>Estado</option>
            <option>Activo</option>
            <option>Inactivo</option>
          </select>
        </div>
        
        {loading && (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>Cargando clientes...</p>
          </div>
        )}
        
        {error && (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#ef4444' }}>
            <p>{error}</p>
            <button onClick={fetchClients} className="btn-add" style={{ marginTop: '1rem' }}>
              Reintentar
            </button>
          </div>
        )}
        
        {!loading && !error && (
          <table className="data-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Estado</th>
                <th>Fecha de Registro</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>
                    No se encontraron clientes
                  </td>
                </tr>
              ) : (
                filteredClients.map((client) => (
                  <tr key={client.id}>
                    <td><strong>{client.name}</strong></td>
                    <td>{client.email}</td>
                    <td>{client.phone || 'N/A'}</td>
                    <td>
                      <span className={`status-badge status-${client.status.toLowerCase()}`}>
                        {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                      </span>
                    </td>
                    <td>{new Date(client.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button className="action-btn text-blue" title="Ver Más" onClick={() => handleView(client)}>
                        <i className="fa-solid fa-eye"></i>
                      </button>
                      <button className="action-btn text-purple" title="Editar" onClick={() => handleEdit(client)}>
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button 
                        className="action-btn text-red" 
                        title={client.status === 'activo' ? 'Desactivar' : 'Activar'}
                        onClick={() => handleToggleStatus(client)}
                      >
                        <i className={`fa-solid fa-${client.status === 'activo' ? 'ban' : 'check'}`}></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* View Modal */}
      <Modal
        isOpen={viewModal.isOpen}
        onClose={() => setViewModal({ isOpen: false, client: null, bookings: [] })}
        title="Detalles del Cliente"
        size="medium"
      >
        {viewModal.client && (
          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-label">Nombre</span>
              <span className="detail-value">{viewModal.client.name}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Email</span>
              <span className="detail-value">{viewModal.client.email}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Teléfono</span>
              <span className="detail-value">{viewModal.client.phone || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Estado</span>
              <span className="detail-value">
                {viewModal.client.status.charAt(0).toUpperCase() + viewModal.client.status.slice(1)}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Fecha de Registro</span>
              <span className="detail-value">
                {new Date(viewModal.client.createdAt).toLocaleDateString()}
              </span>
            </div>
            {viewModal.bookings && viewModal.bookings.length > 0 && (
              <div className="detail-item" style={{ gridColumn: '1 / -1' }}>
                <span className="detail-label">Historial de Compras ({viewModal.bookings.length})</span>
                <div style={{ marginTop: '8px' }}>
                  {viewModal.bookings.map((booking, idx) => (
                    <div key={booking.id} style={{ 
                      padding: '8px', 
                      background: 'rgba(255,255,255,0.05)', 
                      borderRadius: '4px',
                      marginBottom: '8px'
                    }}>
                      <strong>{booking.movie?.title}</strong> - ${booking.totalAmount} - {booking.status}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, client: null })}
        title="Editar Cliente"
        size="medium"
      >
        <form onSubmit={handleSubmitEdit} className="modal-form">
          <div className="form-group">
            <label>Nombre *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Teléfono</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Estado *</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              required
            >
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={() => setEditModal({ isOpen: false, client: null })}>
              Cancelar
            </button>
            <button type="submit" className="btn-submit">
              Guardar Cambios
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Modal */}
      <Modal
        isOpen={addModal}
        onClose={() => setAddModal(false)}
        title="Agregar Nuevo Cliente"
        size="medium"
      >
        <form onSubmit={handleSubmitAdd} className="modal-form">
          <div className="form-group">
            <label>Nombre *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Teléfono</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Contraseña * (mínimo 8 caracteres)</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              minLength="8"
              required
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={() => setAddModal(false)}>
              Cancelar
            </button>
            <button type="submit" className="btn-submit">
              Crear Cliente
            </button>
          </div>
        </form>
      </Modal>

      {/* Status Change Modal */}
      <Modal
        isOpen={statusModal.isOpen}
        onClose={() => setStatusModal({ isOpen: false, client: null })}
        title={statusModal.client?.status === 'activo' ? 'Desactivar Cliente' : 'Activar Cliente'}
        size="small"
      >
        {statusModal.client && (
          <div>
            <div className="delete-warning">
              <p>
                <strong>
                  ¿Estás seguro de que deseas {statusModal.client.status === 'activo' ? 'desactivar' : 'activar'} este cliente?
                </strong>
              </p>
              <p style={{ marginTop: '8px' }}>
                El cliente "{statusModal.client.name}" será {statusModal.client.status === 'activo' ? 'desactivado' : 'activado'}.
              </p>
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setStatusModal({ isOpen: false, client: null })}>
                Cancelar
              </button>
              <button className={statusModal.client.status === 'activo' ? 'btn-delete' : 'btn-submit'} onClick={handleConfirmStatusChange}>
                {statusModal.client.status === 'activo' ? 'Desactivar' : 'Activar'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </AdminLayout>
  )
}

export default Clientes
