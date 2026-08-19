import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function main() {
  console.log('[SEED] Starting Indian TeaML database population...');

  // 1. Load Tea Dataset
  const datasetPath = path.join(__dirname, '..', '..', 'ml-service', 'app', 'data', 'teas_dataset.json');
  let teasData = [];
  if (fs.existsSync(datasetPath)) {
    teasData = JSON.parse(fs.readFileSync(datasetPath, 'utf-8'));
  }

  console.log(`[SEED] Found ${teasData.length} Indian teas in dataset.`);

  // 2. Clean old records
  await prisma.review.deleteMany({});
  await prisma.favorite.deleteMany({});
  await prisma.moodLog.deleteMany({});
  await prisma.recommendationHistory.deleteMany({});
  await prisma.tea.deleteMany({});
  await prisma.user.deleteMany({});

  // 3. Create Default Community Connoisseur Profile
  const defaultUser = await prisma.user.create({
    data: {
      id: 'connoisseur-default',
      email: 'sommelier@teaml.in',
      passwordHash: 'none',
      name: 'Rohan Sharma (Master Sommelier)',
      role: 'SOMMELIER',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      bio: 'Darjeeling & Assam terroir specialist with 15+ years exploring Himalayan flushes.',
      preferences: JSON.stringify({ favoriteTypes: ['Darjeeling', 'Assam', 'Kashmir Kahwa'] })
    }
  });

  // 4. Insert 1000+ Indian Teas in batches
  const batchSize = 100;
  for (let i = 0; i < teasData.length; i += batchSize) {
    const batch = teasData.slice(i, i + batchSize).map((t, idx) => ({
      id: t.id,
      name: t.name,
      origin: t.origin,
      teaType: t.teaType,
      ingredients: t.ingredients,
      flavorProfile: JSON.stringify(t.flavorProfile || []),
      bitterness: t.bitterness,
      sweetness: t.sweetness,
      floralNotes: t.floralNotes,
      spiceLevel: t.spiceLevel,
      aroma: t.aroma,
      caffeine: t.caffeine,
      calories: t.calories,
      preparationTime: t.preparationTime,
      steepTemperature: t.steepTemperature,
      waterRatio: t.waterRatio || '2.5g per 200ml',
      healthBenefits: JSON.stringify(t.healthBenefits || []),
      moodTags: JSON.stringify(t.moodTags || []),
      season: t.season || 'All Season',
      price: t.price,
      rating: t.rating,
      reviewsCount: t.reviewsCount,
      description: t.description,
      foodPairings: JSON.stringify(t.foodPairings || []),
      imageUrl: t.imageUrl,
      isFeatured: (i + idx) < 12
    }));

    await prisma.tea.createMany({
      data: batch
    });
  }

  console.log(`[SEED] Seeded ${teasData.length} Indian teas.`);

  // 5. Seed sample reviews and mood entries
  const featuredTeas = await prisma.tea.findMany({ take: 4 });

  await prisma.review.create({
    data: {
      userId: defaultUser.id,
      teaId: featuredTeas[0].id,
      rating: 5,
      title: 'Sublime muscatel notes with lingering floral sweetness!',
      comment: 'This single-estate spring pluck is pure liquid gold. Pairs delightfully with light butter biscuits or enjoyed clear in the afternoon.',
      upvotes: 38
    }
  });

  await prisma.review.create({
    data: {
      userId: defaultUser.id,
      teaId: featuredTeas[1].id,
      rating: 5,
      title: 'The definitive Assam Kadak Chai',
      comment: 'Rich malt and intense mahogany liquor. Perfect with crushed ginger and hot samosas during monsoon rains.',
      upvotes: 42
    }
  });

  console.log('[SEED] Indian database seed complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
