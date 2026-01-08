import { createClient } from 'redis';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';
import { v4 as uuidv4 } from 'uuid';

class QueueService {
  private client: ReturnType<typeof createClient> | null = null;

  async connect(): Promise<void> {
    if (!this.client) {
      this.client = createClient({
        url: env.REDIS_URL,
      });

      this.client.on('error', (err) => {
        logger.error('Redis Client Error:', err);
      });

      await this.client.connect();
      logger.info('Queue service connected to Redis');
    }
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.quit();
      this.client = null;
      logger.info('Queue service disconnected from Redis');
    }
  }

  async queueVideoGenerationJob(jobId: string, inputPrompt: string): Promise<void> {
    try {
      await this.connect();

      // Create Celery task message format
      const taskId = uuidv4();
      const task = {
        task: 'tasks.process_video_generation',
        id: taskId,
        args: [jobId, inputPrompt],
        kwargs: {},
        retries: 0,
      };

      // Push to Celery queue
      await this.client!.lPush('celery', JSON.stringify(task));

      logger.info(`Queued video generation job: ${jobId}, task: ${taskId}`);
    } catch (error) {
      logger.error('Failed to queue job:', error);
      throw error;
    }
  }

  async getJobStatus(jobId: string): Promise<any> {
    try {
      await this.connect();

      // Get job status from Redis (if stored)
      const status = await this.client!.get(`job:${jobId}:status`);
      return status ? JSON.parse(status) : null;
    } catch (error) {
      logger.error('Failed to get job status:', error);
      return null;
    }
  }
}

export const queueService = new QueueService();
