import { Router } from 'express';
import { reviewController } from '../controllers/review.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validateReview } from '../validators/index.js';

const router = Router();

router.get('/tea/:teaId', reviewController.getByTeaId);
router.post('/', requireAuth, validateReview, reviewController.create);
router.post('/:id/upvote', requireAuth, reviewController.upvote);
router.delete('/:id', requireAuth, reviewController.delete);

export default router;
