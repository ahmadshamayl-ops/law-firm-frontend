import os
import re
from datetime import datetime
from typing import List, Dict, Any, Optional
import pandas as pd
from PyPDF2 import PdfReader
from docx import Document


class FileProcessor:
    """Process uploaded files and extract invoice/payment data"""
    
    @staticmethod
    def extract_amount(text: str) -> Optional[float]:
        """Extract monetary amount from text"""
        # Look for patterns like $1,234.56 or 1234.56
        pattern = r'\$?\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)'
        matches = re.findall(pattern, text)
        if matches:
            # Clean and convert to float
            amount_str = matches[0].replace(',', '')
            return float(amount_str)
        return None
    
    @staticmethod
    def extract_date(text: str) -> Optional[datetime]:
        """Extract date from text"""
        # Simple date pattern matching
        patterns = [
            r'(\d{4}-\d{2}-\d{2})',  # YYYY-MM-DD
            r'(\d{2}/\d{2}/\d{4})',  # MM/DD/YYYY
            r'(\d{2}-\d{2}-\d{4})',  # MM-DD-YYYY
        ]
        
        for pattern in patterns:
            matches = re.findall(pattern, text)
            if matches:
                try:
                    return datetime.strptime(matches[0], '%Y-%m-%d')
                except ValueError:
                    try:
                        return datetime.strptime(matches[0], '%m/%d/%Y')
                    except ValueError:
                        try:
                            return datetime.strptime(matches[0], '%m-%d-%Y')
                        except ValueError:
                            continue
        return None
    
    @staticmethod
    def process_pdf(file_path: str) -> Dict[str, Any]:
        """Extract data from PDF file"""
        reader = PdfReader(file_path)
        text = ""
        for page in reader.pages:
            text += page.extract_text()
        
        # Extract invoice/payment information
        data = {
            "type": "invoice" if "invoice" in text.lower() else "payment",
            "raw_text": text,
            "extracted_data": {}
        }
        
        # Extract invoice number
        invoice_pattern = r'(?:invoice|inv)[\s#:]*([A-Z0-9-]+)'
        invoice_match = re.search(invoice_pattern, text, re.IGNORECASE)
        if invoice_match:
            data["extracted_data"]["invoice_number"] = invoice_match.group(1)
        
        # Extract amount
        amount = FileProcessor.extract_amount(text)
        if amount:
            data["extracted_data"]["amount"] = amount
        
        # Extract date
        date = FileProcessor.extract_date(text)
        if date:
            data["extracted_data"]["date"] = date
        
        return data
    
    @staticmethod
    def process_docx(file_path: str) -> Dict[str, Any]:
        """Extract data from Word document"""
        doc = Document(file_path)
        text = ""
        for paragraph in doc.paragraphs:
            text += paragraph.text + "\n"
        
        data = {
            "type": "invoice" if "invoice" in text.lower() else "payment",
            "raw_text": text,
            "extracted_data": {}
        }
        
        # Extract similar data as PDF
        invoice_pattern = r'(?:invoice|inv)[\s#:]*([A-Z0-9-]+)'
        invoice_match = re.search(invoice_pattern, text, re.IGNORECASE)
        if invoice_match:
            data["extracted_data"]["invoice_number"] = invoice_match.group(1)
        
        amount = FileProcessor.extract_amount(text)
        if amount:
            data["extracted_data"]["amount"] = amount
        
        date = FileProcessor.extract_date(text)
        if date:
            data["extracted_data"]["date"] = date
        
        return data
    
    @staticmethod
    def process_excel(file_path: str) -> Dict[str, Any]:
        """Extract data from Excel file"""
        df = pd.read_excel(file_path)
        
        # Convert DataFrame to list of dictionaries
        records = df.to_dict('records')
        
        data = {
            "type": "structured_data",
            "records": records,
            "columns": list(df.columns),
            "row_count": len(df)
        }
        
        return data
    
    @staticmethod
    def process_csv(file_path: str) -> Dict[str, Any]:
        """Extract data from CSV file"""
        df = pd.read_csv(file_path)
        
        records = df.to_dict('records')
        
        data = {
            "type": "structured_data",
            "records": records,
            "columns": list(df.columns),
            "row_count": len(df)
        }
        
        return data
    
    @staticmethod
    def process_file(file_path: str, file_type: str) -> Dict[str, Any]:
        """Main method to process any file type"""
        try:
            if file_type == "application/pdf":
                return FileProcessor.process_pdf(file_path)
            elif file_type in ["application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/msword"]:
                return FileProcessor.process_docx(file_path)
            elif file_type in ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel"]:
                return FileProcessor.process_excel(file_path)
            elif file_type == "text/csv":
                return FileProcessor.process_csv(file_path)
            else:
                return {"error": f"Unsupported file type: {file_type}"}
        except Exception as e:
            return {"error": f"Error processing file: {str(e)}"}


class PaymentMatcher:
    """Match payments to invoices using various algorithms"""
    
    @staticmethod
    def calculate_name_similarity(name1: str, name2: str) -> float:
        """Calculate similarity between two names"""
        name1 = name1.lower().strip()
        name2 = name2.lower().strip()
        
        if name1 == name2:
            return 1.0
        
        # Simple fuzzy matching based on common words
        words1 = set(name1.split())
        words2 = set(name2.split())
        
        if not words1 or not words2:
            return 0.0
        
        intersection = words1.intersection(words2)
        union = words1.union(words2)
        
        return len(intersection) / len(union)
    
    @staticmethod
    def match_payment_to_invoice(
        payment: Dict[str, Any],
        invoices: List[Dict[str, Any]]
    ) -> Optional[Dict[str, Any]]:
        """Find best matching invoice for a payment"""
        best_match = None
        best_score = 0.0
        
        payment_amount = payment.get("amount", 0)
        payment_payer = payment.get("payer_name", "")
        
        for invoice in invoices:
            invoice_amount = invoice.get("amount", 0)
            invoice_client = invoice.get("client_name", "")
            
            # Calculate match score
            score = 0.0
            match_type = "contextual"
            
            # Exact amount match
            if abs(payment_amount - invoice_amount) < 0.01:
                score += 0.5
                
                # Exact name match
                name_similarity = PaymentMatcher.calculate_name_similarity(
                    payment_payer, invoice_client
                )
                
                if name_similarity >= 0.95:
                    match_type = "exact"
                    score = 0.99
                elif name_similarity >= 0.7:
                    match_type = "fuzzy"
                    score += 0.45
                else:
                    score += name_similarity * 0.4
            else:
                # Partial amount match
                amount_diff = abs(payment_amount - invoice_amount) / max(invoice_amount, payment_amount)
                if amount_diff < 0.1:  # Within 10%
                    score += 0.3
                    name_similarity = PaymentMatcher.calculate_name_similarity(
                        payment_payer, invoice_client
                    )
                    score += name_similarity * 0.3
            
            if score > best_score:
                best_score = score
                best_match = {
                    "invoice": invoice,
                    "match_type": match_type,
                    "confidence_score": min(best_score * 100, 99),
                    "details": {
                        "amount_match": abs(payment_amount - invoice_amount) < 0.01,
                        "name_similarity": PaymentMatcher.calculate_name_similarity(
                            payment_payer, invoice_client
                        )
                    }
                }
        
        # Only return match if confidence is above threshold
        if best_score >= 0.5:
            return best_match
        
        return None
