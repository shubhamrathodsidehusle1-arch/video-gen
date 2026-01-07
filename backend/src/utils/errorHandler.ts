import { CustomError, AppError } from '../types/errors.js';
import { logger } from './logger.js';

export const createError = (message: string, statusCode: number = 500): CustomError => {
  return new CustomError(message, statusCode);
};

export const handleError = (error: Error | AppError): void => {
  if (error instanceof CustomError) {
    logger.error({
      message: error.message,
      statusCode: error.statusCode,
      isOperational: error.isOperational,
      stack: error.stack,
    });
  } else {
    logger.error({
      message: error.message,
      stack: error.stack,
      type: 'UnexpectedError',
    });
  }
};

export const isOperationalError = (error: Error): boolean => {
  return error instanceof CustomError && error.isOperational;
};
