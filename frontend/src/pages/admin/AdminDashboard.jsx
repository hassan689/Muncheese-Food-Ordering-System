import AdminLayout from '../../components/admin/AdminLayout'
import '../../styles/pages/admin/AdminDashboard.css'

const AdminDashboard = () => {
  return (
    <AdminLayout title="Dashboard">
      <div className="admin-dashboard">
        <h2>Welcome to Admin Dashboard</h2>
        <p>Admin panel for managing the restaurant</p>
      </div>
    </AdminLayout>
  )
}

export default AdminDashboard

