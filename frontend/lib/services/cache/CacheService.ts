/**
 * 缓存服务 - 用于管理应用数据缓存
 */

export interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  ttl?: number; // Time to live in milliseconds
  tags?: string[];
}

export interface CacheOptions {
  ttl?: number;
  tags?: string[];
  persist?: boolean; // 是否持久化到localStorage
}

/**
 * 缓存服务类
 */
class CacheService {
  private static instance: CacheService;
  private memoryCache: Map<string, CacheEntry>;
  private storagePrefix = 'cyberpress_cache_';

  private constructor() {
    this.memoryCache = new Map();
    this.initializeFromStorage();
  }

  static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  /**
   * 设置缓存
   */
  set<T>(key: string, data: T, options: CacheOptions = {}): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: options.ttl,
      tags: options.tags,
    };

    // 内存缓存
    this.memoryCache.set(key, entry);

    // 持久化缓存
    if (options.persist) {
      this.setToStorage(key, entry);
    }
  }

  /**
   * 获取缓存
   */
  get<T>(key: string): T | null {
    // 先从内存获取
    const memoryEntry = this.memoryCache.get(key);
    if (memoryEntry && !this.isExpired(memoryEntry)) {
      return memoryEntry.data as T;
    }

    // 从存储获取
    const storageEntry = this.getFromStorage(key);
    if (storageEntry && !this.isExpired(storageEntry)) {
      // 同步到内存
      this.memoryCache.set(key, storageEntry);
      return storageEntry.data as T;
    }

    // 清除过期缓存
    this.delete(key);
    return null;
  }

  /**
   * 检查缓存是否存在
   */
  has(key: string): boolean {
    const entry = this.memoryCache.get(key);
    if (entry && !this.isExpired(entry)) {
      return true;
    }

    const storageEntry = this.getFromStorage(key);
    return storageEntry !== null && !this.isExpired(storageEntry);
  }

  /**
   * 删除缓存
   */
  delete(key: string): void {
    this.memoryCache.delete(key);
    this.removeFromStorage(key);
  }

  /**
   * 根据标签删除缓存
   */
  deleteByTag(tag: string): void {
    // 删除内存缓存
    for (const [key, entry] of this.memoryCache.entries()) {
      if (entry.tags?.includes(tag)) {
        this.memoryCache.delete(key);
      }
    }

    // 删除存储缓存
    if (typeof window !== 'undefined' && window.localStorage) {
      const keys = Object.keys(window.localStorage);
      keys.forEach(storageKey => {
        if (storageKey.startsWith(this.storagePrefix)) {
          try {
            const entry = JSON.parse(window.localStorage.getItem(storageKey) || '');
            if (entry.tags?.includes(tag)) {
              window.localStorage.removeItem(storageKey);
            }
          } catch {
            // Ignore parse errors
          }
        }
      });
    }
  }

  /**
   * 清除所有缓存
   */
  clear(): void {
    this.memoryCache.clear();
    this.clearStorage();
  }

  /**
   * 获取或设置缓存（类似 memo 模式）
   */
  getOrSet<T>(
    key: string,
    fetcher: () => T | Promise<T>,
    options: CacheOptions = {}
  ): T | Promise<T> {
    const cached = this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const result = fetcher();
    if (result instanceof Promise) {
      return result.then(data => {
        this.set(key, data, options);
        return data;
      });
    } else {
      this.set(key, result, options);
      return result;
    }
  }

  /**
   * 清理过期缓存
   */
  cleanup(): void {
    const now = Date.now();

    // 清理内存缓存
    for (const [key, entry] of this.memoryCache.entries()) {
      if (this.isExpired(entry)) {
        this.memoryCache.delete(key);
      }
    }

    // 清理存储缓存
    if (typeof window !== 'undefined' && window.localStorage) {
      const keys = Object.keys(window.localStorage);
      keys.forEach(storageKey => {
        if (storageKey.startsWith(this.storagePrefix)) {
          try {
            const entry = JSON.parse(window.localStorage.getItem(storageKey) || '');
            if (entry.ttl && now - entry.timestamp > entry.ttl) {
              window.localStorage.removeItem(storageKey);
            }
          } catch {
            // Ignore parse errors
          }
        }
      });
    }
  }

  /**
   * 获取缓存统计
   */
  getStats() {
    return {
      memorySize: this.memoryCache.size,
      storageSize: this.getStorageSize(),
      oldestEntry: this.getOldestEntry(),
      newestEntry: this.getNewestEntry(),
    };
  }

  /**
   * 检查是否过期
   */
  private isExpired(entry: CacheEntry): boolean {
    if (!entry.ttl) return false;
    return Date.now() - entry.timestamp > entry.ttl;
  }

  /**
   * 保存到存储
   */
  private setToStorage(key: string, entry: CacheEntry): void {
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }

    try {
      window.localStorage.setItem(
        this.storagePrefix + key,
        JSON.stringify(entry)
      );
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }

  /**
   * 从存储获取
   */
  private getFromStorage(key: string): CacheEntry | null {
    if (typeof window === 'undefined' || !window.localStorage) {
      return null;
    }

    try {
      const data = window.localStorage.getItem(this.storagePrefix + key);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  /**
   * 从存储删除
   */
  private removeFromStorage(key: string): void {
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }

    window.localStorage.removeItem(this.storagePrefix + key);
  }

  /**
   * 清除存储
   */
  private clearStorage(): void {
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }

    const keys = Object.keys(window.localStorage);
    keys.forEach(key => {
      if (key.startsWith(this.storagePrefix)) {
        window.localStorage.removeItem(key);
      }
    });
  }

  /**
   * 从存储初始化
   */
  private initializeFromStorage(): void {
    // 在需要时从存储加载
    this.cleanup();
  }

  /**
   * 获取存储大小
   */
  private getStorageSize(): number {
    if (typeof window === 'undefined' || !window.localStorage) {
      return 0;
    }

    let count = 0;
    const keys = Object.keys(window.localStorage);
    keys.forEach(key => {
      if (key.startsWith(this.storagePrefix)) {
        count++;
      }
    });

    return count;
  }

  /**
   * 获取最旧的条目
   */
  private getOldestEntry(): { key: string; timestamp: number } | null {
    let oldest: { key: string; timestamp: number } | null = null;

    for (const [key, entry] of this.memoryCache.entries()) {
      if (!oldest || entry.timestamp < oldest.timestamp) {
        oldest = { key, timestamp: entry.timestamp };
      }
    }

    return oldest;
  }

  /**
   * 获取最新的条目
   */
  private getNewestEntry(): { key: string; timestamp: number } | null {
    let newest: { key: string; timestamp: number } | null = null;

    for (const [key, entry] of this.memoryCache.entries()) {
      if (!newest || entry.timestamp > newest.timestamp) {
        newest = { key, timestamp: entry.timestamp };
      }
    }

    return newest;
  }
}

// 导出单例实例
export const cache = CacheService.getInstance();

// 导出便捷Hook
export function useCache() {
  return {
    get: cache.get.bind(cache),
    set: cache.set.bind(cache),
    has: cache.has.bind(cache),
    delete: cache.delete.bind(cache),
    deleteByTag: cache.deleteByTag.bind(cache),
    clear: cache.clear.bind(cache),
    getOrSet: cache.getOrSet.bind(cache),
    cleanup: cache.cleanup.bind(cache),
    getStats: cache.getStats.bind(cache),
  };
}

// 预定义的TTL常量
export const CacheTTL = {
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000,
  MONTH: 30 * 24 * 60 * 60 * 1000,
};

// 预定义的标签常量
export const CacheTags = {
  USER: 'user',
  POST: 'post',
  CATEGORY: 'category',
  TAG: 'tag',
  COMMENT: 'comment',
  SEARCH: 'search',
  API: 'api',
};
