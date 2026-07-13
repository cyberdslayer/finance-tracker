# Finance Tracker - Development Guide

## Architecture Overview

### Backend Architecture
```
Django REST Framework
├── Authentication (JWT)
├── Transaction Management
├── Budget Management
├── Report Generation
└── Database Layer (PostgreSQL)
```

### Frontend Architecture
```
React + TypeScript
├── Services Layer (API calls)
├── Components Layer (UI components)
├── Pages Layer (Page components)
└── Charts Layer (Data visualization)
```

## Development Workflow

### 1. Creating a New Feature

**Backend:**
1. Create Django model in appropriate app
2. Create serializer for the model
3. Create viewset/views for CRUD operations
4. Add URL patterns
5. Write tests

**Frontend:**
1. Create API service in services folder
2. Create React component(s)
3. Integrate with state management
4. Add routing if needed
5. Write tests

### 2. Testing

**Backend:**
```bash
cd backend
source venv/bin/activate
python manage.py test
pytest
```

**Frontend:**
```bash
cd frontend
npm test
npm run test:coverage
```

### 3. Code Style

**Backend:**
- Follow PEP 8
- Use Django conventions
- Write docstrings for complex functions

**Frontend:**
- Use ESLint for code style
- Follow React best practices
- Use TypeScript for type safety

### 4. Database Migrations

**Create Migration:**
```bash
python manage.py makemigrations
```

**Apply Migration:**
```bash
python manage.py migrate
```

**Check Status:**
```bash
python manage.py showmigrations
```

## API Guidelines

### Request/Response Format
- Content-Type: application/json
- Use HTTP status codes correctly
- Include error messages in responses

### Pagination
Use Django REST Framework's pagination:
```python
REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20
}
```

### Filtering
Use django-filter for flexible filtering:
```python
from django_filters import DjangoFilterBackend

class MyViewSet(viewsets.ModelViewSet):
    filterset_fields = ['field1', 'field2']
    filter_backends = [DjangoFilterBackend]
```

## Performance Optimization

### Database
- Use select_related() for foreign keys
- Use prefetch_related() for reverse relations
- Add indexes to frequently queried fields
- Use database views for complex aggregations

### Frontend
- Implement lazy loading for lists
- Use React.memo for expensive components
- Implement infinite scroll where appropriate
- Cache API responses

### API
- Implement response caching
- Use compression (gzip)
- Optimize database queries
- Consider using CDN for static files

## Deployment Checklist

- [ ] Set DEBUG=False
- [ ] Configure ALLOWED_HOSTS
- [ ] Set SECRET_KEY
- [ ] Configure database with strong password
- [ ] Setup email backend
- [ ] Configure CORS properly
- [ ] Enable HTTPS
- [ ] Setup logging
- [ ] Configure backups
- [ ] Setup monitoring
- [ ] Test authentication flow
- [ ] Test file uploads
- [ ] Test payment processing (if applicable)

## Common Issues and Solutions

### Issue: CORS errors
**Solution:** Check CORS_ALLOWED_ORIGINS in settings.py

### Issue: 401 Unauthorized
**Solution:** Verify JWT token is sent in Authorization header

### Issue: Database connection error
**Solution:** Check DATABASE_URL and ensure PostgreSQL is running

### Issue: Static files not loading
**Solution:** Run `python manage.py collectstatic`

## Useful Commands

**Backend:**
```bash
# Create superuser
python manage.py createsuperuser

# Shell access
python manage.py shell

# Check migrations
python manage.py showmigrations

# Run specific test
python manage.py test accounts.tests.TestUserModel

# Generate static files
python manage.py collectstatic
```

**Frontend:**
```bash
# Install new package
npm install package-name

# Update packages
npm update

# Build for production
npm run build

# Preview build
npm run preview
```

**Docker:**
```bash
# Build images
docker-compose build

# Start services
docker-compose up

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Execute command in container
docker-compose exec backend python manage.py migrate
```

## Resources

- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [React Documentation](https://react.dev/)
- [Material-UI Documentation](https://mui.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
