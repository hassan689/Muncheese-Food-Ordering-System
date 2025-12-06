import { useState, useEffect } from 'react'
import AdminLayout from '../../layouts/admin/Layout'
import { userService } from '../../services/userService'
import '../../styles/pages/admin/Menu.css'

const Menu = () => {
  const [menu, setMenu] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchMenu()
  }, [])

  const fetchMenu = async () => {
    try { 
      /* CALL FECTH API HERE
      const data = await userService.getAllMenu()
      */
      
      setMenu(data);
    } catch (err) {
      setError('Failed to fetch menu')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout title="Menu">
        <div className="loading">Loading...</div>
      </AdminLayout>
    )
  }

  if (error) {
    return (
      <AdminLayout title="Menu">
        <div className="error">{error}</div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Menu">
      <div className="menu">
        <div className="menu-table-card">
          <table className="menu-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {menu.map(menu => (
                <tr key={menu.user_id}>
                  <td>{menu.user_id}</td>
                  <td>{menu.name}</td>
                  <td>{menu.phone}</td>
                  <td>{menu.address}</td>
                  <td>{menu.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}

export default Menu

