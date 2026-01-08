import { Router } from 'express';
import { projectController } from '../controllers/project.controller.js';
import { validateBody, validateQuery } from '../middleware/validate.js';
import { authenticate } from '../middleware/auth.js';
import {
  createProjectSchema,
  updateProjectSchema,
  listProjectsSchema,
} from '../validators/project.validator.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.post('/', validateBody(createProjectSchema), projectController.createProject.bind(projectController));
router.get('/', validateQuery(listProjectsSchema), projectController.listProjects.bind(projectController));
router.get('/:id', projectController.getProject.bind(projectController));
router.put('/:id', validateBody(updateProjectSchema), projectController.updateProject.bind(projectController));
router.delete('/:id', projectController.deleteProject.bind(projectController));

export default router;
