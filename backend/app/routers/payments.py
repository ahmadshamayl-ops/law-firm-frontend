from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.database import get_db
from app.models import User, Payment, UploadedFile
from app.schemas import Payment as PaymentSchema, PaymentCreate
from app.auth import get_current_active_user

router = APIRouter(prefix="/api/payments", tags=["payments"])


@router.post("/", response_model=PaymentSchema, status_code=status.HTTP_201_CREATED)
def create_payment(
    payment: PaymentCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create a new payment record"""
    # Verify file belongs to user
    file = db.query(UploadedFile).filter(
        UploadedFile.id == payment.file_id,
        UploadedFile.user_id == current_user.id
    ).first()
    
    if not file:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found"
        )
    
    db_payment = Payment(**payment.dict())
    db.add(db_payment)
    db.commit()
    db.refresh(db_payment)
    
    return db_payment


@router.get("/", response_model=List[PaymentSchema])
def get_payments(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100
):
    """Get all payments for current user"""
    payments = db.query(Payment).join(UploadedFile).filter(
        UploadedFile.user_id == current_user.id
    ).order_by(desc(Payment.created_at)).offset(skip).limit(limit).all()
    
    return payments


@router.get("/{payment_id}", response_model=PaymentSchema)
def get_payment(
    payment_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get specific payment"""
    payment = db.query(Payment).join(UploadedFile).filter(
        Payment.id == payment_id,
        UploadedFile.user_id == current_user.id
    ).first()
    
    if not payment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Payment not found"
        )
    
    return payment


@router.delete("/{payment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_payment(
    payment_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Delete payment"""
    payment = db.query(Payment).join(UploadedFile).filter(
        Payment.id == payment_id,
        UploadedFile.user_id == current_user.id
    ).first()
    
    if not payment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Payment not found"
        )
    
    db.delete(payment)
    db.commit()
    
    return None
