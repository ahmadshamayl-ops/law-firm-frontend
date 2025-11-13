# System Architecture

Complete technical architecture documentation for the Law Firm Cash Posting application.

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                             │
│                  (React + TypeScript)                        │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Auth    │  │Dashboard │  │ Invoices │  │ Matches  │   │
│  │  Pages   │  │  Pages   │  │  Pages   │  │  Pages   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│        │              │              │              │        │
│        └──────────────┴──────────────┴──────────────┘       │
│                          │                                   │
│                    ┌─────▼─────┐                           │
│                    │ API Client │                           │
│                    └─────┬─────┘                           │
└──────────────────────────┼─────────────────────────────────┘
                           │ HTTPS/REST
                    ┌──────▼──────┐
                    │   FastAPI   │
                    │   Backend   │
                    └──────┬──────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
   ┌────▼────┐      ┌─────▼─────┐     ┌────▼────┐
   │PostgreSQL│      │   File    │     │   AI    │
   │ Database │      │ Processing│     │ Matching│
   └──────────┘      └───────────┘     └─────────┘
```

## 📦 Component Breakdown

### Frontend Architecture

```
src/
├── components/              # Reusable UI components
│   ├── ui/                 # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── table.tsx
│   │   └── ...
│   ├── DashboardLayout.tsx # Main layout wrapper
│   ├── FileUpload.tsx      # File upload widget
│   ├── ProtectedRoute.tsx  # Route guard
│   └── NavLink.tsx         # Navigation component
│
├── contexts/               # React Context providers
│   └── AuthContext.tsx     # Authentication state
│
├── lib/                    # Utilities and helpers
│   ├── api.ts             # API client (Axios)
│   └── utils.ts           # Helper functions
│
├── pages/                 # Page components (routes)
│   ├── Landing.tsx        # Landing page
│   ├── Auth.tsx           # Login/Signup
│   ├── Dashboard.tsx      # Main dashboard
│   ├── Invoices.tsx       # Invoice management
│   ├── Matches.tsx        # Payment matching
│   ├── Reports.tsx        # Analytics
│   └── Settings.tsx       # Settings + upload
│
└── App.tsx                # Main app component
```

#### Key Frontend Patterns

1. **Component Composition**
   - Atomic design principles
   - Reusable UI components
   - Compound components pattern

2. **State Management**
   - React Context for global auth state
   - Local state for component-specific data
   - React Query for server state

3. **API Integration**
   - Centralized API client (`api.ts`)
   - Axios interceptors for auth tokens
   - Error handling and retry logic

4. **Routing**
   - React Router v6
   - Protected routes with auth guard
   - Lazy loading (future enhancement)

### Backend Architecture

```
backend/app/
├── routers/                 # API route handlers
│   ├── auth.py             # Authentication endpoints
│   ├── files.py            # File upload/management
│   ├── invoices.py         # Invoice CRUD
│   ├── payments.py         # Payment CRUD
│   ├── matches.py          # Matching logic
│   └── analytics.py        # Analytics endpoints
│
├── models.py               # SQLAlchemy ORM models
├── schemas.py              # Pydantic validation schemas
├── database.py             # Database connection
├── auth.py                 # Authentication utilities
├── config.py               # Configuration management
├── file_processor.py       # File parsing logic
└── main.py                 # FastAPI application
```

#### Key Backend Patterns

1. **Layered Architecture**
   ```
   API Layer (routers) 
        ↓
   Business Logic Layer (processors)
        ↓
   Data Layer (models/database)
   ```

2. **Dependency Injection**
   - FastAPI's DI system
   - Database session management
   - Authentication dependencies

3. **Schema Validation**
   - Pydantic models for request/response
   - Type hints throughout
   - Automatic OpenAPI generation

4. **Error Handling**
   - HTTPException for expected errors
   - Middleware for unexpected errors
   - Structured error responses

## 🔄 Data Flow

### Authentication Flow

```
1. User submits credentials
   ↓
