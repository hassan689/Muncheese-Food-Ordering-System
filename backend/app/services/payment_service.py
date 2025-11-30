from app.repositories.payment_repository import PaymentRepository
from app.repositories.order_repository import OrderRepository
from app.models.payment import Payment
from app.utils.s3_utils import upload_file_to_r2 # <--- Import this
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
            
            # --- CLOUDFLARE UPLOAD LOGIC START ---
            
            # 1. Create a safe filename (e.g., "proof_101_170023423.png")
            # We use timestamp to ensure uniqueness
            timestamp = int(time.time())
            original_ext = screenshot_file.filename.split('.')[-1]
            safe_filename = f"proof_{order_id}_{timestamp}.{original_ext}"

            # 2. Upload using our Helper
            # screenshot_file is the actual file object from Flask
            image_url = upload_file_to_r2(
                screenshot_file, 
                safe_filename, 
                screenshot_file.content_type
            )
            
            # --- CLOUDFLARE UPLOAD LOGIC END ---

        # Save to DB
        payment = Payment(
            order_id=order_id,
            method=method,
            amount=amount,
            screenshot_url=image_url # <--- Now storing the REAL R2 URL
        )
        PaymentRepository.create(payment)

        # Update Status
        new_status = "paid" if method == 'cash' else "awaiting_approval"
        OrderRepository.update_status(order, new_status)

        return payment