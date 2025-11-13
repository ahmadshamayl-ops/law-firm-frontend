from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from app.database import get_db
from app.models import User, Invoice, UploadedFile
from app.schemas import Invoice as InvoiceSchema, InvoiceCreate, InvoiceSummary
from app.auth import get_current_active_user

router = APIRouter(prefix="/api/invoices", tags=["invoices"])


@router.post("/", response_model=InvoiceSchema, status_code=status.HTTP_201_CREATED)
def create_invoice(
    invoice: InvoiceCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create a new invoice"""
    # Verify file belongs to user
    file = db.query(UploadedFile).filter(
        UploadedFile.id == invoice.file_id,
        UploadedFile.user_id == current_user.id
    ).first()
    
    if not file:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found"
        )
    
    db_invoice = Invoice(**invoice.dict())
    db.add(db_invoice)
    db.commit()
    db.refresh(db_invoice)
    
    return db_invoice


@router.get("/", response_model=List[InvoiceSchema])
def get_invoices(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    status_filter: str = None
):
    """Get all invoices for current user"""
    query = db.query(Invoice).join(UploadedFile).filter(
        UploadedFile.user_id == current_user.id
    )
    
    if status_filter:
        query = query.filter(Invoice.status == status_filter)
    
    invoices = query.order_by(desc(Invoice.created_at)).offset(skip).limit(limit).all()
    
    return invoices


@router.get("/summary", response_model=InvoiceSummary)
def get_invoice_summary(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get invoice summary statistics"""
    invoices = db.query(Invoice).join(UploadedFile).filter(
        UploadedFile.user_id == current_user.id,
        Invoice.status == "pending"
    ).all()
    
    total_outstanding = sum(inv.amount for inv in invoices)
    avg_invoice_value = total_outstanding / len(invoices) if invoices else 0
    
    return {
        "total_outstanding": total_outstanding,
        "avg_invoice_value": avg_invoice_value,
        "avg_days_outstanding": 18,  # Simplified calculation
        "invoice_count": len(invoices)
    }


@router.get("/{invoice_id}", response_model=InvoiceSchema)
def get_invoice(
    invoice_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get specific invoice"""
    invoice = db.query(Invoice).join(UploadedFile).filter(
        Invoice.id == invoice_id,
        UploadedFile.user_id == current_user.id
    ).first()
    
    if not invoice:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invoice not found"
        )
    
    return invoice


@router.put("/{invoice_id}", response_model=InvoiceSchema)
def update_invoice(
    invoice_id: int,
    invoice_update: InvoiceCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update invoice"""
    invoice = db.query(Invoice).join(UploadedFile).filter(
        Invoice.id == invoice_id,
        UploadedFile.user_id == current_user.id
    ).first()
    
    if not invoice:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invoice not found"
        )
    
    for key, value in invoice_update.dict().items():
        setattr(invoice, key, value)
    
    db.commit()
    db.refresh(invoice)
    
    return invoice


@router.delete("/{invoice_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_invoice(
    invoice_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Delete invoice"""
    invoice = db.query(Invoice).join(UploadedFile).filter(
        Invoice.id == invoice_id,
        UploadedFile.user_id == current_user.id
    ).first()
    
    if not invoice:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invoice not found"
        )
    
    db.delete(invoice)
    db.commit()
    
    return None
