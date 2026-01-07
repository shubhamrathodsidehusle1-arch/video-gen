import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      return res.status(400).json({
        error: {
          message: 'Validation error',
          details: error,
          statusCode: 400,
        },
      });
    }
  };
};

export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.query = schema.parse(req.query);
      next();
    } catch (error) {
      return res.status(400).json({
        error: {
          message: 'Query validation error',
          details: error,
          statusCode: 400,
        },
      });
    }
  };
};
