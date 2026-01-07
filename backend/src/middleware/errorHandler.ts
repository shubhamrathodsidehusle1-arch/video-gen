import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';
import { AppError } from '../types/errors.js';

export const errorHandler = (error: AppError, req: Request, res: Response, _next: NextFunction) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  logger.error({
    statusCode,
    message,
    path: req.path,
    method: req.method,
    stack: error.stack,
  });

  res.status(statusCode).json({
    error: {
      message,
      statusCode,
      timestamp: new Date().toISOString(),
    },
  });
};
