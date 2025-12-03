import { useEffect } from 'react'
import { CheckCircle, X } from 'lucide-react'
import '../styles/SuccessModal.css'

function SuccessModal({ isOpen, message, onClose, autoClose = true, duration = 5000 }) {
  useEffect(() => {
    if (isOpen && autoClose) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [isOpen, autoClose, duration, onClose])

  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>
        
        <div className="modal-icon">
          <CheckCircle size={64} color="#10b981" />
        </div>
        
        <h2 className="modal-title">¡Excelente!</h2>
        <p className="modal-message">{message}</p>
        
        <button className="modal-button" onClick={onClose}>
          Volver al Inicio
        </button>
        
        {autoClose && (
          <div className="modal-progress-bar">
            <div className="progress-fill" style={{ animationDuration: `${duration}ms` }}></div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SuccessModal
