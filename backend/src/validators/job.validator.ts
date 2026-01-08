import { z } from 'zod';

export const createJobSchema = z.object({
  inputPrompt: z.string().min(1, 'Input prompt is required').max(5000, 'Prompt is too long'),
  projectId: z.string().uuid().optional(),
  metadata: z.record(z.any()).optional(),
});

export const updateJobSchema = z.object({
  status: z.enum(['pending', 'processing', 'completed', 'failed', 'cancelled']).optional(),
  outputUrl: z.string().url().optional(),
  metadata: z.record(z.any()).optional(),
});

export const listJobsSchema = z.object({
  page: z.string().transform(Number).default('1'),
  limit: z.string().transform(Number).default('10'),
  status: z.enum(['pending', 'processing', 'completed', 'failed', 'cancelled']).optional(),
  projectId: z.string().uuid().optional(),
});

export type CreateJobInput = z.infer<typeof createJobSchema>;
export type UpdateJobInput = z.infer<typeof updateJobSchema>;
export type ListJobsInput = z.infer<typeof listJobsSchema>;
