import { app } from './app.js';
import { config } from './config/index.js';
import { connectDB, prisma } from './database/prisma.js';

async function startServer() {
  await connectDB();

  const server = app.listen(config.port, () => {
    console.log(`====================================================`);
    console.log(`🍵 TeaML Backend API Server running on port ${config.port}`);
    console.log(`📡 Health: http://localhost:${config.port}/api/health`);
    console.log(`🌐 Environment: ${config.env}`);
    console.log(`====================================================`);
  });

  // Graceful shutdown handling
  const shutdown = async (signal) => {
    console.log(`\n[SERVER] Received ${signal}. Shutting down gracefully...`);
    server.close(async () => {
      await prisma.$disconnect();
      console.log('[SERVER] Database connection closed. Process terminated.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

startServer();
