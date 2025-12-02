import { useState, useEffect } from 'react'
import AdminLayout from '../../components/AdminLayout'
import Modal from '../../components/Modal'
import employeeService from '../../services/employeeService'

function Administradores() {
  const [admins, setAdmins] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('Estado')

  // Modal states
  const [viewModal, setViewModal] = useState({ isOpen: false, admin: null })
  const [editModal, setEditModal] = useState({ isOpen: false, admin: null })
  const [statusModal, setStatusModal] = useState({ isOpen: false, admin: null })
  const [addModal, setAddModal] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'gerente', // Fixed role
    status: 'activo'
  })

  useEffect(() => {
    fetchAdmins()
  }, [statusFilter])

  const fetchAdmins = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const filters = {
        role: 'gerente', // Only fetch gerentes (administrators)
      }
      
      if (statusFilter !== 'Estado') {
        filters.status = statusFilter.toLowerCase()
      }
      
      const response = await employeeService.getEmployees(filters)
      setAdmins(response.data || response.employees || [])
    } catch (err) {
      console.error('Error fetching admins:', err)
      setError('Error al cargar los administradores')
    } finally {
      setLoading(false)
    }
  }

  // Filter by search term (client-side)
  const filteredAdmins = admins.filter(admin =>
    admin.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleView = (admin) => {
    setViewModal({ isOpen: true, admin })
  }

  const handleEdit = (admin) => {
    setFormData({
      name: admin.name,
      email: admin.email,
      phone: admin.phone || '',
      role: 'gerente',
      status: admin.status
    })
    setEditModal({ isOpen: true, admin })
  }

  const handleToggleStatus = (admin) => {
    setStatusModal({ isOpen: true, admin })
  }

  const handleAdd = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      role: 'gerente',
      status: 'activo'
    })
    setAddModal(true)
  }

  const handleSubmitEdit = async (e) => {
    e.preventDefault()
    try {
      await employeeService.updateEmployee(editModal.admin.id || editModal.admin._id, formData)
      setEditModal({ isOpen: false, admin: null })
      fetchAdmins()
    } catch (err) {
      console.error('Error updating admin:', err)
      alert(err.response?.data?.message || 'Error al actualizar el administrador')
    }
  }

  const handleSubmitAdd = async (e) => {
    e.preventDefault()
    if (formData.password.length < 8) {
      alert('La contraseña debe tener al menos 8 caracteres')
      return
    }
    try {
      await employeeService.createEmployee(formData)
      setAddModal(false)
      fetchAdmins()
    } catch (err) {
      console.error('Error creating admin:', err)
      alert(err.response?.data?.message || 'Error al crear el administrador')
    }
  }

  const handleConfirmStatusChange = async () => {
    try {
      const adminId = statusModal.admin.id || statusModal.admin._id
      if (statusModal.admin.status === 'activo') {
        await employeeService.deleteEmployee(adminId) // Deactivate
      } else {
        await employeeService.reactivateEmployee(adminId) // Reactivate
      }
      setStatusModal({ isOpen: false, admin: null })
      fetchAdmins()
    } catch (err) {
      console.error('Error changing status:', err)
      alert('Error al cambiar el estado del administrador')
    }
  }

  return (
    <AdminLayout 
      title="Gestión de Administradores" 
      subtitle="Administra los usuarios con permisos de gerente"
    >
      <div className="card">
        <div className="card-header">
          <h3>Lista de Administradores</h3>
          <button className="btn-add" onClick={handleAdd}>
            <i className="fa-solid fa-plus"></i> Agregar Administrador
          </button>
        </div>
        
        <div className="filters-container">
          <input 
            type="text" 
            className="search-bar" 
            placeholder="Buscar administrador..."
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
            <p>Cargando administradores...</p>
          </div>
        )}
        
        {error && (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#ef4444' }}>
            <p>{error}</p>
            <button onClick={fetchAdmins} className="btn-add" style={{ marginTop: '1rem' }}>
              Reintentar
            </button>
          </div>
        )}
        
        {!loading && !error && (
          <table className="data-table">
            <thead>
              <tr>
                <th>Administrador</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Estado</th>
                <th>Fecha Registro</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredAdmins.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>
                    No se encontraron administradores
                  </td>
                </tr>
              ) : (
                filteredAdmins.map((admin) => (
                  <tr key={admin._id || admin.id}>
                    <td>
                      <div className="user-avatar-cell">
                        <div className="avatar">
                          {admin.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="user-name">{admin.name}</div>
                      </div>
                    </td>
                    <td>{admin.email}</td>
                    <td>{admin.phone || 'N/A'}</td>
                    <td>
                      <span className={`status-badge status-${admin.status?.toLowerCase()}`}>
                        {admin.status?.charAt(0).toUpperCase() + admin.status?.slice(1)}
                      </span>
                    </td>
                    <td>{new Date(admin.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button className="action-btn text-blue" title="Ver Más" onClick={() => handleView(admin)}>
                        <i className="fa-solid fa-eye"></i>
                      </button>
                      <button className="action-btn text-purple" title="Editar" onClick={() => handleEdit(admin)}>
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button 
                        className="action-btn text-red" 
                        title={admin.status === 'activo' ? 'Desactivar' : 'Activar'}
                        onClick={() => handleToggleStatus(admin)}
                      >
                        <i className={`fa-solid fa-${admin.status === 'activo' ? 'ban' : 'check'}`}></i>
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
        onClose={() => setViewModal({ isOpen: false, admin: null })}
        title="Detalles del Administrador"
        size="medium"
      >
        {viewModal.admin && (
          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-label">Nombre</span>
              <span className="detail-value">{viewModal.admin.name}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Email</span>
              <span className="detail-value">{viewModal.admin.email}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Teléfono</span>
              <span className="detail-value">{viewModal.admin.phone || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Rol</span>
              <span className="detail-value">Gerente (Administrador)</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Estado</span>
              <span className="detail-value">
                {viewModal.admin.status?.charAt(0).toUpperCase() + viewModal.admin.status?.slice(1)}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Fecha de Registro</span>
              <span className="detail-value">
                {new Date(viewModal.admin.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, admin: null })}
        title="Editar Administrador"
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
            <button type="button" className="btn-cancel" onClick={() => setEditModal({ isOpen: false, admin: null })}>
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
        title="Agregar Nuevo Administrador"
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
              Crear Administrador
            </button>
          </div>
        </form>
      </Modal>

      {/* Status Change Modal */}
      <Modal
        isOpen={statusModal.isOpen}
        onClose={() => setStatusModal({ isOpen: false, admin: null })}
        title={statusModal.admin?.status === 'activo' ? 'Desactivar Administrador' : 'Activar Administrador'}
        size="small"
      >
        {statusModal.admin && (
          <div>
            <div className="delete-warning">
              <p>
                <strong>
                  ¿Estás seguro de que deseas {statusModal.admin.status === 'activo' ? 'desactivar' : 'activar'} a este administrador?
                </strong>
              </p>
              <p style={{ marginTop: '8px' }}>
                El administrador "{statusModal.admin.name}" será {statusModal.admin.status === 'activo' ? 'desactivado' : 'activado'}.
              </p>
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setStatusModal({ isOpen: false, admin: null })}>
                Cancelar
              </button>
              <button className={statusModal.admin.status === 'activo' ? 'btn-delete' : 'btn-submit'} onClick={handleConfirmStatusChange}>
                {statusModal.admin.status === 'activo' ? 'Desactivar' : 'Activar'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </AdminLayout>
  )
}

export default Administradores
