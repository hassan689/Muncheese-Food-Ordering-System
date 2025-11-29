import '../../styles/components/ui/Button.css'

const Button = ({ children, variant = 'primary', onClick, disabled, type = 'button', ...props }) => {
  return (
    <button
      className={`btn btn-${variant}`}
      onClick={onClick}
      disabled={disabled}
      type={type}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button

