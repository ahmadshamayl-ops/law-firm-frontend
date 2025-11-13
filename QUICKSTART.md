# Quick Start Guide

Get the Law Firm Cash Posting application up and running in minutes!

## ⚡ 5-Minute Setup

### Prerequisites

Ensure you have installed:
- **Node.js** 18+ ([Download](https://nodejs.org/))
- **Python** 3.10+ ([Download](https://www.python.org/downloads/))
- **PostgreSQL** 14+ ([Download](https://www.postgresql.org/download/))

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd law-firm-cash-posting
```

### Step 2: Set Up the Database

```bash
# Create PostgreSQL database
createdb lawfirm_db

# Or using psql:
psql -U postgres
CREATE DATABASE lawfirm_db;
\q
```

### Step 3: Start the Backend

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment (using defaults)
cp .env.example .env

# Start the server
python run.py
```

✅ Backend running at `http://localhost:8000`

### Step 4: Start the Frontend

Open a **new terminal** window:

```bash
# Navigate to project root
cd law-firm-cash-posting

# Install dependencies
npm install

# Start development server
npm run dev
```

✅ Frontend running at `http://localhost:5173`

### Step 5: Use the Application

1. **Open your browser** and go to `http://localhost:5173`

2. **Sign up** for a new account:
   - Click "Get Started" or go to `/auth`
   - Enter your email and password
   - Click "Create Account"

3. **Upload sample data**:
   - Go to **Settings** page
   - Drag and drop files or click to browse
   - Use sample files from `backend/sample_data/`:
     - `sample_invoice.csv`
     - `sample_payments.csv`

4. **Run auto-matching**:
   - Go to **Matches** page
   - Click "Auto-Match Payments"
   - Review the matched results

5. **View analytics**:
   - Check the **Dashboard** for overview
   - Visit **Reports** for detailed analytics

## 🎯 What You Can Do

### Upload Files
- **Supported formats**: PDF, Excel (.xlsx), CSV, Word (.docx)
- **File types**: Invoices, payment records, bank statements
- **Max size**: 10MB per file

### Manage Invoices
- View all outstanding invoices
- Search by invoice number or client name
- Track payment status
- Export data

### Match Payments
- **Automatic matching** with AI algorithms
- **Confidence scores** for each match
- **Manual review** for low-confidence matches
- **Bulk approval** of matches

### Analytics & Reports
- Real-time dashboard metrics
- Performance indicators
- Financial impact analysis
- Match rate trends

## 🔧 Common Issues

### Backend won't start

**Error**: `ModuleNotFoundError: No module named 'fastapi'`

**Solution**:
```bash
pip install -r requirements.txt
```

**Error**: `Could not connect to database`

**Solution**:
```bash
# Check if PostgreSQL is running
pg_isready

# Verify database exists
psql -U postgres -l

# Update DATABASE_URL in backend/.env
```

### Frontend won't start

**Error**: `Cannot find module`

**Solution**:
```bash
rm -rf node_modules package-lock.json
npm install
```

**Error**: `Failed to fetch`

**Solution**:
- Ensure backend is running on port 8000
- Check VITE_API_URL in `.env`
- Verify CORS settings in backend

### File upload fails

**Error**: `File size exceeds limit`

**Solution**: Reduce file size or increase `MAX_FILE_SIZE` in `backend/.env`

**Error**: `Unsupported file type`

**Solution**: Use supported formats: PDF, DOCX, XLSX, CSV

## 📁 Sample Data Files

Test the application with provided sample files:

### `backend/sample_data/sample_invoice.csv`
Contains 8 sample invoices with:
- Invoice numbers
- Client names
- Amounts
- Due dates

### `backend/sample_data/sample_payments.csv`
Contains 7 sample payments that match the invoices

**How to use**:
1. Upload `sample_invoice.csv` first
2. Upload `sample_payments.csv` second
3. Go to Matches page
4. Click "Auto-Match Payments"
5. See the results!

## 🎨 UI Features

### Dashboard
- Live statistics cards
- Recent matches list
- Performance metrics
- Quick action buttons

### Invoices Page
- Summary cards (total outstanding, average value, days outstanding)
- Searchable invoice table
- Status badges
- Export functionality

### Matches Page
- Match statistics
- Auto-match button
- Confidence score indicators
- Approve/reject actions
- AI insights

### Settings Page
- File upload interface
- Account management
- Automation preferences
- Integration settings

## 🔐 Authentication

### First Time Setup
1. Sign up with any email (no verification required for development)
2. Password must be at least 6 characters
3. You're automatically logged in after signup

### Login
- Use your email and password
- JWT token is stored in localStorage
- Token expires after 30 minutes (default)

### Logout
- Click "Logout" button in top navigation
- Token is automatically cleared
- Redirected to landing page

## 🧪 Testing the Workflow

Complete end-to-end test:

```bash
# 1. Create account at /auth
# 2. Login
# 3. Go to Settings
# 4. Upload sample_invoice.csv
# 5. Upload sample_payments.csv
# 6. Go to Matches
# 7. Click "Auto-Match Payments"
# 8. Review matches (should see 7 matches)
# 9. Approve pending matches
# 10. Check Dashboard for updated stats
# 11. View Reports for analytics
```

## 📊 API Documentation

Once the backend is running, view interactive API docs:

- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

Try API endpoints directly from the browser!

## 🚀 Next Steps

1. **Explore all features**: Try each page and feature
2. **Upload your own files**: Test with real data
3. **Customize settings**: Adjust automation preferences
4. **Review the code**: Check out the architecture
5. **Read full documentation**: See `README.md` for details

## 💡 Tips

- **Use Chrome DevTools** to inspect API calls
- **Check backend logs** for debugging
- **Use sample data** to quickly test features
- **Try different file formats** (PDF, Excel, CSV)
- **Experiment with matching** - upload various payment amounts

## 🆘 Need Help?

1. Check the full `README.md`
2. Review `backend/README.md` for API details
3. See `DEPLOYMENT.md` for production setup
4. Check API documentation at `/docs`
5. Review error messages in browser console

## 🎉 You're Ready!

Your full-stack Law Firm Cash Posting application is now running. Start uploading files and exploring the features!

**Happy coding! 🚀**
