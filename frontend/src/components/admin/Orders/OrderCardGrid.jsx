// Order Cards Grid Component
import OrderCard from "../../../components/admin/Orders/OrderCard";
import "../../../styles/components/admin/Orders/OrderCardGrid.css";

const OrderCardsGrid = ({ orders, onAccept, onReject, onComplete }) => {
  return (
    <div className="orders-grid">
      {orders.map((order) => (
        <OrderCard
          key={order.order_id}
          order={order}
          onAccept={onAccept}
          onReject={onReject}
          onComplete={onComplete}
        />
      ))}
    </div>
  );
};

export default OrderCardsGrid;