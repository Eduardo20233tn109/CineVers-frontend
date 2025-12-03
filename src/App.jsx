import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
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
import RequireAuth from './components/RequireAuth'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={
          <RequireAuth>
            <Profile />
          </RequireAuth>
        } />
        
        {/* Protected Booking Routes */}
        <Route path="/book-ticket/:movieId" element={
          <RequireAuth>
            <BookTicket />
          </RequireAuth>
        } />
        <Route path="/seat-selection/:movieId/:showtimeId" element={
          <RequireAuth>
            <SeatSelection />
          </RequireAuth>
        } />
        <Route path="/checkout/:movieId" element={
          <RequireAuth>
            <Checkout />
          </RequireAuth>
        } />
        
        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/administradores" element={<Administradores />} />
        <Route path="/admin/peliculas" element={<Peliculas />} />
        <Route path="/admin/salas" element={<Salas />} />
        <Route path="/admin/clientes" element={<Clientes />} />
        <Route path="/admin/trabajadores" element={<Trabajadores />} />
        <Route path="/admin/ventas" element={<Ventas />} />
        
      </Routes>
    </Router>
  )
}

export default App
