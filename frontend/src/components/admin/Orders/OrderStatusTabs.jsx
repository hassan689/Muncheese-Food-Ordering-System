// Order Status Tabs Component
import "../../../styles/components/admin/Orders/OrderStatusTabs.css";

const OrderStatusTabs = ({ orders, selectedOrder, onOrderSelect }) => {
  const getStatusIcon = (status) => {
    if (status === "accepted") return "✓";
    if (status === "rejected") return "✕";
    return "";
  };

  const getStatusClass = (status) => {
    if (status === "accepted") return "accepted";
    if (status === "rejected") return "rejected";
    return "pending";
  };

  return (
    <div className="order-tabs">
      <div className="tabs-container">
        {orders
          .filter((order) => order.status !== "completed") // skip completed orders
          .map((order) => (
            <button
              key={order.order_id}
              className={`tab-button ${getStatusClass(order.status)} ${
                selectedOrder === order.order_id ? "active" : ""
              }`}
              onClick={() => onOrderSelect(order.order_id)}
            >
              <span className="tab-icon">{getStatusIcon(order.status)}</span>
              <span className="tab-text">#{order.order_id}</span>
            </button>
          ))}
      </div>
    </div>
  );
};

export default OrderStatusTabs;
