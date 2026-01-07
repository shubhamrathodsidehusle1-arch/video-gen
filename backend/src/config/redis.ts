import { createClient, RedisClientType } from 'redis';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

let redisClient: RedisClientType;

export async function connectRedis(): Promise<RedisClientType> {
  try {
    redisClient = createClient({
      url: env.REDIS_URL,
      socket: {
        reconnectStrategy: (retries) => Math.min(retries * 50, 500),
      },
    });

    redisClient.on('error', (error) => {
      logger.error('Redis client error:', error);
    });

    redisClient.on('connect', () => {
      logger.info('Redis connected successfully');
    });

    await redisClient.connect();
    return redisClient;
  } catch (error) {
    logger.error('Failed to connect to Redis:', error);
    process.exit(1);
  }
}

export async function disconnectRedis(): Promise<void> {
  if (redisClient) {
    await redisClient.quit();
    logger.info('Redis disconnected');
  }
}

export function getRedisClient(): RedisClientType {
  if (!redisClient) {
    throw new Error('Redis client not initialized');
  }
  return redisClient;
}
