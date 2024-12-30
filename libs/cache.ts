import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.KV_REST_API_URL || '',
  token: process.env.KV_REST_API_TOKEN || '',
})

// 缓存时间（24小时）
const CACHE_TTL = 60 * 60 * 24;

// 缓存键前缀
const CACHE_PREFIX = 'blog:';

export async function getCache<T>(key: string): Promise<T | null> {
  if (process.env.VERCEL) {
    try {
      const data = await redis.get(CACHE_PREFIX + key);
      return data as T;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }
  // 本地开发环境不使用缓存
  return null;
}

export async function setCache<T>(key: string, data: T): Promise<void> {
  if (process.env.VERCEL) {
    try {
      await redis.set(CACHE_PREFIX + key, data, {
        ex: CACHE_TTL
      });
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }
}

export async function deleteCache(key: string): Promise<void> {
  if (process.env.VERCEL) {
    try {
      await redis.del(CACHE_PREFIX + key);
    } catch (error) {
      console.error('Cache delete error:', error);
    }
  }
}

export async function clearCache(): Promise<void> {
  if (process.env.VERCEL) {
    try {
      const keys = await redis.keys(CACHE_PREFIX + '*');
      if (keys.length > 0) {
        await Promise.all(keys.map(key => redis.del(key)));
      }
    } catch (error) {
      console.error('Cache clear error:', error);
    }
  }
} 