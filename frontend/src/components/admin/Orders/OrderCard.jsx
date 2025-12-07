// Order Card Component
import { useState } from "react";
import Card from "../../../components/ui/Card";
import OrderDetailsModal from "./OrderDetailsModal";
import "../../../styles/components/admin/Orders/OrderCard.css";

const OrderCard = ({ order, onAccept, onReject, onComplete }) => {
  const [showDetails, setShowDetails] = useState(false);

  const formatDate = (dateString) => {
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

  const getStatusButton = () => {
    if (order.status === 'accepted') {
      return (
        <button className="btn-complete" onClick={() => onComplete(order.order_id)}>
          ✓ Mark as Completed
        </button>
      );
    }
    
    if (order.status === 'rejected') {
      return (
        <div className="status-badge rejected">
          ✕ REJECTED
        </div>
      );
    }

    if (order.status === 'completed') {
      return (
        <div className="status-badge completed">
          ✓ COMPLETED
        </div>
      );
    }

    return (
      <div className="action-buttons">
        <button className="btn-reject" onClick={() => onReject(order.order_id)}>
          ✕
        </button>
        <button className="btn-accept" onClick={() => onAccept(order.order_id)}>
          ✓
        </button>
      </div>
    );
  };

  return (
    <>
      <Card className="order-card">
        <div className="order-header">
          <div>
            <h3>Order #{order.order_id}</h3>
            <p className="order-date">{formatDate(order.created_at)}</p>
          </div>
          <button 
            className="btn-details"
            onClick={() => setShowDetails(true)}
            title="View Order Details"
          >
            Details
          </button>
        </div>

      <div className="order-items">
        {order.items && order.items.length > 0 ? (
          order.items.map((item, index) => (
            <div key={item.order_item_id || index} className="order-item">
              <div className="item-details">
                <h4>{item.product_name || item.name || 'Unknown Item'}</h4>
                <p>{item.description || item.size ? `${item.size} size` : ''}</p>
                {item.size && <p className="item-size">Size: {item.size}</p>}
              </div>
              <div className="item-price-qty">
                <span className="item-price">Rs{(item.price || 0).toFixed(2)}</span>
                <span className="item-qty">Qty: {item.quantity || 1}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="order-item">
            <p>No items in this order</p>
          </div>
        )}
      </div>

      <div className="order-footer">
        <div className="order-total-info">
          <span className="items-count">{order.items ? order.items.length : 0} Items</span>
          <span className="order-total">Total: Rs{(order.total_amount || 0).toFixed(2)}</span>
        </div>
        <div className="order-actions">
          {getStatusButton()}
        </div>
      </div>
    </Card>
    
    {showDetails && (
      <OrderDetailsModal
        order={order}
        onClose={() => setShowDetails(false)}
      />
    )}
    </>
  );
};

export default OrderCard;