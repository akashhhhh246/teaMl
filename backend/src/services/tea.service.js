import { teaRepository } from '../repositories/TeaRepository.js';
import { favoriteRepository } from '../repositories/FavoriteRepository.js';
import { NotFoundError } from '../errors/AppError.js';

export class TeaService {
  async getTeas(filters) {
    return teaRepository.searchAndFilter(filters);
  }

  async getTeaById(id, currentUserId = null) {
    const tea = await teaRepository.findById(id);
    if (!tea) {
      throw new NotFoundError(`Tea with id '${id}' not found.`);
    }

    let isFavorited = false;
    if (currentUserId) {
      isFavorited = await favoriteRepository.isFavorited(currentUserId, id);
    }

    const related = await teaRepository.getRelated(id, tea.teaType, 4);

    return {
      ...tea,
      isFavorited,
      relatedTeas: related,
    };
  }

  async getFeaturedTeas() {
    return teaRepository.getFeatured(12);
  }

  async createTea(teaData) {
    const id = teaData.id || `TEA-${Date.now().toString().slice(-4)}`;
    return teaRepository.createTea({ ...teaData, id });
  }

  async updateTea(id, teaData) {
    const existing = await teaRepository.findById(id);
    if (!existing) {
      throw new NotFoundError(`Tea with id '${id}' not found.`);
    }
    return teaRepository.updateTea(id, teaData);
  }

  async deleteTea(id) {
    const existing = await teaRepository.findById(id);
    if (!existing) {
      throw new NotFoundError(`Tea with id '${id}' not found.`);
    }
    await teaRepository.delete(id);
    return { id, deleted: true };
  }
}

export const teaService = new TeaService();
