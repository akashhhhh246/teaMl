import { BaseRepository } from './BaseRepository.js';
import { prisma } from '../database/prisma.js';

export class UserRepository extends BaseRepository {
  constructor() {
    super('user');
  }

  async findByEmail(email) {
    return prisma.user.findUnique({ where: { email } });
  }

  async findUserProfile(id) {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        favorites: {
          include: {
            tea: true,
          },
          orderBy: { createdAt: 'desc' },
        },
        reviews: {
          include: {
            tea: { select: { id: true, name: true, imageUrl: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
        recommendations: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
        moodLogs: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!user) return null;

    // Sanitize passwordHash and format JSON preferences
    const { passwordHash, ...userWithoutPassword } = user;
    return {
      ...userWithoutPassword,
      preferences: user.preferences ? (typeof user.preferences === 'string' ? JSON.parse(user.preferences) : user.preferences) : null,
      favorites: user.favorites.map(f => ({
        ...f,
        tea: {
          ...f.tea,
          flavorProfile: typeof f.tea.flavorProfile === 'string' ? JSON.parse(f.tea.flavorProfile) : f.tea.flavorProfile,
          moodTags: typeof f.tea.moodTags === 'string' ? JSON.parse(f.tea.moodTags) : f.tea.moodTags,
          healthBenefits: typeof f.tea.healthBenefits === 'string' ? JSON.parse(f.tea.healthBenefits) : f.tea.healthBenefits,
        }
      })),
      recommendations: user.recommendations.map(r => ({
        ...r,
        quizInputs: typeof r.quizInputs === 'string' ? JSON.parse(r.quizInputs) : r.quizInputs,
        recommendedTeas: typeof r.recommendedTeas === 'string' ? JSON.parse(r.recommendedTeas) : r.recommendedTeas,
      })),
    };
  }

  async getAllUsers(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [total, users] = await Promise.all([
      prisma.user.count(),
      prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          avatar: true,
          createdAt: true,
          _count: {
            select: {
              reviews: true,
              favorites: true,
              recommendations: true,
            },
          },
        },
      }),
    ]);

    return {
      users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

export const userRepository = new UserRepository();
