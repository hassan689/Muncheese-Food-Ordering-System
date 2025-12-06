import { Link } from 'react-router-dom'
import AdminLayout from '../../components/admin/AdminLayout'
import '../../styles/pages/admin/AdminDashboard.css'

const AdminDashboard = () => {
  return (
    <AdminLayout title="Dashboard">
      <div className="admin-dashboard">
        <h2>Welcome to Admin Dashboard</h2>
        <p>Admin panel for managing the restaurant</p>
        
        <div className="dashboard-cards">
          <Link to="/admin/orders" className="dashboard-card">
            <div className="card-icon">📦</div>
            <h3>Orders Management</h3>
            <p>View and manage all orders</p>
          </Link>
          
          <Link to="/admin/customers" className="dashboard-card">
            <div className="card-icon">👥</div>
            <h3>Customers</h3>
            <p>View all customers</p>
          </Link>
          
          <Link to="/admin/reports" className="dashboard-card">
            <div className="card-icon">📊</div>
            <h3>Reports</h3>
            <p>View sales and analytics</p>
          </Link>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminDashboard

