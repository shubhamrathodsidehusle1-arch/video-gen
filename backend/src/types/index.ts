import { Request } from 'express';

export interface ApiResponse<T = any> {
  data?: T;
  error?: {
    message: string;
    statusCode: number;
    timestamp: string;
  };
  message?: string;
  success: boolean;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface AuthUser {
  id: string;
  email: string;
  role?: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}
