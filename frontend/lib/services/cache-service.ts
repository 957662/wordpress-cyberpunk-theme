/**
 * Cache Service
 * 赛博朋克风格的缓存服务
 */

export interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  tags?: string[]; // Cache tags for invalidation
  persist?: boolean; // Persist to localStorage
}

export interface CacheEntry<T = any> {
  value: T;
  timestamp: number;
  ttl?: number;
  tags?: string[];
}

export class CacheService {
  private memoryCache: Map<string, CacheEntry>;
  private prefix: string;

  constructor(prefix: string = 'cyber_cache_') {
    this.memoryCache = new Map();
    this.prefix = prefix;

    // 加载持久化的缓存
    if (typeof window !== 'undefined') {
      this.loadPersistedCache();
    }
  }

  /**
   * 生成缓存键
   */
  private generateKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  /**
   * 从 localStorage 加载持久化缓存
   */
  private loadPersistedCache(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          const entry = JSON.parse(localStorage.getItem(key) || '{}');
          if (this.isValid(entry)) {
            this.memoryCache.set(
              key.substring(this.prefix.length),
              entry
            );
          }
        }
      });
    } catch (error) {
      console.error('Failed to load persisted cache:', error);
    }
  }

  /**
   * 验证缓存条目是否有效
   */
  private isValid(entry: CacheEntry): boolean {
    if (!entry.timestamp) return false;

    if (entry.ttl) {
      const now = Date.now();
      const age = now - entry.timestamp;
      if (age > entry.ttl) {
        return false;
      }
    }

    return true;
  }

  /**
   * 设置缓存
   */
  set<T>(key: string, value: T, options: CacheOptions = {}): void {
    const entry: CacheEntry<T> = {
      value,
      timestamp: Date.now(),
      ttl: options.ttl,
      tags: options.tags,
    };

    this.memoryCache.set(key, entry);

    // 持久化到 localStorage
    if (options.persist !== false && typeof window !== 'undefined') {
      try {
        localStorage.setItem(
          this.generateKey(key),
          JSON.stringify(entry)
        );
      } catch (error) {
        console.error('Failed to persist cache:', error);
      }
    }

    // 设置定时清理
    if (entry.ttl) {
      setTimeout(() => {
        this.delete(key);
      }, entry.ttl);
    }
  }

  /**
   * 获取缓存
   */
  get<T>(key: string): T | null {
    const entry = this.memoryCache.get(key);

    if (!entry) return null;

    if (!this.isValid(entry)) {
      this.delete(key);
      return null;
    }

    return entry.value as T;
  }

  /**
   * 检查缓存是否存在
   */
  has(key: string): boolean {
    const entry = this.memoryCache.get(key);
    return entry !== undefined && this.isValid(entry);
  }

  /**
   * 删除缓存
   */
  delete(key: string): boolean {
    const deleted = this.memoryCache.delete(key);

    if (deleted && typeof window !== 'undefined') {
      try {
        localStorage.removeItem(this.generateKey(key));
      } catch (error) {
        console.error('Failed to remove persisted cache:', error);
      }
    }

    return deleted;
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
        console.error('Failed to clear persisted cache:', error);
      }
    }
  }

  /**
   * 根据标签删除缓存
   */
  deleteByTag(tag: string): void {
    const keysToDelete: string[] = [];

    this.memoryCache.forEach((entry, key) => {
      if (entry.tags && entry.tags.includes(tag)) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => this.delete(key));
  }

  /**
   * 根据前缀删除缓存
   */
  deleteByPrefix(prefix: string): void {
    const keysToDelete: string[] = [];

    this.memoryCache.forEach((_, key) => {
      if (key.startsWith(prefix)) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => this.delete(key));
  }

  /**
   * 获取缓存统计信息
   */
  getStats(): {
    size: number;
    keys: string[];
    tags: Set<string>;
  } {
    const tags = new Set<string>();

    this.memoryCache.forEach(entry => {
      if (entry.tags) {
        entry.tags.forEach(tag => tags.add(tag));
      }
    });

    return {
      size: this.memoryCache.size,
      keys: Array.from(this.memoryCache.keys()),
      tags,
    };
  }

  /**
   * 清理过期缓存
   */
  cleanup(): void {
    const keysToDelete: string[] = [];

    this.memoryCache.forEach((entry, key) => {
      if (!this.isValid(entry)) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => this.delete(key));
  }

  /**
   * 获取或设置缓存（懒加载模式）
   */
  async getOrSet<T>(
    key: string,
    factory: () => Promise<T>,
    options: CacheOptions = {}
  ): Promise<T> {
    const cached = this.get<T>(key);

    if (cached !== null) {
      return cached;
    }

    const value = await factory();
    this.set(key, value, options);

    return value;
  }

  /**
   * 批量设置缓存
   */
  setMany(entries: Record<string, any>, options: CacheOptions = {}): void {
    Object.entries(entries).forEach(([key, value]) => {
      this.set(key, value, options);
    });
  }

  /**
   * 批量获取缓存
   */
  getMany<T>(keys: string[]): Record<string, T | null> {
    const result: Record<string, T | null> = {};

    keys.forEach(key => {
      result[key] = this.get<T>(key);
    });

    return result;
  }

  /**
   * 批量删除缓存
   */
  deleteMany(keys: string[]): void {
    keys.forEach(key => this.delete(key));
  }
}

/**
 * 创建默认的缓存服务实例
 */
export const cacheService = new CacheService();

/**
 * 缓存装饰器（用于类方法）
 */
export function Cached(options: CacheOptions = {}) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const cacheKey = `${propertyKey}_${JSON.stringify(args)}`;
      const cached = cacheService.get(cacheKey);

      if (cached !== null) {
        return cached;
      }

      const result = await originalMethod.apply(this, args);
      cacheService.set(cacheKey, result, options);

      return result;
    };

    return descriptor;
  };
}

/**
 * 记忆化函数
 */
export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  options: CacheOptions = {}
): T {
  return ((...args: Parameters<T>) => {
    const cacheKey = `${fn.name}_${JSON.stringify(args)}`;
    const cached = cacheService.get<ReturnType<T>>(cacheKey);

    if (cached !== null) {
      return cached;
    }

    const result = fn(...args);
    cacheService.set(cacheKey, result, options);

    return result;
  }) as T;
}

/**
 * 预加载数据
 */
export async function preload<T>(
  key: string,
  factory: () => Promise<T>,
  options: CacheOptions = {}
): Promise<void> {
  try {
    const value = await factory();
    cacheService.set(key, value, options);
  } catch (error) {
    console.error(`Failed to preload ${key}:`, error);
  }
}

/**
 * 预加载多个数据
 */
export async function preloadMany(
  entries: Array<{ key: string; factory: () => Promise<any> }>,
  options: CacheOptions = {}
): Promise<void> {
  await Promise.all(
    entries.map(entry => preload(entry.key, entry.factory, options))
  );
}
