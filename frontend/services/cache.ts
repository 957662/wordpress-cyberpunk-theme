/**
 * 缓存服务
 * 提供内存和持久化缓存功能
 */

// 缓存项接口
interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl?: number;
}

// 缓存配置
interface CacheConfig {
  ttl?: number; // 生存时间（毫秒）
  persistent?: boolean; // 是否持久化到 localStorage
  prefix?: string; // 键前缀
}

// 默认配置
const DEFAULT_CONFIG: CacheConfig = {
  ttl: 5 * 60 * 1000, // 5 分钟
  persistent: false,
  prefix: 'cache_'
};

/**
 * 缓存服务类
 */
export class CacheService {
  private memoryCache: Map<string, CacheItem<any>> = new Map();
  private config: CacheConfig;

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * 生成缓存键
   */
  private getKey(key: string): string {
    return `${this.config.prefix}${key}`;
  }

  /**
   * 检查缓存是否过期
   */
  private isExpired(item: CacheItem<any>): boolean {
    if (!item.ttl) return false;
    return Date.now() - item.timestamp > item.ttl;
  }

  /**
   * 设置缓存
   */
  set<T>(key: string, data: T, ttl?: number): void {
    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.config.ttl
    };

    // 内存缓存
    this.memoryCache.set(this.getKey(key), item);

    // 持久化缓存
    if (this.config.persistent && typeof window !== 'undefined') {
      try {
        localStorage.setItem(this.getKey(key), JSON.stringify(item));
      } catch (error) {
        console.error('Failed to persist cache:', error);
      }
    }
  }

  /**
   * 获取缓存
   */
  get<T>(key: string): T | null {
    const fullKey = this.getKey(key);

    // 先从内存缓存获取
    let item = this.memoryCache.get(fullKey);

    // 如果内存中没有，尝试从 localStorage 获取
    if (!item && this.config.persistent && typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(fullKey);
        if (stored) {
          item = JSON.parse(stored);
          // 同步到内存缓存
          this.memoryCache.set(fullKey, item);
        }
      } catch (error) {
        console.error('Failed to retrieve from localStorage:', error);
      }
    }

    // 检查是否过期
    if (!item || this.isExpired(item)) {
      this.delete(key);
      return null;
    }

    return item.data as T;
  }

  /**
   * 删除缓存
   */
  delete(key: string): void {
    const fullKey = this.getKey(key);

    // 从内存删除
    this.memoryCache.delete(fullKey);

    // 从持久化存储删除
    if (this.config.persistent && typeof window !== 'undefined') {
      try {
        localStorage.removeItem(fullKey);
      } catch (error) {
        console.error('Failed to delete from localStorage:', error);
      }
    }
  }

  /**
   * 清空所有缓存
   */
  clear(): void {
    // 清空内存缓存
    this.memoryCache.clear();

    // 清空持久化缓存
    if (this.config.persistent && typeof window !== 'undefined') {
      try {
        const keys = Object.keys(localStorage);
        keys.forEach((key) => {
          if (key.startsWith(this.config!.prefix)) {
            localStorage.removeItem(key);
          }
        });
      } catch (error) {
        console.error('Failed to clear localStorage:', error);
      }
    }
  }

  /**
   * 检查缓存是否存在
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * 获取或设置缓存
   */
  getOrSet<T>(
    key: string,
    factory: () => T | Promise<T>,
    ttl?: number
  ): T | Promise<T> {
    const cached = this.get<T>(key);

    if (cached !== null) {
      return cached;
    }

    const result = factory();

    if (result instanceof Promise) {
      return result.then((data) => {
        this.set(key, data, ttl);
        return data;
      });
    } else {
      this.set(key, result, ttl);
      return result;
    }
  }

  /**
   * 批量删除缓存
   */
  deletePattern(pattern: string): void {
    const regex = new RegExp(pattern);
    const keys = Array.from(this.memoryCache.keys());

    keys.forEach((key) => {
      if (regex.test(key)) {
        this.delete(key.replace(this.config!.prefix, ''));
      }
    });
  }

  /**
   * 获取缓存统计信息
   */
  getStats(): {
    size: number;
    keys: string[];
    memoryUsage: number;
  } {
    const keys = Array.from(this.memoryCache.keys());
    const memoryUsage = JSON.stringify(Array.from(this.memoryCache.values())).length;

    return {
      size: this.memoryCache.size,
      keys,
      memoryUsage
    };
  }
}

// 创建默认实例
export const cache = new CacheService();

// 创建持久化实例
export const persistentCache = new CacheService({
  ttl: 60 * 60 * 1000, // 1 小时
  persistent: true,
  prefix: 'persistent_'
});

// 创建短期实例
export const shortTermCache = new CacheService({
  ttl: 60 * 1000, // 1 分钟
  persistent: false,
  prefix: 'short_'
});

/**
 * React Hook 缓存装饰器
 */
export function useCached<T>(
  key: string,
  factory: () => Promise<T>,
  config?: CacheConfig
) {
  const cacheService = new CacheService(config);

  return {
    get: () => cacheService.get<T>(key),
    set: (data: T, ttl?: number) => cacheService.set(key, data, ttl),
    fetch: async (): Promise<T> => {
      return cacheService.getOrSet(key, factory);
    },
    invalidate: () => cacheService.delete(key)
  };
}

/**
 * 缓存装饰器 - 用于方法缓存
 */
export function Cached(ttl?: number) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    const cacheKey = `${target.constructor.name}_${propertyKey}`;

    descriptor.value = async function (...args: any[]) {
      const key = `${cacheKey}_${JSON.stringify(args)}`;
      const cached = cache.get(key);

      if (cached !== null) {
        return cached;
      }

      const result = await originalMethod.apply(this, args);
      cache.set(key, result, ttl);
      return result;
    };

    return descriptor;
  };
}
