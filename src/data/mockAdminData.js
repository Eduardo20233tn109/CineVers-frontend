// Mock data for admin modules

export const mockAdministradores = [
  {
    id: 'ADM001',
    nombre: 'Carlos Rodríguez',
    email: 'carlos.rodriguez@cinemax.com',
    estado: 'Activo',
    ultimaConexion: 'Hoy 14:32',
    avatar: 'https://ui-avatars.com/api/?name=Carlos+Rodriguez&background=random'
  },
  {
    id: 'ADM002',
    nombre: 'María González',
    email: 'maria.gonzalez@cinemax.com',
    estado: 'Activo',
    ultimaConexion: 'Hoy 12:15',
    avatar: 'https://ui-avatars.com/api/?name=Maria+Gonzalez&background=random'
  }
]

export const mockClientes = [
  {
    id: 'CLI001',
    nombre: 'Juan Pérez',
    email: 'juan.perez@email.com',
    puntos: 1250,
    estado: 'Activo'
  },
  {
    id: 'CLI002',
    nombre: 'Ana Martínez',
    email: 'ana.martinez@email.com',
    puntos: 850,
    estado: 'Activo'
  },
  {
    id: 'CLI003',
    nombre: 'Pedro Sánchez',
    email: 'pedro.sanchez@email.com',
    puntos: 2100,
    estado: 'Inactivo'
  }
]

export const mockPeliculas = [
  {
    id: 'PEL001',
    titulo: 'Avatar: El Camino del Agua',
    genero: 'Ciencia Ficción',
    duracion: '192 min',
    clasificacion: 'B',
    estado: 'En Cartelera',
    poster: 'https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg'
  },
  {
    id: 'PEL002',
    titulo: 'Super Mario Bros',
    genero: 'Animación',
    duracion: '92 min',
    clasificacion: 'AA',
    estado: 'En Cartelera',
    poster: 'https://image.tmdb.org/t/p/w500/qNBAXBIQlnOThrVvA6mA2B5ggV6.jpg'
  },
  {
    id: 'PEL003',
    titulo: 'John Wick 4',
    genero: 'Acción',
    duracion: '169 min',
    clasificacion: 'B15',
    estado: 'Próximamente',
    poster: 'https://image.tmdb.org/t/p/w500/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg'
  }
]

export const mockSalas = [
  {
    id: 'SALA001',
    numero: 'Sala 1',
    tipo: 'IMAX',
    capacidad: 150,
    estado: 'Activa'
  },
  {
    id: 'SALA002',
    numero: 'Sala 2',
    tipo: 'Estándar',
    capacidad: 100,
    estado: 'Activa'
  },
  {
    id: 'SALA003',
    numero: 'Sala 3',
    tipo: 'VIP',
    capacidad: 50,
    estado: 'Mantenimiento'
  }
]

export const mockTrabajadores = [
  {
    id: 'TRAB001',
    nombre: 'Ana Martínez',
    puesto: 'Taquilla',
    turno: 'Matutino',
    estado: 'Activo'
  },
  {
    id: 'TRAB002',
    nombre: 'Pedro Sánchez',
    puesto: 'Proyección',
    turno: 'Vespertino',
    estado: 'Activo'
  },
  {
    id: 'TRAB003',
    nombre: 'Laura Díaz',
    puesto: 'Taquilla',
    turno: 'Vespertino',
    estado: 'Activo'
  },
  {
    id: 'TRAB004',
    nombre: 'Miguel Torres',
    puesto: 'Limpieza',
    turno: 'Matutino',
    estado: 'Inactivo'
  }
]

export const mockVentas = [
  {
    id: 'VEN001',
    cliente: 'Juan Pérez',
    pelicula: 'Avatar: El Camino del Agua',
    tipoCompra: 'Compra',
    horario: '18:30',
    fecha: '2025-12-01',
    monto: 250.00
  },
  {
    id: 'VEN002',
    cliente: 'Maria Gonzalez',
    pelicula: 'Super Mario Bros',
    tipoCompra: 'Reserva',
    horario: '16:00',
    fecha: '2025-12-01',
    monto: 180.00
  },
  {
    id: 'VEN003',
    cliente: 'Pedro Sánchez',
    pelicula: 'Avatar: El Camino del Agua',
    tipoCompra: 'Compra',
    horario: '20:00',
    fecha: '2025-11-30',
    monto: 300.00
  }
]

export const ventasStats = {
  ventasTotales: 12450.00,
  ventasPorSala: {
    imax: 60,
    estandar: 40
  },
  ventasPorPago: {
    compra: 85,
    reserva: 15
  }
}

// Utility functions for filtering
export const filterBySearch = (data, searchTerm, fields) => {
  if (!searchTerm) return data
  
  return data.filter(item => 
    fields.some(field => 
      item[field]?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  )
}

export const filterByStatus = (data, status) => {
  if (!status || status === 'Todos los Estados') return data
  return data.filter(item => item.estado === status)
}
