import { Router } from 'express';

const router = Router();

// Health check endpoints
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

router.get('/api/v1/health', (req, res) => {
  res.json({
    service: 'vibeclip-api',
    status: 'running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

export default router;
