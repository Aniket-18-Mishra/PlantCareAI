import express from 'express';

const router = express.Router();

// GET /api/health — simple health check endpoint
router.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'OK',
      timestamp: new Date().toISOString(),
      service: 'PlantCare AI API',
      version: '1.0.0',
    },
  });
});

export default router;
