import { BaseRepository } from './BaseRepository.js';
import { prisma } from '../database/prisma.js';

export class RecommendationRepository extends BaseRepository {
  constructor() {
    super('recommendationHistory');
  }

  async saveRecommendation({ userId, quizInputs, recommendedTeas, activeModel }) {
    const record = await prisma.recommendationHistory.create({
      data: {
        userId: userId || null,
        quizInputs: typeof quizInputs !== 'string' ? JSON.stringify(quizInputs) : quizInputs,
        recommendedTeas: typeof recommendedTeas !== 'string' ? JSON.stringify(recommendedTeas) : recommendedTeas,
        activeModel: activeModel || 'Hybrid AI Ensemble',
      },
    });

    return {
      ...record,
      quizInputs: JSON.parse(record.quizInputs),
      recommendedTeas: JSON.parse(record.recommendedTeas),
    };
  }

  async getUserHistory(userId, limit = 10) {
    const history = await prisma.recommendationHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return history.map(item => ({
      ...item,
      quizInputs: typeof item.quizInputs === 'string' ? JSON.parse(item.quizInputs) : item.quizInputs,
      recommendedTeas: typeof item.recommendedTeas === 'string' ? JSON.parse(item.recommendedTeas) : item.recommendedTeas,
    }));
  }

  async getRecentGlobal(limit = 10) {
    const history = await prisma.recommendationHistory.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        user: { select: { name: true, avatar: true } },
      },
    });

    return history.map(item => ({
      ...item,
      quizInputs: typeof item.quizInputs === 'string' ? JSON.parse(item.quizInputs) : item.quizInputs,
      recommendedTeas: typeof item.recommendedTeas === 'string' ? JSON.parse(item.recommendedTeas) : item.recommendedTeas,
    }));
  }
}

export const recommendationRepository = new RecommendationRepository();
