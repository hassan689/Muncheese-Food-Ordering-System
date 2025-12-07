// Order Card Component
import Card from "../../../components/ui/Card";
import "../../../styles/components/admin/Orders/OrderCard.css";

const OrderCard = ({ order, onAccept, onReject, onComplete }) => {
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
          ✓ Accepted
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
    <Card className="order-card">
      <div className="order-header">
        <div>
          <h3>Order #{order.order_id}</h3>
          <p className="order-date">{formatDate(order.created_at)}</p>
        </div>
      </div>

      <div className="order-items">
        {order.items.map((item, index) => (
          <div key={index} className="order-item">
            <div className="item-details">
              <h4>{item.name}</h4>
              <p>{item.description}</p>
            </div>
            <div className="item-price-qty">
              <span className="item-price">${item.price.toFixed(2)}</span>
              <span className="item-qty">Qty: {item.quantity}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="order-footer">
        <span className="items-count">X{order.items.length} Items</span>
        <div className="order-actions">
          {getStatusButton()}
        </div>
      </div>
    </Card>
  );
};

export default OrderCard;