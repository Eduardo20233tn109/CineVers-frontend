import { useState, useEffect } from 'react'
import AdminLayout from '../../components/AdminLayout'
import Modal from '../../components/Modal'
import movieService from '../../services/movieService'

function Peliculas() {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [generoFilter, setGeneroFilter] = useState('Género')
  const [clasificacionFilter, setClasificacionFilter] = useState('Clasificación')
  const [estadoFilter, setEstadoFilter] = useState('Estado')
  
  // Modal states
  const [viewModal, setViewModal] = useState({ isOpen: false, movie: null })
  const [editModal, setEditModal] = useState({ isOpen: false, movie: null })
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, movie: null })
  const [addModal, setAddModal] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    genre: '',
    duration: '',
    classification: '',
    synopsis: '',
    status: 'activa'
  })

  useEffect(() => {
    fetchMovies()
  }, [generoFilter, clasificacionFilter, estadoFilter])

  const fetchMovies = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const filters = {}
      if (generoFilter !== 'Género') filters.genre = generoFilter
      if (clasificacionFilter !== 'Clasificación') filters.classification = clasificacionFilter
      if (estadoFilter !== 'Estado') {
        if (estadoFilter === 'En Cartelera') filters.status = 'activa'
        else if (estadoFilter === 'Próximamente') filters.status = 'proximamente'
        else if (estadoFilter === 'Inactiva') filters.status = 'inactiva'
      }
      
      const response = await movieService.getMovies(filters)
      setMovies(response.data || response.movies || [])
    } catch (err) {
      console.error('Error fetching movies:', err)
      setError('Error al cargar las películas')
    } finally {
      setLoading(false)
    }
  }

  const filteredMovies = movies.filter(movie =>
    movie.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    movie.genre?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleView = (movie) => {
    setViewModal({ isOpen: true, movie })
  }

  const handleEdit = (movie) => {
    setFormData({
      title: movie.title,
      genre: movie.genre,
      duration: movie.duration,
      classification: movie.classification,
      synopsis: movie.synopsis,
      status: movie.status
    })
    setEditModal({ isOpen: true, movie })
  }

  const handleDelete = (movie) => {
    setDeleteModal({ isOpen: true, movie })
  }

  const handleAdd = () => {
    setFormData({
      title: '',
      genre: '',
      duration: '',
      classification: '',
      synopsis: '',
      status: 'activa'
    })
    setAddModal(true)
  }

  const handleSubmitEdit = async (e) => {
    e.preventDefault()
    try {
      await movieService.updateMovie(editModal.movie._id || editModal.movie.id, formData)
      setEditModal({ isOpen: false, movie: null })
      fetchMovies()
    } catch (err) {
      console.error('Error updating movie:', err)
      alert('Error al actualizar la película')
    }
  }

  const handleSubmitAdd = async (e) => {
    e.preventDefault()
    try {
      await movieService.createMovie(formData)
      setAddModal(false)
      fetchMovies()
    } catch (err) {
      console.error('Error creating movie:', err)
      alert('Error al crear la película')
    }
  }

  const handleConfirmDelete = async () => {
    try {
      await movieService.deleteMovie(deleteModal.movie._id || deleteModal.movie.id)
      setDeleteModal({ isOpen: false, movie: null })
      fetchMovies()
    } catch (err) {
      console.error('Error deleting movie:', err)
      alert('Error al eliminar la película: ' + (err.response?.data?.message || err.message))
    }
  }

  return (
    <AdminLayout 
      title="Catálogo de Películas" 
      subtitle="Gestiona el catálogo completo de películas"
    >
      <div className="card">
        <div className="card-header">
          <h3>Lista de Películas</h3>
          <button className="btn-add" onClick={handleAdd}>
            <i className="fa-solid fa-plus"></i> Agregar Película
          </button>
        </div>
        
        <div className="filters-container">
          <input 
            type="text" 
            className="search-bar" 
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select 
            className="filter-select"
            value={generoFilter}
            onChange={(e) => setGeneroFilter(e.target.value)}
          >
            <option>Género</option>
            <option>Acción</option>
            <option>Aventura</option>
            <option>Comedia</option>
            <option>Drama</option>
            <option>Terror</option>
            <option>Ciencia Ficción</option>
            <option>Romance</option>
            <option>Animación</option>
            <option>Documental</option>
            <option>Suspenso</option>
          </select>
          <select 
            className="filter-select"
            value={clasificacionFilter}
            onChange={(e) => setClasificacionFilter(e.target.value)}
          >
            <option>Clasificación</option>
            <option>AA</option>
            <option>A</option>
            <option>B</option>
            <option>B15</option>
            <option>C</option>
            <option>D</option>
          </select>
          <select 
            className="filter-select"
            value={estadoFilter}
            onChange={(e) => setEstadoFilter(e.target.value)}
          >
            <option>Estado</option>
            <option>En Cartelera</option>
            <option>Próximamente</option>
            <option>Inactiva</option>
          </select>
        </div>
        
        {loading && (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>Cargando películas...</p>
          </div>
        )}
        
        {error && (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#ef4444' }}>
            <p>{error}</p>
            <button onClick={fetchMovies} className="btn-add" style={{ marginTop: '1rem' }}>
              Reintentar
            </button>
          </div>
        )}
        
        {!loading && !error && (
          <table className="data-table">
            <thead>
              <tr>
                <th>Título</th>
                <th>Género</th>
                <th>Duración</th>
                <th>Clasificación</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredMovies.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>
                    No se encontraron películas
                  </td>
                </tr>
              ) : (
                filteredMovies.map((movie) => (
                  <tr key={movie._id || movie.id}>
                    <td>
                      <div className="user-avatar-cell">
                        <div className="avatar" style={{ borderRadius: '4px' }}>
                          <img src={movie.image || '/placeholder.jpg'} alt={movie.title} />
                        </div>
                        <div className="user-name">{movie.title}</div>
                      </div>
                    </td>
                    <td>{movie.genre}</td>
                    <td>{movie.duration} min</td>
                    <td>
                      <span className="status-badge" style={{ background: '#dbeafe', color: '#1e40af' }}>
                        {movie.classification}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${movie.status === 'activa' ? 'status-active' : ''}`}
                        style={
                          movie.status === 'proximamente' ? { background: '#dbeafe', color: '#1e40af' } :
                          movie.status === 'inactiva' ? { background: '#fef3c7', color: '#d97706' } : {}
                        }>
                        {movie.status === 'activa' ? 'En Cartelera' : movie.status === 'proximamente' ? 'Próximamente' : 'Inactiva'}
                      </span>
                    </td>
                    <td>
                      <button className="action-btn text-blue" title="Ver Más" onClick={() => handleView(movie)}>
                        <i className="fa-solid fa-eye"></i>
                      </button>
                      <button className="action-btn text-purple" title="Editar" onClick={() => handleEdit(movie)}>
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button className="action-btn text-red" title="Eliminar" onClick={() => handleDelete(movie)}>
                        <i className="fa-solid fa-trash"></i>
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
        onClose={() => setViewModal({ isOpen: false, movie: null })}
        title="Detalles de la Película"
        size="large"
      >
        {viewModal.movie && (
          <div>
            {viewModal.movie.image && (
              <img 
                src={viewModal.movie.image} 
                alt={viewModal.movie.title}
                className="movie-image-preview"
              />
            )}
            <div className="detail-grid" style={{ marginTop: '24px' }}>
              <div className="detail-item">
                <span className="detail-label">Título</span>
                <span className="detail-value">{viewModal.movie.title}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Género</span>
                <span className="detail-value">{viewModal.movie.genre}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Duración</span>
                <span className="detail-value">{viewModal.movie.duration} minutos</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Clasificación</span>
                <span className="detail-value">{viewModal.movie.classification}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Estado</span>
                <span className="detail-value">
                  {viewModal.movie.status === 'activa' ? 'En Cartelera' : viewModal.movie.status === 'proximamente' ? 'Próximamente' : 'Inactiva'}
                </span>
              </div>
              <div className="detail-item" style={{ gridColumn: '1 / -1' }}>
                <span className="detail-label">Sinopsis</span>
                <span className="detail-value">{viewModal.movie.synopsis}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, movie: null })}
        title="Editar Película"
        size="large"
      >
        <form onSubmit={handleSubmitEdit} className="modal-form">
          <div className="form-row">
            <div className="form-group">
              <label>Título *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Género *</label>
              <select
                value={formData.genre}
                onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                required
              >
                <option value="">Seleccionar...</option>
                <option>Acción</option>
                <option>Aventura</option>
                <option>Comedia</option>
                <option>Drama</option>
                <option>Terror</option>
                <option>Ciencia Ficción</option>
                <option>Romance</option>
                <option>Animación</option>
                <option>Documental</option>
                <option>Suspenso</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Duración (minutos) *</label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Clasificación *</label>
              <select
                value={formData.classification}
                onChange={(e) => setFormData({ ...formData, classification: e.target.value })}
                required
              >
                <option value="">Seleccionar...</option>
                <option>AA</option>
                <option>A</option>
                <option>B</option>
                <option>B15</option>
                <option>C</option>
                <option>D</option>
              </select>
            </div>
            <div className="form-group">
              <label>Estado *</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                required
              >
                <option value="activa">En Cartelera</option>
                <option value="proximamente">Próximamente</option>
                <option value="inactiva">Inactiva</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Sinopsis *</label>
            <textarea
              value={formData.synopsis}
              onChange={(e) => setFormData({ ...formData, synopsis: e.target.value })}
              required
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={() => setEditModal({ isOpen: false, movie: null })}>
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
        title="Agregar Nueva Película"
        size="large"
      >
        <form onSubmit={handleSubmitAdd} className="modal-form">
          <div className="form-row">
            <div className="form-group">
              <label>Título *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Género *</label>
              <select
                value={formData.genre}
                onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                required
              >
                <option value="">Seleccionar...</option>
                <option>Acción</option>
                <option>Aventura</option>
                <option>Comedia</option>
                <option>Drama</option>
                <option>Terror</option>
                <option>Ciencia Ficción</option>
                <option>Romance</option>
                <option>Animación</option>
                <option>Documental</option>
                <option>Suspenso</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Duración (minutos) *</label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Clasificación *</label>
              <select
                value={formData.classification}
                onChange={(e) => setFormData({ ...formData, classification: e.target.value })}
                required
              >
                <option value="">Seleccionar...</option>
                <option>AA</option>
                <option>A</option>
                <option>B</option>
                <option>B15</option>
                <option>C</option>
                <option>D</option>
              </select>
            </div>
            <div className="form-group">
              <label>Estado *</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                required
              >
                <option value="activa">En Cartelera</option>
                <option value="proximamente">Próximamente</option>
                <option value="inactiva">Inactiva</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Sinopsis *</label>
            <textarea
              value={formData.synopsis}
              onChange={(e) => setFormData({ ...formData, synopsis: e.target.value })}
              required
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={() => setAddModal(false)}>
              Cancelar
            </button>
            <button type="submit" className="btn-submit">
              Crear Película
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, movie: null })}
        title="Eliminar Película"
        size="small"
      >
        {deleteModal.movie && (
          <div>
            <div className="delete-warning">
              <p>
                <strong>¿Estás seguro de que deseas eliminar esta película?</strong>
              </p>
              <p style={{ marginTop: '8px' }}>
                Esta acción no se puede deshacer. La película "{deleteModal.movie.title}" será eliminada permanentemente.
              </p>
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setDeleteModal({ isOpen: false, movie: null })}>
                Cancelar
              </button>
              <button className="btn-delete" onClick={handleConfirmDelete}>
                Eliminar
              </button>
            </div>
          </div>
        )}
      </Modal>
    </AdminLayout>
  )
}

export default Peliculas
