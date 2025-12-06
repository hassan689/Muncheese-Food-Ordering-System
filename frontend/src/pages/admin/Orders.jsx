import { useState, useEffect } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { orderService } from '../../services/orderService'
import '../../styles/pages/admin/Orders.css'

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [editingOrder, setEditingOrder] = useState(null)
  const [updateData, setUpdateData] = useState({ status: '', total_amount: '' })

  useEffect(() => {
    fetchOrders()
  }, [statusFilter])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const status = statusFilter === 'all' ? null : statusFilter
      const response = await orderService.getOrders(status)
      setOrders(response || [])
      setError('')
    } catch (err) {
      console.error('Error fetching orders:', err)
      setError('Failed to fetch orders')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateOrder = async (orderId) => {
    try {
      const data = {}
      if (updateData.status) data.status = updateData.status
      if (updateData.total_amount) data.total_amount = parseFloat(updateData.total_amount)

      if (Object.keys(data).length === 0) {
        alert('Please provide at least one field to update')
        return
      }

      await orderService.updateOrder(orderId, data)
      alert('Order updated successfully!')
      setEditingOrder(null)
      setUpdateData({ status: '', total_amount: '' })
      fetchOrders()
    } catch (err) {
      console.error('Error updating order:', err)
      alert(err.response?.data?.error || 'Failed to update order')
    }
  }

  const handleReviewOrder = async (orderId, action) => {
    try {
      const response = await orderService.reviewOrder(orderId, { action })
      alert(`Order ${action}d successfully!`)
      fetchOrders()
    } catch (err) {
      console.error('Error reviewing order:', err)
      alert(err.response?.data?.error || `Failed to ${action} order`)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const getStatusColor = (status) => {
    const colors = {
      'pending': '#ffb800',
      'location_verified': '#4CAF50',
      'awaiting_approval': '#2196F3',
      'paid': '#4CAF50',
      'accepted': '#2196F3',
      'preparing': '#FF9800',
      'completed': '#4CAF50',
      'rejected': '#f44336'
    }
    return colors[status] || '#666'
  }

  const statusOptions = [
    'pending',
    'location_verified',
    'awaiting_approval',
    'paid',
    'accepted',
    'preparing',
    'completed',
    'rejected'
  ]

  if (loading) {
    return (
      <AdminLayout title="Orders">
        <div className="loading">Loading orders...</div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Orders Management">
      <div className="admin-orders">
        <div className="orders-header">
          <h2>Orders Management</h2>
          <div className="filter-controls">
            <label>Filter by Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="status-filter"
            >
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="awaiting_approval">Awaiting Approval</option>
              <option value="paid">Paid</option>
              <option value="accepted">Accepted</option>
              <option value="preparing">Preparing</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
            </select>
            <button onClick={fetchOrders} className="refresh-btn">
              Refresh
            </button>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        {orders.length === 0 ? (
          <div className="no-orders">
            <p>No orders found</p>
          </div>
        ) : (
          <div className="orders-table-container">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer ID</th>
                  <th>Status</th>
                  <th>Total Amount</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.order_id}>
                    <td>#{order.order_id}</td>
                    <td>{order.customer_id}</td>
                    <td>
                      <span
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(order.status) }}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td>RS {parseFloat(order.total_amount || 0).toFixed(2)}</td>
                    <td>{formatDate(order.created_at)}</td>
                    <td>
                      <div className="action-buttons">
                        {editingOrder === order.order_id ? (
                          <div className="edit-form">
                            <select
                              value={updateData.status || order.status}
                              onChange={(e) =>
                                setUpdateData({ ...updateData, status: e.target.value })
                              }
                              className="status-select"
                            >
                              {statusOptions.map((status) => (
                                <option key={status} value={status}>
                                  {status}
                                </option>
                              ))}
                            </select>
                            <input
                              type="number"
                              placeholder="Total Amount"
                              value={updateData.total_amount || order.total_amount}
                              onChange={(e) =>
                                setUpdateData({ ...updateData, total_amount: e.target.value })
                              }
                              className="amount-input"
                              step="0.01"
                            />
                            <button
                              onClick={() => handleUpdateOrder(order.order_id)}
                              className="save-btn"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => {
                                setEditingOrder(null)
                                setUpdateData({ status: '', total_amount: '' })
                              }}
                              className="cancel-btn"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <>
                            <button
                              onClick={() => setEditingOrder(order.order_id)}
                              className="edit-btn"
                            >
                              Edit
                            </button>
                            {order.status === 'awaiting_approval' && (
                              <>
                                <button
                                  onClick={() => handleReviewOrder(order.order_id, 'approve')}
                                  className="approve-btn"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleReviewOrder(order.order_id, 'reject')}
                                  className="reject-btn"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default Orders


