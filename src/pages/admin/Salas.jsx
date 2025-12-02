import { useState, useEffect } from 'react'
import AdminLayout from '../../components/AdminLayout'
import Modal from '../../components/Modal'
import roomService from '../../services/roomService'

function Salas() {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [tipoFilter, setTipoFilter] = useState('Tipo')
  const [estadoFilter, setEstadoFilter] = useState('Estado')
  
  // Modal states
  const [viewModal, setViewModal] = useState({ isOpen: false, room: null })
  const [editModal, setEditModal] = useState({ isOpen: false, room: null })
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, room: null })
  const [addModal, setAddModal] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    number: '',
    name: '',
    type: '2D',
    capacity: '',
    rows: '',
    seatsPerRow: '',
    features: [],
    status: 'activa'
  })

  useEffect(() => {
    fetchRooms()
  }, [tipoFilter, estadoFilter])

  const fetchRooms = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const filters = {}
      if (tipoFilter !== 'Tipo') filters.type = tipoFilter
      if (estadoFilter !== 'Estado') filters.status = estadoFilter.toLowerCase()
      
      const response = await roomService.getRooms(filters)
      setRooms(response.data || [])
    } catch (err) {
      console.error('Error fetching rooms:', err)
      setError('Error al cargar las salas')
    } finally {
      setLoading(false)
    }
  }

  const filteredRooms = rooms.filter(room =>
    room.number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getTipoBadgeClass = (tipo) => {
    switch(tipo) {
      case 'IMAX': return 'type-imax'
      case 'VIP': return 'type-vip'
      default: return 'type-standard'
    }
  }

  const handleView = (room) => {
    setViewModal({ isOpen: true, room })
  }

  const handleEdit = (room) => {
    setFormData({
      number: room.number,
      name: room.name,
      type: room.type,
      capacity: room.capacity,
      rows: room.rows,
      seatsPerRow: room.seatsPerRow,
      features: room.features || [],
      status: room.status
    })
    setEditModal({ isOpen: true, room })
  }

  const handleDelete = (room) => {
    setDeleteModal({ isOpen: true, room })
  }

  const handleAdd = () => {
    setFormData({
      number: '',
      name: '',
      type: '2D',
      capacity: '',
      rows: '',
      seatsPerRow: '',
      features: [],
      status: 'activa'
    })
    setAddModal(true)
  }

  const handleSubmitEdit = async (e) => {
    e.preventDefault()
    try {
      await roomService.updateRoom(editModal.room._id || editModal.room.id, formData)
      setEditModal({ isOpen: false, room: null })
      fetchRooms()
    } catch (err) {
      console.error('Error updating room:', err)
      alert('Error al actualizar la sala')
    }
  }

  const handleSubmitAdd = async (e) => {
    e.preventDefault()
    try {
      await roomService.createRoom(formData)
      setAddModal(false)
      fetchRooms()
    } catch (err) {
      console.error('Error creating room:', err)
      alert('Error al crear la sala')
    }
  }

  const handleConfirmDelete = async () => {
    try {
      await roomService.deleteRoom(deleteModal.room._id || deleteModal.room.id)
      setDeleteModal({ isOpen: false, room: null })
      fetchRooms()
    } catch (err) {
      console.error('Error deleting room:', err)
      alert('Error al eliminar la sala: ' + (err.response?.data?.message || err.message))
    }
  }

  const handleFeatureChange = (feature) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }))
  }

  return (
    <AdminLayout 
      title="Gestión de Salas" 
      subtitle="Administra las salas de cine y su configuración"
    >
      <div className="card">
        <div className="card-header">
          <h3>Listado de Salas</h3>
          <button className="btn-add" onClick={handleAdd}>
            <i className="fa-solid fa-plus"></i> Agregar Sala
          </button>
        </div>
        
        <div className="filters-container">
          <input 
            type="text" 
            className="search-bar" 
            placeholder="Buscar sala..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select 
            className="filter-select"
            value={tipoFilter}
            onChange={(e) => setTipoFilter(e.target.value)}
          >
            <option>Tipo</option>
            <option>2D</option>
            <option>3D</option>
            <option>IMAX</option>
            <option>VIP</option>
          </select>
          <select 
            className="filter-select"
            value={estadoFilter}
            onChange={(e) => setEstadoFilter(e.target.value)}
          >
            <option>Estado</option>
            <option>Activa</option>
            <option>Mantenimiento</option>
            <option>Inactiva</option>
          </select>
        </div>
        
        {loading && (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>Cargando salas...</p>
          </div>
        )}
        
        {error && (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#ef4444' }}>
            <p>{error}</p>
            <button onClick={fetchRooms} className="btn-add" style={{ marginTop: '1rem' }}>
              Reintentar
            </button>
          </div>
        )}
        
        {!loading && !error && (
          <table className="data-table">
            <thead>
              <tr>
                <th>Número</th>
                <th>Nombre</th>
                <th>Tipo</th>
                <th>Capacidad</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredRooms.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>
                    No se encontraron salas
                  </td>
                </tr>
              ) : (
                filteredRooms.map((room) => (
                  <tr key={room._id || room.id}>
                    <td><strong>{room.number}</strong></td>
                    <td>{room.name}</td>
                    <td>
                      <span className={`type-badge ${getTipoBadgeClass(room.type)}`}>
                        {room.type}
                      </span>
                    </td>
                    <td>{room.capacity} asientos</td>
                    <td>
                      <span className={`status-badge ${
                        room.status === 'activa' ? 'status-active' : 
                        room.status === 'mantenimiento' ? 'status-mantenimiento' : 
                        'status-inactive'
                      }`}>
                        {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
                      </span>
                    </td>
                    <td>
                      <button className="action-btn text-blue" title="Ver Más" onClick={() => handleView(room)}>
                        <i className="fa-solid fa-eye"></i>
                      </button>
                      <button className="action-btn text-purple" title="Editar" onClick={() => handleEdit(room)}>
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button className="action-btn text-red" title="Desactivar" onClick={() => handleDelete(room)}>
                        <i className="fa-solid fa-ban"></i>
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
        onClose={() => setViewModal({ isOpen: false, room: null })}
        title="Detalles de la Sala"
        size="medium"
      >
        {viewModal.room && (
          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-label">Número de Sala</span>
              <span className="detail-value">{viewModal.room.number}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Nombre</span>
              <span className="detail-value">{viewModal.room.name}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Tipo</span>
              <span className="detail-value">{viewModal.room.type}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Capacidad</span>
              <span className="detail-value">{viewModal.room.capacity} asientos</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Filas</span>
              <span className="detail-value">{viewModal.room.rows}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Asientos por Fila</span>
              <span className="detail-value">{viewModal.room.seatsPerRow}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Estado</span>
              <span className="detail-value">
                {viewModal.room.status.charAt(0).toUpperCase() + viewModal.room.status.slice(1)}
              </span>
            </div>
            <div className="detail-item" style={{ gridColumn: '1 / -1' }}>
              <span className="detail-label">Características</span>
              <span className="detail-value">
                {viewModal.room.features?.join(', ') || 'Ninguna'}
              </span>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, room: null })}
        title="Editar Sala"
        size="large"
      >
        <form onSubmit={handleSubmitEdit} className="modal-form">
          <div className="form-row">
            <div className="form-group">
              <label>Número de Sala *</label>
              <input
                type="text"
                value={formData.number}
                onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Nombre *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Tipo *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                required
              >
                <option value="2D">2D</option>
                <option value="3D">3D</option>
                <option value="IMAX">IMAX</option>
                <option value="VIP">VIP</option>
              </select>
            </div>
            <div className="form-group">
              <label>Capacidad *</label>
              <input
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Filas *</label>
              <input
                type="number"
                value={formData.rows}
                onChange={(e) => setFormData({ ...formData, rows: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Asientos por Fila *</label>
              <input
                type="number"
                value={formData.seatsPerRow}
                onChange={(e) => setFormData({ ...formData, seatsPerRow: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Estado *</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                required
              >
                <option value="activa">Activa</option>
                <option value="mantenimiento">Mantenimiento</option>
                <option value="inactiva">Inactiva</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Características</label>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '8px' }}>
              {['Sonido Dolby', 'Pantalla Curva', 'Asientos Reclinables', 'D-Box'].map(feature => (
                <label key={feature} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.features.includes(feature)}
                    onChange={() => handleFeatureChange(feature)}
                  />
                  <span style={{ fontSize: '14px' }}>{feature}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={() => setEditModal({ isOpen: false, room: null })}>
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
        title="Agregar Nueva Sala"
        size="large"
      >
        <form onSubmit={handleSubmitAdd} className="modal-form">
          <div className="form-row">
            <div className="form-group">
              <label>Número de Sala *</label>
              <input
                type="text"
                value={formData.number}
                onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Nombre *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Tipo *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                required
              >
                <option value="2D">2D</option>
                <option value="3D">3D</option>
                <option value="IMAX">IMAX</option>
                <option value="VIP">VIP</option>
              </select>
            </div>
            <div className="form-group">
              <label>Capacidad *</label>
              <input
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Filas *</label>
              <input
                type="number"
                value={formData.rows}
                onChange={(e) => setFormData({ ...formData, rows: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Asientos por Fila *</label>
              <input
                type="number"
                value={formData.seatsPerRow}
                onChange={(e) => setFormData({ ...formData, seatsPerRow: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Estado *</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                required
              >
                <option value="activa">Activa</option>
                <option value="mantenimiento">Mantenimiento</option>
                <option value="inactiva">Inactiva</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Características</label>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '8px' }}>
              {['Sonido Dolby', 'Pantalla Curva', 'Asientos Reclinables', 'D-Box'].map(feature => (
                <label key={feature} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.features.includes(feature)}
                    onChange={() => handleFeatureChange(feature)}
                  />
                  <span style={{ fontSize: '14px' }}>{feature}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={() => setAddModal(false)}>
              Cancelar
            </button>
            <button type="submit" className="btn-submit">
              Crear Sala
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, room: null })}
        title="Desactivar Sala"
        size="small"
      >
        {deleteModal.room && (
          <div>
            <div className="delete-warning">
              <p>
                <strong>¿Estás seguro de que deseas desactivar esta sala?</strong>
              </p>
              <p style={{ marginTop: '8px' }}>
                La sala "{deleteModal.room.number} - {deleteModal.room.name}" será desactivada y no estará disponible para nuevas reservas.
              </p>
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setDeleteModal({ isOpen: false, room: null })}>
                Cancelar
              </button>
              <button className="btn-delete" onClick={handleConfirmDelete}>
                Desactivar
              </button>
            </div>
          </div>
        )}
      </Modal>
    </AdminLayout>
  )
}

export default Salas
