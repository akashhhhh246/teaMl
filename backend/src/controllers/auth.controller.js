import { authService } from '../services/auth.service.js';
import { ApiResponse } from '../utils/response.js';
import { HTTP_STATUS } from '../constants/index.js';

export class AuthController {
  async register(req, res, next) {
    try {
      const result = await authService.register(req.body);
      return ApiResponse.created(res, result, 'User registered successfully');
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const result = await authService.login(req.body);
      return ApiResponse.success(res, result, 'Login successful');
    } catch (error) {
      next(error);
    }
  }

  async getMe(req, res, next) {
    try {
      const profile = await authService.getMe(req.user.id);
      return ApiResponse.success(res, profile, 'User profile fetched');
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const updated = await authService.updateProfile(req.user.id, req.body);
      return ApiResponse.success(res, updated, 'Profile updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async forgotPassword(req, res, next) {
    try {
      const result = await authService.resetPassword(req.body.email);
      return ApiResponse.success(res, result, result.message);
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
