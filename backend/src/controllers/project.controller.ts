import { Request, Response } from 'express';
import { projectService } from '../services/project.service.js';
import type { CreateProjectInput, UpdateProjectInput, ListProjectsInput } from '../validators/project.validator.js';

export class ProjectController {
  async createProject(req: Request, res: Response): Promise<void> {
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

      const data: CreateProjectInput = req.body;
      const project = await projectService.createProject(req.user.userId, data);

      res.status(201).json({
        success: true,
        data: { project },
      });
    } catch (error: any) {
      res.status(400).json({
        error: {
          message: error.message || 'Failed to create project',
          statusCode: 400,
        },
      });
    }
  }

  async getProject(req: Request, res: Response): Promise<void> {
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
      const project = await projectService.getProjectById(id, req.user.userId);

      if (!project) {
        res.status(404).json({
          error: {
            message: 'Project not found',
            statusCode: 404,
          },
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: { project },
      });
    } catch (error: any) {
      res.status(500).json({
        error: {
          message: error.message || 'Failed to get project',
          statusCode: 500,
        },
      });
    }
  }

  async listProjects(req: Request, res: Response): Promise<void> {
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

      const query = req.query as any as ListProjectsInput;
      const result = await projectService.listProjects(
        req.user.userId,
        query.page,
        query.limit,
        query.isArchived
      );

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      res.status(500).json({
        error: {
          message: error.message || 'Failed to list projects',
          statusCode: 500,
        },
      });
    }
  }

  async updateProject(req: Request, res: Response): Promise<void> {
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
      const data: UpdateProjectInput = req.body;
      const project = await projectService.updateProject(id, req.user.userId, data);

      res.status(200).json({
        success: true,
        data: { project },
      });
    } catch (error: any) {
      res.status(400).json({
        error: {
          message: error.message || 'Failed to update project',
          statusCode: 400,
        },
      });
    }
  }

  async deleteProject(req: Request, res: Response): Promise<void> {
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
      await projectService.deleteProject(id, req.user.userId);

      res.status(200).json({
        success: true,
        message: 'Project deleted successfully',
      });
    } catch (error: any) {
      res.status(400).json({
        error: {
          message: error.message || 'Failed to delete project',
          statusCode: 400,
        },
      });
    }
  }
}

export const projectController = new ProjectController();
