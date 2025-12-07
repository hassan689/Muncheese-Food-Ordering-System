import OrderCardsGrid from "../../components/admin/Orders/OrderCardGrid";
import OrderStatusTabs from "../../components/admin/Orders/OrderStatusTabs";
import { useState, useEffect } from "react";
import AdminLayout from "../../layouts/admin/Layout";
import { orderService } from "../../services/orderService";
import api from "../../services/api";
import "../../styles/pages/admin/Orders.css";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const adminUserId = localStorage.getItem('adminUserId') || '1'; // Get admin user ID
        
        // Fetch all orders using admin endpoint
        const response = await api.get('/api/admin/orders', {
          headers: {
            'user-id': adminUserId
          }
        });
        
        setOrders(response.data || []);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleAccept = async (orderId) => {
    // Approve/ Accept Orders
    try {
      const adminUserId = localStorage.getItem('adminUserId') || '1';
      const response = await api.post(`/api/admin/orders/${orderId}/review`, 
        { action: "approve" },
        {
          headers: {
            "user-id": adminUserId
          }
        }
      );

      console.log("Order Accepted:", response.data);
      // Refresh orders
      await refreshOrders();
    } catch (error) {
      console.error("Failed to accept order:", error);
      alert("Failed to accept order. Please try again.");
    }
  };

  const handleReject = async (orderId) => {
    // Reject/ Decline Orders
    try {
      const adminUserId = localStorage.getItem('adminUserId') || '1';
      const response = await api.post(`/api/admin/orders/${orderId}/review`,
        { action: "reject" },
        {
          headers: {
            "user-id": adminUserId
          }
        }
      );

      console.log("Order Rejected:", response.data);
      // Remove rejected order from display immediately
      setOrders(orders.filter((order) => order.order_id !== orderId));
    } catch (error) {
      console.error("Failed to reject order:", error);
      alert("Failed to reject order. Please try again.");
    }
  };

  // Refresh orders function
  const refreshOrders = async () => {
    try {
      const adminUserId = localStorage.getItem('adminUserId') || '1';
      const response = await api.get('/api/admin/orders', {
        headers: {
          'user-id': adminUserId
        }
      });
      setOrders(response.data || []);
    } catch (error) {
      console.error('Error refreshing orders:', error);
    }
  };

  const handleComplete = async (orderId) => {
    // Mark order as completed
    try {
      const adminUserId = localStorage.getItem('adminUserId') || '1';
      const response = await api.post(`/api/admin/orders/${orderId}/review`,
        { action: "completed" },
        {
          headers: {
            "user-id": adminUserId
          }
        }
      );

      console.log("Order Completed:", response.data);
      // Refresh orders to update status
      await refreshOrders();
    } catch (error) {
      console.error("Failed to complete order:", error);
      alert("Failed to mark order as completed. Please try again.");
    }
  };

  // Filter out rejected and completed orders from display
  const displayedOrders = orders.filter(
    (order) => order.status !== "completed" && order.status !== "rejected"
  );

  if (loading) {
    return (
      <AdminLayout title="Orders">
        <div className="orders-page">
          <div className="page-header">
            <h1>Order List</h1>
          </div>
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <p>Loading orders...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Orders">
      <div className="orders-page">
        <div className="page-header">
          <h1>Order List</h1>
        </div>

        {orders.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <p>No orders found</p>
          </div>
        ) : (
          <>
            <OrderStatusTabs
              orders={orders}
              selectedOrder={selectedOrder}
              onOrderSelect={setSelectedOrder}
            />

            <OrderCardsGrid
              orders={displayedOrders}
              onAccept={handleAccept}
              onReject={handleReject}
              onComplete={handleComplete}
            />
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default OrdersPage;



/* Hassan Code */
/*
import { useState, useEffect } from 'react'
import AdminLayout from '../../layouts/admin/Layout'
import { orderService } from '../../services/orderService'
import '../../styles/pages/admin/Orders.css'

const OrdersPage = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [editingOrder, setEditingOrder] = useState(null)
  const [updateData, setUpdateData] = useState({ status: '', total_amount: '' })
  const [viewingPayment, setViewingPayment] = useState(null)

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
      setViewingPayment(null)
      fetchOrders()
    } catch (err) {
      console.error('Error reviewing order:', err)
      alert(err.response?.data?.error || `Failed to ${action} order`)
    }
  }

  const handleVerifyPayment = async (orderId) => {
    try {
      // Update order status to paid and accepted
      await orderService.updateOrder(orderId, { status: 'paid' })
      await orderService.updateOrder(orderId, { status: 'accepted' })
      alert('Payment verified and order confirmed!')
      setViewingPayment(null)
      fetchOrders()
    } catch (err) {
      console.error('Error verifying payment:', err)
      alert(err.response?.data?.error || 'Failed to verify payment')
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
                  <th>Payment Method</th>
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
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span>{order.payment?.method || 'N/A'}</span>
                        {order.payment?.method === 'online' && order.payment?.screenshot && (
                          <button
                            onClick={() => setViewingPayment(order)}
                            className="view-proof-btn"
                            title="View Payment Proof"
                          >
                            📷 View Proof
                          </button>
                        )}
                      </div>
                    </td>
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
                            {order.status === 'awaiting_approval' && order.payment?.method === 'online' && (
                              <>
                                <button
                                  onClick={() => handleVerifyPayment(order.order_id)}
                                  className="verify-btn"
                                >
                                  ✓ Verify Payment
                                </button>
                                <button
                                  onClick={() => handleReviewOrder(order.order_id, 'reject')}
                                  className="reject-btn"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            {order.status === 'awaiting_approval' && order.payment?.method !== 'online' && (
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

        {viewingPayment && viewingPayment.payment?.screenshot && (
          <div className="payment-proof-modal" onClick={() => setViewingPayment(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Payment Proof - Order #{viewingPayment.order_id}</h3>
                <button className="close-modal" onClick={() => setViewingPayment(null)}>×</button>
              </div>
              <div className="modal-body">
                <div className="payment-info">
                  <p><strong>Amount:</strong> RS {parseFloat(viewingPayment.payment.amount || 0).toFixed(2)}</p>
                  <p><strong>Method:</strong> {viewingPayment.payment.method}</p>
                  <p><strong>Date:</strong> {formatDate(viewingPayment.payment.date)}</p>
                </div>
                <div className="proof-image-container">
                  <img 
                    src={viewingPayment.payment.screenshot} 
                    alt="Payment proof" 
                    className="proof-image"
                  />
                </div>
                <div className="modal-actions">
                  <button
                    onClick={() => handleVerifyPayment(viewingPayment.order_id)}
                    className="verify-payment-btn"
                  >
                    ✓ Verify Payment & Confirm Order
                  </button>
                  <button
                    onClick={() => handleReviewOrder(viewingPayment.order_id, 'reject')}
                    className="reject-payment-btn"
                  >
                    Reject Payment
                  </button>
                  <button
                    onClick={() => setViewingPayment(null)}
                    className="cancel-modal-btn"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
export default OrdersPage;
*/