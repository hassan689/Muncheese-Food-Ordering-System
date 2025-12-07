import { useState, useEffect } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
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

        {/* Payment Proof Modal */}
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


// import OrderCardsGrid from "../../components/admin/Orders/OrderCardGrid";
// import OrderStatusTabs from "../../components/admin/Orders/OrderStatusTabs";
// import { useState } from "react";
// import AdminLayout from "../../layouts/admin/Layout";
// import "../../styles/pages/admin/Orders.css";

// const OrdersPage = () => {
//   const [orders, setOrders] = useState([
//     {
//       order_id: 345,
//       customer_id: "C001",
//       status: "completed",
//       total_amount: 10.6,
//       created_at: "2023-02-05T08:28:00",
//       items: [
//         {
//           name: "Vegetable Mixups",
//           description: "Vegetable Fritters with Egg",
//           price: 5.3,
//           quantity: 1,
//         },
//         {
//           name: "Chinese Takeout Disj",
//           description: "Fresh Prawn mix salad",
//           price: 5.3,
//           quantity: 1,
//         }
//       ],
//     },
//     {
//       order_id: 346,
//       customer_id: "C002",
//       status: "rejected",
//       total_amount: 10.6,
//       created_at: "2023-02-05T08:28:00",
//       items: [
//         {
//           name: "Vegetable Mixups",
//           description: "Vegetable Fritters with Egg",
//           price: 5.3,
//           quantity: 1,
//         },
//         {
//           name: "Chinese Takeout Disj",
//           description: "Fresh Prawn mix salad",
//           price: 5.3,
//           quantity: 1,
//         },
//         {
//           name: "Chinese Takeout Disj",
//           description: "Fresh Prawn mix salad",
//           price: 5.3,
//           quantity: 1,
//         },
//         {
//           name: "Chinese Takeout Disj",
//           description: "Fresh Prawn mix salad",
//           price: 5.3,
//           quantity: 1,
//         },
//         {
//           name: "Chinese Takeout Disj",
//           description: "Fresh Prawn mix salad",
//           price: 5.3,
//           quantity: 1,
//         },
//         {
//           name: "Chinese Takeout Disj",
//           description: "Fresh Prawn mix salad",
//           price: 5.3,
//           quantity: 1,
//         }
//       ],
//     },
//     {
//       order_id: 349,
//       customer_id: "C005",
//       status: "accepted",
//       total_amount: 10.6,
//       created_at: "2023-02-05T08:28:00",
//       items: [
//         {
//           name: "Vegetable Mixups",
//           description: "Vegetable Fritters with Egg",
//           price: 5.3,
//           quantity: 1,
//         },
//         {
//           name: "Chinese Takeout Disj",
//           description: "Fresh Prawn mix salad",
//           price: 5.3,
//           quantity: 1,
//         },
//       ],
//     },
//     {
//       order_id: 350,
//       customer_id: "C006",
//       status: "pending",
//       total_amount: 10.6,
//       created_at: "2023-02-05T08:28:00",
//       items: [
//         {
//           name: "Vegetable Mixups",
//           description: "Vegetable Fritters with Egg",
//           price: 5.3,
//           quantity: 1,
//         },
//         {
//           name: "Chinese Takeout Disj",
//           description: "Fresh Prawn mix salad",
//           price: 5.3,
//           quantity: 1,
//         },
//       ],
//     },
//     {
//       order_id: 351,
//       customer_id: "C007",
//       status: "rejected",
//       total_amount: 10.6,
//       created_at: "2023-02-05T08:28:00",
//       items: [
//         {
//           name: "Vegetable Mixups",
//           description: "Vegetable Fritters with Egg",
//           price: 5.3,
//           quantity: 1,
//         },
//         {
//           name: "Chinese Takeout Disj",
//           description: "Fresh Prawn mix salad",
//           price: 5.3,
//           quantity: 1,
//         },
//       ],
//     },
//     {
//       order_id: 352,
//       customer_id: "C008",
//       status: "pending",
//       total_amount: 10.6,
//       created_at: "2023-02-05T08:28:00",
//       items: [
//         {
//           name: "Vegetable Mixups",
//           description: "Vegetable Fritters with Egg",
//           price: 5.3,
//           quantity: 1,
//         },
//         {
//           name: "Chinese Takeout Disj",
//           description: "Fresh Prawn mix salad",
//           price: 5.3,
//           quantity: 1,
//         },
//       ],
//     },
//   ]);

//   const [selectedOrder, setSelectedOrder] = useState(null);                     // This state variable is responsible whenever order is updated to re-render

//   const handleAccept = async (orderId) => {
//     // Approve/ Accept Orders
//     try {
//       const response = await fetch(`http://localhost:5000/api/admin/orders/${orderId}/review`, {
//         method: "POST",
//         headers: {
//           "user-id": 1,
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({ action: "approve" })
//       });

//       if (!response.ok) {
//         throw new Error(`Error: ${response}`);
//       }

//       const data = await response.json();
//       console.log("Order Accepted:", data);
//       // Updating on frontend (envokes re-render)
//       setOrders(
//         orders.map((order) =>
//           order.order_id === orderId ? { ...order, status: "accepted" } : order
//         )
//       );
//     } catch (error) {
//       console.error("Failed to add product:", error);
//     }
//   };

//   const handleReject = async (orderId) => {
//     // Reject/ Decline Orders
//     try {
//       const response = await fetch(`http://localhost:5000/api/admin/orders/${orderId}/review`, {
//         method: "POST",
//         headers: {
//           "user-id": 1,
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({ action: "reject" })
//       });

//       if (!response.ok) {
//         throw new Error(`Error: ${response}`);
//       }

//       const data = await response.json();
//       console.log("Order Rejected:", data);
//       // Updating on frontend (envokes re-render)
//       setOrders(
//         orders.map((order) =>
//           order.order_id === orderId ? { ...order, status: "rejected" } : order
//         )
//       );
//     } catch (error) {
//       console.error("Failed to add product:", error);
//     }
//   };

//   /* TO BE IMPLEMENTED */
//   const handleComplete = async (orderId) => {
//     // // Completed Orders
//     // try {
//     //   const response = await fetch(`http://localhost:5000/api/admin/orders/${orderId}/review`, {
//     //     method: "POST",
//     //     headers: {
//     //       "user-id": 1,
//     //       "Content-Type": "application/json"
//     //     },
//     //     body: JSON.stringify({ action: "completed" })
//     //   });

//     //   if (!response.ok) {
//     //     throw new Error(`Error: ${response}`);
//     //   }

//     //   const data = await response.json();
//     //   console.log("Order Completed:", data);
//     //   // Updating on frontend (envokes re-render)
//     //   setOrders(orders.filter((order) => order.order_id !== orderId));
//     // } catch (error) {
//     //   console.error("Failed to add product:", error);
//     // }
//       setOrders(orders.filter((order) => order.order_id !== orderId));
//   };

//   const displayedOrders = orders.filter(
//     (order) => order.status !== "completed"
//   );

//   return (
//     <AdminLayout title="Orders">
//       <div className="orders-page">
//         <div className="page-header">
//           <h1>Order List</h1>
//         </div>

//         <OrderStatusTabs
//           orders={orders}
//           selectedOrder={selectedOrder}
//           onOrderSelect={setSelectedOrder}
//         />

//         <OrderCardsGrid
//           orders={displayedOrders}
//           onAccept={handleAccept}
//           onReject={handleReject}
//           onComplete={handleComplete}
//         />
//       </div>
//     </AdminLayout>
//   );
// };

