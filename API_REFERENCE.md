# Finance Tracker - API Reference

## Base URL
```
http://localhost:8000/api
```

## Authentication
All endpoints (except login/register) require JWT authentication:
```
Authorization: Bearer <access_token>
```

## Endpoints

### Authentication

#### POST /auth/register/
Register a new user
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "secure_password"
}
```

#### POST /auth/login/
Login and get tokens
```json
{
  "username": "john_doe",
  "password": "secure_password"
}
```
Returns:
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

#### POST /auth/logout/
Logout and blacklist token
```json
{
  "refresh": "refresh_token_here"
}
```

#### POST /auth/token/refresh/
Refresh access token
```json
{
  "refresh": "refresh_token_here"
}
```

#### GET /auth/me/
Get current user info
Response:
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com"
}
```

#### POST /auth/password-reset/
Request password reset
```json
{
  "email": "john@example.com"
}
```

#### POST /auth/password-reset/confirm/
Confirm password reset
```json
{
  "uid": "base64_encoded_user_id",
  "token": "reset_token",
  "new_password": "new_secure_password"
}
```

### Transactions

#### GET /transactions/
List all transactions with filters
Query Parameters:
- `type`: 'income' or 'expense'
- `category`: expense category
- `date`: specific date
- `search`: search in description
- `ordering`: field to order by (e.g., '-date')

Response:
```json
[
  {
    "id": 1,
    "type": "expense",
    "type_display": "Expense",
    "category": "food",
    "category_display": "Food & Dining",
    "amount": "500.00",
    "description": "Lunch",
    "date": "2024-01-15",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
]
```

#### POST /transactions/
Create a new transaction
```json
{
  "type": "expense",
  "category": "food",
  "amount": 500,
  "description": "Lunch at restaurant",
  "date": "2024-01-15"
}
```

#### GET /transactions/{id}/
Get transaction details

#### PUT /transactions/{id}/
Update transaction
```json
{
  "amount": 600,
  "description": "Updated description"
}
```

#### DELETE /transactions/{id}/
Delete transaction

#### GET /transactions/summary/
Get transaction summary
Response:
```json
{
  "monthly_income": 50000,
  "monthly_expenses": 15000,
  "monthly_savings": 35000,
  "yearly_income": 600000,
  "yearly_expenses": 180000,
  "yearly_savings": 420000,
  "category_breakdown": [
    {
      "category": "food",
      "total": 5000
    }
  ]
}
```

#### GET /transactions/trends/monthly/
Get monthly trend data
Response:
```json
[
  {
    "month": "2023-12",
    "income": 50000,
    "expenses": 15000
  },
  {
    "month": "2024-01",
    "income": 52000,
    "expenses": 16000
  }
]
```

### Budgets

#### GET /budgets/
List all budgets
Query Parameters:
- `month`: filter by month (1-12)
- `year`: filter by year

Response:
```json
[
  {
    "id": 1,
    "category": "food",
    "category_display": "Food & Dining",
    "monthly_limit": "10000.00",
    "month": 1,
    "year": 2024,
    "spent": "5000.00",
    "remaining": "5000.00",
    "percentage_used": "50.0",
    "is_over_budget": false,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
]
```

#### POST /budgets/
Create a new budget
```json
{
  "category": "food",
  "monthly_limit": 10000,
  "month": 1,
  "year": 2024
}
```

#### GET /budgets/{id}/
Get budget details

#### PUT /budgets/{id}/
Update budget
```json
{
  "monthly_limit": 12000
}
```

#### DELETE /budgets/{id}/
Delete budget

#### GET /budgets/current-month/
Get budgets for current month

#### GET /budgets/alerts/
Get budget alerts
Response:
```json
{
  "alerts": [
    {
      "budget_id": 1,
      "category": "Food & Dining",
      "status": "WARNING",
      "message": "Approaching budget limit! 85.0% used",
      "percentage_used": 85.0,
      "remaining": 1500.00
    }
  ],
  "total_alerts": 1
}
```

### Reports

#### GET /reports/monthly/
Get monthly financial report
Query Parameters:
- `month`: month number (1-12)
- `year`: year

Response:
```json
{
  "month": 1,
  "year": 2024,
  "total_income": 50000,
  "total_expenses": 15000,
  "net_savings": 35000
}
```

#### GET /reports/export/pdf/
Export monthly report as PDF
Query Parameters:
- `month`: month number
- `year`: year

Returns: PDF file

#### GET /reports/export/csv/
Export monthly report as CSV
Query Parameters:
- `month`: month number
- `year`: year

Returns: CSV file

#### GET /reports/export/excel/
Export monthly report as Excel
Query Parameters:
- `month`: month number
- `year`: year

Returns: Excel file (.xlsx)

## Error Responses

### 400 Bad Request
```json
{
  "field_name": ["Error message"]
}
```

### 401 Unauthorized
```json
{
  "detail": "Invalid token"
}
```

### 404 Not Found
```json
{
  "detail": "Not found"
}
```

### 500 Internal Server Error
```json
{
  "detail": "Internal server error"
}
```

## HTTP Status Codes

- `200 OK`: Successful GET request
- `201 Created`: Successful POST request
- `204 No Content`: Successful DELETE request
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

## Rate Limiting

Current API does not have rate limiting. Add the following to settings.py for production:

```python
REST_FRAMEWORK = {
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle'
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '100/hour',
        'user': '1000/hour'
    }
}
```

## Pagination

Default page size: 20 results

Query: `GET /api/transactions/?page=2`

Response includes:
```json
{
  "count": 100,
  "next": "http://localhost:8000/api/transactions/?page=3",
  "previous": "http://localhost:8000/api/transactions/",
  "results": [...]
}
```
