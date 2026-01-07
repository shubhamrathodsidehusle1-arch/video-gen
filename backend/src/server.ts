import { createApp } from './app.js';
import { env } from './config/env.js';
import { connectDatabase } from './config/database.js';
import { connectRedis } from './config/redis.js';
import { logger } from './utils/logger.js';

async function startServer(): Promise<void> {
  try {
    // Connect to databases
    await connectDatabase();
    await connectRedis();

    // Create and start Express app
    const app = createApp();
    const port = env.PORT;

    const server = app.listen(port, () => {
      logger.info(`Server running on port ${port}`);
      logger.info(`Environment: ${env.NODE_ENV}`);
      logger.info(`Health check: http://localhost:${port}/health`);
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      logger.info('SIGINT signal received: closing HTTP server');
      server.close(async () => {
        logger.info('HTTP server closed');
        process.exit(0);
      });
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();