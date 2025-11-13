# Deployment Guide

Complete guide for deploying the Law Firm Cash Posting application to production.

## 📋 Pre-Deployment Checklist

### Backend
- [ ] Change `SECRET_KEY` to a secure random value
- [ ] Configure production database URL
- [ ] Set up SSL/HTTPS certificates
- [ ] Configure production CORS origins
- [ ] Set up file storage (S3/similar)
- [ ] Configure logging and monitoring
- [ ] Set up database backups
- [ ] Review and update rate limiting
- [ ] Configure email service (if needed)

### Frontend
- [ ] Update API URL to production backend
- [ ] Build optimized production bundle
- [ ] Configure CDN for static assets
- [ ] Set up custom domain
- [ ] Configure analytics (optional)
- [ ] Review and optimize bundle size

## 🚀 Quick Deployment Options

### Option 1: Traditional VPS (DigitalOcean, AWS EC2, etc.)

#### Backend Deployment

1. **Set up server:**
```bash
# SSH into your server
ssh user@your-server-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Python, PostgreSQL
sudo apt install python3.10 python3-pip python3-venv postgresql postgresql-contrib nginx -y
```

2. **Set up PostgreSQL:**
```bash
sudo -u postgres psql
CREATE DATABASE lawfirm_db;
CREATE USER lawfirm_user WITH PASSWORD 'your-secure-password';
GRANT ALL PRIVILEGES ON DATABASE lawfirm_db TO lawfirm_user;
\q
```

3. **Deploy backend:**
```bash
# Clone repository
git clone <your-repo-url>
cd law-firm-backend/backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
nano .env
# Update DATABASE_URL, SECRET_KEY, etc.

# Test the application
python run.py
```

4. **Set up systemd service:**
```bash
sudo nano /etc/systemd/system/lawfirm-api.service
```

Add:
```ini
[Unit]
Description=Law Firm API
After=network.target

[Service]
User=www-data
WorkingDirectory=/path/to/backend
Environment="PATH=/path/to/backend/venv/bin"
ExecStart=/path/to/backend/venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable lawfirm-api
sudo systemctl start lawfirm-api
sudo systemctl status lawfirm-api
```

5. **Configure Nginx:**
```bash
sudo nano /etc/nginx/sites-available/lawfirm-api
```

Add:
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/lawfirm-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

