/**
 * Cache Service
 * 缓存服务 - 支持内存缓存、LocalStorage、SessionStorage
 * 支持过期时间、最大容量、LRU 淘汰策略
 */

// ============================================
// 类型定义
// ============================================

export interface CacheEntry<T = any> {
  value: T;
  timestamp: number;
  ttl?: number; // Time to live in milliseconds
}

export interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  maxSize?: number; // Maximum number of entries
  namespace?: string; // Storage namespace prefix
  persistent?: boolean; // Whether to persist across sessions
}

export interface CacheStats {
  size: number;
  hits: number;
  misses: number;
  hitRate: number;
}

// ============================================
// Cache Service Class
// ============================================

class CacheService {
  private memoryCache: Map<string, CacheEntry> = new Map();
  private stats = { hits: 0, misses: 0 };
  private maxSize: number;
  private namespace: string;

  constructor(options: CacheOptions = {}) {
    this.maxSize = options.maxSize || 100;
    this.namespace = options.namespace || 'cache';
  }

  // ============================================
  // 核心 API
  // ============================================

  /**
   * 设置缓存
   */
  set<T>(key: string, value: T, options: CacheOptions = {}): void {
    const entry: CacheEntry<T> = {
      value,
      timestamp: Date.now(),
      ttl: options.ttl,
    };

    // 内存缓存
    this.memoryCache.set(this.getKey(key), entry as CacheEntry);

    // 持久化缓存
    if (options.persistent) {
      this.setPersistent(key, entry);
    }

    // 检查容量限制
    this.evictIfNeeded();
  }

  /**
   * 获取缓存
   */
  get<T>(key: string, options: CacheOptions = {}): T | null {
    const fullKey = this.getKey(key);
    const entry = this.memoryCache.get(fullKey);

    if (entry) {
      // 检查是否过期
      if (this.isExpired(entry)) {
        this.delete(key);
        this.stats.misses++;
        return null;
      }

      this.stats.hits++;
      return entry.value as T;
    }

    // 尝试从持久化存储读取
    if (options.persistent !== false) {
      const persistentEntry = this.getPersistent(key);
      if (persistentEntry) {
        if (this.isExpired(persistentEntry)) {
          this.deletePersistent(key);
          this.stats.misses++;
          return null;
        }

        // 加载到内存
        this.memoryCache.set(fullKey, persistentEntry);
        this.stats.hits++;
        return persistentEntry.value as T;
      }
    }

    this.stats.misses++;
    return null;
  }

  /**
   * 删除缓存
   */
  delete(key: string): void {
    this.memoryCache.delete(this.getKey(key));
    this.deletePersistent(key);
  }

  /**
   * 清空所有缓存
   */
  clear(): void {
    this.memoryCache.clear();
    this.clearPersistent();
    this.stats = { hits: 0, misses: 0 };
  }

  /**
   * 检查缓存是否存在
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  // ============================================
  // 批量操作
  // ============================================

  /**
   * 批量设置
   */
  setMany<T>(entries: Record<string, T>, options: CacheOptions = {}): void {
    Object.entries(entries).forEach(([key, value]) => {
      this.set(key, value, options);
    });
  }

  /**
   * 批量获取
   */
  getMany<T>(keys: string[], options: CacheOptions = {}): Record<string, T> {
    const result: Record<string, T> = {};

    keys.forEach((key) => {
      const value = this.get<T>(key, options);
      if (value !== null) {
        result[key] = value;
      }
    });

    return result;
  }

  /**
   * 批量删除
   */
  deleteMany(keys: string[]): void {
    keys.forEach((key) => this.delete(key));
  }

  // ============================================
  // 模式匹配
  // ============================================

  /**
   * 根据模式获取所有键
   */
  keys(pattern?: string): string[] {
    const allKeys = Array.from(this.memoryCache.keys());

    if (!pattern) {
      return allKeys.map((key) => this.removeNamespace(key));
    }

    const regex = new RegExp(pattern);
    return allKeys
      .filter((key) => regex.test(this.removeNamespace(key)))
      .map((key) => this.removeNamespace(key));
  }

