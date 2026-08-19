import { favoriteService, moodService } from '../services/mood.service.js';
import { chatService, adminService, analyticsService } from '../services/analytics.service.js';
import { userRepository } from '../repositories/UserRepository.js';
import { ApiResponse } from '../utils/response.js';

export class FavoriteController {
  async getMyFavorites(req, res, next) {
    try {
      const favorites = await favoriteService.getFavorites(req.user.id);
      return ApiResponse.success(res, favorites, 'Favorites retrieved');
    } catch (error) {
      next(error);
    }
  }

  async addFavorite(req, res, next) {
    try {
      const fav = await favoriteService.addFavorite(req.user.id, req.body.teaId);
      return ApiResponse.created(res, fav, 'Added to favorites');
    } catch (error) {
      next(error);
    }
  }

  async removeFavorite(req, res, next) {
    try {
      await favoriteService.removeFavorite(req.user.id, req.params.teaId);
      return ApiResponse.success(res, { teaId: req.params.teaId, removed: true }, 'Removed from favorites');
    } catch (error) {
      next(error);
    }
  }
}

export const favoriteController = new FavoriteController();

export class MoodController {
  async logMood(req, res, next) {
    try {
      const log = await moodService.logMood(req.user.id, req.body);
      return ApiResponse.created(res, log, 'Mood entry logged');
    } catch (error) {
      next(error);
    }
  }

  async getMoodHistory(req, res, next) {
    try {
      const history = await moodService.getMoodHistory(req.user.id);
      return ApiResponse.success(res, history, 'Mood history retrieved');
    } catch (error) {
      next(error);
    }
  }
}

export const moodController = new MoodController();

export class ChatController {
  async sendMessage(req, res, next) {
    try {
      const reply = await chatService.processMessage(req.body.message, req.body.context);
      return ApiResponse.success(res, reply, 'Assistant response generated');
    } catch (error) {
      next(error);
    }
  }
}

export const chatController = new ChatController();

export class AnalyticsController {
  async getDashboard(req, res, next) {
    try {
      const data = await analyticsService.getDashboardAnalytics();
      return ApiResponse.success(res, data, 'Analytics data retrieved');
    } catch (error) {
      next(error);
    }
  }
}

export const analyticsController = new AnalyticsController();

export class AdminController {
  async getUsers(req, res, next) {
    try {
      const page = parseInt(req.query.page || '1', 10);
      const limit = parseInt(req.query.limit || '20', 10);
      const users = await userRepository.getAllUsers(page, limit);
      return ApiResponse.success(res, users.users, 'Users retrieved', 200, users.pagination);
    } catch (error) {
      next(error);
    }
  }

  async updateUserRole(req, res, next) {
    try {
      const updated = await adminService.updateUserRole(req.params.id, req.body.role);
      return ApiResponse.success(res, updated, 'User role updated');
    } catch (error) {
      next(error);
    }
  }

  async exportData(req, res, next) {
    try {
      const teas = await adminService.exportAllTeas();
      return ApiResponse.success(res, teas, 'Export data ready');
    } catch (error) {
      next(error);
    }
  }
}

export const adminController = new AdminController();
