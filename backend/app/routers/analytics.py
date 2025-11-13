from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models import User, PaymentMatch, Invoice, Payment, UploadedFile
from app.schemas import (
    DashboardStats,
    PerformanceMetrics,
    RecentMatch,
    FinancialMetrics
)
from app.auth import get_current_active_user

router = APIRouter(prefix="/api/analytics", tags=["analytics"])


@router.get("/dashboard-stats", response_model=DashboardStats)
def get_dashboard_stats(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get dashboard statistics"""
    # Get all invoices for user
    invoices = db.query(Invoice).join(UploadedFile).filter(
        UploadedFile.user_id == current_user.id
    ).all()
    
    # Get all matches for user
    matches = db.query(PaymentMatch).join(
        Payment, PaymentMatch.payment_id == Payment.id
    ).join(
        UploadedFile, Payment.file_id == UploadedFile.id
    ).filter(
        UploadedFile.user_id == current_user.id
    ).all()
    
    total_processed = sum(inv.amount for inv in invoices if inv.status == "paid")
    auto_posted = sum(1 for m in matches if m.status == "posted")
    pending_review = sum(1 for m in matches if m.status == "review")
    total_matches = len(matches)
    
    match_rate = (auto_posted / total_matches * 100) if total_matches > 0 else 0
    
    return {
        "total_processed": total_processed,
        "total_processed_change": 12.5,  # Mock data for percentage change
        "match_rate": round(match_rate, 1),
        "match_rate_change": 2.1,
        "pending_review": pending_review,
        "pending_review_change": -8,
        "auto_posted": auto_posted,
        "auto_posted_change": 94
    }


@router.get("/performance-metrics", response_model=PerformanceMetrics)
def get_performance_metrics(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get performance metrics"""
    matches = db.query(PaymentMatch).join(
        Payment, PaymentMatch.payment_id == Payment.id
    ).join(
        UploadedFile, Payment.file_id == UploadedFile.id
    ).filter(
        UploadedFile.user_id == current_user.id
    ).all()
    
    total_matches = len(matches)
    auto_posted = sum(1 for m in matches if m.status == "posted")
    
    auto_match_rate = (auto_posted / total_matches * 100) if total_matches > 0 else 0
    
    return {
        "auto_match_rate": round(auto_match_rate, 1),
        "processing_speed": 92.0,  # Mock metric
        "data_quality": 96.0  # Mock metric
    }


@router.get("/recent-matches", response_model=List[RecentMatch])
def get_recent_matches(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
    limit: int = 10
):
    """Get recent matches"""
    results = db.query(
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
    ).order_by(PaymentMatch.matched_at.desc()).limit(limit).all()
    
    matches = []
    for match, payment, invoice in results:
        matches.append(RecentMatch(
            id=payment.payment_reference,
            payer=payment.payer_name,
            invoice=invoice.invoice_number,
            amount=f"${payment.amount:,.2f}",
            confidence=match.confidence_score,
            status=match.status
        ))
    
    return matches


@router.get("/financial-metrics", response_model=FinancialMetrics)
def get_financial_metrics(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get financial metrics"""
    # Get paid invoices for MTD calculation
    paid_invoices = db.query(Invoice).join(UploadedFile).filter(
        UploadedFile.user_id == current_user.id,
        Invoice.status == "paid"
    ).all()
    
    total_processed_mtd = sum(inv.amount for inv in paid_invoices)
    
    # Get automation rate
    matches = db.query(PaymentMatch).join(
        Payment, PaymentMatch.payment_id == Payment.id
    ).join(
        UploadedFile, Payment.file_id == UploadedFile.id
    ).filter(
        UploadedFile.user_id == current_user.id
    ).all()
    
    total_matches = len(matches)
    auto_posted = sum(1 for m in matches if m.status == "posted")
    automation_rate = (auto_posted / total_matches * 100) if total_matches > 0 else 0
    
    # Mock calculations for time and cost savings
    time_saved_hours = int(total_matches * 0.25)  # Assume 15 min saved per match
    cost_savings = time_saved_hours * 50  # $50 per hour labor cost
    
    return {
        "total_processed_mtd": total_processed_mtd,
        "automation_rate": round(automation_rate, 1),
        "time_saved_hours": time_saved_hours,
        "cost_savings": cost_savings
    }
