import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validateAuthRegister, validateAuthLogin } from '../validators/index.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/register', authLimiter, validateAuthRegister, authController.register);
router.post('/login', authLimiter, validateAuthLogin, authController.login);
router.get('/me', requireAuth, authController.getMe);
router.put('/profile', requireAuth, authController.updateProfile);
router.post('/forgot-password', authLimiter, authController.forgotPassword);

export default router;
