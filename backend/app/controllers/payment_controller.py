from flask import request, jsonify
from app.services.payment_service import PaymentService

class PaymentController:
    @staticmethod
    def make_payment():
        """
        Form-Data input:
        - order_id: 1
        - method: 'online'
        - amount: 500
        - file: (Binary Image)
        """
        try:
            # --- DEBUG PRINTS ---
            print("FORM DATA:", request.form)
            print("FILES DATA:", request.files)
            # --------------------
            # When uploading files, we use request.form and request.files
            order_id = int(request.form['order_id'])
            method = request.form['method']
            amount = float(request.form['amount'])
            file = request.files.get('file') # Returns None if no file

            payment = PaymentService.process_payment(order_id, method, amount, file)
            
            return jsonify({"message": "Payment recorded", "status": "success"}), 201
        except ValueError as e:
            return jsonify({"error": str(e)}), 400