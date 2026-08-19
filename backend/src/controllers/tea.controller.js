import { teaService } from '../services/tea.service.js';
import { ApiResponse } from '../utils/response.js';

export class TeaController {
  async getTeas(req, res, next) {
    try {
      const result = await teaService.getTeas(req.query);
      return ApiResponse.success(res, result.teas, 'Teas retrieved successfully', 200, result.pagination);
    } catch (error) {
      next(error);
    }
  }

  async getFeatured(req, res, next) {
    try {
      const teas = await teaService.getFeaturedTeas();
      return ApiResponse.success(res, teas, 'Featured teas retrieved');
    } catch (error) {
      next(error);
    }
  }

  async getTeaById(req, res, next) {
    try {
      const currentUserId = req.user ? req.user.id : null;
      const tea = await teaService.getTeaById(req.params.id, currentUserId);
      return ApiResponse.success(res, tea, 'Tea details retrieved');
    } catch (error) {
      next(error);
    }
  }

  async createTea(req, res, next) {
    try {
      const newTea = await teaService.createTea(req.body);
      return ApiResponse.created(res, newTea, 'Tea blend created successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateTea(req, res, next) {
    try {
      const updatedTea = await teaService.updateTea(req.params.id, req.body);
      return ApiResponse.success(res, updatedTea, 'Tea blend updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async deleteTea(req, res, next) {
    try {
      const result = await teaService.deleteTea(req.params.id);
      return ApiResponse.success(res, result, 'Tea blend deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const teaController = new TeaController();