2. Frontend sends POST /api/auth/login
   ↓
3. Backend validates credentials
   ↓
4. Backend generates JWT token
   ↓
5. Frontend stores token in localStorage
   ↓
6. Frontend includes token in subsequent requests
   ↓
7. Backend validates token on each request
```

### File Upload Flow

```
1. User selects file
   ↓
2. Frontend validates file (size, type)
   ↓
3. Frontend sends POST /api/files/upload
   ↓
4. Backend saves file to disk
   ↓
5. Backend creates database record
   ↓
6. Backend processes file (extract data)
   ↓
7. Backend creates invoice/payment records
   ↓
8. Backend updates file status
   ↓
9. Frontend receives upload response
   ↓
10. Frontend refreshes data
```

### Payment Matching Flow

```
1. User clicks "Auto-Match"
   ↓
2. Frontend sends POST /api/matches/auto-match
   ↓
3. Backend fetches unmatched payments
   ↓
4. Backend fetches pending invoices
   ↓
5. Backend runs matching algorithm:
   - Exact amount + name match (99%)
   - Fuzzy name match (90-95%)
   - Contextual match (85-90%)
   ↓
6. Backend creates match records
   ↓
7. Backend auto-posts high-confidence matches (≥95%)
   ↓
8. Backend returns match results
   ↓
9. Frontend displays matches
```

## 💾 Database Schema

### Entity Relationship Diagram

```
┌─────────────┐
│    Users    │
├─────────────┤
│ id (PK)     │
│ email       │
│ password    │
│ full_name   │
└──────┬──────┘
       │ 1:N
       │
┌──────▼──────────────┐
│  UploadedFiles      │
├─────────────────────┤
│ id (PK)             │
│ user_id (FK)        │
│ filename            │
│ file_path           │
│ status              │
└──────┬──────────────┘
       │ 1:N
       ├────────────────┐
       │                │
┌──────▼──────┐  ┌─────▼──────┐
│  Invoices   │  │  Payments  │
├─────────────┤  ├────────────┤
│ id (PK)     │  │ id (PK)    │
│ file_id(FK) │  │ file_id(FK)│
│ inv_number  │  │ pay_ref    │
│ client_name │  │ payer_name │
│ amount      │  │ amount     │
└──────┬──────┘  └─────┬──────┘
       │ 1:N      N:1  │
       │                │
       └────────┬───────┘
                │
        ┌───────▼────────┐
        │ PaymentMatches │
        ├────────────────┤
        │ id (PK)        │
        │ payment_id(FK) │
        │ invoice_id(FK) │
        │ match_type     │
        │ confidence     │
        │ status         │
        └────────────────┘
```

### Key Tables

#### Users
- Authentication and user management
- One-to-many with uploaded files

#### UploadedFiles
- Tracks all uploaded files
- Links to invoices and payments

#### Invoices
- Parsed invoice data
- Links to matches

#### Payments
- Parsed payment data
- Links to matches

#### PaymentMatches
- Junction table with metadata
- Stores matching confidence and type
- Tracks approval status

## 🔐 Security Architecture

### Authentication & Authorization

```
┌────────────────────────────────────────┐
│         Security Layers                │
├────────────────────────────────────────┤
│ 1. HTTPS/TLS (Transport Security)     │
│ 2. JWT Authentication (API Security)   │
│ 3. Password Hashing (bcrypt)          │
│ 4. CORS Protection                     │
│ 5. Input Validation (Pydantic)        │
│ 6. SQL Injection Prevention (ORM)     │
│ 7. XSS Protection (React)             │
└────────────────────────────────────────┘
```

### JWT Token Flow

```
┌────────────┐                    ┌────────────┐
│  Frontend  │                    │  Backend   │
└─────┬──────┘                    └─────┬──────┘
      │                                 │
      │ 1. Login (email/password)       │
      │────────────────────────────────>│
      │                                 │
      │                                 │ 2. Verify
      │                                 │    credentials
      │                                 │
      │ 3. JWT Token                    │
      │<────────────────────────────────│
      │                                 │
      │ 4. Store in localStorage        │
      │                                 │
      │ 5. API Request + Token          │
      │────────────────────────────────>│
      │                                 │
      │                                 │ 6. Validate
      │                                 │    token
      │                                 │
      │ 7. Response                     │
      │<────────────────────────────────│
      │                                 │
