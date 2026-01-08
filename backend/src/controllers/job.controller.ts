import { Request, Response } from 'express';
import { jobService } from '../services/job.service.js';
import type { CreateJobInput, UpdateJobInput, ListJobsInput } from '../validators/job.validator.js';

export class JobController {
  async createJob(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          error: {
            message: 'Not authenticated',
            statusCode: 401,
          },
        });
        return;
      }

      const data: CreateJobInput = req.body;
      const job = await jobService.createJob(req.user.userId, data);

      res.status(201).json({
        success: true,
        data: { job },
      });
    } catch (error: any) {
      res.status(400).json({
        error: {
          message: error.message || 'Failed to create job',
          statusCode: 400,
        },
      });
    }
  }

  async getJob(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          error: {
            message: 'Not authenticated',
            statusCode: 401,
          },
        });
        return;
      }

      const { id } = req.params;
      const job = await jobService.getJobById(id, req.user.userId);

      if (!job) {
        res.status(404).json({
          error: {
            message: 'Job not found',
            statusCode: 404,
          },
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: { job },
      });
    } catch (error: any) {
      res.status(500).json({
        error: {
          message: error.message || 'Failed to get job',
          statusCode: 500,
        },
      });
    }
  }

  async listJobs(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          error: {
            message: 'Not authenticated',
            statusCode: 401,
          },
        });
        return;
      }

      const query = req.query as any as ListJobsInput;
      const result = await jobService.listJobs(
        req.user.userId,
        query.page,
        query.limit,
        query.status,
        query.projectId
      );

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      res.status(500).json({
        error: {
          message: error.message || 'Failed to list jobs',
          statusCode: 500,
        },
      });
    }
  }

  async updateJob(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          error: {
            message: 'Not authenticated',
            statusCode: 401,
          },
        });
        return;
      }

      const { id } = req.params;
      const data: UpdateJobInput = req.body;
      const job = await jobService.updateJob(id, req.user.userId, data);

      res.status(200).json({
        success: true,
        data: { job },
      });
    } catch (error: any) {
      res.status(400).json({
        error: {
          message: error.message || 'Failed to update job',
          statusCode: 400,
        },
      });
    }
  }

  async deleteJob(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          error: {
            message: 'Not authenticated',
            statusCode: 401,
          },
        });
        return;
      }

      const { id } = req.params;
      await jobService.deleteJob(id, req.user.userId);

      res.status(200).json({
        success: true,
        message: 'Job deleted successfully',
      });
    } catch (error: any) {
      res.status(400).json({
        error: {
          message: error.message || 'Failed to delete job',
          statusCode: 400,
        },
      });
    }
  }

  async cancelJob(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          error: {
            message: 'Not authenticated',
            statusCode: 401,
          },
        });
        return;
      }

      const { id } = req.params;
      const job = await jobService.cancelJob(id, req.user.userId);

      res.status(200).json({
        success: true,
        data: { job },
      });
    } catch (error: any) {
      res.status(400).json({
        error: {
          message: error.message || 'Failed to cancel job',
          statusCode: 400,
        },
      });
    }
  }

  async getJobStatus(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          error: {
            message: 'Not authenticated',
            statusCode: 401,
          },
        });
        return;
      }

      const { id } = req.params;
      const job = await jobService.getJobById(id, req.user.userId);

      if (!job) {
        res.status(404).json({
          error: {
            message: 'Job not found',
            statusCode: 404,
          },
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: {
          id: job.id,
          status: job.status,
          progress: job.metadata ? (job.metadata as any).progress : null,
          startedAt: job.startedAt,
          completedAt: job.completedAt,
          errorMessage: job.errorMessage,
        },
      });
    } catch (error: any) {
      res.status(500).json({
        error: {
          message: error.message || 'Failed to get job status',
          statusCode: 500,
        },
      });
    }
  }

  async getJobStats(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          error: {
            message: 'Not authenticated',
            statusCode: 401,
          },
        });
        return;
      }

      const stats = await jobService.getJobStats(req.user.userId);

      res.status(200).json({
        success: true,
        data: { stats },
      });
    } catch (error: any) {
      res.status(500).json({
        error: {
          message: error.message || 'Failed to get job stats',
          statusCode: 500,
        },
      });
    }
  }
}

export const jobController = new JobController();
