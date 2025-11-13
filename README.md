# Law Firm Cash Posting - Full Stack Application

A full-stack AI-powered cash posting automation system for law firms, combining a React frontend with a FastAPI backend for real-time invoice matching, payment processing, and analytics.

## 🚀 Features

### Frontend (React + TypeScript)
- **Modern UI/UX**: Clean, professional interface built with React and shadcn/ui
- **Authentication**: Secure login/signup with JWT token management
- **Real-time Dashboard**: Live analytics and performance metrics
- **File Upload**: Drag-and-drop file upload interface
- **Invoice Management**: View, search, and manage invoices
- **Payment Matching**: AI-powered payment-to-invoice matching with confidence scores
- **Analytics & Reports**: Interactive charts and insights
- **Responsive Design**: Works seamlessly on desktop and mobile

### Backend (FastAPI + PostgreSQL)
- **RESTful API**: FastAPI with automatic OpenAPI documentation
- **Authentication**: JWT-based auth with secure password hashing
- **Database**: PostgreSQL with SQLAlchemy ORM
- **File Processing**: Parse PDF, Excel, CSV, Word documents
- **AI Matching**: Intelligent payment-to-invoice matching algorithms
- **Analytics Engine**: Real-time metrics and insights
- **CORS Support**: Configured for frontend integration

## 📁 Project Structure

```
law-firm-cash-posting/
├── backend/                    # FastAPI Backend
│   ├── app/
│   │   ├── routers/           # API route handlers
│   │   │   ├── auth.py        # Authentication endpoints
│   │   │   ├── files.py       # File upload/processing
│   │   │   ├── invoices.py    # Invoice management
│   │   │   ├── payments.py    # Payment management
│   │   │   ├── matches.py     # Matching logic
│   │   │   └── analytics.py   # Analytics/metrics
│   │   ├── main.py            # FastAPI app
│   │   ├── models.py          # Database models
│   │   ├── schemas.py         # Pydantic schemas
│   │   ├── database.py        # DB connection
│   │   ├── auth.py            # Auth utilities
│   │   ├── config.py          # Configuration
│   │   └── file_processor.py  # File parsing logic
│   ├── sample_data/           # Sample CSV files
│   ├── requirements.txt       # Python dependencies
│   ├── .env                   # Environment variables
│   └── README.md              # Backend documentation
│
├── src/                       # React Frontend
│   ├── components/            # Reusable components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── DashboardLayout.tsx
│   │   ├── FileUpload.tsx    # File upload component
│   │   └── ProtectedRoute.tsx
│   ├── contexts/             # React contexts
│   │   └── AuthContext.tsx   # Authentication state
│   ├── lib/                  # Utilities
│   │   ├── api.ts            # API client
│   │   └── utils.ts          # Helper functions
│   ├── pages/                # Page components
│   │   ├── Auth.tsx          # Login/Signup
│   │   ├── Dashboard.tsx     # Main dashboard
│   │   ├── Invoices.tsx      # Invoice list
│   │   ├── Matches.tsx       # Payment matches
│   │   ├── Reports.tsx       # Analytics
│   │   └── Settings.tsx      # Settings + File upload
│   ├── App.tsx               # Main app component
│   └── main.tsx              # Entry point
│
├── package.json              # Frontend dependencies
├── vite.config.ts            # Vite configuration
└── README.md                 # This file
```

## 🛠️ Setup Instructions

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.10+
- **PostgreSQL** 14+
- Git

### Backend Setup

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Create virtual environment:**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies:**
```bash
pip install -r requirements.txt
```

4. **Set up PostgreSQL database:**
```bash
# Create database
createdb lawfirm_db

# Or using psql:
psql -U postgres
CREATE DATABASE lawfirm_db;
\q
```

5. **Configure environment variables:**
```bash
cp .env.example .env
# Edit .env with your database credentials
```

6. **Run the backend:**
```bash
python run.py
```

Backend will be available at `http://localhost:8000`
- API Documentation: `http://localhost:8000/docs`
- Alternative docs: `http://localhost:8000/redoc`

### Frontend Setup

1. **Navigate to project root:**
```bash
cd ..  # From backend directory
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure environment:**
```bash
cp .env.example .env
# Default: VITE_API_URL=http://localhost:8000
```

4. **Run the development server:**
```bash
npm run dev
```

Frontend will be available at `http://localhost:5173`

## 🎯 Usage Guide

### 1. Create an Account

1. Navigate to `http://localhost:5173`
2. Click "Get Started" or go to `/auth`
3. Sign up with your email and password
4. You'll be automatically logged in and redirected to the dashboard

### 2. Upload Files

1. Go to **Settings** page
2. Use the file upload component to upload:
   - Invoice files (PDF, DOCX, XLSX, CSV)
   - Payment files (CSV, XLSX, PDF)
   - Sample files are provided in `backend/sample_data/`
3. Files are automatically processed upon upload

