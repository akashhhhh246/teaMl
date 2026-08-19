import { reviewRepository } from '../repositories/ReviewRepository.js';
import { teaRepository } from '../repositories/TeaRepository.js';
import { NotFoundError, ForbiddenError } from '../errors/AppError.js';

export class ReviewService {
  async getReviewsForTea(teaId) {
    const tea = await teaRepository.findById(teaId);
    if (!tea) {
      throw new NotFoundError(`Tea with id '${teaId}' not found.`);
    }
    return reviewRepository.findByTeaId(teaId);
  }

  async addReview(userId, reviewData) {
    const tea = await teaRepository.findById(reviewData.teaId);
    if (!tea) {
      throw new NotFoundError(`Tea with id '${reviewData.teaId}' not found.`);
    }

    return reviewRepository.createReview({
      userId,
      teaId: reviewData.teaId,
      rating: parseInt(reviewData.rating, 10),
      title: reviewData.title || null,
      comment: reviewData.comment,
      imageUrl: reviewData.imageUrl || null,
    });
  }

  async upvoteReview(reviewId) {
    const review = await reviewRepository.findById(reviewId);
    if (!review) {
      throw new NotFoundError('Review not found.');
    }
    return reviewRepository.upvote(reviewId);
  }

  async deleteReview(reviewId, currentUserId, userRole) {
    const review = await reviewRepository.findById(reviewId);
    if (!review) {
      throw new NotFoundError('Review not found.');
    }
    if (review.userId !== currentUserId && userRole !== 'ADMIN') {
      throw new ForbiddenError('You can only delete your own reviews.');
    }

    await reviewRepository.delete(reviewId);
    await reviewRepository.updateTeaRatingAggregates(review.teaId);
    return { id: reviewId, deleted: true };
  }
}

export const reviewService = new ReviewService();
