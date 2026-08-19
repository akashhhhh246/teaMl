import { recommendationService } from '../services/recommendation.service.js';
import { ApiResponse } from '../utils/response.js';

export class RecommendationController {
  async predict(req, res, next) {
    try {
      const userId = req.user ? req.user.id : null;
      const result = await recommendationService.generateRecommendations(req.body, userId);
      return ApiResponse.success(res, result, 'Recommendations generated successfully');
    } catch (error) {
      next(error);
    }
  }

  async getUserHistory(req, res, next) {
    try {
      const history = await recommendationService.getUserHistory(req.user.id);
      return ApiResponse.success(res, history, 'Recommendation history retrieved');
    } catch (error) {
      next(error);
    }
  }

  async getRecentGlobal(req, res, next) {
    try {
      const recent = await recommendationService.getRecentGlobal();
      return ApiResponse.success(res, recent, 'Recent recommendations retrieved');
    } catch (error) {
      next(error);
    }
  }

  async retrain(req, res, next) {
    try {
      const result = await recommendationService.retrainModels();
      return ApiResponse.success(res, result, 'ML models retrained successfully');
    } catch (error) {
      next(error);
    }
  }

  async compareModels(req, res, next) {
    try {
      const comparison = await recommendationService.compareModels();
      return ApiResponse.success(res, comparison, 'Model benchmarks retrieved');
    } catch (error) {
      next(error);
    }
  }
}

export const recommendationController = new RecommendationController();
