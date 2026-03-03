/**
 * Cache Service
 * 缓存服务
 */

interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export class CacheService {
  private cache: Map<string, CacheItem<any>> = new Map();
  private defaultTTL: number = 5 * 60 * 1000; // 5分钟

  constructor(defaultTTL?: number) {
    if (defaultTTL) {
      this.defaultTTL = defaultTTL;
    }

    // 定期清理过期缓存
    setInterval(() => this.cleanup(), 60 * 1000);
  }

  /**
   * 设置缓存
   */
  set<T>(key: string, data: T, ttl?: number): void {
    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL,
    };

    this.cache.set(key, item);

    // 同时设置到 localStorage
    try {
      localStorage.setItem(`cache_${key}`, JSON.stringify(item));
    } catch (error) {
      console.error('Failed to save cache to localStorage:', error);
    }
  }

  /**
   * 获取缓存
   */
  get<T>(key: string): T | null {
    // 先从内存缓存获取
    const memoryItem = this.cache.get(key);

    if (memoryItem) {
      const now = Date.now();
      const age = now - memoryItem.timestamp;

      if (age < memoryItem.ttl) {
        return memoryItem.data as T;
      } else {
        // 过期，删除
        this.cache.delete(key);
      }
    }

    // 从 localStorage 获取
    try {
      const stored = localStorage.getItem(`cache_${key}`);

      if (stored) {
        const item: CacheItem<T> = JSON.parse(stored);
        const now = Date.now();
        const age = now - item.timestamp;

        if (age < item.ttl) {
          // 恢复到内存缓存
          this.cache.set(key, item);
          return item.data;
        } else {
          // 过期，删除
          localStorage.removeItem(`cache_${key}`);
        }
      }
    } catch (error) {
      console.error('Failed to read cache from localStorage:', error);
    }

    return null;
  }

  /**
   * 删除缓存
   */
  delete(key: string): void {
    this.cache.delete(key);

    try {
      localStorage.removeItem(`cache_${key}`);
    } catch (error) {
      console.error('Failed to delete cache from localStorage:', error);
    }
  }

  /**
   * 清空所有缓存
   */
  clear(): void {
    this.cache.clear();

    try {
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith('cache_')) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Failed to clear cache from localStorage:', error);
    }
  }

  /**
   * 检查缓存是否存在且有效
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * 清理过期缓存
   */
  private cleanup(): void {
    const now = Date.now();

    // 清理内存缓存
    for (const [key, item] of this.cache.entries()) {
      const age = now - item.timestamp;
      if (age >= item.ttl) {
        this.cache.delete(key);
      }
    }

    // 清理 localStorage 缓存
    try {
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith('cache_')) {
          const stored = localStorage.getItem(key);
          if (stored) {
            const item: CacheItem<any> = JSON.parse(stored);
            const age = now - item.timestamp;
            if (age >= item.ttl) {
              localStorage.removeItem(key);
            }
          }
        }
      });
    } catch (error) {
      console.error('Failed to cleanup cache:', error);
    }
  }

  /**
   * 获取缓存统计信息
   */
  getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }

  /**
   * 预热缓存
   */
  async warmup<T>(
    keys: string[],
    fetcher: (key: string) => Promise<T>,
    ttl?: number
  ): Promise<void> {
    await Promise.all(
      keys.map(async (key) => {
        if (!this.has(key)) {
          try {
            const data = await fetcher(key);
            this.set(key, data, ttl);
          } catch (error) {
            console.error(`Failed to warmup cache for key "${key}":`, error);
          }
        }
      })
    );
  }
}

// 创建单例实例
export const cacheService = new CacheService();

export default cacheService;
