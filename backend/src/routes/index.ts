import { Router } from 'express';
import healthRouter from './health.js';

const router = Router();

// Mount all routes
router.use('/', healthRouter);

export default router;