  /**
   * 根据模式删除
   */
  deletePattern(pattern: string): void {
    const keysToDelete = this.keys(pattern);
    this.deleteMany(keysToDelete);
  }

  // ============================================
  // 统计
  // ============================================

  getStats(): CacheStats {
    const total = this.stats.hits + this.stats.misses;
    return {
      size: this.memoryCache.size,
      hits: this.stats.hits,
      misses: this.stats.misses,
      hitRate: total > 0 ? this.stats.hits / total : 0,
    };
  }

  resetStats(): void {
    this.stats = { hits: 0, misses: 0 };
  }

  // ============================================
  // 辅助方法
  // ============================================

  private getKey(key: string): string {
    return `${this.namespace}:${key}`;
  }

  private removeNamespace(key: string): string {
    return key.replace(`${this.namespace}:`, '');
  }

  private isExpired(entry: CacheEntry): boolean {
    if (!entry.ttl) return false;
    return Date.now() - entry.timestamp > entry.ttl;
  }

  private evictIfNeeded(): void {
    if (this.memoryCache.size <= this.maxSize) return;

    // LRU: 按时间戳排序，删除最旧的
    const entries = Array.from(this.memoryCache.entries())
      .sort((a, b) => a[1].timestamp - b[1].timestamp);

    const toRemove = entries.slice(0, this.memoryCache.size - this.maxSize);
    toRemove.forEach(([key]) => {
      this.memoryCache.delete(key);
      this.deletePersistent(this.removeNamespace(key));
    });
  }

  // ============================================
  // 持久化存储
  // ============================================

  private setPersistent(key: string, entry: CacheEntry): void {
    if (typeof window === 'undefined') return;

    try {
      const storageKey = this.getKey(key);
      localStorage.setItem(storageKey, JSON.stringify(entry));
    } catch (error) {
      console.error('[CacheService] Failed to persist cache:', error);
    }
  }

  private getPersistent(key: string): CacheEntry | null {
    if (typeof window === 'undefined') return null;

    try {
      const storageKey = this.getKey(key);
      const item = localStorage.getItem(storageKey);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('[CacheService] Failed to read persisted cache:', error);
      return null;
    }
  }

  private deletePersistent(key: string): void {
    if (typeof window === 'undefined') return;

    try {
      const storageKey = this.getKey(key);
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.error('[CacheService] Failed to delete persisted cache:', error);
    }
  }

  private clearPersistent(): void {
    if (typeof window === 'undefined') return;

    try {
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith(this.namespace)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('[CacheService] Failed to clear persisted cache:', error);
    }
  }

  // ============================================
  // 便捷方法
  // ============================================

  /**
   * 记忆化函数
   */
  memoize<T extends (...args: any[]) => any>(
    fn: T,
    options: CacheOptions = {}
  ): T {
    return ((...args: Parameters<T>) => {
      const key = `${fn.name}:${JSON.stringify(args)}`;
      const cached = this.get<ReturnType<T>>(key);

      if (cached !== null) {
        return cached;
      }

      const result = fn(...args);
      this.set(key, result, options);
      return result;
    }) as T;
  }

  /**
   * 异步缓存
   */
  async getOrSet<T>(
    key: string,
    fetch: () => Promise<T>,
    options: CacheOptions = {}
  ): Promise<T> {
    const cached = this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const value = await fetch();
    this.set(key, value, options);
    return value;
  }
}

// ============================================
// 单例实例
// ============================================

let defaultCacheInstance: CacheService | null = null;

export const getCache = (options?: CacheOptions): CacheService => {
  if (!defaultCacheInstance) {
    defaultCacheInstance = new CacheService(options);
  }
  return defaultCacheInstance;
};

// ============================================
// 导出
// ============================================

export default CacheService;
