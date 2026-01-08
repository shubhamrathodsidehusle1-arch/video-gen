import { Router } from 'express';
import { healthController } from '../controllers/health.controller.js';

const router = Router();

router.get('/status', healthController.getSystemHealth.bind(healthController));
router.get('/providers', healthController.getProviderHealth.bind(healthController));

export default router;
