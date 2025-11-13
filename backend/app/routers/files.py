import os
import uuid
from datetime import datetime
from typing import List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, UploadedFile, Invoice, Payment
from app.schemas import FileUploadResponse
from app.auth import get_current_active_user
from app.config import get_settings
from app.file_processor import FileProcessor

router = APIRouter(prefix="/api/files", tags=["files"])
settings = get_settings()

# Ensure upload directory exists
os.makedirs(settings.upload_dir, exist_ok=True)


@router.post("/upload", response_model=FileUploadResponse, status_code=status.HTTP_201_CREATED)
async def upload_file(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Upload and process a file"""
    # Validate file size
    content = await file.read()
    if len(content) > settings.max_file_size:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File size exceeds maximum allowed size of {settings.max_file_size} bytes"
        )
    
    # Generate unique filename
    file_extension = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(settings.upload_dir, unique_filename)
    
    # Save file
    with open(file_path, "wb") as f:
        f.write(content)
    
    # Create database record
    db_file = UploadedFile(
        user_id=current_user.id,
        filename=unique_filename,
        original_filename=file.filename,
        file_path=file_path,
        file_type=file.content_type,
        file_size=len(content),
        status="processing"
    )
    db.add(db_file)
    db.commit()
    db.refresh(db_file)
    
    # Process file in background (simplified - in production use Celery or similar)
    try:
        processed_data = FileProcessor.process_file(file_path, file.content_type)
        
        # Store extracted data based on file type
        if processed_data.get("type") == "invoice":
            extracted = processed_data.get("extracted_data", {})
            if extracted.get("invoice_number") and extracted.get("amount"):
                invoice = Invoice(
                    file_id=db_file.id,
                    invoice_number=extracted["invoice_number"],
                    client_name=f"Client-{extracted['invoice_number']}",
                    amount=extracted["amount"],
                    invoice_date=extracted.get("date"),
                    status="pending"
                )
                db.add(invoice)
        
        elif processed_data.get("type") == "structured_data":
            # Process structured data (CSV/Excel)
            records = processed_data.get("records", [])
            for record in records[:100]:  # Limit to 100 records
                # Try to identify if it's invoice or payment data
                if "invoice" in str(record).lower():
                    # Create invoice records
                    pass
                elif "payment" in str(record).lower():
                    # Create payment records
                    pass
        
        db_file.status = "completed"
        db_file.processed_at = datetime.utcnow()
    except Exception as e:
        db_file.status = "failed"
        print(f"Error processing file: {str(e)}")
    
    db.commit()
    db.refresh(db_file)
    
    return db_file


@router.get("/", response_model=List[FileUploadResponse])
def get_user_files(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100
):
    """Get all files uploaded by current user"""
    files = db.query(UploadedFile).filter(
        UploadedFile.user_id == current_user.id
    ).offset(skip).limit(limit).all()
    
    return files


@router.get("/{file_id}", response_model=FileUploadResponse)
def get_file(
    file_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get specific file details"""
    file = db.query(UploadedFile).filter(
        UploadedFile.id == file_id,
        UploadedFile.user_id == current_user.id
    ).first()
    
    if not file:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found"
        )
    
    return file


@router.delete("/{file_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_file(
    file_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Delete a file"""
    file = db.query(UploadedFile).filter(
        UploadedFile.id == file_id,
        UploadedFile.user_id == current_user.id
    ).first()
    
    if not file:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found"
        )
    
    # Delete physical file
    if os.path.exists(file.file_path):
        os.remove(file.file_path)
    
    # Delete database record
    db.delete(file)
    db.commit()
    
    return None
