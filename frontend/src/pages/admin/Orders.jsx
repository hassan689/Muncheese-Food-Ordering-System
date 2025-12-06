import OrderCardsGrid from "../../components/admin/Orders/OrderCardGrid";
import OrderStatusTabs from "../../components/admin/Orders/OrderStatusTabs";
import { useState, useEffect } from "react";
import AdminLayout from "../../layouts/admin/Layout";
import "../../styles/pages/admin/Orders.css";

const OrdersPage = () => {
  const [orders, setOrders] = useState([
    {
      order_id: 345,
      customer_id: "C001",
      status: "completed",
      total_amount: 10.6,
      created_at: "2023-02-05T08:28:00",
      items: [
        {
          name: "Vegetable Mixups",
          description: "Vegetable Fritters with Egg",
          price: 5.3,
          quantity: 1,
        },
        {
          name: "Chinese Takeout Disj",
          description: "Fresh Prawn mix salad",
          price: 5.3,
          quantity: 1,
        },
      ],
    },
    {
      order_id: 346,
      customer_id: "C002",
      status: "rejected",
      total_amount: 10.6,
      created_at: "2023-02-05T08:28:00",
      items: [
        {
          name: "Vegetable Mixups",
          description: "Vegetable Fritters with Egg",
          price: 5.3,
          quantity: 1,
        },
        {
          name: "Chinese Takeout Disj",
          description: "Fresh Prawn mix salad",
          price: 5.3,
          quantity: 1,
        },
      ],
    },
    {
      order_id: 347,
      customer_id: "C003",
      status: "pending",
      total_amount: 10.6,
      created_at: "2023-02-05T08:28:00",
      items: [
        {
          name: "Vegetable Mixups",
          description: "Vegetable Fritters with Egg",
          price: 5.3,
          quantity: 1,
        },
        {
          name: "Chinese Takeout Disj",
          description: "Fresh Prawn mix salad",
          price: 5.3,
          quantity: 1,
        },
      ],
    },
    {
      order_id: 348,
      customer_id: "C004",
      status: "pending",
      total_amount: 10.6,
      created_at: "2023-02-05T08:28:00",
      items: [
        {
          name: "Vegetable Mixups",
          description: "Vegetable Fritters with Egg",
          price: 5.3,
          quantity: 1,
        },
        {
          name: "Chinese Takeout Disj",
          description: "Fresh Prawn mix salad",
          price: 5.3,
          quantity: 1,
        },
      ],
    },
    {
      order_id: 349,
      customer_id: "C005",
      status: "accepted",
      total_amount: 10.6,
      created_at: "2023-02-05T08:28:00",
      items: [
        {
          name: "Vegetable Mixups",
          description: "Vegetable Fritters with Egg",
          price: 5.3,
          quantity: 1,
        },
        {
          name: "Chinese Takeout Disj",
          description: "Fresh Prawn mix salad",
          price: 5.3,
          quantity: 1,
        },
      ],
    },
    {
      order_id: 350,
      customer_id: "C006",
      status: "pending",
      total_amount: 10.6,
      created_at: "2023-02-05T08:28:00",
      items: [
        {
          name: "Vegetable Mixups",
          description: "Vegetable Fritters with Egg",
          price: 5.3,
          quantity: 1,
        },
        {
          name: "Chinese Takeout Disj",
          description: "Fresh Prawn mix salad",
          price: 5.3,
          quantity: 1,
        },
      ],
    },
    {
      order_id: 351,
      customer_id: "C007",
      status: "rejected",
      total_amount: 10.6,
      created_at: "2023-02-05T08:28:00",
      items: [
        {
          name: "Vegetable Mixups",
          description: "Vegetable Fritters with Egg",
          price: 5.3,
          quantity: 1,
        },
        {
          name: "Chinese Takeout Disj",
          description: "Fresh Prawn mix salad",
          price: 5.3,
          quantity: 1,
        },
      ],
    },
    {
      order_id: 352,
      customer_id: "C008",
      status: "pending",
      total_amount: 10.6,
      created_at: "2023-02-05T08:28:00",
      items: [
        {
          name: "Vegetable Mixups",
          description: "Vegetable Fritters with Egg",
          price: 5.3,
          quantity: 1,
        },
        {
          name: "Chinese Takeout Disj",
          description: "Fresh Prawn mix salad",
          price: 5.3,
          quantity: 1,
        },
      ],
    },
    {
      order_id: 353,
      customer_id: "C009",
      status: "pending",
      total_amount: 10.6,
      created_at: "2023-02-05T08:28:00",
      items: [
        {
          name: "Vegetable Mixups",
          description: "Vegetable Fritters with Egg",
          price: 5.3,
          quantity: 1,
        },
        {
          name: "Chinese Takeout Disj",
          description: "Fresh Prawn mix salad",
          price: 5.3,
          quantity: 1,
        },
      ],
    },
    {
      order_id: 354,
      customer_id: "C010",
      status: "pending",
      total_amount: 10.6,
      created_at: "2023-02-05T08:28:00",
      items: [
        {
          name: "Vegetable Mixups",
          description: "Vegetable Fritters with Egg",
          price: 5.3,
          quantity: 1,
        },
        {
          name: "Chinese Takeout Disj",
          description: "Fresh Prawn mix salad",
          price: 5.3,
          quantity: 1,
        },
      ],
    },
  ]);

  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleAccept = (orderId) => {
    setOrders(
      orders.map((order) =>
        order.order_id === orderId ? { ...order, status: "accepted" } : order
      )
    );
  };

  const handleReject = (orderId) => {
    setOrders(
      orders.map((order) =>
        order.order_id === orderId ? { ...order, status: "rejected" } : order
      )
    );
  };

  const handleComplete = (orderId) => {
    setOrders(orders.filter((order) => order.order_id !== orderId));
  };

  const displayedOrders = orders.filter(
    (order) => order.status !== "completed"
  );

  return (
    <AdminLayout>
      <div className="orders-page">
        <div className="page-header">
          <h1>Order List</h1>
        </div>

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
      </div>
    </AdminLayout>
  );
};

export default OrdersPage;
