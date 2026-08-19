import { moodRepository } from '../repositories/MoodRepository.js';
import { favoriteRepository } from '../repositories/FavoriteRepository.js';
import { teaRepository } from '../repositories/TeaRepository.js';

export class MoodService {
  async logMood(userId, data) {
    // Find a quick matching tea for this mood
    const matchingTeas = await teaRepository.searchAndFilter({ mood: data.mood, limit: 1 });
    const recommendedTeaId = matchingTeas.teas.length > 0 ? matchingTeas.teas[0].id : null;

    return moodRepository.logMood({
      userId,
      mood: data.mood,
      stressLevel: parseInt(data.stressLevel || 5, 10),
      energyLevel: parseInt(data.energyLevel || 5, 10),
      note: data.note || null,
      recommendedTeaId,
    });
  }

  async getMoodHistory(userId) {
    return moodRepository.getLogsByUser(userId, 30);
  }
}

export const moodService = new MoodService();

export class FavoriteService {
  async getFavorites(userId) {
    return favoriteRepository.getFavoritesByUser(userId);
  }

  async addFavorite(userId, teaId) {
    return favoriteRepository.addFavorite(userId, teaId);
  }

  async removeFavorite(userId, teaId) {
    return favoriteRepository.removeFavorite(userId, teaId);
  }
}

export const favoriteService = new FavoriteService();
