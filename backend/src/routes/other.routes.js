import { Router } from 'express';
import { favoriteController, moodController, chatController, analyticsController, adminController } from '../controllers/other.controllers.js';
import { requireAuth, requireAdmin } from '../middleware/auth.middleware.js';
import { validateMoodLog } from '../validators/index.js';

// Favorite Routes
export const favoriteRouter = Router();
favoriteRouter.get('/', requireAuth, favoriteController.getMyFavorites);
favoriteRouter.post('/', requireAuth, favoriteController.addFavorite);
favoriteRouter.delete('/:teaId', requireAuth, favoriteController.removeFavorite);

// Mood Routes
export const moodRouter = Router();
moodRouter.post('/', requireAuth, validateMoodLog, moodController.logMood);
moodRouter.get('/history', requireAuth, moodController.getMoodHistory);

// Chat Routes
export const chatRouter = Router();
chatRouter.post('/', chatController.sendMessage);

// Analytics Routes
export const analyticsRouter = Router();
analyticsRouter.get('/dashboard', analyticsController.getDashboard);

// Admin Routes
export const adminRouter = Router();
adminRouter.get('/users', requireAuth, requireAdmin, adminController.getUsers);
adminRouter.put('/users/:id/role', requireAuth, requireAdmin, adminController.updateUserRole);
adminRouter.get('/export', requireAuth, requireAdmin, adminController.exportData);
