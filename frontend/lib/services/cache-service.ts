/**
 * 缓存服务
 * 提供内存缓存和 localStorage 缓存功能
 */

interface CacheItem<T = any> {
  data: T;
  timestamp: number;
  ttl?: number;
}

type CacheKey = string;

/**
 * 缓存服务类
 */
class CacheService {
  private memoryCache: Map<CacheKey, CacheItem>;
  private prefix = 'cyberpress_cache_';

  constructor() {
    this.memoryCache = new Map();

    // 从 localStorage 恢复缓存
    if (typeof window !== 'undefined') {
      this.restoreFromLocalStorage();
    }
  }

  /**
   * 设置缓存
   */
  set<T>(key: CacheKey, data: T, ttl?: number, useLocalStorage = false): void {
    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      ttl,
    };

    // 内存缓存
    this.memoryCache.set(key, item);

    // localStorage 缓存
    if (useLocalStorage && typeof window !== 'undefined') {
      try {
        localStorage.setItem(`${this.prefix}${key}`, JSON.stringify(item));
      } catch (error) {
        console.error('Failed to save to localStorage:', error);
      }
    }
  }

  /**
   * 获取缓存
   */
  get<T>(key: CacheKey): T | null {
    // 先从内存缓存获取
    const memoryItem = this.memoryCache.get(key);
    if (memoryItem && this.isValid(memoryItem)) {
      return memoryItem.data as T;
    }

    // 从 localStorage 获取
    if (typeof window !== 'undefined') {
      const localItem = this.getFromLocalStorage(key);
      if (localItem && this.isValid(localItem)) {
        // 恢复到内存缓存
        this.memoryCache.set(key, localItem);
        return localItem.data as T;
      }
    }

    return null;
  }

  /**
   * 检查缓存是否存在且有效
   */
  has(key: CacheKey): boolean {
    return this.get(key) !== null;
  }

  /**
   * 删除缓存
   */
  delete(key: CacheKey): void {
    this.memoryCache.delete(key);

    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(`${this.prefix}${key}`);
      } catch (error) {
        console.error('Failed to remove from localStorage:', error);
      }
    }
  }

  /**
   * 清空所有缓存
   */
  clear(): void {
    this.memoryCache.clear();

    if (typeof window !== 'undefined') {
      try {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
          if (key.startsWith(this.prefix)) {
            localStorage.removeItem(key);
          }
        });
      } catch (error) {
        console.error('Failed to clear localStorage:', error);
      }
    }
  }

  /**
   * 清理过期缓存
   */
  clean(): void {
    const now = Date.now();

    // 清理内存缓存
    for (const [key, item] of this.memoryCache.entries()) {
      if (item.ttl && now - item.timestamp > item.ttl) {
        this.memoryCache.delete(key);
      }
    }

    // 清理 localStorage 缓存
    if (typeof window !== 'undefined') {
      try {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
          if (key.startsWith(this.prefix)) {
            const item = this.parseLocalStorageItem(localStorage.getItem(key));
            if (item && item.ttl && now - item.timestamp > item.ttl) {
              localStorage.removeItem(key);
            }
          }
        });
      } catch (error) {
        console.error('Failed to clean localStorage:', error);
      }
    }
  }

  /**
   * 获取缓存统计信息
   */
  getStats(): { memory: number; localStorage: number; total: number } {
    const memoryCount = this.memoryCache.size;
    let localStorageCount = 0;

    if (typeof window !== 'undefined') {
      const keys = Object.keys(localStorage);
      localStorageCount = keys.filter(key => key.startsWith(this.prefix)).length;
    }

    return {
      memory: memoryCount,
      localStorage: localStorageCount,
      total: memoryCount + localStorageCount,
    };
  }

  /**
   * 预热缓存
   */
  async warmup<T>(
    keys: CacheKey[],
    fetchFn: (key: CacheKey) => Promise<T>,
    ttl?: number
  ): Promise<void> {
    const promises = keys.map(async key => {
      if (!this.has(key)) {
        try {
          const data = await fetchFn(key);
          this.set(key, data, ttl, true);
        } catch (error) {
          console.error(`Failed to warmup cache for key: ${key}`, error);
        }
      }
    });

    await Promise.allSettled(promises);
  }

  // 私有方法

  private isValid(item: CacheItem): boolean {
    if (!item.ttl) return true;
    return Date.now() - item.timestamp <= item.ttl;
  }

  private getFromLocalStorage(key: CacheKey): CacheItem | null {
    if (typeof window === 'undefined') return null;

    try {
      const item = localStorage.getItem(`${this.prefix}${key}`);
      return this.parseLocalStorageItem(item);
    } catch (error) {
      console.error('Failed to get from localStorage:', error);
      return null;
    }
  }

  private parseLocalStorageItem(item: string | null): CacheItem | null {
    if (!item) return null;

    try {
      return JSON.parse(item);
    } catch (error) {
      console.error('Failed to parse localStorage item:', error);
      return null;
    }
  }

  private restoreFromLocalStorage(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          const cacheKey = key.replace(this.prefix, '');
          const item = this.parseLocalStorageItem(localStorage.getItem(key));
          if (item && this.isValid(item)) {
            this.memoryCache.set(cacheKey, item);
          }
        }
      });
    } catch (error) {
      console.error('Failed to restore from localStorage:', error);
    }
  }
}

// 导出单例
export const cacheService = new CacheService();

// 导出便捷方法
export const cache = {
  set: <T>(key: string, data: T, ttl?: number, useLocalStorage = false) =>
    cacheService.set(key, data, ttl, useLocalStorage),
  get: <T>(key: string) => cacheService.get<T>(key),
  has: (key: string) => cacheService.has(key),
  delete: (key: string) => cacheService.delete(key),
  clear: () => cacheService.clear(),
  clean: () => cacheService.clean(),
  stats: () => cacheService.getStats(),
};

export type { CacheItem, CacheKey };
