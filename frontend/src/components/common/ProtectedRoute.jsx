import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children }) => {
  // Simple check: if admin is logged in (stored in localStorage)
  const adminToken = localStorage.getItem('adminToken')
  const adminUser = localStorage.getItem('adminUser')

  if (!adminToken || !adminUser) {
    return <Navigate to="/login" replace />
  }

  try {
    const user = JSON.parse(adminUser)
    if (user.role !== 'admin') {
      return <Navigate to="/" replace />
    }
  } catch {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute

