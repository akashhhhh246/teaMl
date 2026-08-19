import { Router } from 'express';
import { teaController } from '../controllers/tea.controller.js';
import { requireAuth, requireAdmin, optionalAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', teaController.getTeas);
router.get('/featured', teaController.getFeatured);
router.get('/:id', optionalAuth, teaController.getTeaById);
router.post('/', requireAuth, requireAdmin, teaController.createTea);
router.put('/:id', requireAuth, requireAdmin, teaController.updateTea);
router.delete('/:id', requireAuth, requireAdmin, teaController.deleteTea);

export default router;
