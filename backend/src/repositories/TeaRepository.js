import { BaseRepository } from './BaseRepository.js';
import { prisma } from '../database/prisma.js';

export class TeaRepository extends BaseRepository {
  constructor() {
    super('tea');
  }

  _formatTea(tea) {
    if (!tea) return null;
    return {
      ...tea,
      flavorProfile: typeof tea.flavorProfile === 'string' ? JSON.parse(tea.flavorProfile) : tea.flavorProfile,
      healthBenefits: typeof tea.healthBenefits === 'string' ? JSON.parse(tea.healthBenefits) : tea.healthBenefits,
      moodTags: typeof tea.moodTags === 'string' ? JSON.parse(tea.moodTags) : tea.moodTags,
      foodPairings: typeof tea.foodPairings === 'string' ? JSON.parse(tea.foodPairings) : tea.foodPairings,
    };
  }

  async findById(id) {
    const tea = await prisma.tea.findUnique({
      where: { id },
      include: {
        reviews: {
          include: {
            user: { select: { id: true, name: true, avatar: true, role: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    return this._formatTea(tea);
  }

  async searchAndFilter(filters = {}) {
    const {
      search = '',
      teaType,
      origin,
      mood,
      healthGoal,
      caffeineMin,
      caffeineMax,
      priceMin,
      priceMax,
      season,
      sortBy = 'rating',
      sortOrder = 'desc',
      page = 1,
      limit = 20,
    } = filters;

    const where = {};

    // Text search in name, description, origin, ingredients
    if (search && search.trim() !== '') {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { origin: { contains: search } },
        { ingredients: { contains: search } },
        { teaType: { contains: search } },
      ];
    }

    if (teaType && teaType !== 'All') {
      where.teaType = teaType;
    }

    if (origin && origin !== 'All') {
      where.origin = { contains: origin };
    }

    if (season && season !== 'All') {
      where.season = season;
    }

    if (mood && mood !== 'All') {
      where.moodTags = { contains: mood };
    }

    if (healthGoal && healthGoal !== 'All') {
      where.healthBenefits = { contains: healthGoal };
    }

    if (caffeineMin !== undefined || caffeineMax !== undefined) {
      where.caffeine = {};
      if (caffeineMin !== undefined) where.caffeine.gte = parseInt(caffeineMin, 10);
      if (caffeineMax !== undefined) where.caffeine.lte = parseInt(caffeineMax, 10);
    }

    if (priceMin !== undefined || priceMax !== undefined) {
      where.price = {};
      if (priceMin !== undefined) where.price.gte = parseFloat(priceMin);
      if (priceMax !== undefined) where.price.lte = parseFloat(priceMax);
    }

    // Determine sorting
    let orderBy = { rating: 'desc' };
    if (sortBy === 'price') {
      orderBy = { price: sortOrder === 'asc' ? 'asc' : 'desc' };
    } else if (sortBy === 'reviews') {
      orderBy = { reviewsCount: 'desc' };
    } else if (sortBy === 'name') {
      orderBy = { name: sortOrder === 'desc' ? 'desc' : 'asc' };
    } else if (sortBy === 'newest') {
      orderBy = { createdAt: 'desc' };
    }

    const parsedPage = parseInt(page, 10) || 1;
    const parsedLimit = parseInt(limit, 10) || 20;
    const skip = (parsedPage - 1) * parsedLimit;
    const [total, teas] = await Promise.all([
      prisma.tea.count({ where }),
      prisma.tea.findMany({
        where,
        orderBy,
        skip,
        take: parsedLimit,
      }),
    ]);

    return {
      teas: teas.map(t => this._formatTea(t)),
      pagination: {
        total,
        page: parsedPage,
        limit: parsedLimit,
        totalPages: Math.ceil(total / parsedLimit),
      },
    };
  }

  async getFeatured(limit = 8) {
    const teas = await prisma.tea.findMany({
      where: { isFeatured: true },
      take: limit,
      orderBy: { rating: 'desc' },
    });
    return teas.map(t => this._formatTea(t));
  }

  async getRelated(teaId, teaType, limit = 4) {
    const teas = await prisma.tea.findMany({
      where: {
        id: { not: teaId },
        teaType,
      },
      take: limit,
      orderBy: { rating: 'desc' },
    });
    return teas.map(t => this._formatTea(t));
  }

  async createTea(data) {
    const formattedData = {
      ...data,
      flavorProfile: typeof data.flavorProfile !== 'string' ? JSON.stringify(data.flavorProfile || []) : data.flavorProfile,
      healthBenefits: typeof data.healthBenefits !== 'string' ? JSON.stringify(data.healthBenefits || []) : data.healthBenefits,
      moodTags: typeof data.moodTags !== 'string' ? JSON.stringify(data.moodTags || []) : data.moodTags,
      foodPairings: typeof data.foodPairings !== 'string' ? JSON.stringify(data.foodPairings || []) : data.foodPairings,
    };
    const tea = await prisma.tea.create({ data: formattedData });
    return this._formatTea(tea);
  }

  async updateTea(id, data) {
    const formattedData = { ...data };
    if (data.flavorProfile && typeof data.flavorProfile !== 'string') {
      formattedData.flavorProfile = JSON.stringify(data.flavorProfile);
    }
    if (data.healthBenefits && typeof data.healthBenefits !== 'string') {
      formattedData.healthBenefits = JSON.stringify(data.healthBenefits);
    }
    if (data.moodTags && typeof data.moodTags !== 'string') {
      formattedData.moodTags = JSON.stringify(data.moodTags);
    }
    if (data.foodPairings && typeof data.foodPairings !== 'string') {
      formattedData.foodPairings = JSON.stringify(data.foodPairings);
    }
    const tea = await prisma.tea.update({ where: { id }, data: formattedData });
    return this._formatTea(tea);
  }
}

export const teaRepository = new TeaRepository();
