import { ZodSchema } from 'zod';
import { ValidationError } from '../types/errors.js';

export const validateSchema = <T>(schema: ZodSchema<T>, data: unknown): T => {
  try {
    return schema.parse(data);
  } catch (error) {
    throw new ValidationError('Validation failed');
  }
};

export const createValidationMiddleware = <T>(schema: ZodSchema<T>) => {
  return (req: any, res: any, next: any) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      throw new ValidationError('Validation failed');
    }
  };
};

export const validatePagination = (page: string | undefined, limit: string | undefined) => {
  const pageNum = page ? parseInt(page, 10) : 1;
  const limitNum = limit ? parseInt(limit, 10) : 10;

  if (isNaN(pageNum) || pageNum < 1) {
    throw new ValidationError('Page must be a positive number');
  }

  if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
    throw new ValidationError('Limit must be between 1 and 100');
  }

  return {
    page: pageNum,
    limit: limitNum,
    skip: (pageNum - 1) * limitNum,
  };
};
