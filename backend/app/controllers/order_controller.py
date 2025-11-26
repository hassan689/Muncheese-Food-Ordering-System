from flask import request, jsonify
from app.services.order_service import OrderService

class OrderController:
    @staticmethod
    def create_order():
        """Expected JSON: { "customer_id": 1, "total_amount": 500.0 }"""
        try:
            data = request.json
            order = OrderService.create_initial_order(
                customer_id=data['customer_id'],
                total_amount=data['total_amount']
            )
            return jsonify({"message": "Order started", "order_id": order.order_id}), 201
        except Exception as e:
            return jsonify({"error": str(e)}), 400

    @staticmethod
    def add_location(order_id):
        """Expected JSON: { "address": "Model Town", "lat": 24.9, "lng": 67.1 }"""
        try:
            data = request.json
            OrderService.validate_and_add_location(
                order_id=order_id,
                address=data['address'],
                lat=data['lat'],
                lng=data['lng']
            )
            return jsonify({"message": "Location valid. Proceed to payment."}), 200
        except ValueError as e:
            return jsonify({"error": str(e)}), 400 # User error (Too far)
        except Exception as e:
            return jsonify({"error": str(e)}), 500 # Server error
        
     # --- ADMIN ONLY STUFF (Added here) ---

    @staticmethod
    def get_all_orders():
        """Admin views all orders"""
        status = request.args.get('status')
        orders = OrderService.get_all_orders(status) # Add this to OrderService
        return jsonify([o.to_dict() for o in orders]), 200

    @staticmethod
    def review_order(order_id):
        """Admin Approves/Rejects"""
        try:
            data = request.json
            action = data.get('action') # 'approve' or 'reject'
            
            # You can keep the logic in OrderService now!
            result = OrderService.update_order_status(order_id, action)
            return jsonify(result), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 400
        
    @staticmethod
    def get_sales_report():
        """
        GET /api/admin/reports/sales?type=monthly
        """
        try:
            report_type = request.args.get('type', 'daily') # Default to daily
            
            if report_type not in ['daily', 'monthly', 'yearly']:
                return jsonify({"error": "Invalid type. Use daily, monthly, or yearly"}), 400
                
            data = OrderService.get_analytics(report_type)
            return jsonify(data), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500