# Phase 1.3: Backend API, Authentication, Database & Job Processing

## Overview
This phase implements the complete backend infrastructure with:
- PostgreSQL database with Prisma ORM
- JWT-based authentication
- RESTful API endpoints for jobs, projects, and users
- Celery-based job processing with Redis
- Frontend-backend integration

## Architecture

### Tech Stack
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL 15
- **ORM**: Prisma
- **Authentication**: JWT (jsonwebtoken + bcryptjs)
- **Job Queue**: Celery (Python) + Redis
- **Cache/Queue**: Redis

### Database Schema

#### Users Table
- id (UUID)
- email (unique)
- password (hashed)
- name
- role (user/admin)
- isActive
- timestamps

#### Jobs Table
- id (UUID)
- userId (FK)
- status (pending/processing/completed/failed/cancelled)
- inputPrompt
- outputUrl
- metadata (JSON)
- retryCount
- errorMessage
- startedAt
- completedAt
- projectId (FK, optional)
- timestamps

#### Projects Table
- id (UUID)
- userId (FK)
- name
- description
- color
- isArchived
- timestamps

#### ProviderHealth Table
- id (UUID)
- providerName (unique)
- status (healthy/degraded/down)
- lastChecked
- errorRate
- responseTime
- metadata (JSON)
- timestamps

#### ApiKeys Table
- id (UUID)
- userId (FK)
- key (unique)
- name
- scopes (array)
- lastUsed
- expiresAt
- isActive
- timestamps

## API Endpoints

### Authentication (`/api/v1/auth`)
- `POST /register` - Register new user
- `POST /login` - Login and get JWT tokens
- `POST /refresh` - Refresh access token
- `POST /logout` - Logout (client-side)
- `GET /me` - Get current user (protected)
- `POST /change-password` - Change password (protected)

### Jobs (`/api/v1/jobs`)
All endpoints require authentication.

- `POST /` - Create new job
- `GET /` - List user's jobs (with pagination)
- `GET /stats` - Get job statistics
- `GET /:id` - Get job details
- `GET /:id/status` - Get job status
- `PUT /:id` - Update job
- `DELETE /:id` - Delete job
- `POST /:id/cancel` - Cancel job

### Projects (`/api/v1/projects`)
All endpoints require authentication.

- `POST /` - Create project
- `GET /` - List user's projects (with pagination)
- `GET /:id` - Get project details
- `PUT /:id` - Update project
- `DELETE /:id` - Delete project

### Users (`/api/v1/users`)
All endpoints require authentication.

- `GET /profile` - Get user profile
- `PUT /profile` - Update user profile
- `GET /settings` - Get user settings
- `PUT /settings` - Update user settings
- `DELETE /account` - Delete user account

### Health (`/api/v1/health`)
- `GET /status` - Get system health status
- `GET /providers` - Get AI provider health status

## Authentication

### JWT Tokens
- **Access Token**: Short-lived (15 minutes), used for API requests
- **Refresh Token**: Long-lived (7 days), used to get new access tokens

### Usage
```bash
# Register
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123", "name": "Test User"}'

# Login
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'

# Use token in requests
curl -X GET http://localhost:5000/api/v1/jobs \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Job Processing

### Celery Worker
The Celery worker processes video generation jobs asynchronously.

#### Tasks
1. **process_video_generation**: Main task for generating videos
   - Takes jobId and inputPrompt
   - Updates job status in database
   - Retries up to 3 times on failure
   - Currently simulates video generation (AI integration in Phase 4)

2. **check_provider_health**: Periodic task (every 5 minutes)
   - Checks health of AI providers
   - Updates provider_health table

3. **cleanup_old_jobs**: Periodic task (daily)
   - Removes old completed/failed jobs (>90 days)

4. **send_notification**: Notification task
   - Placeholder for future email/push notifications

### Job Workflow
1. User creates job via POST /api/v1/jobs
2. Backend saves job to database with status 'pending'
3. Backend queues job to Celery via Redis
4. Celery worker picks up job
5. Worker updates status to 'processing'
6. Worker processes job (simulated for now)
7. Worker updates status to 'completed' with output URL
8. User can poll GET /api/v1/jobs/:id/status for updates

## Setup & Development

### Prerequisites
- Node.js 20+
- Python 3.11+
- Docker & Docker Compose
- PostgreSQL 15
- Redis 7

### Environment Variables

Create `.env` file in backend directory:
```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://postgres:changeme@localhost:5432/vibeclip?schema=public
REDIS_URL=redis://localhost:6379
CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/0
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production-min-32-chars
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

### Installation

#### Using Docker Compose (Recommended)
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

#### Manual Setup

##### Backend
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate deploy
npm run dev
```

##### Worker
```bash
cd worker
pip install -r requirements.txt
celery -A celery_app worker --loglevel=info
```

##### Database
```bash
# Run PostgreSQL
docker run -d \
  --name vibeclip-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=changeme \
  -e POSTGRES_DB=vibeclip \
  -p 5432:5432 \
  postgres:15-alpine

# Run Redis
docker run -d \
  --name vibeclip-redis \
  -p 6379:6379 \
  redis:7-alpine
