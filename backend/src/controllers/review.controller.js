import { reviewService } from '../services/review.service.js';
import { ApiResponse } from '../utils/response.js';

export class ReviewController {
  async getByTeaId(req, res, next) {
    try {
      const reviews = await reviewService.getReviewsForTea(req.params.teaId);
      return ApiResponse.success(res, reviews, 'Reviews retrieved');
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const review = await reviewService.addReview(req.user.id, req.body);
      return ApiResponse.created(res, review, 'Review posted successfully');
    } catch (error) {
      next(error);
    }
  }

  async upvote(req, res, next) {
    try {
      const review = await reviewService.upvoteReview(req.params.id);
      return ApiResponse.success(res, review, 'Review upvoted');
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const result = await reviewService.deleteReview(req.params.id, req.user.id, req.user.role);
      return ApiResponse.success(res, result, 'Review deleted');
    } catch (error) {
      next(error);
    }
  }
}

export const reviewController = new ReviewController();
