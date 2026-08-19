import { Router } from 'express';
import { recommendationController } from '../controllers/recommendation.controller.js';
import { optionalAuth, requireAuth, requireAdmin } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/predict', optionalAuth, recommendationController.predict);
router.get('/history', requireAuth, recommendationController.getUserHistory);
router.get('/recent', recommendationController.getRecentGlobal);
router.post('/retrain', requireAuth, requireAdmin, recommendationController.retrain);
router.get('/models/compare', recommendationController.compareModels);

export default router;
