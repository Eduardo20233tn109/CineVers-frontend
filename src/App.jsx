import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import BookTicket from './pages/BookTicket'
import SeatSelection from './pages/SeatSelection'
import Checkout from './pages/Checkout'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/book-ticket/:movieId" element={<BookTicket />} />
        <Route path="/seat-selection/:movieId/:showtimeId" element={<SeatSelection />} />
        <Route path="/checkout/:movieId" element={<Checkout />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App
