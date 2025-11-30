from app.models.order import Order
from app.models.delivery_info import DeliveryInfo
from app.extensions import db

class OrderRepository:
    @staticmethod
    def create(order):
        db.session.add(order)
        db.session.commit()
        return order

    @staticmethod
    def get_by_id(order_id):
        return Order.query.get(order_id)

    @staticmethod
    def update_status(order, new_status):
        order.status = new_status
        db.session.commit()
        return order

    @staticmethod
    def add_delivery_info(delivery_info):
        db.session.add(delivery_info)
        db.session.commit()
        return delivery_info
    
    @staticmethod
    def get_all_pending():
        # Fetch orders that need attention (paid or awaiting approval)
        return Order.query.filter(Order.status.in_(['paid', 'awaiting_approval'])).all()

        
    @staticmethod
    def get_dashboard_orders():
        """
        Fetch all orders EXCEPT rejected ones.
        This is what the Admin sees in the main 'Active Orders' table.
        """
        return Order.query.filter(Order.status != 'rejected').all()

    @staticmethod
    def get_rejected_orders():
        """
        (Optional) If you want a separate page for 'Rejected History'
        """
        return Order.query.filter_by(status='rejected').all()