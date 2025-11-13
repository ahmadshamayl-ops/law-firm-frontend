from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime


# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    full_name: str


class UserCreate(UserBase):
    password: str = Field(..., min_length=6)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class User(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None


# File Schemas
class FileUploadResponse(BaseModel):
    id: int
    filename: str
    original_filename: str
    file_type: str
    file_size: int
    status: str
    uploaded_at: datetime
    
    class Config:
        from_attributes = True


# Invoice Schemas
class InvoiceBase(BaseModel):
    invoice_number: str
    client_name: str
    matter_number: Optional[str] = None
    invoice_date: Optional[datetime] = None
    due_date: Optional[datetime] = None
    amount: float
    currency: str = "USD"
    status: str = "pending"


class InvoiceCreate(InvoiceBase):
    file_id: int


class Invoice(InvoiceBase):
    id: int
    file_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True


# Payment Schemas
class PaymentBase(BaseModel):
    payment_reference: str
    payer_name: str
    amount: float
    currency: str = "USD"
    payment_date: Optional[datetime] = None
    description: Optional[str] = None


class PaymentCreate(PaymentBase):
    file_id: int


class Payment(PaymentBase):
    id: int
    file_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True


# Payment Match Schemas
class PaymentMatchBase(BaseModel):
    payment_id: int
    invoice_id: int
    match_type: str
    confidence_score: float
    status: str = "review"
    match_details: Optional[dict] = None


class PaymentMatchCreate(PaymentMatchBase):
    pass


class PaymentMatch(PaymentMatchBase):
    id: int
    matched_at: datetime
    posted_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class PaymentMatchDetail(BaseModel):
    id: int
    payment_reference: str
    payer_name: str
    amount: float
    invoice_number: str
    match_type: str
    confidence_score: float
    status: str
    matched_at: datetime
    
    class Config:
        from_attributes = True


# Analytics Schemas
class DashboardStats(BaseModel):
    total_processed: float
    total_processed_change: float
    match_rate: float
    match_rate_change: float
    pending_review: int
    pending_review_change: int
    auto_posted: int
    auto_posted_change: int


class PerformanceMetrics(BaseModel):
    auto_match_rate: float
    processing_speed: float
    data_quality: float


class RecentMatch(BaseModel):
    id: str
    payer: str
    invoice: str
    amount: str
    confidence: float
    status: str


class InvoiceSummary(BaseModel):
    total_outstanding: float
    avg_invoice_value: float
    avg_days_outstanding: int
    invoice_count: int


class MatchStats(BaseModel):
    auto_posted: int
    pending_review: int
    match_rate: float
    avg_confidence: float


class FinancialMetrics(BaseModel):
    total_processed_mtd: float
    automation_rate: float
    time_saved_hours: int
    cost_savings: float