```

## 🤖 AI Matching Algorithm

### Matching Strategy

The payment matching system uses a multi-stage algorithm:

#### Stage 1: Exact Match (99% confidence)
```python
if payment.amount == invoice.amount:
    if payment.payer_name == invoice.client_name:
        return Match(type="exact", confidence=99)
```

#### Stage 2: Fuzzy Name Match (90-95% confidence)
```python
if payment.amount == invoice.amount:
    similarity = calculate_name_similarity(payer, client)
    if similarity >= 0.7:
        confidence = 90 + (similarity - 0.7) * 16.67
        return Match(type="fuzzy", confidence=confidence)
```

#### Stage 3: Contextual Match (85-90% confidence)
```python
if amount_similarity >= 0.9:  # Within 10%
    name_similarity = calculate_name_similarity(payer, client)
    if name_similarity >= 0.6:
        confidence = 85 + combined_score
        return Match(type="contextual", confidence=confidence)
```

#### Stage 4: Reference Match (90-98% confidence)
```python
if invoice_number in payment.description:
    confidence = 90 + reference_strength
    return Match(type="reference", confidence=confidence)
```

### Auto-Posting Rules

```
Confidence >= 95% → Auto-post
Confidence < 95%  → Manual review required
Confidence < 50%  → No match created
```

## 🚀 Performance Considerations

### Frontend Optimization

1. **Code Splitting**
   - Lazy load routes (future)
   - Dynamic imports for large components

2. **Asset Optimization**
   - Image compression
   - Tree shaking
   - Minification

3. **Caching**
   - React Query caching
   - Browser caching headers

### Backend Optimization

1. **Database**
   - Indexed columns (email, invoice_number, payment_reference)
   - Connection pooling
   - Query optimization

2. **API**
   - Pagination for list endpoints
   - Async/await for I/O operations
   - Response compression

3. **File Processing**
   - Background task queue (future: Celery)
   - Chunked reading for large files
   - Streaming responses

## 📈 Scalability

### Horizontal Scaling

```
Load Balancer
     ↓
┌────┴────┐
│ App 1   │
├─────────┤
│ App 2   │  → Shared Database
├─────────┤
│ App 3   │
└─────────┘
```

### Vertical Scaling

- Increase database resources
- Optimize queries
- Add caching layer (Redis)

### Future Enhancements

1. **Caching Layer**
   - Redis for session storage
   - Cache frequently accessed data
   - Rate limiting

2. **Message Queue**
   - Celery for background tasks
   - File processing queue
   - Email notifications

3. **CDN**
   - CloudFront for static assets
   - Global edge caching
   - Reduced latency

4. **Microservices**
   - Separate file processing service
   - Dedicated matching service
   - Analytics service

## 🔍 Monitoring & Observability

### Logging

```python
# Structured logging
logger.info("User logged in", extra={
    "user_id": user.id,
    "email": user.email,
    "timestamp": datetime.now()
})
```

### Metrics

- Request duration
- Error rate
- Match success rate
- File processing time

### Tracing

- Request tracing (future: OpenTelemetry)
- Database query tracing
- External API calls

## 🧪 Testing Strategy

### Frontend Tests

- Unit tests (Jest + React Testing Library)
- Integration tests
- E2E tests (Cypress)

### Backend Tests

- Unit tests (pytest)
- Integration tests (TestClient)
- API tests (automated OpenAPI validation)

### Test Coverage

Target: 80%+ code coverage

---

**This architecture is designed to be scalable, maintainable, and production-ready.**