### 3. View Invoices

1. Navigate to **Invoices** page
2. View all outstanding invoices with:
   - Summary statistics
   - Searchable invoice list
   - Detailed information per invoice

### 4. Match Payments

1. Go to **Matches** page
2. Click "Auto-Match Payments" to run AI matching
3. Review matches with confidence scores
4. Approve or reject matches requiring manual review
5. High-confidence matches (≥95%) are auto-posted

### 5. View Analytics

1. Check **Dashboard** for overview metrics
2. Visit **Reports** for detailed analytics:
   - Processing volume trends
   - Match rate distribution
   - Financial impact analysis
   - Performance metrics

## 🔧 Configuration

### Backend Configuration (`backend/.env`)

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/lawfirm_db

# Security (change in production!)
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
FRONTEND_URL=http://localhost:5173

# File Upload
MAX_FILE_SIZE=10485760  # 10MB
UPLOAD_DIR=./uploads
```

### Frontend Configuration (`.env`)

```env
VITE_API_URL=http://localhost:8000
```

## 📊 Sample Data

Sample CSV files are provided in `backend/sample_data/`:

- `sample_invoice.csv` - Sample invoices
- `sample_payments.csv` - Sample payments

Upload these files to quickly populate your system with test data.

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login (returns JWT token)
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Files
- `POST /api/files/upload` - Upload and process file
- `GET /api/files/` - List uploaded files
- `GET /api/files/{id}` - Get file details
- `DELETE /api/files/{id}` - Delete file

### Invoices
- `GET /api/invoices/` - List invoices
- `GET /api/invoices/summary` - Get summary stats
- `GET /api/invoices/{id}` - Get invoice details
- `POST /api/invoices/` - Create invoice
- `PUT /api/invoices/{id}` - Update invoice
- `DELETE /api/invoices/{id}` - Delete invoice

### Matches
- `POST /api/matches/auto-match` - Auto-match payments
- `GET /api/matches/` - List all matches
- `GET /api/matches/stats` - Get match statistics
- `PUT /api/matches/{id}/approve` - Approve match
- `DELETE /api/matches/{id}` - Reject match

### Analytics
- `GET /api/analytics/dashboard-stats` - Dashboard metrics
- `GET /api/analytics/performance-metrics` - Performance data
- `GET /api/analytics/recent-matches` - Recent matches
- `GET /api/analytics/financial-metrics` - Financial analysis

## 🚢 Deployment

### Production Checklist

**Backend:**
- [ ] Change `SECRET_KEY` to a strong random value
- [ ] Set up production PostgreSQL server
- [ ] Configure HTTPS/SSL
- [ ] Update CORS origins to production domains
- [ ] Use production ASGI server (Gunicorn + Uvicorn)
- [ ] Set up proper logging and monitoring
- [ ] Configure file storage (S3 or similar)
- [ ] Set up database backups

**Frontend:**
- [ ] Update `VITE_API_URL` to production API
- [ ] Build production bundle: `npm run build`
- [ ] Deploy to hosting service (Vercel, Netlify, etc.)
- [ ] Configure custom domain
- [ ] Set up CDN for static assets

### Docker Deployment (Optional)

Create `docker-compose.yml`:

```yaml
version: '3.8'
services:
  db:
    image: postgres:14
    environment:
      POSTGRES_DB: lawfirm_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    depends_on:
      - db
    environment:
      DATABASE_URL: postgresql://postgres:postgres@db:5432/lawfirm_db

  frontend:
    build: .
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  postgres_data:
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest
```

### Frontend Tests
```bash
npm test
```

## 📝 Development

### Code Formatting

**Backend:**
```bash
black app/
```

**Frontend:**
```bash
npm run lint
```

### Type Checking

**Backend:**
```bash
mypy app/
```

**Frontend:**
```bash
npx tsc --noEmit
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is proprietary and confidential. All rights reserved.

## 🆘 Support

For issues or questions:
1. Check the documentation in `backend/README.md`
2. Review API docs at `/docs` endpoint
3. Contact the development team

## 🎉 Features Implemented

✅ Full authentication system with JWT
✅ File upload and processing (PDF, Excel, CSV, Word)
✅ Invoice and payment management
✅ AI-powered payment matching with multiple algorithms
✅ Real-time analytics and dashboard
✅ Responsive React UI with modern design
✅ PostgreSQL database integration
✅ RESTful API with OpenAPI documentation
✅ Protected routes and session management
✅ Error handling and validation
✅ Sample data for testing

## 🔮 Future Enhancements

- [ ] Real-time WebSocket updates
- [ ] Email notifications
- [ ] ERP system integration (SAP, NetSuite)
- [ ] Advanced reporting with charts
- [ ] Bulk operations
- [ ] Audit trail and logging
- [ ] Multi-tenancy support
- [ ] Mobile app

---

**Built with ❤️ for law firms seeking automation excellence**
