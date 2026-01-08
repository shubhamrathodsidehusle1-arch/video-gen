import { Router } from 'express';
import { jobController } from '../controllers/job.controller.js';
import { validateBody, validateQuery } from '../middleware/validate.js';
import { authenticate } from '../middleware/auth.js';
import { createJobSchema, updateJobSchema, listJobsSchema } from '../validators/job.validator.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.post('/', validateBody(createJobSchema), jobController.createJob.bind(jobController));
router.get('/', validateQuery(listJobsSchema), jobController.listJobs.bind(jobController));
router.get('/stats', jobController.getJobStats.bind(jobController));
router.get('/:id', jobController.getJob.bind(jobController));
router.get('/:id/status', jobController.getJobStatus.bind(jobController));
router.put('/:id', validateBody(updateJobSchema), jobController.updateJob.bind(jobController));
router.delete('/:id', jobController.deleteJob.bind(jobController));
router.post('/:id/cancel', jobController.cancelJob.bind(jobController));

export default router;
