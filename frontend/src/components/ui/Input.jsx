import '../../styles/components/ui/Input.css'

const Input = ({ label, error, ...props }) => {
  return (
    <div className="input-group">
      {label && <label>{label}</label>}
      <input className={error ? 'input-error' : ''} {...props} />
      {error && <span className="error-message">{error}</span>}
    </div>
  )
}

export default Input

