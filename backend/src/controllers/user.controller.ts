import { Request, Response } from 'express';
import { getPrismaClient } from '../config/prisma.js';
import { authService } from '../services/auth.service.js';

export class UserController {
  private prisma = getPrismaClient();

  async getProfile(req: Request, res: Response): Promise<void> {
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

      const user = await this.prisma.user.findUnique({
        where: { id: req.user.userId },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        res.status(404).json({
          error: {
            message: 'User not found',
            statusCode: 404,
          },
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: { user },
      });
    } catch (error: any) {
      res.status(500).json({
        error: {
          message: error.message || 'Failed to get profile',
          statusCode: 500,
        },
      });
    }
  }

  async updateProfile(req: Request, res: Response): Promise<void> {
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

      const { name } = req.body;

      const user = await this.prisma.user.update({
        where: { id: req.user.userId },
        data: { name },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      res.status(200).json({
        success: true,
        data: { user },
      });
    } catch (error: any) {
      res.status(400).json({
        error: {
          message: error.message || 'Failed to update profile',
          statusCode: 400,
        },
      });
    }
  }

  async getSettings(req: Request, res: Response): Promise<void> {
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

      // For now, return basic user settings
      // This can be extended with a separate Settings model in the future
      const user = await this.prisma.user.findUnique({
        where: { id: req.user.userId },
        select: {
          id: true,
          email: true,
          name: true,
        },
      });

      res.status(200).json({
        success: true,
        data: {
          settings: {
            email: user?.email,
            name: user?.name,
            // Add more settings as needed
          },
        },
      });
    } catch (error: any) {
      res.status(500).json({
        error: {
          message: error.message || 'Failed to get settings',
          statusCode: 500,
        },
      });
    }
  }

  async updateSettings(req: Request, res: Response): Promise<void> {
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

      const { name } = req.body;

      await this.prisma.user.update({
        where: { id: req.user.userId },
        data: { name },
      });

      res.status(200).json({
        success: true,
        message: 'Settings updated successfully',
      });
    } catch (error: any) {
      res.status(400).json({
        error: {
          message: error.message || 'Failed to update settings',
          statusCode: 400,
        },
      });
    }
  }

  async deleteAccount(req: Request, res: Response): Promise<void> {
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

      // Delete user and all related data (cascading delete)
      await this.prisma.user.delete({
        where: { id: req.user.userId },
      });

      res.status(200).json({
        success: true,
        message: 'Account deleted successfully',
      });
    } catch (error: any) {
      res.status(400).json({
        error: {
          message: error.message || 'Failed to delete account',
          statusCode: 400,
        },
      });
    }
  }
}

export const userController = new UserController();
