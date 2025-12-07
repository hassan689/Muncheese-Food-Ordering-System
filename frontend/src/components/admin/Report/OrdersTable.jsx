import { useState, useEffect } from 'react'
import "../../../styles/components/admin/Reports/OrdersTable.css"

const OrdersTable = ({ orders }) => {
  const [sortedOrders, setSortedOrders] = useState([])
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })

  // Update sorted orders when data changes
  useEffect(() => {
    if (orders && orders.length > 0) {
      setSortedOrders([...orders])
    } else {
      setSortedOrders([])
    }
  }, [orders])

  // Sorting function
  const handleSort = (key) => {
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }

    const sorted = [...sortedOrders].sort((a, b) => {
      if (key === 'total') {
        // Remove $ and convert to number for total
        const aValue = parseFloat(a[key].replace('$', '').replace(',', ''))
        const bValue = parseFloat(b[key].replace('$', '').replace(',', ''))
        return direction === 'asc' ? aValue - bValue : bValue - aValue
      }

      // String comparison for other fields
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1
      return 0
    })

    setSortedOrders(sorted)
    setSortConfig({ key, direction })
  }

  // Get sort indicator
  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return '⇅'
    return sortConfig.direction === 'asc' ? '↑' : '↓'
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="orders-table-card">
        <h3 className="table-title">Recent Orders</h3>
        <p className="no-data">No orders found for the selected date range.</p>
      </div>
    )
  }

  return (
    <div className="orders-table-card">
      <div className="table-header">
        <h3 className="table-title">Recent Orders</h3>
        <span className="table-count">
          {sortedOrders.length} {sortedOrders.length === 1 ? 'order' : 'orders'}
        </span>
      </div>
      
      <div className="table-wrapper">
        <table className="orders-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('id')} className="sortable">
                Order ID {getSortIndicator('id')}
              </th>
              <th onClick={() => handleSort('customerName')} className="sortable">
                Customer Name {getSortIndicator('customerName')}
              </th>
              <th onClick={() => handleSort('phone')} className="sortable">
                Phone Number {getSortIndicator('phone')}
              </th>
              <th onClick={() => handleSort('orderDate')} className="sortable">
                Order Date {getSortIndicator('orderDate')}
              </th>
              <th onClick={() => handleSort('total')} className="sortable">
                Total {getSortIndicator('total')}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedOrders.map((order, index) => (
              <tr 
                key={`${order.id}-${index}`} 
                className={index % 2 === 0 ? 'even' : 'odd'}
              >
                <td className="order-id">{order.id}</td>
                <td className="customer-name">{order.customerName}</td>
                <td>{order.phone}</td>
                <td>{order.orderDate}</td>
                <td className="total-amount">{order.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default OrdersTable