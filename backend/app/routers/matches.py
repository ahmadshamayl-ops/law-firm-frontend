from typing import List
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.database import get_db
from app.models import User, PaymentMatch, Payment, Invoice, UploadedFile
from app.schemas import (
    PaymentMatch as PaymentMatchSchema,
    PaymentMatchCreate,
    PaymentMatchDetail,
    MatchStats
)
from app.auth import get_current_active_user
from app.file_processor import PaymentMatcher

router = APIRouter(prefix="/api/matches", tags=["matches"])


@router.post("/auto-match", status_code=status.HTTP_201_CREATED)
def auto_match_payments(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Automatically match payments to invoices"""
    # Get unmatched payments
    payments = db.query(Payment).join(UploadedFile).filter(
        UploadedFile.user_id == current_user.id
    ).all()
    
    # Get pending invoices
    invoices = db.query(Invoice).join(UploadedFile).filter(
        UploadedFile.user_id == current_user.id,
        Invoice.status == "pending"
    ).all()
    
    matches_created = 0
    
    for payment in payments:
        # Check if payment already has a match
        existing_match = db.query(PaymentMatch).filter(
            PaymentMatch.payment_id == payment.id
        ).first()
        
        if existing_match:
            continue
        
        # Convert to dict for matcher
        payment_dict = {
            "amount": payment.amount,
            "payer_name": payment.payer_name,
            "reference": payment.payment_reference
        }
        
        invoices_dict = [
            {
                "id": inv.id,
                "amount": inv.amount,
                "client_name": inv.client_name,
                "invoice_number": inv.invoice_number
            }
            for inv in invoices
        ]
        
        # Find best match
        match_result = PaymentMatcher.match_payment_to_invoice(payment_dict, invoices_dict)
        
        if match_result:
            invoice_id = match_result["invoice"]["id"]
            
            # Create match record
            db_match = PaymentMatch(
                payment_id=payment.id,
                invoice_id=invoice_id,
                match_type=match_result["match_type"],
                confidence_score=match_result["confidence_score"],
                status="posted" if match_result["confidence_score"] >= 95 else "review",
                match_details=match_result["details"],
                posted_at=datetime.utcnow() if match_result["confidence_score"] >= 95 else None
            )
            db.add(db_match)
            matches_created += 1
            
            # Update invoice status if auto-posted
            if match_result["confidence_score"] >= 95:
                invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
                if invoice:
                    invoice.status = "paid"
    
    db.commit()
    
    return {
        "message": f"Successfully created {matches_created} matches",
        "matches_created": matches_created
    }


@router.get("/", response_model=List[PaymentMatchDetail])
def get_matches(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    status_filter: str = None
):
    """Get all payment matches"""
    query = db.query(
        PaymentMatch,
        Payment,
        Invoice
    ).join(
        Payment, PaymentMatch.payment_id == Payment.id
    ).join(
        Invoice, PaymentMatch.invoice_id == Invoice.id
    ).join(
        UploadedFile, Payment.file_id == UploadedFile.id
    ).filter(
        UploadedFile.user_id == current_user.id
    )
    
    if status_filter:
        query = query.filter(PaymentMatch.status == status_filter)
    
    results = query.order_by(desc(PaymentMatch.matched_at)).offset(skip).limit(limit).all()
    
    matches = []
    for match, payment, invoice in results:
        matches.append(PaymentMatchDetail(
            id=match.id,
            payment_reference=payment.payment_reference,
            payer_name=payment.payer_name,
            amount=payment.amount,
            invoice_number=invoice.invoice_number,
            match_type=match.match_type,
            confidence_score=match.confidence_score,
            status=match.status,
            matched_at=match.matched_at
        ))
    
    return matches


@router.get("/stats", response_model=MatchStats)
def get_match_stats(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get match statistics"""
    # Get all matches for user
    matches = db.query(PaymentMatch).join(
        Payment, PaymentMatch.payment_id == Payment.id
    ).join(
        UploadedFile, Payment.file_id == UploadedFile.id
    ).filter(
        UploadedFile.user_id == current_user.id
    ).all()
    
    auto_posted = sum(1 for m in matches if m.status == "posted")
    pending_review = sum(1 for m in matches if m.status == "review")
    total_matches = len(matches)
    
    match_rate = (auto_posted / total_matches * 100) if total_matches > 0 else 0
    avg_confidence = sum(m.confidence_score for m in matches) / total_matches if total_matches > 0 else 0
    
    return {
        "auto_posted": auto_posted,
        "pending_review": pending_review,
        "match_rate": round(match_rate, 1),
        "avg_confidence": round(avg_confidence, 1)
    }


@router.put("/{match_id}/approve", response_model=PaymentMatchSchema)
def approve_match(
    match_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Approve a pending match"""
    match = db.query(PaymentMatch).join(
        Payment, PaymentMatch.payment_id == Payment.id
    ).join(
        UploadedFile, Payment.file_id == UploadedFile.id
    ).filter(
        PaymentMatch.id == match_id,
        UploadedFile.user_id == current_user.id
    ).first()
    
    if not match:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Match not found"
        )
    
    match.status = "posted"
    match.posted_at = datetime.utcnow()
    
    # Update invoice status
    invoice = db.query(Invoice).filter(Invoice.id == match.invoice_id).first()
    if invoice:
        invoice.status = "paid"
    
    db.commit()
    db.refresh(match)
    
    return match


@router.delete("/{match_id}", status_code=status.HTTP_204_NO_CONTENT)
def reject_match(
    match_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Reject a match"""
    match = db.query(PaymentMatch).join(
        Payment, PaymentMatch.payment_id == Payment.id
    ).join(
        UploadedFile, Payment.file_id == UploadedFile.id
    ).filter(
        PaymentMatch.id == match_id,
        UploadedFile.user_id == current_user.id
    ).first()
    
    if not match:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Match not found"
        )
    
    match.status = "rejected"
    db.commit()
    
    return None
