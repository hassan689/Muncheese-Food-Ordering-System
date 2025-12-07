// Order Details Modal Component
import "../../../styles/components/admin/Orders/OrderDetailsModal.css";

const OrderDetailsModal = ({ order, onClose }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const paymentMethod = order.payment?.method || 'N/A';
  const isOnlinePayment = paymentMethod === 'online';
  const screenshotUrl = order.payment?.screenshot || order.payment?.screenshot_url;
  const customer = order.customer || {};
  const deliveryInfo = order.delivery_info || {};

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Order Details - #{order.order_id}</h2>
          <button className="modal-close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          {/* Customer Information */}
          <div className="details-section">
            <h3 className="section-title">Customer Information</h3>
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Name:</span>
                <span className="detail-value">{customer.name || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Phone:</span>
                <span className="detail-value">{customer.phone || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Address:</span>
                <span className="detail-value">
                  {deliveryInfo.address || customer.address || 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="details-section">
            <h3 className="section-title">Payment Information</h3>
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Payment Method:</span>
                <span className={`detail-value payment-method ${isOnlinePayment ? 'online' : 'cod'}`}>
                  {isOnlinePayment ? 'Online Payment' : 'Cash on Delivery (COD)'}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Amount:</span>
                <span className="detail-value">Rs {parseFloat(order.payment?.amount || order.total_amount || 0).toFixed(2)}</span>
              </div>
              {order.payment?.date && (
                <div className="detail-item">
                  <span className="detail-label">Payment Date:</span>
                  <span className="detail-value">{formatDate(order.payment.date)}</span>
                </div>
              )}
            </div>

            {/* Screenshot for Online Payment */}
            {isOnlinePayment && screenshotUrl && (
              <div className="screenshot-section">
                <h4 className="screenshot-title">Payment Screenshot</h4>
                <div className="screenshot-container">
                  <img 
                    src={screenshotUrl} 
                    alt="Payment Screenshot" 
                    className="screenshot-image"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Available';
                      e.target.alt = 'Image not available';
                    }}
                  />
                </div>
                <a 
                  href={screenshotUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="screenshot-link"
                >
                  Open in New Tab
                </a>
              </div>
            )}

            {isOnlinePayment && !screenshotUrl && (
              <div className="screenshot-section">
                <p className="no-screenshot">No screenshot available for this payment</p>
              </div>
            )}
          </div>

          {/* Order Items Summary */}
          {order.items && order.items.length > 0 && (
            <div className="details-section">
              <h3 className="section-title">Order Items</h3>
              <div className="order-items-list">
                {order.items.map((item, index) => (
                  <div key={item.order_item_id || index} className="modal-order-item">
                    <div className="modal-item-info">
                      <span className="modal-item-name">{item.product_name || item.name || 'Unknown Item'}</span>
                      {item.size && <span className="modal-item-size">({item.size})</span>}
                    </div>
                    <div className="modal-item-details">
                      <span>Qty: {item.quantity || 1}</span>
                      <span className="modal-item-price">Rs {(item.price || 0).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="order-total-section">
                <span className="total-label">Total Amount:</span>
                <span className="total-amount">Rs {(order.total_amount || 0).toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="modal-close-button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;

