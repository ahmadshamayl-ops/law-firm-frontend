# Law Firm Cash Posting API Backend

FastAPI backend for AI-powered cash posting automation for law firms.

## Features

- **Authentication**: JWT-based authentication with PostgreSQL
- **File Processing**: Upload and process invoices/payments (PDF, DOCX, Excel, CSV)
- **AI Matching**: Automatically match payments to invoices
- **Analytics Dashboard**: Real-time metrics and insights
- **RESTful API**: Full CRUD operations for invoices, payments, and matches

## Tech Stack

- **FastAPI**: Modern Python web framework
- **PostgreSQL**: Relational database
- **SQLAlchemy**: ORM for database operations
- **JWT**: Secure authentication
- **Pandas**: Data processing
- **PyPDF2, python-docx**: File parsing

## Setup Instructions

### Prerequisites

- Python 3.10+
- PostgreSQL 14+
- pip or poetry

### Installation

1. **Install dependencies:**
```bash
cd backend
pip install -r requirements.txt
```

2. **Set up PostgreSQL database:**
```bash
# Create database
createdb lawfirm_db

# Or using psql
psql -U postgres
CREATE DATABASE lawfirm_db;
```

3. **Configure environment variables:**
```bash
# Copy example env file
cp .env.example .env

# Edit .env with your database credentials
DATABASE_URL=postgresql://username:password@localhost:5432/lawfirm_db
```

4. **Initialize database (tables will be created automatically on first run):**
The application uses SQLAlchemy to automatically create tables on startup.

5. **Run the development server:**
```bash
python run.py
```

The API will be available at `http://localhost:8000`

### API Documentation

Once running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/logout` - Logout

### Files
- `POST /api/files/upload` - Upload and process file
- `GET /api/files/` - List user's files
- `GET /api/files/{file_id}` - Get file details
- `DELETE /api/files/{file_id}` - Delete file

### Invoices
- `POST /api/invoices/` - Create invoice
- `GET /api/invoices/` - List invoices
- `GET /api/invoices/summary` - Get invoice summary stats
- `GET /api/invoices/{invoice_id}` - Get invoice details
- `PUT /api/invoices/{invoice_id}` - Update invoice
- `DELETE /api/invoices/{invoice_id}` - Delete invoice

### Payments
- `POST /api/payments/` - Create payment
- `GET /api/payments/` - List payments
- `GET /api/payments/{payment_id}` - Get payment details
- `DELETE /api/payments/{payment_id}` - Delete payment

### Matches
- `POST /api/matches/auto-match` - Auto-match payments to invoices
- `GET /api/matches/` - List all matches
- `GET /api/matches/stats` - Get match statistics
- `PUT /api/matches/{match_id}/approve` - Approve a match
- `DELETE /api/matches/{match_id}` - Reject a match

### Analytics
- `GET /api/analytics/dashboard-stats` - Dashboard statistics
- `GET /api/analytics/performance-metrics` - Performance metrics
- `GET /api/analytics/recent-matches` - Recent matches
- `GET /api/analytics/financial-metrics` - Financial metrics

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application
│   ├── config.py            # Configuration settings
│   ├── database.py          # Database connection
│   ├── models.py            # SQLAlchemy models
│   ├── schemas.py           # Pydantic schemas
│   ├── auth.py              # Authentication utilities
│   ├── file_processor.py    # File processing logic
│   └── routers/
│       ├── __init__.py
│       ├── auth.py          # Auth endpoints
│       ├── files.py         # File endpoints
│       ├── invoices.py      # Invoice endpoints
│       ├── payments.py      # Payment endpoints
│       ├── matches.py       # Match endpoints
│       └── analytics.py     # Analytics endpoints
├── uploads/                  # Uploaded files directory
├── .env                      # Environment variables
├── .env.example             # Example environment variables
├── requirements.txt         # Python dependencies
├── run.py                   # Application entry point
└── README.md
```

## File Upload Formats

Supported file formats:
- **PDF**: `.pdf` - Invoices and payment receipts
- **Word**: `.docx`, `.doc` - Invoice documents
- **Excel**: `.xlsx`, `.xls` - Structured invoice/payment data
- **CSV**: `.csv` - Bulk invoice/payment imports

## Matching Algorithm

The AI matching system uses multiple strategies:

1. **Exact Match**: Perfect name and amount match (99% confidence)
2. **Fuzzy Match**: Similar names with exact amount (90-95% confidence)
3. **Contextual Match**: AI reasoning based on multiple factors (85-90% confidence)
4. **Reference Match**: Invoice/payment reference matching (90-98% confidence)

Matches with 95%+ confidence are auto-posted. Lower confidence requires manual review.

## Development

### Running Tests
```bash
pytest
```

### Code Formatting
```bash
black app/
```

### Type Checking
```bash
mypy app/
```

## Production Deployment

For production deployment:

1. Set secure `SECRET_KEY` in environment variables
2. Use production PostgreSQL server
3. Set up HTTPS/SSL
4. Configure proper CORS origins
5. Use production ASGI server (Gunicorn + Uvicorn)
6. Set up file storage (S3 or similar)
7. Implement proper logging and monitoring

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | - |
| `SECRET_KEY` | JWT secret key | - |
| `ALGORITHM` | JWT algorithm | HS256 |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token expiration time | 30 |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:5173 |
| `MAX_FILE_SIZE` | Max upload size in bytes | 10485760 |
| `UPLOAD_DIR` | Upload directory path | ./uploads |

## Support

For issues or questions, please contact the development team.
