import { getPrismaClient } from '../config/prisma.js';
import { logger } from '../utils/logger.js';
import { queueService } from './queue.service.js';
import type { Job, Prisma } from '../generated/prisma/index.js';
import type { CreateJobInput, UpdateJobInput } from '../validators/job.validator.js';

export class JobService {
  private prisma = getPrismaClient();

  async createJob(userId: string, data: CreateJobInput): Promise<Job> {
    const job = await this.prisma.job.create({
      data: {
        userId,
        inputPrompt: data.inputPrompt,
        projectId: data.projectId,
        metadata: data.metadata ? (data.metadata as Prisma.InputJsonValue) : undefined,
        status: 'pending',
      },
    });

    logger.info(`Job created: ${job.id} for user: ${userId}`);

    // Queue job for processing with Celery
    try {
      await queueService.queueVideoGenerationJob(job.id, data.inputPrompt);
    } catch (error) {
      logger.error(`Failed to queue job ${job.id}:`, error);
      // Don't fail the job creation if queueing fails
    }

    return job;
  }

  async getJobById(jobId: string, userId: string): Promise<Job | null> {
    return this.prisma.job.findFirst({
      where: {
        id: jobId,
        userId,
      },
      include: {
        project: true,
      },
    });
  }

  async listJobs(
    userId: string,
    page: number = 1,
    limit: number = 10,
    status?: string,
    projectId?: string
  ): Promise<{ jobs: Job[]; total: number; page: number; totalPages: number }> {
    const skip = (page - 1) * limit;

    const where: Prisma.JobWhereInput = {
      userId,
      ...(status && { status }),
      ...(projectId && { projectId }),
    };

    const [jobs, total] = await Promise.all([
      this.prisma.job.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          project: true,
        },
      }),
      this.prisma.job.count({ where }),
    ]);

    return {
      jobs,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async updateJob(jobId: string, userId: string, data: UpdateJobInput): Promise<Job> {
    // Verify job belongs to user
    const job = await this.getJobById(jobId, userId);
    if (!job) {
      throw new Error('Job not found');
    }

    const updated = await this.prisma.job.update({
      where: { id: jobId },
      data: {
        ...(data.status && { status: data.status }),
        ...(data.outputUrl && { outputUrl: data.outputUrl }),
        ...(data.metadata && { metadata: data.metadata as Prisma.InputJsonValue }),
        ...(data.status === 'completed' && { completedAt: new Date() }),
        ...(data.status === 'processing' && !job.startedAt && { startedAt: new Date() }),
      },
    });

    logger.info(`Job updated: ${jobId}`);

    return updated;
  }

  async deleteJob(jobId: string, userId: string): Promise<void> {
    // Verify job belongs to user
    const job = await this.getJobById(jobId, userId);
    if (!job) {
      throw new Error('Job not found');
    }

    await this.prisma.job.delete({
      where: { id: jobId },
    });

    logger.info(`Job deleted: ${jobId}`);
  }

  async cancelJob(jobId: string, userId: string): Promise<Job> {
    return this.updateJob(jobId, userId, { status: 'cancelled' });
  }

  async getJobStats(userId: string): Promise<{
    total: number;
    pending: number;
    processing: number;
    completed: number;
    failed: number;
  }> {
    const [total, pending, processing, completed, failed] = await Promise.all([
      this.prisma.job.count({ where: { userId } }),
      this.prisma.job.count({ where: { userId, status: 'pending' } }),
      this.prisma.job.count({ where: { userId, status: 'processing' } }),
      this.prisma.job.count({ where: { userId, status: 'completed' } }),
      this.prisma.job.count({ where: { userId, status: 'failed' } }),
    ]);

    return { total, pending, processing, completed, failed };
  }
}

export const jobService = new JobService();
