# 💰 Personal Finance Tracker

A full-stack web application for managing personal finances with features like transaction tracking, budget management, expense analytics, and financial reports.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Quick Start (Local Development)](#quick-start-local-development)
- [Docker Setup](#docker-setup)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Deployment](#deployment)
- [Future Enhancements](#future-enhancements)

## ✨ Features

### Core Features
- **User Authentication**: Registration, login, logout, and password reset with JWT tokens
- **Transaction Management**: Add, edit, delete, and view income/expense transactions
- **Budget Management**: Create monthly budgets by category with spending alerts
- **Financial Dashboard**: Real-time overview of income, expenses, and savings
- **Analytics & Charts**: 
  - Monthly spending trends
  - Category-wise expense breakdown
  - Budget utilization tracking
- **Reports & Export**:
  - Monthly financial reports
  - Export to PDF, CSV, and Excel formats
  - Category-wise spending analysis

### Technical Features
- RESTful API with JWT authentication
- PostgreSQL database with optimized queries
- Responsive React frontend with Material-UI
- Real-time chart visualizations with Recharts
- Docker containerization for easy deployment
- Comprehensive error handling and validation

## 🛠️ Tech Stack

### Backend
- **Framework**: Django 5.0 + Django REST Framework
- **Database**: PostgreSQL
- **Authentication**: JWT (djangorestframework-simplejwt)
- **Report Generation**: ReportLab, OpenPyXL, Pandas
- **Deployment**: Gunicorn, Nginx

### Frontend
- **Framework**: React 18 with TypeScript
- **UI Library**: Material-UI (MUI)
- **Charts**: Recharts
- **HTTP Client**: Axios
- **Build Tool**: Vite
- **Styling**: Emotion

### DevOps
- **Containerization**: Docker & Docker Compose
- **Reverse Proxy**: Nginx
- **Database**: PostgreSQL with Docker

## 📁 Project Structure

```
personal-finance-tracker/
├── backend/
│   ├── accounts/                 # User authentication
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   ├── transactions/            # Transaction CRUD
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   ├── budgets/                 # Budget management
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   ├── reports/                 # Report generation
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   ├── finance_tracker_backend/ # Django project settings
│   ├── manage.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/          # Reusable components
│   │   │   ├── AddTransactionDialog.tsx
│   │   │   ├── BudgetList.tsx
│   │   │   ├── TransactionList.tsx
│   │   │   └── Navbar.tsx
│   │   ├── pages/              # Page components
│   │   │   ├── Dashboard.tsx
│   │   │   ├── TransactionsPage.tsx
│   │   │   ├── BudgetsPage.tsx
│   │   │   └── ReportsPage.tsx
│   │   ├── services/           # API services
│   │   │   ├── api.ts
│   │   │   ├── authService.ts
│   │   │   ├── transactionService.ts
│   │   │   ├── budgetService.ts
│   │   │   └── reportService.ts
│   │   ├── charts/             # Chart components
│   │   │   ├── MonthlyTrendChart.tsx
│   │   │   └── CategoryBreakdownChart.tsx
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── docker-compose.yml           # Docker orchestration
├── Dockerfile.backend
├── Dockerfile.frontend
├── nginx.conf                   # Nginx configuration
├── .env.example                 # Environment variables template
└── README.md
```

## 📋 Prerequisites

- Python 3.11+
- Node.js 20+
- PostgreSQL 13+ (or use Docker)
- pip & npm

## 🚀 Quick Start (Local Development)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd finance-tracker
```

### 2. Setup Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment variables
cp ../.env.example .env

# Setup database (assuming PostgreSQL is running)
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser

# Start development server
python manage.py runserver 0.0.0.0:8000
```

### 3. Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### 4. Access the Application
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8000/api`
- Django Admin: `http://localhost:8000/admin`

## 🐳 Docker Setup

### Prerequisites
- Docker 20+
- Docker Compose 2+

### 1. Prepare Environment
```bash
cp .env.example .env
# Update .env with your settings
```

### 2. Start Services
```bash
docker-compose up -d
```

### 3. Run Migrations
```bash
docker-compose exec backend python manage.py migrate
docker-compose exec backend python manage.py createsuperuser
```

### 4. Access the Application
- Frontend: `http://localhost:3000` (or `http://localhost` via Nginx)
- Backend API: `http://localhost:8000/api`
- Database: `localhost:5432`

### Useful Docker Commands
```bash
# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Execute migrations
docker-compose exec backend python manage.py migrate

# Create superuser
docker-compose exec backend python manage.py createsuperuser

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

## 📚 API Documentation

### Authentication APIs

#### Register
```http
POST /api/auth/register/
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "secure_password"
}
```

#### Login
```http
POST /api/auth/login/
Content-Type: application/json

{
  "username": "john_doe",
  "password": "secure_password"
}

Response:
{
  "access": "jwt_access_token",
  "refresh": "jwt_refresh_token"
}
```

#### Get User Info
```http
GET /api/auth/me/
Authorization: Bearer <access_token>
```

### Transaction APIs

#### List Transactions
```http
GET /api/transactions/?type=expense&category=food&date=2024-01-15
Authorization: Bearer <access_token>
```

#### Create Transaction
```http
POST /api/transactions/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "type": "expense",
  "category": "food",
  "amount": 500.00,
  "description": "Lunch at restaurant",
  "date": "2024-01-15"
}
```

#### Get Transaction Summary
```http
GET /api/transactions/summary/
Authorization: Bearer <access_token>
```

#### Get Monthly Trend
```http
GET /api/transactions/trends/monthly/
Authorization: Bearer <access_token>
```

### Budget APIs

#### List Budgets
```http
GET /api/budgets/?month=1&year=2024
Authorization: Bearer <access_token>
```

#### Create Budget
```http
POST /api/budgets/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "category": "food",
  "monthly_limit": 10000,
  "month": 1,
  "year": 2024
}
```

#### Get Budget Alerts
```http
GET /api/budgets/alerts/
Authorization: Bearer <access_token>
```

### Reports APIs

#### Get Monthly Report
```http
GET /api/reports/monthly/?month=1&year=2024
Authorization: Bearer <access_token>
```

#### Export PDF
```http
GET /api/reports/export/pdf/?month=1&year=2024
Authorization: Bearer <access_token>
```

#### Export CSV
```http
GET /api/reports/export/csv/?month=1&year=2024
Authorization: Bearer <access_token>
```

#### Export Excel
```http
GET /api/reports/export/excel/?month=1&year=2024
Authorization: Bearer <access_token>
```

## 🗄️ Database Schema

### User Model
```sql
{
  id: Integer (Primary Key),
  username: String (Unique),
  email: String (Unique),
  password: String (Hashed),
  first_name: String (Optional),
  last_name: String (Optional),
  date_joined: DateTime,
  is_active: Boolean
}
```

### Transaction Model
```sql
{
  id: Integer (Primary Key),
  user_id: Integer (Foreign Key),
  type: Choice('income', 'expense'),
  category: String,
  amount: Decimal(10, 2),
  description: Text,
  date: Date,
  created_at: DateTime,
  updated_at: DateTime
}
```

### Budget Model
```sql
{
  id: Integer (Primary Key),
  user_id: Integer (Foreign Key),
  category: String,
  monthly_limit: Decimal(10, 2),
  month: Integer (1-12),
  year: Integer,
  created_at: DateTime,
  updated_at: DateTime
}
```

## 🚀 Deployment

### Deploy to Render

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up for a free account

2. **Deploy Backend**
   ```bash
   # Create a new Web Service
   - Select Repository
   - Set Build Command: pip install -r requirements.txt && python manage.py migrate
   - Set Start Command: gunicorn finance_tracker_backend.wsgi:application
   - Add Environment Variables (copy from .env)
   ```

3. **Deploy Frontend**
   ```bash
   # Create a new Static Site
   - Select Repository
   - Set Build Command: npm install && npm run build
   - Set Publish Directory: dist
   ```

### Deploy to AWS

1. **Use RDS for PostgreSQL**
2. **Use EC2 for Application Server** or **Elastic Beanstalk**
3. **Use CloudFront for CDN**
4. **Use S3 for Static Files**

### Deploy to Azure

1. **Azure Database for PostgreSQL**
2. **Azure App Service** for Backend
3. **Azure Static Web Apps** for Frontend
4. **Azure CDN** for Caching

## 🔐 Security Considerations

- Change `DJANGO_SECRET_KEY` in production
- Set `DEBUG = False` in production
- Use environment variables for sensitive data
- Enable HTTPS/SSL
- Configure CORS properly
- Use strong database passwords
- Implement rate limiting
- Regular security audits

## 🔄 Future Enhancements

### Intermediate Level
- [ ] Email notifications for budget alerts
- [ ] Recurring transaction scheduling
- [ ] AI-powered expense categorization
- [ ] Multi-currency support
- [ ] Social sharing of spending insights

### Advanced Level
- [ ] Bank statement import and parsing
- [ ] OCR bill scanner
- [ ] Machine learning financial forecasting
- [ ] Personal finance chatbot (with AI)
- [ ] Blockchain-based transaction verification
- [ ] Mobile app (React Native)
- [ ] Advanced tax planning tools
- [ ] Investment tracking and recommendations

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For issues, feature requests, or questions, please create an issue on GitHub or contact the development team.

---

**Built with ❤️ by the Finance Tracker Team**
#   f i n a n c e - t r a c k e r 
 
 