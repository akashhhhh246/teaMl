import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
});

export async function connectDB() {
  try {
    await prisma.$connect();
    console.log('[DATABASE] Connected to SQLite/PostgreSQL via Prisma.');
  } catch (error) {
    console.error('[DATABASE ERROR] Failed to connect to database:', error);
    process.exit(1);
  }
}
