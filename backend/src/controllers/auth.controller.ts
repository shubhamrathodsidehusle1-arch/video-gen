import { Request, Response } from 'express';
import { authService } from '../services/auth.service.js';
import type { RegisterInput, LoginInput, ChangePasswordInput } from '../validators/auth.validator.js';

export class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const data: RegisterInput = req.body;

      const user = await authService.register(data.email, data.password, data.name);
      const tokens = authService.generateTokens({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      res.status(201).json({
        success: true,
        data: {
          user: authService.sanitizeUser(user),
          tokens,
        },
      });
    } catch (error: any) {
      res.status(400).json({
        error: {
          message: error.message || 'Registration failed',
          statusCode: 400,
        },
      });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const data: LoginInput = req.body;

      const { user, tokens } = await authService.login(data.email, data.password);

      res.status(200).json({
        success: true,
        data: {
          user: authService.sanitizeUser(user),
          tokens,
        },
      });
    } catch (error: any) {
      res.status(401).json({
        error: {
          message: error.message || 'Login failed',
          statusCode: 401,
        },
      });
    }
  }

  async refresh(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        res.status(400).json({
          error: {
            message: 'Refresh token is required',
            statusCode: 400,
          },
        });
        return;
      }

      const payload = authService.verifyRefreshToken(refreshToken);
      const tokens = authService.generateTokens(payload);

      res.status(200).json({
        success: true,
        data: { tokens },
      });
    } catch (error: any) {
      res.status(401).json({
        error: {
          message: error.message || 'Token refresh failed',
          statusCode: 401,
        },
      });
    }
  }

  async getMe(req: Request, res: Response): Promise<void> {
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

      const user = await authService.getUserById(req.user.userId);

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
        data: {
          user: authService.sanitizeUser(user),
        },
      });
    } catch (error: any) {
      res.status(500).json({
        error: {
          message: error.message || 'Failed to get user',
          statusCode: 500,
        },
      });
    }
  }

  async changePassword(req: Request, res: Response): Promise<void> {
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

      const data: ChangePasswordInput = req.body;

      await authService.changePassword(req.user.userId, data.oldPassword, data.newPassword);

      res.status(200).json({
        success: true,
        message: 'Password changed successfully',
      });
    } catch (error: any) {
      res.status(400).json({
        error: {
          message: error.message || 'Password change failed',
          statusCode: 400,
        },
      });
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    // For stateless JWT, logout is handled on the client side
    // Here we just send a success response
    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  }
}

export const authController = new AuthController();
