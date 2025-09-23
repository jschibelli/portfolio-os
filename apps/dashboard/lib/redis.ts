import { Redis } from '@upstash/redis';

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export { redis };

// Cache utilities
export class CacheService {
  private static instance: CacheService;
  private redis: Redis;

  private constructor() {
    this.redis = redis;
  }

  public static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  // Cache with TTL
  async set(key: string, value: any, ttlSeconds: number = 3600): Promise<void> {
    try {
      await this.redis.setex(key, ttlSeconds, JSON.stringify(value));
    } catch (error) {
      console.error('Redis set error:', error);
    }
  }

  // Get cached value
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.redis.get(key);
      return value ? JSON.parse(value as string) : null;
    } catch (error) {
      console.error('Redis get error:', error);
      return null;
    }
  }

  // Delete cache
  async del(key: string): Promise<void> {
    try {
      await this.redis.del(key);
    } catch (error) {
      console.error('Redis delete error:', error);
    }
  }

  // Cache analytics data
  async cacheAnalytics(key: string, data: any, ttlSeconds: number = 300): Promise<void> {
    await this.set(`analytics:${key}`, data, ttlSeconds);
  }

  // Get cached analytics
  async getCachedAnalytics<T>(key: string): Promise<T | null> {
    return await this.get<T>(`analytics:${key}`);
  }

  // Cache user session data
  async cacheUserSession(userId: string, sessionData: any, ttlSeconds: number = 86400): Promise<void> {
    await this.set(`session:${userId}`, sessionData, ttlSeconds);
  }

  // Get cached user session
  async getCachedUserSession<T>(userId: string): Promise<T | null> {
    return await this.get<T>(`session:${userId}`);
  }

  // Cache API responses
  async cacheApiResponse(endpoint: string, params: any, data: any, ttlSeconds: number = 600): Promise<void> {
    const key = `api:${endpoint}:${JSON.stringify(params)}`;
    await this.set(key, data, ttlSeconds);
  }

  // Get cached API response
  async getCachedApiResponse<T>(endpoint: string, params: any): Promise<T | null> {
    const key = `api:${endpoint}:${JSON.stringify(params)}`;
    return await this.get<T>(key);
  }
}

export const cacheService = CacheService.getInstance();