6. **Set up SSL with Let's Encrypt:**
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d api.yourdomain.com
```

#### Frontend Deployment

1. **Build frontend locally:**
```bash
cd /path/to/frontend
npm install
npm run build
```

2. **Upload build to server:**
```bash
scp -r dist/* user@your-server-ip:/var/www/lawfirm-frontend/
```

3. **Configure Nginx for frontend:**
```bash
sudo nano /etc/nginx/sites-available/lawfirm-frontend
```

Add:
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/lawfirm-frontend;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Enable and restart:
```bash
sudo ln -s /etc/nginx/sites-available/lawfirm-frontend /etc/nginx/sites-enabled/
sudo systemctl restart nginx
sudo certbot --nginx -d yourdomain.com
```

### Option 2: Docker Deployment

1. **Create Dockerfile for backend:**
```dockerfile
# backend/Dockerfile
FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

2. **Create Dockerfile for frontend:**
```dockerfile
# Dockerfile
FROM node:18 as builder

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

3. **Create docker-compose.yml:**
```yaml
version: '3.8'

services:
  db:
    image: postgres:14
    environment:
      POSTGRES_DB: lawfirm_db
      POSTGRES_USER: lawfirm_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      DATABASE_URL: postgresql://lawfirm_user:${DB_PASSWORD}@db:5432/lawfirm_db
      SECRET_KEY: ${SECRET_KEY}
      FRONTEND_URL: ${FRONTEND_URL}
    depends_on:
      - db
    restart: unless-stopped
    volumes:
      - ./backend/uploads:/app/uploads

  frontend:
    build: .
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped

volumes:
  postgres_data:
```

4. **Deploy with Docker:**
```bash
# Create .env file with secrets
echo "DB_PASSWORD=your-secure-password" > .env
echo "SECRET_KEY=your-secret-key" >> .env
echo "FRONTEND_URL=https://yourdomain.com" >> .env

# Build and run
docker-compose up -d

# View logs
docker-compose logs -f
```

### Option 3: Platform-as-a-Service (Heroku, Render, Railway)

#### Backend on Render

1. Create `render.yaml`:
```yaml
services:
  - type: web
    name: lawfirm-api
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn app.main:app --host 0.0.0.0 --port $PORT
    envVars:
      - key: DATABASE_URL
        fromDatabase:
          name: lawfirm-db
          property: connectionString
      - key: SECRET_KEY
        generateValue: true
      - key: PYTHON_VERSION
        value: 3.10.0

databases:
  - name: lawfirm-db
    plan: starter
```

2. Push to GitHub and connect to Render

#### Frontend on Vercel

1. **Install Vercel CLI:**
```bash
npm i -g vercel
```

2. **Deploy:**
```bash
vercel --prod
```

3. **Set environment variables in Vercel dashboard:**
- `VITE_API_URL` = your backend URL

### Option 4: Kubernetes (Advanced)

See `kubernetes/` directory for manifests (not included in this guide).

## 🔒 Security Best Practices

### Backend Security

1. **Environment Variables:**
```bash
# Generate secure SECRET_KEY
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

2. **Database Security:**
- Use strong passwords
- Restrict database access to backend only
- Enable SSL for database connections
- Regular backups

3. **API Security:**
- Rate limiting (implement with slowapi)
- CORS restrictions
- Input validation
- SQL injection prevention (using SQLAlchemy ORM)

### Frontend Security

1. **Content Security Policy:**
```nginx
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';";
```

2. **Security Headers:**
```nginx
add_header X-Frame-Options "SAMEORIGIN";
add_header X-Content-Type-Options "nosniff";
add_header X-XSS-Protection "1; mode=block";
```

## 📊 Monitoring & Logging

### Application Monitoring

1. **Sentry for Error Tracking:**
```bash
pip install sentry-sdk
```

```python
# backend/app/main.py
import sentry_sdk
sentry_sdk.init(dsn="your-sentry-dsn")
```

2. **Application Logs:**
```python
# Configure structured logging
import logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
```

### Infrastructure Monitoring

- **Uptime Monitoring**: UptimeRobot, Pingdom
- **Performance**: New Relic, DataDog
- **Logs**: CloudWatch, Papertrail

## 🔄 Continuous Deployment

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to production
        run: |
          # Your deployment script
          
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run build
      - name: Deploy to hosting
        run: |
          # Your deployment script
```

## 🗄️ Database Migrations

### Alembic Setup

1. **Initialize Alembic:**
```bash
cd backend
alembic init alembic
```

2. **Configure alembic.ini:**
```ini
sqlalchemy.url = postgresql://user:pass@localhost/dbname
```

3. **Create migration:**
```bash
alembic revision --autogenerate -m "Initial migration"
```

4. **Apply migration:**
```bash
alembic upgrade head
```

5. **In production:**
```bash
# Run migrations before starting app
alembic upgrade head && uvicorn app.main:app
```

## 📦 Backup Strategy

### Database Backups

1. **Automated daily backups:**
```bash
#!/bin/bash
# backup.sh
BACKUP_DIR="/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
pg_dump lawfirm_db > "$BACKUP_DIR/backup_$TIMESTAMP.sql"

# Keep only last 30 days
find $BACKUP_DIR -name "backup_*.sql" -mtime +30 -delete
```

2. **Add to crontab:**
```bash
0 2 * * * /path/to/backup.sh
```

### File Storage Backups

- Use S3 versioning
- Enable automated backups
- Test restore procedures regularly

## 🧪 Pre-Production Testing

1. **Smoke Tests:**
```bash
# Test API health
curl https://api.yourdomain.com/health

# Test authentication
curl -X POST https://api.yourdomain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test@example.com","password":"test"}'
```

2. **Load Testing:**
```bash
# Install locust
pip install locust

# Run load test
locust -f loadtest.py --host=https://api.yourdomain.com
```

## 🚨 Rollback Procedures

### Quick Rollback

1. **Database rollback:**
```bash
alembic downgrade -1
```

2. **Application rollback:**
```bash
# With Docker
docker-compose down
docker-compose up -d --build previous-version

# With systemd
systemctl stop lawfirm-api
# Restore previous code
systemctl start lawfirm-api
```

## 📞 Support & Maintenance

### Health Checks

- `/health` endpoint for basic health
- Database connectivity check
- File system access check
- External API availability

### Monitoring Alerts

Set up alerts for:
- API response time > 2s
- Error rate > 1%
- Database connection failures
- Disk space < 10%
- Memory usage > 80%

---

**Remember**: Always test deployment procedures in a staging environment first!
