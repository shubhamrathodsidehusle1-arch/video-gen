import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { connectRedis, disconnectRedis } from '../config/redis.js';

export async function initializeConnections(): Promise<void> {
  await Promise.all([connectDatabase(), connectRedis()]);
}

export async function closeConnections(): Promise<void> {
  await Promise.all([disconnectDatabase(), disconnectRedis()]);
}
