from app.models.payment import Payment
from app.extensions import db
from sqlalchemy import func, text

class PaymentRepository:
    
    @staticmethod
    def create(payment):
        db.session.add(payment)
        db.session.commit()
        return payment

    @staticmethod
    def get_sales_stats(start_date, end_date, group_by_type):
        """
        start_date/end_date: The time range (e.g., Nov 1 to Nov 30)
        group_by_type: 'day' (for monthly report) or 'month' (for yearly report)
        """
        
        # 1. Select Date, Sum(Amount), Count(Transactions)
        # We use date_trunc to group by Day or Month
        
        # NOTE: 'date_trunc' is specific to PostgreSQL. 
        # If using SQLite for testing, this syntax is different.
        # Assuming PostgreSQL:
        
        trunc_func = func.date_trunc(group_by_type, Payment.payment_date)
        
        query = db.session.query(
            trunc_func.label('period'),
            func.sum(Payment.amount).label('total_sales'),
            func.count(Payment.payment_id).label('tx_count')
        ).filter(
            Payment.payment_date >= start_date,
            Payment.payment_date <= end_date
        ).group_by(
            trunc_func
        ).order_by(
            trunc_func
        )
        
        return query.all()

    @staticmethod
    def get_total_sum(start_date, end_date):
        """Get a single number for the total sales in a range"""
        result = db.session.query(
            func.sum(Payment.amount)
        ).filter(
            Payment.payment_date >= start_date,
            Payment.payment_date <= end_date
        ).scalar()
        
        return result if result else 0.0