import express, { Express, Request, Response } from 'express';
import 'express-async-errors';
import helmet from 'helmet';
import { corsConfig } from './middleware/corsConfig.js';
import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/logger.js';
import { logger } from './utils/logger.js';
import authRoutes from './routes/auth.routes.js';
import jobRoutes from './routes/job.routes.js';
import projectRoutes from './routes/project.routes.js';
import userRoutes from './routes/user.routes.js';
import healthRoutes from './routes/health.routes.js';

export function createApp(): Express {
  const app = express();

  // Security middleware
  app.use(helmet());
  app.use(corsConfig);

  // Body parsing middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));

  // Request logging
  app.use(requestLogger);

  // Health check endpoint
  app.get('/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });

  // API routes
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/jobs', jobRoutes);
  app.use('/api/v1/projects', projectRoutes);
  app.use('/api/v1/users', userRoutes);
  app.use('/api/v1/health', healthRoutes);

  // 404 handler
  app.use((req: Request, res: Response) => {
    res.status(404).json({
      error: {
        message: 'Route not found',
        path: req.path,
        statusCode: 404,
      },
    });
  });

  // Error handling middleware (must be last)
  app.use(errorHandler);

  return app;
}