```

### Database Migrations
```bash
# Generate Prisma client
npx prisma generate

# Create new migration
npx prisma migrate dev --name migration_name

# Apply migrations
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset
```

## Frontend Integration

### API Service Layer
The frontend uses Axios with interceptors for JWT token management.

Located at: `frontend/src/services/api.ts`

Features:
- Automatic token attachment to requests
- Token refresh on 401 responses
- Error handling and retry logic
- Request/response interceptors

### Redux Integration

#### Auth Slice
- `login()` - Login action
- `register()` - Register action
- `logout()` - Logout action
- `refreshToken()` - Refresh token action
- `getProfile()` - Get user profile action

#### Jobs Slice
- `createJob()` - Create new job
- `fetchJobs()` - Fetch user's jobs
- `fetchJobById()` - Fetch job details
- `updateJob()` - Update job
- `deleteJob()` - Delete job
- `cancelJob()` - Cancel job

#### Projects Slice
- `createProject()` - Create project
- `fetchProjects()` - Fetch user's projects
- `fetchProjectById()` - Fetch project details
- `updateProject()` - Update project
- `deleteProject()` - Delete project

### Protected Routes
Routes requiring authentication use the `ProtectedRoute` component.

```typescript
<Route path="/dashboard" element={
  <ProtectedRoute>
    <DashboardPage />
  </ProtectedRoute>
} />
```

## Testing

### Manual Testing

#### Test Authentication
```bash
# Register
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "Test1234", "name": "Test User"}'

# Login
TOKEN=$(curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "Test1234"}' \
  | jq -r '.data.tokens.accessToken')

echo "Token: $TOKEN"
```

#### Test Job Creation
```bash
# Create job
curl -X POST http://localhost:5000/api/v1/jobs \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"inputPrompt": "Create a video of a sunset"}'

# List jobs
curl -X GET http://localhost:5000/api/v1/jobs \
  -H "Authorization: Bearer $TOKEN"

# Get job status
curl -X GET http://localhost:5000/api/v1/jobs/{JOB_ID}/status \
  -H "Authorization: Bearer $TOKEN"
```

#### Test Projects
```bash
# Create project
curl -X POST http://localhost:5000/api/v1/projects \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "My Project", "description": "Test project"}'

# List projects
curl -X GET http://localhost:5000/api/v1/projects \
  -H "Authorization: Bearer $TOKEN"
```

## Deployment

### Docker Deployment
```bash
# Build and start all services
docker-compose up -d --build

# View logs
docker-compose logs -f backend
docker-compose logs -f worker

# Scale workers
docker-compose up -d --scale worker=3
```

### Production Considerations
1. Use strong JWT secrets (32+ characters)
2. Enable HTTPS/TLS
3. Set up database backups
4. Configure Redis persistence
5. Set up monitoring and logging
6. Use environment-specific configs
7. Implement rate limiting
8. Set up error tracking (e.g., Sentry)

## Monitoring

### Health Checks
```bash
# System health
curl http://localhost:5000/health

# API health
curl http://localhost:5000/api/v1/health/status

# Provider health
curl http://localhost:5000/api/v1/health/providers
```

### Logs
```bash
# Backend logs
docker-compose logs -f backend

# Worker logs
docker-compose logs -f worker

# Database logs
docker-compose logs -f postgres
```

## Troubleshooting

### Database Connection Issues
```bash
# Check if PostgreSQL is running
docker-compose ps postgres

# Check database logs
docker-compose logs postgres

# Test connection
psql postgresql://postgres:changeme@localhost:5432/vibeclip
```

### Redis Connection Issues
```bash
# Check if Redis is running
docker-compose ps redis

# Test connection
redis-cli -h localhost -p 6379 ping
```

### Celery Worker Issues
```bash
# Check worker logs
docker-compose logs -f worker

# Restart worker
docker-compose restart worker

# Check Redis queue
redis-cli -h localhost -p 6379 LLEN celery
```

### Migration Issues
```bash
# Reset database (development only)
npx prisma migrate reset

# Force push schema
npx prisma db push --force-reset
```

## Next Phases

### Phase 2: File Upload & Storage
- Implement file upload endpoints
- Add S3/cloud storage integration
- Video file validation

### Phase 3: AI Service Integration
- Integrate OpenRouter API
- Implement actual video generation
- Add provider failover logic

### Phase 4: Payment Processing
- Stripe/Razorpay integration
- Subscription management
- Usage tracking and billing

## Security Notes

1. **Passwords**: Hashed with bcrypt (12 rounds)
2. **JWT Tokens**: Signed with HS256
3. **CORS**: Configured for frontend origin
4. **Helmet**: Security headers enabled
5. **Rate Limiting**: TODO in future phase
6. **Input Validation**: Zod schemas for all endpoints

## Performance

- **Database Indexing**: All frequently queried fields indexed
- **Connection Pooling**: Prisma handles connection pooling
- **Redis Caching**: Ready for implementation
- **Job Queue**: Async processing prevents blocking
- **Pagination**: All list endpoints support pagination

## Support

For issues or questions:
1. Check logs: `docker-compose logs -f`
2. Verify environment variables
3. Check database connectivity
4. Review API documentation above
