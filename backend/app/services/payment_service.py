from app.repositories.payment_repository import PaymentRepository
from app.repositories.order_repository import OrderRepository
from app.models.payment import Payment
from app.utils.cloudinary_utils import upload_image_to_cloudinary
import time

class PaymentService:
    @staticmethod
    def process_payment(order_id, method, amount, screenshot_file=None):
        order = OrderRepository.get_by_id(order_id)
        if not order:
            raise ValueError("Order not found")
        
        image_url = None
        
        if method == 'online':
            if not screenshot_file:
                raise ValueError("Online payment requires a screenshot.")
            
            # --- CLOUDINARY UPLOAD LOGIC START ---
            
            # 1. Create a safe public_id (e.g., "payments/proof_101_170023423")
            # We use timestamp to ensure uniqueness
            timestamp = int(time.time())
            public_id = f"payments/proof_{order_id}_{timestamp}"

            # 2. Upload using Cloudinary
            # screenshot_file is the actual file object from Flask
            upload_result = upload_image_to_cloudinary(
                screenshot_file, 
                folder="payments",
                public_id=public_id
            )
            
            if not upload_result.get("success"):
                raise ValueError(f"Failed to upload screenshot: {upload_result.get('error', 'Unknown error')}")
            
            # Get the secure URL from Cloudinary
            image_url = upload_result.get("url")
            
            # --- CLOUDINARY UPLOAD LOGIC END ---

        # Save to DB
        payment = Payment(
            order_id=order_id,
            method=method,
            amount=amount,
            screenshot_url=image_url # <--- Now storing the Cloudinary URL
        )
        PaymentRepository.create(payment)

        # Update Status
        new_status = "paid" if method == 'cash' else "awaiting_approval"
        OrderRepository.update_status(order, new_status)

        return payment