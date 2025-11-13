from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, Boolean, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    uploaded_files = relationship("UploadedFile", back_populates="user")


class UploadedFile(Base):
    __tablename__ = "uploaded_files"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    filename = Column(String, nullable=False)
    original_filename = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    file_type = Column(String, nullable=False)
    file_size = Column(Integer, nullable=False)
    status = Column(String, default="pending")  # pending, processing, completed, failed
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())
    processed_at = Column(DateTime(timezone=True))
    
    # Relationships
    user = relationship("User", back_populates="uploaded_files")
    invoices = relationship("Invoice", back_populates="file")
    payments = relationship("Payment", back_populates="file")


class Invoice(Base):
    __tablename__ = "invoices"
    
    id = Column(Integer, primary_key=True, index=True)
    file_id = Column(Integer, ForeignKey("uploaded_files.id"), nullable=False)
    invoice_number = Column(String, unique=True, index=True, nullable=False)
    client_name = Column(String, nullable=False)
    matter_number = Column(String)
    invoice_date = Column(DateTime(timezone=True))
    due_date = Column(DateTime(timezone=True))
    amount = Column(Float, nullable=False)
    currency = Column(String, default="USD")
    status = Column(String, default="pending")  # pending, paid, overdue, cancelled
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    file = relationship("UploadedFile", back_populates="invoices")
    matches = relationship("PaymentMatch", back_populates="invoice")


class Payment(Base):
    __tablename__ = "payments"
    
    id = Column(Integer, primary_key=True, index=True)
    file_id = Column(Integer, ForeignKey("uploaded_files.id"), nullable=False)
    payment_reference = Column(String, unique=True, index=True, nullable=False)
    payer_name = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    currency = Column(String, default="USD")
    payment_date = Column(DateTime(timezone=True))
    description = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    file = relationship("UploadedFile", back_populates="payments")
    matches = relationship("PaymentMatch", back_populates="payment")


class PaymentMatch(Base):
    __tablename__ = "payment_matches"
    
    id = Column(Integer, primary_key=True, index=True)
    payment_id = Column(Integer, ForeignKey("payments.id"), nullable=False)
    invoice_id = Column(Integer, ForeignKey("invoices.id"), nullable=False)
    match_type = Column(String, nullable=False)  # exact, fuzzy, contextual, reference
    confidence_score = Column(Float, nullable=False)
    status = Column(String, default="review")  # review, posted, rejected
    matched_at = Column(DateTime(timezone=True), server_default=func.now())
    posted_at = Column(DateTime(timezone=True))
    match_details = Column(JSON)  # Store additional matching metadata
    
    # Relationships
    payment = relationship("Payment", back_populates="matches")
    invoice = relationship("Invoice", back_populates="matches")


class AnalyticsMetric(Base):
    __tablename__ = "analytics_metrics"
    
    id = Column(Integer, primary_key=True, index=True)
    metric_name = Column(String, nullable=False)
    metric_value = Column(Float, nullable=False)
    metric_type = Column(String, nullable=False)  # count, percentage, amount, time
    period = Column(String, nullable=False)  # daily, weekly, monthly
    date = Column(DateTime(timezone=True), nullable=False)
    metadata = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
