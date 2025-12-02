import { useState, useEffect } from 'react'
import AdminLayout from '../../components/AdminLayout'
import Modal from '../../components/Modal'
import employeeService from '../../services/employeeService'

function Trabajadores() {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [puestoFilter, setPuestoFilter] = useState('Puesto')
  const [estadoFilter, setEstadoFilter] = useState('Estado')

  // Modal states
  const [viewModal, setViewModal] = useState({ isOpen: false, employee: null })
  const [editModal, setEditModal] = useState({ isOpen: false, employee: null })
  const [statusModal, setStatusModal] = useState({ isOpen: false, employee: null })
  const [addModal, setAddModal] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'taquilla',
    status: 'activo'
  })

  useEffect(() => {
    fetchEmployees()
  }, [puestoFilter, estadoFilter])

  const fetchEmployees = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const filters = {}
      
      // Filter by role (puesto)
      if (puestoFilter !== 'Puesto') {
        filters.role = puestoFilter.toLowerCase()
      }
      
      // Filter by status
      if (estadoFilter !== 'Estado') {
        filters.status = estadoFilter.toLowerCase()
      }
      
      const response = await employeeService.getEmployees(filters)
      setEmployees(response.data || response.employees || [])
    } catch (err) {
      console.error('Error fetching employees:', err)
      setError('Error al cargar los trabajadores')
    } finally {
      setLoading(false)
    }
  }

  // Filter by search term (client-side)
  const filteredEmployees = employees.filter(employee => {
    return employee.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           employee.email?.toLowerCase().includes(searchTerm.toLowerCase())
  })

  const handleView = (employee) => {
    setViewModal({ isOpen: true, employee })
  }

  const handleEdit = (employee) => {
    setFormData({
      name: employee.name,
      email: employee.email,
      phone: employee.phone || '',
      role: employee.role,
      status: employee.status
    })
    setEditModal({ isOpen: true, employee })
  }

  const handleToggleStatus = (employee) => {
    setStatusModal({ isOpen: true, employee })
  }

  const handleAdd = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      role: 'taquilla',
      status: 'activo'
    })
    setAddModal(true)
  }

  const handleSubmitEdit = async (e) => {
    e.preventDefault()
    try {
      await employeeService.updateEmployee(editModal.employee.id || editModal.employee._id, formData)
      setEditModal({ isOpen: false, employee: null })
      fetchEmployees()
    } catch (err) {
      console.error('Error updating employee:', err)
      alert(err.response?.data?.message || 'Error al actualizar el trabajador')
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
      fetchEmployees()
    } catch (err) {
      console.error('Error creating employee:', err)
      alert(err.response?.data?.message || 'Error al crear el trabajador')
    }
  }

  const handleConfirmStatusChange = async () => {
    try {
      const employeeId = statusModal.employee.id || statusModal.employee._id
      if (statusModal.employee.status === 'activo') {
        await employeeService.deleteEmployee(employeeId) // Deactivate
      } else {
        await employeeService.reactivateEmployee(employeeId) // Reactivate
      }
      setStatusModal({ isOpen: false, employee: null })
      fetchEmployees()
    } catch (err) {
      console.error('Error changing status:', err)
      alert('Error al cambiar el estado del trabajador')
    }
  }

  return (
    <AdminLayout 
      title="Gestión de Trabajadores" 
      subtitle="Administra el personal del cine"
    >
      <div className="card">
        <div className="card-header">
          <h3>Lista de Trabajadores</h3>
          <button className="btn-add" onClick={handleAdd}>
            <i className="fa-solid fa-plus"></i> Agregar Trabajador
          </button>
        </div>
        
        <div className="filters-container">
          <input 
            type="text" 
            className="search-bar" 
            placeholder="Buscar trabajador..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select 
            className="filter-select"
            value={puestoFilter}
            onChange={(e) => setPuestoFilter(e.target.value)}
          >
            <option>Puesto</option>
            <option>Taquilla</option>
            <option>Gerente</option>
          </select>
          <select 
            className="filter-select"
            value={estadoFilter}
            onChange={(e) => setEstadoFilter(e.target.value)}
          >
            <option>Estado</option>
            <option>Activo</option>
            <option>Inactivo</option>
          </select>
        </div>
        
        {loading && (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>Cargando trabajadores...</p>
          </div>
        )}
        
        {error && (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#ef4444' }}>
            <p>{error}</p>
            <button onClick={fetchEmployees} className="btn-add" style={{ marginTop: '1rem' }}>
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
                <th>Puesto</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>
                    No se encontraron trabajadores
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((employee) => (
                  <tr key={employee._id || employee.id}>
                    <td><strong>{employee.name}</strong></td>
                    <td>{employee.email}</td>
                    <td>
                      <span className="status-badge" style={{ 
                        background: employee.role === 'gerente' ? '#f3e8ff' : '#dbeafe', 
                        color: employee.role === 'gerente' ? '#7e22ce' : '#1e40af' 
                      }}>
                        {employee.role?.charAt(0).toUpperCase() + employee.role?.slice(1)}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge status-${employee.status?.toLowerCase()}`}>
                        {employee.status?.charAt(0).toUpperCase() + employee.status?.slice(1)}
                      </span>
                    </td>
                    <td>
                      <button className="action-btn text-blue" title="Ver Más" onClick={() => handleView(employee)}>
                        <i className="fa-solid fa-eye"></i>
                      </button>
                      <button className="action-btn text-purple" title="Editar" onClick={() => handleEdit(employee)}>
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button 
                        className="action-btn text-red" 
                        title={employee.status === 'activo' ? 'Desactivar' : 'Activar'}
                        onClick={() => handleToggleStatus(employee)}
                      >
                        <i className={`fa-solid fa-${employee.status === 'activo' ? 'ban' : 'check'}`}></i>
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
        onClose={() => setViewModal({ isOpen: false, employee: null })}
        title="Detalles del Trabajador"
        size="medium"
      >
        {viewModal.employee && (
          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-label">Nombre</span>
              <span className="detail-value">{viewModal.employee.name}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Email</span>
              <span className="detail-value">{viewModal.employee.email}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Teléfono</span>
              <span className="detail-value">{viewModal.employee.phone || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Puesto</span>
              <span className="detail-value">
                {viewModal.employee.role?.charAt(0).toUpperCase() + viewModal.employee.role?.slice(1)}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Estado</span>
              <span className="detail-value">
                {viewModal.employee.status?.charAt(0).toUpperCase() + viewModal.employee.status?.slice(1)}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Fecha de Registro</span>
              <span className="detail-value">
                {new Date(viewModal.employee.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, employee: null })}
        title="Editar Trabajador"
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
          <div className="form-row">
            <div className="form-group">
              <label>Puesto *</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                required
              >
                <option value="taquilla">Taquilla</option>
                <option value="gerente">Gerente</option>
              </select>
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
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={() => setEditModal({ isOpen: false, employee: null })}>
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
        title="Agregar Nuevo Trabajador"
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
          <div className="form-row">
            <div className="form-group">
              <label>Puesto *</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                required
              >
                <option value="taquilla">Taquilla</option>
                <option value="gerente">Gerente</option>
              </select>
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
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={() => setAddModal(false)}>
              Cancelar
            </button>
            <button type="submit" className="btn-submit">
              Crear Trabajador
            </button>
          </div>
        </form>
      </Modal>

      {/* Status Change Modal */}
      <Modal
        isOpen={statusModal.isOpen}
        onClose={() => setStatusModal({ isOpen: false, employee: null })}
        title={statusModal.employee?.status === 'activo' ? 'Desactivar Trabajador' : 'Activar Trabajador'}
        size="small"
      >
        {statusModal.employee && (
          <div>
            <div className="delete-warning">
              <p>
                <strong>
                  ¿Estás seguro de que deseas {statusModal.employee.status === 'activo' ? 'desactivar' : 'activar'} a este trabajador?
                </strong>
              </p>
              <p style={{ marginTop: '8px' }}>
                El trabajador "{statusModal.employee.name}" será {statusModal.employee.status === 'activo' ? 'desactivado' : 'activado'}.
              </p>
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setStatusModal({ isOpen: false, employee: null })}>
                Cancelar
              </button>
              <button className={statusModal.employee.status === 'activo' ? 'btn-delete' : 'btn-submit'} onClick={handleConfirmStatusChange}>
                {statusModal.employee.status === 'activo' ? 'Desactivar' : 'Activar'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </AdminLayout>
  )
}

export default Trabajadores
