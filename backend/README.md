# VibeClip Backend Infrastructure

Production-ready Node.js/Express backend API foundation with TypeScript, Express, MongoDB, Redis, and Docker orchestration.

## Features

- **Express.js** with TypeScript
- **MongoDB** with connection pooling
- **Redis** for caching and session management
- **JWT** authentication middleware
- **Zod** validation with environment configuration
- **Pino** logging with development-friendly formatting
- **Docker** multi-stage builds with health checks
- **CORS** configuration
- **Helmet** security middleware
- **ESLint** and **Prettier** code formatting
- **Graceful shutdown** handling

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB
- Redis

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

### Development

Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:5000`

### Build

Compile TypeScript:
```bash
npm run build
```

Start production server:
```bash
npm start
```

### Testing Health Endpoints

Once the server is running, test the health endpoints:

```bash
# Basic health check
curl http://localhost:5000/health

# API health check
curl http://localhost:5000/api/v1/health
```

### Docker Deployment

Start all services with Docker Compose:
```bash
docker-compose up --build
```

This will start:
- MongoDB on port 27017
- Redis on port 6379
- Backend API on port 5000

## Project Structure

```
backend/
├── src/
│   ├── app.ts                    # Express app initialization
│   ├── server.ts                 # Server entry point
│   ├── config/
│   │   ├── env.ts               # Environment validation (Zod)
│   │   ├── database.ts          # MongoDB connection
│   │   ├── redis.ts             # Redis client setup
│   │   └── constants.ts         # App constants
│   ├── middleware/
│   │   ├── errorHandler.ts      # Global error handler
│   │   ├── auth.ts              # JWT verification
│   │   ├── validation.ts        # Request validation
│   │   ├── logger.ts            # Request logging
│   │   └── corsConfig.ts        # CORS setup
│   ├── routes/
│   │   ├── index.ts             # Route aggregator
│   │   └── health.ts            # Health check route
│   ├── controllers/             # Will be added in Phase 2
│   ├── services/               # Will be added in Phase 2
│   ├── models/                 # Will be added in Phase 1.3
│   ├── types/
│   │   ├── index.ts             # Global types
│   │   └── errors.ts            # Error types
│   ├── utils/
│   │   ├── logger.ts            # Logging utility (Pino)
│   │   ├── validators.ts        # Validation helpers
│   │   └── errorHandler.ts      # Error utilities
│   └── db/
│       └── connection.ts         # Database connection helper
├── package.json
├── tsconfig.json
├── .env.example
├── .eslintrc.json
├── .prettierrc
├── Dockerfile
└── .dockerignore

Root level:
├── docker-compose.yml            # Multi-service orchestration
└── .gitignore
```

## Environment Variables

Required environment variables are defined in `.env.example`:

- `NODE_ENV`: Environment (development/production/test)
- `PORT`: Server port (default: 5000)
- `MONGODB_URI`: MongoDB connection string
- `REDIS_URL`: Redis connection URL
- `JWT_SECRET`: JWT signing secret
- `JWT_REFRESH_SECRET`: JWT refresh token secret
- `FRONTEND_URL`: Frontend URL for CORS

## API Endpoints

### Health Checks

- `GET /health` - Basic health check
- `GET /api/v1/health` - API health check with service info

### Response Format

All API responses follow this structure:

```typescript
{
  "success": boolean,
  "data"?: any,
  "error"?: {
    "message": string,
    "statusCode": number,
    "timestamp": string
  },
  "message"?: string
}
```

## Error Handling

The application includes comprehensive error handling:

- **Global error handler** middleware
- **Custom error classes** for different error types
- **Operational vs programming errors** distinction
- **Structured error logging** with Pino

## Security Features

- **Helmet.js** for security headers
- **CORS** configuration
- **Input validation** with Zod
- **JWT** authentication middleware

## Development Tools

- **TypeScript** for type safety
- **ESLint** for code linting
- **Prettier** for code formatting
- **Nodemon** for development hot reload

## Database Configuration

### MongoDB

- Connection pooling: min 2, max 10 connections
- Server selection timeout: 5 seconds
- Socket timeout: 45 seconds
- Automatic reconnection handling

### Redis

- Automatic reconnection with exponential backoff
- Connection health monitoring
- Graceful shutdown handling

## Docker Configuration

### Multi-stage Dockerfile

1. **Builder stage**: Compiles TypeScript
2. **Production stage**: Runs compiled JavaScript

### Health Checks

- Backend: HTTP health check on port 5000
- MongoDB: `db.runCommand("ping")` check
- Redis: `redis-cli ping` check

## Logging

- **Development**: Colored, human-readable logs
- **Production**: JSON-structured logs
- **Request logging**: All HTTP requests logged with timing
- **Error logging**: Structured error information

## Testing

The infrastructure supports:

- Health endpoint testing
- Environment validation
- Database connection testing
- Build process validation
- Docker container testing

## Next Steps

This infrastructure is ready for:

1. **Phase 2**: Adding controllers and services
2. **Phase 3**: Database models and migrations
3. **Phase 4**: AI service integration
4. **Phase 5**: File upload handling
5. **Phase 6**: Payment processing

## Troubleshooting

### Common Issues

1. **Port already in use**: Change `PORT` in `.env`
2. **MongoDB connection failed**: Check `MONGODB_URI` and MongoDB status
3. **Redis connection failed**: Check `REDIS_URL` and Redis status
4. **Environment validation failed**: Check `.env` file contains all required variables

### Logs

Check logs for detailed error information:
- Development: Colored console output
- Production: JSON logs suitable for log aggregation

## Contributing

1. Follow the existing code structure
2. Use TypeScript for all new files
3. Add proper error handling
4. Include logging for important operations
5. Update documentation as needed

## License

This project is part of the VibeClip AI Video Generator platform.