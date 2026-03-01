/**
 * 缓存服务
 * 提供内存缓存和 LocalStorage 缓存
 */

interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl?: number; // Time to live in milliseconds
}

class CacheService {
  private memoryCache: Map<string, CacheItem<any>>;
  private prefix: string = 'cyberpress_';

  constructor() {
    this.memoryCache = new Map();

    // 初始化时清理过期的 localStorage 缓存
    if (typeof window !== 'undefined') {
      this.cleanExpiredLocalStorage();
    }
  }

  /**
   * 内存缓存 - 设置
   */
  setMemory<T>(key: string, data: T, ttl?: number): void {
    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      ttl,
    };
    this.memoryCache.set(key, item);
  }

  /**
   * 内存缓存 - 获取
   */
  getMemory<T>(key: string): T | null {
    const item = this.memoryCache.get(key);

    if (!item) {
      return null;
    }

    // 检查是否过期
    if (item.ttl && Date.now() - item.timestamp > item.ttl) {
      this.memoryCache.delete(key);
      return null;
    }

    return item.data as T;
  }

  /**
   * 内存缓存 - 删除
   */
  deleteMemory(key: string): void {
    this.memoryCache.delete(key);
  }

  /**
   * 内存缓存 - 清空
   */
  clearMemory(): void {
    this.memoryCache.clear();
  }

  /**
   * LocalStorage 缓存 - 设置
   */
  setLocalStorage<T>(key: string, data: T, ttl?: number): void {
    if (typeof window === 'undefined') return;

    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      ttl,
    };

    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(item));
    } catch (error) {
      console.error('LocalStorage set error:', error);
    }
  }

  /**
   * LocalStorage 缓存 - 获取
   */
  getLocalStorage<T>(key: string): T | null {
    if (typeof window === 'undefined') return null;

    try {
      const itemStr = localStorage.getItem(this.prefix + key);

      if (!itemStr) {
        return null;
      }

      const item: CacheItem<T> = JSON.parse(itemStr);

      // 检查是否过期
      if (item.ttl && Date.now() - item.timestamp > item.ttl) {
        localStorage.removeItem(this.prefix + key);
        return null;
      }

      return item.data;
    } catch (error) {
      console.error('LocalStorage get error:', error);
      return null;
    }
  }

  /**
   * LocalStorage 缓存 - 删除
   */
  deleteLocalStorage(key: string): void {
    if (typeof window === 'undefined') return;

    localStorage.removeItem(this.prefix + key);
  }

  /**
   * LocalStorage 缓存 - 清空
   */
  clearLocalStorage(): void {
    if (typeof window === 'undefined') return;

    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith(this.prefix)) {
        localStorage.removeItem(key);
      }
    });
  }

  /**
   * 清理过期的 LocalStorage 缓存
   */
  private cleanExpiredLocalStorage(): void {
    const keys = Object.keys(localStorage);
    const now = Date.now();

    keys.forEach((key) => {
      if (key.startsWith(this.prefix)) {
        try {
          const itemStr = localStorage.getItem(key);
          if (itemStr) {
            const item = JSON.parse(itemStr);
            if (item.ttl && now - item.timestamp > item.ttl) {
              localStorage.removeItem(key);
            }
          }
        } catch {
          // 如果解析失败，删除该项
          localStorage.removeItem(key);
        }
      }
    });
  }

  /**
   * 通用缓存方法 - 自动选择存储方式
   */
  set<T>(key: string, data: T, ttl?: number, useLocalStorage = false): void {
    if (useLocalStorage) {
      this.setLocalStorage(key, data, ttl);
    } else {
      this.setMemory(key, data, ttl);
    }
  }

  /**
   * 通用获取方法
   */
  get<T>(key: string, useLocalStorage = false): T | null {
    if (useLocalStorage) {
      return this.getLocalStorage<T>(key);
    } else {
      return this.getMemory<T>(key);
    }
  }

  /**
   * 通用删除方法
   */
  delete(key: string, useLocalStorage = false): void {
    if (useLocalStorage) {
      this.deleteLocalStorage(key);
    } else {
      this.deleteMemory(key);
    }
  }

  /**
   * 获取缓存统计信息
   */
  getStats(): {
    memoryCacheSize: number;
    localStorageCacheSize: number;
  } {
    let localStorageCacheSize = 0;

    if (typeof window !== 'undefined') {
      const keys = Object.keys(localStorage);
      localStorageCacheSize = keys.filter((key) =>
        key.startsWith(this.prefix)
      ).length;
    }

    return {
      memoryCacheSize: this.memoryCache.size,
      localStorageCacheSize,
    };
  }
}

// 导出单例
export const cacheService = new CacheService();

// 预设的 TTL 常量
export const CACHE_TTL = {
  MINUTE: 60 * 1000,
  FIVE_MINUTES: 5 * 60 * 1000,
  FIFTEEN_MINUTES: 15 * 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000,
};

export default cacheService;
