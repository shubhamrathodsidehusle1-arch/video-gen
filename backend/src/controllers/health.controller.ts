import { Request, Response } from 'express';
import { getPrismaClient } from '../config/prisma.js';

export class HealthController {
  private prisma = getPrismaClient();

  async getSystemHealth(req: Request, res: Response): Promise<void> {
    try {
      // Check database connection
      await this.prisma.$queryRaw`SELECT 1`;

      res.status(200).json({
        success: true,
        data: {
          status: 'healthy',
          timestamp: new Date().toISOString(),
          uptime: process.uptime(),
          services: {
            database: 'healthy',
            redis: 'healthy', // TODO: Add actual Redis health check
          },
        },
      });
    } catch (error: any) {
      res.status(503).json({
        error: {
          message: 'Service unavailable',
          statusCode: 503,
          details: error.message,
        },
      });
    }
  }

  async getProviderHealth(req: Request, res: Response): Promise<void> {
    try {
      const providers = await this.prisma.providerHealth.findMany({
        orderBy: { lastChecked: 'desc' },
      });

      res.status(200).json({
        success: true,
        data: {
          providers,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error: any) {
      res.status(500).json({
        error: {
          message: error.message || 'Failed to get provider health',
          statusCode: 500,
        },
      });
    }
  }
}

export const healthController = new HealthController();
