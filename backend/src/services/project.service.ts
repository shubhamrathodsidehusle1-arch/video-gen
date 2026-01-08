import { getPrismaClient } from '../config/prisma.js';
import { logger } from '../utils/logger.js';
import type { Project, Prisma } from '../generated/prisma/index.js';
import type { CreateProjectInput, UpdateProjectInput } from '../validators/project.validator.js';

export class ProjectService {
  private prisma = getPrismaClient();

  async createProject(userId: string, data: CreateProjectInput): Promise<Project> {
    const project = await this.prisma.project.create({
      data: {
        userId,
        name: data.name,
        description: data.description,
        color: data.color,
      },
    });

    logger.info(`Project created: ${project.id} for user: ${userId}`);

    return project;
  }

  async getProjectById(projectId: string, userId: string): Promise<Project | null> {
    return this.prisma.project.findFirst({
      where: {
        id: projectId,
        userId,
      },
      include: {
        jobs: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  async listProjects(
    userId: string,
    page: number = 1,
    limit: number = 10,
    isArchived?: boolean
  ): Promise<{ projects: Project[]; total: number; page: number; totalPages: number }> {
    const skip = (page - 1) * limit;

    const where: Prisma.ProjectWhereInput = {
      userId,
      ...(isArchived !== undefined && { isArchived }),
    };

    const [projects, total] = await Promise.all([
      this.prisma.project.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { jobs: true },
          },
        },
      }),
      this.prisma.project.count({ where }),
    ]);

    return {
      projects,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async updateProject(projectId: string, userId: string, data: UpdateProjectInput): Promise<Project> {
    // Verify project belongs to user
    const project = await this.getProjectById(projectId, userId);
    if (!project) {
      throw new Error('Project not found');
    }

    const updated = await this.prisma.project.update({
      where: { id: projectId },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.color !== undefined && { color: data.color }),
        ...(data.isArchived !== undefined && { isArchived: data.isArchived }),
      },
    });

    logger.info(`Project updated: ${projectId}`);

    return updated;
  }

  async deleteProject(projectId: string, userId: string): Promise<void> {
    // Verify project belongs to user
    const project = await this.getProjectById(projectId, userId);
    if (!project) {
      throw new Error('Project not found');
    }

    await this.prisma.project.delete({
      where: { id: projectId },
    });

    logger.info(`Project deleted: ${projectId}`);
  }
}

export const projectService = new ProjectService();
