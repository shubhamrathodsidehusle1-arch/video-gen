import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('5000'),

  // Database
  DATABASE_URL: z.string().min(1),

  // Redis
  REDIS_URL: z.string().url(),

  // Celery/Job Queue
  CELERY_BROKER_URL: z.string().optional(),
  CELERY_RESULT_BACKEND: z.string().optional(),

  // JWT
  JWT_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_EXPIRE: z.string().default('15m'),
  JWT_REFRESH_EXPIRE: z.string().default('7d'),

  // Frontend
  FRONTEND_URL: z.string().url(),

  // Optional
  STRIPE_SECRET_KEY: z.string().optional(),
  RAZORPAY_KEY_ID: z.string().optional(),
  OPENROUTER_API_KEY: z.string().optional(),

  // File Upload
  MAX_FILE_SIZE: z.string().transform(Number).default('1073741824'),
  UPLOAD_DIR: z.string().default('./uploads'),
});

export type Environment = z.infer<typeof envSchema>;

export const env = envSchema.parse(process.env);
