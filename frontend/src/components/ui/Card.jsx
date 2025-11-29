import '../../styles/components/ui/Card.css'

const Card = ({ children, className = '', ...props }) => {
  return (
    <div className={`card ${className}`} {...props}>
      {children}
    </div>
  )
}

export default Card

