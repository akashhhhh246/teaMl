import { BaseRepository } from './BaseRepository.js';
import { prisma } from '../database/prisma.js';

export class ReviewRepository extends BaseRepository {
  constructor() {
    super('review');
  }

  async findByTeaId(teaId) {
    return prisma.review.findMany({
      where: { teaId },
      include: {
        user: {
          select: { id: true, name: true, avatar: true, role: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createReview(data) {
    const review = await prisma.review.create({
      data,
      include: {
        user: { select: { id: true, name: true, avatar: true, role: true } },
      },
    });

    // Recalculate tea average rating and review count
    await this.updateTeaRatingAggregates(data.teaId);
    return review;
  }

  async updateTeaRatingAggregates(teaId) {
    const reviews = await prisma.review.findMany({
      where: { teaId },
      select: { rating: true },
    });

    if (reviews.length === 0) return;

    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    const avg = Number((sum / reviews.length).toFixed(2));

    await prisma.tea.update({
      where: { id: teaId },
      data: {
        rating: avg,
        reviewsCount: reviews.length,
      },
    });
  }

  async upvote(reviewId) {
    return prisma.review.update({
      where: { id: reviewId },
      data: {
        upvotes: { increment: 1 },
      },
    });
  }
}

export const reviewRepository = new ReviewRepository();
