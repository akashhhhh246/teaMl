import { Router } from 'express';
import authRoutes from './auth.routes.js';
import teaRoutes from './tea.routes.js';
import recommendationRoutes from './recommendation.routes.js';
import reviewRoutes from './review.routes.js';
import { favoriteRouter, moodRouter, chatRouter, analyticsRouter, adminRouter } from './other.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/teas', teaRoutes);
router.use('/recommendations', recommendationRoutes);
router.use('/reviews', reviewRoutes);
router.use('/favorites', favoriteRouter);
router.use('/moods', moodRouter);
router.use('/chat', chatRouter);
router.use('/analytics', analyticsRouter);
router.use('/admin', adminRouter);

router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'TeaML Backend API Gateway',
    version: '1.0.0'
  });
});

export default router;
