import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import BookTicket from './pages/BookTicket'
import SeatSelection from './pages/SeatSelection'
import Checkout from './pages/Checkout'
import AdminDashboard from './pages/admin/AdminDashboard'
import Administradores from './pages/admin/Administradores'
import Peliculas from './pages/admin/Peliculas'
import Salas from './pages/admin/Salas'
import Clientes from './pages/admin/Clientes'
import Trabajadores from './pages/admin/Trabajadores'
import Ventas from './pages/admin/Ventas'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/book-ticket/:movieId" element={<BookTicket />} />
        <Route path="/seat-selection/:movieId/:showtimeId" element={<SeatSelection />} />
        <Route path="/checkout/:movieId" element={<Checkout />} />
        
        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/administradores" element={<Administradores />} />
        <Route path="/admin/peliculas" element={<Peliculas />} />
        <Route path="/admin/salas" element={<Salas />} />
        <Route path="/admin/clientes" element={<Clientes />} />
        <Route path="/admin/trabajadores" element={<Trabajadores />} />
        <Route path="/admin/ventas" element={<Ventas />} />
        
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App
