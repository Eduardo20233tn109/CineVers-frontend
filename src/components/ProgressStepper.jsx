import PropTypes from 'prop-types'
import '../styles/ProgressStepper.css'

const steps = [
  { number: 1, label: 'Seleccionar Película' },
  { number: 2, label: 'Horario y Sala' },
  { number: 3, label: 'Asientos' },
  { number: 4, label: 'Confirmar Compra' },
  { number: 5, label: 'Boleto Digital' }
]

function ProgressStepper({ currentStep }) {
  const getStepStatus = (stepNumber) => {
    if (stepNumber < currentStep) return 'completed'
    if (stepNumber === currentStep) return 'active'
    return 'pending'
  }

  const getLineStatus = (stepNumber) => {
    if (stepNumber < currentStep) return 'completed'
    if (stepNumber === currentStep - 1) return 'active'
    return 'pending'
  }

  return (
    <div className="progress-stepper">
      {steps.map((step, index) => (
        <div key={step.number} className="stepper-wrapper">
          <div className={`step ${getStepStatus(step.number)}`}>
            <div className="step-icon">
              {getStepStatus(step.number) === 'completed' ? '✓' : step.number}
            </div>
            <span className="step-label">{step.label}</span>
          </div>
          {index < steps.length - 1 && (
            <div className={`step-line ${getLineStatus(step.number + 1)}`}></div>
          )}
        </div>
      ))}
    </div>
  )
}

ProgressStepper.propTypes = {
  currentStep: PropTypes.number.isRequired
}

export default ProgressStepper
