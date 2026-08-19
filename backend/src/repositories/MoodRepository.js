import { BaseRepository } from './BaseRepository.js';
import { prisma } from '../database/prisma.js';

export class MoodRepository extends BaseRepository {
  constructor() {
    super('moodLog');
  }

  async getLogsByUser(userId, limit = 30) {
    return prisma.moodLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async logMood(data) {
    return prisma.moodLog.create({ data });
  }

  async getMoodAnalytics() {
    const logs = await prisma.moodLog.findMany({
      select: { mood: true, stressLevel: true, energyLevel: true, createdAt: true },
    });
    return logs;
  }
}

export const moodRepository = new MoodRepository();
