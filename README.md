# Soutrali - African Fundraising Platform

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Django](https://img.shields.io/badge/Django-5.0-green.svg)
![Python](https://img.shields.io/badge/Python-3.11-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

**Soutrali** (meaning "help" in Wolof) is a modern fundraising platform designed specifically for African communities, enabling seamless donation collection through mobile money (Wave, Orange Money, MTN Mobile Money) and traditional payment methods.

## 🌟 Features

### Core Functionality
- **Campaign Management**: Create, manage, and track fundraising campaigns
- **Mobile Money Integration**: Support for Wave, Orange Money, and MTN Mobile Money
- **Real-time Tracking**: Live updates on donation progress and campaign statistics
- **Multi-currency Support**: XOF, EUR, USD, and more
- **Role-based Access Control**: Admin, Organizer, and Donor roles with granular permissions
- **KYC Compliance**: Built-in identity verification for organizers
- **Receipt Generation**: Automatic receipt generation and email delivery
- **Admin Dashboard**: Comprehensive reconciliation and reporting tools

### Technical Features
- **RESTful API**: Built with Django REST Framework
- **Webhook Support**: Secure webhook handlers with signature verification
- **Idempotency**: Prevent duplicate transactions
- **Background Jobs**: Celery for async task processing
- **Caching**: Redis for high-performance caching
- **Monitoring**: Sentry integration for error tracking
- **API Documentation**: Auto-generated with drf-spectacular
- **Docker Support**: Containerized deployment
- **CI/CD Ready**: GitHub Actions integration

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   Frontend (React + Vite)                    │
│        TypeScript, TailwindCSS, React Router, Zustand       │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                    Django REST API                           │
│  ┌──────────────┬───────────────┬──────────────────────┐   │
│  │   Users      │   Campaigns   │      Payments        │   │
│  │   - Auth     │   - CRUD      │   - Initiation       │   │
│  │   - KYC      │   - Status    │   - Verification     │   │
│  │   - Roles    │   - Updates   │   - Refunds          │   │
│  └──────────────┴───────────────┴──────────────────────┘   │
└─────────────────────┬───────────────────────────────────────┘
                      │
          ┌───────────┴────────────┬──────────────┐
          ▼                        ▼              ▼
┌──────────────────┐    ┌──────────────┐  ┌─────────────┐
│   PostgreSQL     │    │    Redis     │  │   Celery    │
│   - Primary DB   │    │   - Cache    │  │  - Workers  │
│   - Transactions │    │   - Queues   │  │  - Beat     │
└──────────────────┘    └──────────────┘  └─────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────┐
│              Mobile Money Providers                          │
│   ┌──────────┬────────────────┬──────────────────────┐     │
│   │   Wave   │  Orange Money  │   MTN Mobile Money   │     │
│   └──────────┴────────────────┴──────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

## 📋 Prerequisites

- Python 3.11+
- PostgreSQL 14+
- Redis 7+
- Docker & Docker Compose (optional but recommended)
- Node.js 18+ (for frontend development)

## 🚀 Quick Start

### Using Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/fanymodeste25/SOUTRALI.git
   cd SOUTRALI
   ```

2. **Create environment file**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start services**
   ```bash
   docker-compose up -d
   ```

4. **Create superuser**
   ```bash
   docker-compose exec backend python manage.py createsuperuser
   ```

5. **Access the application**
   - API: http://localhost:8000
   - Admin: http://localhost:8000/admin
   - API Docs: http://localhost:8000/api/docs
   - Flower (Celery monitoring): http://localhost:5555

### Manual Setup

1. **Clone and setup virtual environment**
   ```bash
   git clone https://github.com/fanymodeste25/SOUTRALI.git
   cd SOUTRALI
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. **Setup PostgreSQL database**
   ```bash
   # Se connecter à PostgreSQL avec l'utilisateur postgres
   psql -U postgres

   # Dans psql, créer l'utilisateur et la base de données
   CREATE USER soutrali_user WITH PASSWORD 'soutrali_pass';
   CREATE DATABASE soutrali_db OWNER soutrali_user;
   GRANT ALL PRIVILEGES ON DATABASE soutrali_db TO soutrali_user;
   \q
   ```

   > 📖 **Note**: Pour des instructions détaillées, consultez [docs/DATABASE_SETUP.md](docs/DATABASE_SETUP.md)

4. **Configure environment**
   ```bash
   cp ../.env.example ../.env
   # Edit .env with your database credentials and other settings
   ```

5. **Run migrations**
   ```bash
   python manage.py migrate
   ```

6. **Create superuser**
   ```bash
   python manage.py createsuperuser
   ```

7. **Collect static files**
   ```bash
   python manage.py collectstatic
   ```

8. **Start development server**
   ```bash
   python manage.py runserver
   ```

9. **Start Celery worker (in another terminal)**
   ```bash
   celery -A soutrali worker -l info
   ```

10. **Start Celery beat (in another terminal)**
    ```bash
    celery -A soutrali beat -l info
    ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env if needed (default points to http://localhost:8000/api)
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000/api
   - API Documentation: http://localhost:8000/api/docs

### Frontend Technology Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Routing**: React Router v6
- **State Management**: Zustand
- **Data Fetching**: TanStack React Query
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast
- **Icons**: React Icons

### Frontend Features

- **Home Page**: Featured campaigns and call-to-action
- **Campaign Browsing**: Filter, search, and browse all campaigns
- **Campaign Details**: View full campaign information
- **Donation Flow**: Multi-step donation process with payment provider selection
- **Authentication**: Login and registration with JWT tokens
- **Organizer Dashboard**: Create and manage campaigns
- **Protected Routes**: Role-based access control
- **Responsive Design**: Mobile-first, works on all devices

## 🔧 Configuration

### Environment Variables

Key environment variables to configure in `.env`:

```bash
# Django
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DATABASE_URL=postgresql://soutrali_user:soutrali_pass@localhost:5432/soutrali_db

# Redis
REDIS_URL=redis://localhost:6379/0

# Mobile Money - Wave
WAVE_API_KEY=your-wave-api-key
WAVE_API_SECRET=your-wave-api-secret
WAVE_MERCHANT_ID=your-merchant-id
WAVE_WEBHOOK_SECRET=your-webhook-secret
WAVE_SANDBOX_MODE=True

# Mobile Money - Orange Money
ORANGE_API_KEY=your-orange-api-key
ORANGE_API_SECRET=your-orange-api-secret
ORANGE_MERCHANT_ID=your-merchant-id
ORANGE_WEBHOOK_SECRET=your-webhook-secret
ORANGE_SANDBOX_MODE=True

# Mobile Money - MTN Mobile Money
MTN_API_KEY=your-mtn-api-key
MTN_COLLECTION_SUBSCRIPTION_KEY=your-subscription-key
MTN_WEBHOOK_SECRET=your-webhook-secret
MTN_SANDBOX_MODE=True

# Platform Settings
PLATFORM_COMMISSION_RATE=0.07  # 7% commission
DEFAULT_CURRENCY=XOF

# Sentry (Error Monitoring)
SENTRY_DSN=your-sentry-dsn
SENTRY_ENVIRONMENT=development
```

### Mobile Money Provider Setup

#### Wave
1. Sign up at [Wave Developer Portal](https://developers.wave.com)
2. Create a merchant account
3. Get sandbox API credentials
4. Configure webhook URL: `https://yourdomain.com/api/webhooks/wave/`

#### Orange Money
1. Register at [Orange Developer Portal](https://developer.orange.com)
2. Subscribe to Orange Money Web Payment API
3. Get sandbox credentials
4. Configure webhook URL: `https://yourdomain.com/api/webhooks/orange/`

#### MTN Mobile Money
1. Register at [MTN MoMo Developer Portal](https://momodeveloper.mtn.com)
2. Create sandbox user
3. Get API credentials and subscription key
4. Configure webhook URL: `https://yourdomain.com/api/webhooks/mtn/`

## 📚 API Documentation

### Accessing Documentation

- **Swagger UI**: http://localhost:8000/api/docs/
- **ReDoc**: http://localhost:8000/api/redoc/
- **OpenAPI Schema**: http://localhost:8000/api/schema/

### Key API Endpoints

#### Authentication
```
POST   /api/users/register/          - Register new user
POST   /api/users/login/             - Login
POST   /api/users/token/refresh/     - Refresh JWT token
GET    /api/users/profile/           - Get user profile
```

#### Campaigns
```
GET    /api/campaigns/               - List campaigns
POST   /api/campaigns/               - Create campaign (organizer)
GET    /api/campaigns/{id}/          - Get campaign details
PUT    /api/campaigns/{id}/          - Update campaign
DELETE /api/campaigns/{id}/          - Delete campaign
```

#### Payments
```
POST   /api/payments/initiate/       - Initiate payment
GET    /api/payments/verify/{id}/    - Verify payment status
POST   /api/payments/webhook/{provider}/ - Webhook handler
```

### Payment Flow

```python
# 1. Initiate Payment
POST /api/payments/initiate/
{
    "campaign_id": "uuid",
    "amount": "10000",
    "currency": "XOF",
    "provider": "WAVE",
    "donor_email": "donor@example.com",
    "donor_phone": "+221771234567",
    "idempotency_key": "unique-key-123"
}

# Response
{
    "transaction_id": "tx_123456",
    "status": "PENDING",
    "redirect_url": "https://payment.wave.com/...",
    "payment_instructions": "Complete payment via Wave app"
}

# 2. Provider sends webhook
POST /api/webhooks/wave/
# (Automatic, from Wave)

# 3. Verify Payment (optional)
GET /api/payments/verify/tx_123456/
{
    "transaction_id": "tx_123456",
    "status": "SUCCESS",
    "amount": "10000",
    "currency": "XOF",
    "paid_at": "2025-01-15T10:30:00Z"
}
```

## 🧪 Testing

### Run Tests
```bash
# All tests
pytest

# With coverage
pytest --cov=apps --cov-report=html

# Specific app
pytest apps/payments/tests/

# Run integration tests
pytest -m integration
```

### Test Mobile Money Providers
```bash
# Run provider tests with mock responses
pytest apps/payments/tests/test_providers.py -v
```

## 🔐 Security

### Best Practices Implemented

- ✅ HTTPS enforced in production
- ✅ JWT authentication with refresh tokens
- ✅ CSRF protection
- ✅ Rate limiting
- ✅ SQL injection prevention (Django ORM)
- ✅ XSS protection
- ✅ Webhook signature verification
- ✅ Idempotency for payments
- ✅ Secure password hashing (Argon2)
- ✅ Environment variable management
- ✅ CORS configuration
- ✅ Audit logging for sensitive operations

### Security Checklist for Production

- [ ] Change `SECRET_KEY` to a strong random value
- [ ] Set `DEBUG=False`
- [ ] Configure `ALLOWED_HOSTS` properly
- [ ] Enable SSL/TLS certificates
- [ ] Set up Sentry for error monitoring
- [ ] Configure firewall rules
- [ ] Enable database backups
- [ ] Set up log rotation
- [ ] Review CORS settings
- [ ] Implement rate limiting
- [ ] Enable 2FA for admin accounts

## 📊 Monitoring & Logging

### Sentry Integration

```bash
# Configure in .env
SENTRY_DSN=your-sentry-dsn
SENTRY_ENVIRONMENT=production
```

### Celery Monitoring with Flower

Access Flower dashboard at http://localhost:5555

```bash
# Start Flower
celery -A soutrali flower --port=5555
```

### Logs

Logs are stored in:
- Development: `backend/logs/soutrali.log`
- Docker: Container logs via `docker-compose logs`

```bash
# View logs
docker-compose logs -f backend
docker-compose logs -f celery_worker
```

## 🚢 Deployment

### Production Deployment Checklist

1. **Environment Setup**
   - Set all production environment variables
   - Configure production database
   - Set up Redis instance
   - Configure S3 or equivalent for media storage

2. **Security**
   - Enable HTTPS
   - Set `DEBUG=False`
   - Configure `ALLOWED_HOSTS`
   - Set secure cookies
   - Enable HSTS

3. **Database**
   - Run migrations
   - Create superuser
   - Set up database backups

4. **Static Files**
   - Collect static files
   - Configure CDN (optional)

5. **Monitoring**
   - Configure Sentry
   - Set up log aggregation
   - Enable health checks

### Deploy to Production

```bash
# Using Docker
docker-compose -f docker-compose.prod.yml up -d

# Or using traditional deployment
gunicorn soutrali.wsgi:application --bind 0.0.0.0:8000 --workers 4
```

## 🛠️ Development

### Project Structure

```
SOUTRALI/
├── backend/
│   ├── apps/
│   │   ├── users/          # User management, auth, KYC
│   │   ├── campaigns/      # Campaign CRUD and management
│   │   ├── payments/       # Payment processing
│   │   │   └── providers/  # Mobile money integrations
│   │   ├── webhooks/       # Webhook handlers
│   │   └── core/           # Shared utilities
│   ├── soutrali/          # Django project settings
│   ├── manage.py
│   └── requirements.txt
├── frontend/              # React + TypeScript frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API service layer
│   │   ├── stores/        # Zustand state management
│   │   ├── types/         # TypeScript type definitions
│   │   └── utils/         # Utility functions
│   ├── public/            # Static assets
│   └── package.json
├── docker-compose.yml
├── .env.example
└── README.md
```

### Code Style

We follow PEP 8 and use:
- **Black** for code formatting
- **Flake8** for linting
- **isort** for import sorting
- **mypy** for type checking

```bash
# Format code
black .

# Lint
flake8 .

# Sort imports
isort .

# Type check
mypy apps/
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Coding Guidelines

- Write tests for new features
- Follow Django best practices
- Document your code
- Update README if needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Lead Developer**: Fany Modeste
- **Project**: Soutrali Fundraising Platform

## 📞 Support

For support, email support@soutrali.com or open an issue on GitHub.

## 🗺️ Roadmap

### Phase 1 (MVP) - ✅ Completed
- [x] Backend API with Django + DRF
- [x] User authentication and roles
- [x] Campaign management
- [x] Mobile money integration (Wave, Orange Money, MTN)
- [x] Webhook handlers
- [x] Payment reconciliation
- [x] Admin dashboard

### Phase 2 - ✅ Completed
- [x] React frontend with TypeScript
- [x] Campaign pages (public)
- [x] Donation flow UI
- [x] Organizer dashboard
- [x] Authentication pages (login/register)
- [x] Responsive design with TailwindCSS
- [ ] Admin reconciliation UI
- [ ] Email templates
- [ ] SMS notifications

### Phase 3 (Planned)
- [ ] Mobile app (React Native)
- [ ] Recurring donations
- [ ] Social sharing integration
- [ ] Advanced analytics
- [ ] Multi-language support (EN/FR + local languages)
- [ ] Peer-to-peer campaigns
- [ ] Campaign categories and search
- [ ] Donor badges and gamification

## 📖 Additional Resources

- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [Celery Documentation](https://docs.celeryproject.org/)
- [Wave API Docs](https://developers.wave.com/)
- [Orange Money API](https://developer.orange.com/)
- [MTN MoMo API](https://momodeveloper.mtn.com/)

---

**Built with ❤️ for African communities**
