import { BaseRepository } from './BaseRepository.js';
import { prisma } from '../database/prisma.js';

export class FavoriteRepository extends BaseRepository {
  constructor() {
    super('favorite');
  }

  async getFavoritesByUser(userId) {
    const favorites = await prisma.favorite.findMany({
      where: { userId },
      include: {
        tea: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return favorites.map(f => ({
      ...f,
      tea: {
        ...f.tea,
        flavorProfile: typeof f.tea.flavorProfile === 'string' ? JSON.parse(f.tea.flavorProfile) : f.tea.flavorProfile,
        healthBenefits: typeof f.tea.healthBenefits === 'string' ? JSON.parse(f.tea.healthBenefits) : f.tea.healthBenefits,
        moodTags: typeof f.tea.moodTags === 'string' ? JSON.parse(f.tea.moodTags) : f.tea.moodTags,
        foodPairings: typeof f.tea.foodPairings === 'string' ? JSON.parse(f.tea.foodPairings) : f.tea.foodPairings,
      },
    }));
  }

  async isFavorited(userId, teaId) {
    const fav = await prisma.favorite.findUnique({
      where: {
        userId_teaId: { userId, teaId },
      },
    });
    return !!fav;
  }

  async addFavorite(userId, teaId) {
    return prisma.favorite.upsert({
      where: {
        userId_teaId: { userId, teaId },
      },
      create: { userId, teaId },
      update: {},
    });
  }

  async removeFavorite(userId, teaId) {
    return prisma.favorite.delete({
      where: {
        userId_teaId: { userId, teaId },
      },
    });
  }
}

export const favoriteRepository = new FavoriteRepository();
