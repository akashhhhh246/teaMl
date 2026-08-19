import { mlClientService } from './mlClient.service.js';
import { recommendationRepository } from '../repositories/RecommendationRepository.js';

export class RecommendationService {
  async generateRecommendations(quizData, userId = null) {
    const mlResponse = await mlClientService.predict(
      quizData,
      quizData.topK || 5,
      quizData.modelOverride || null
    );

    // Persist recommendation record
    if (mlResponse.recommendations && mlResponse.recommendations.length > 0) {
      await recommendationRepository.saveRecommendation({
        userId,
        quizInputs: quizData,
        recommendedTeas: mlResponse.recommendations,
        activeModel: mlResponse.activeModel,
      });
    }

    return mlResponse;
  }

  async getUserHistory(userId) {
    return recommendationRepository.getUserHistory(userId, 20);
  }

  async getRecentGlobal() {
    return recommendationRepository.getRecentGlobal(10);
  }

  async retrainModels() {
    return mlClientService.retrain();
  }

  async compareModels() {
    return mlClientService.getModelsComparison();
  }
}

export const recommendationService = new RecommendationService();
