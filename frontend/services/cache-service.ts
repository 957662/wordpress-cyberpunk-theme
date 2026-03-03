/**
 * CyberPress Platform - 缓存服务
 * ============================================================================
 * 功能: 统一的缓存管理，支持多级缓存、过期策略、缓存预热
 * 版本: 1.0.0
 * 日期: 2026-03-03
 * ============================================================================
 */

import { ls } from './storage-service';

// ============================================================================
// 类型定义
// ============================================================================

export type CacheLevel = 'memory' | 'storage' | 'network';

export interface CacheEntry<T = any> {
  key: string;
  value: T;
  ttl: number; // 过期时间（毫秒）
  createdAt: number;
  level: CacheLevel;
  metadata?: Record<string, any>;
}

export interface CacheOptions {
  ttl?: number; // 过期时间（毫秒）
  level?: CacheLevel; // 缓存级别
  tags?: string[]; // 缓存标签，用于批量失效
  metadata?: Record<string, any>;
  version?: string; // 版本号，用于缓存更新
}

export interface CacheStats {
  hits: number;
  misses: number;
  size: number;
  hitRate: number;
}

// ============================================================================
// 内存缓存存储
// ============================================================================

class MemoryCache {
  private cache: Map<string, CacheEntry> = new Map();
  private timers: Map<string, NodeJS.Timeout> = new Map();

  set(entry: CacheEntry): void {
    const { key, ttl } = entry;

    // 清除旧的定时器
    const oldTimer = this.timers.get(key);
    if (oldTimer) {
      clearTimeout(oldTimer);
    }

    // 存储缓存
    this.cache.set(key, entry);

    // 设置过期定时器
    if (ttl > 0) {
      const timer = setTimeout(() => {
        this.delete(key);
      }, ttl);
      this.timers.set(key, timer);
    }
  }

  get(key: string): CacheEntry | undefined {
    return this.cache.get(key);
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }

  delete(key: string): boolean {
    this.timers.delete(key);
    return this.cache.delete(key);
  }

  clear(): void {
    // 清除所有定时器
    this.timers.forEach((timer) => clearTimeout(timer));
    this.timers.clear();
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }

  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  values(): CacheEntry[] {
    return Array.from(this.cache.values());
  }

  /**
   * 清理过期的缓存项
   */
  cleanup(): number {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, entry] of this.cache.entries()) {
      const age = now - entry.createdAt;
      if (age > entry.ttl) {
        this.delete(key);
        cleaned++;
      }
    }

    return cleaned;
  }
}

// ============================================================================
// 缓存服务类
// ============================================================================

class CacheService {
  private memoryCache = new MemoryCache();
  private stats = { hits: 0, misses: 0 };
  private cleanupTimer: NodeJS.Timeout | null = null;

  // 默认配置
  private defaultTTL = 5 * 60 * 1000; // 5分钟
  private defaultLevel: CacheLevel = 'memory';

  // 缓存标签索引
  private tagIndex: Map<string, Set<string>> = new Map();

  constructor() {
    // 启动定时清理（每5分钟）
    this.startCleanup();
  }

  /**
   * 启动定时清理
   */
  private startCleanup() {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }

    this.cleanupTimer = setInterval(() => {
      this.memoryCache.cleanup();
      this.cleanupStorage();
    }, 5 * 60 * 1000); // 每5分钟
  }

  /**
   * 清理存储中的过期缓存
   */
  private cleanupStorage() {
    const keys = ls.get<string[]>('cache_keys') || [];
    const now = Date.now();
    const validKeys: string[] = [];

    for (const key of keys) {
      const entry = ls.get<CacheEntry>(`cache_${key}`);
      if (entry && (entry.createdAt + entry.ttl) > now) {
        validKeys.push(key);
      } else {
        ls.remove(`cache_${key}`);
      }
    }

    ls.set('cache_keys', validKeys);
  }

  /**
   * 生成缓存键
   */
  private generateKey(prefix: string, params: Record<string, any> = {}): string {
    const paramString = Object.keys(params)
      .sort()
      .map((k) => `${k}:${JSON.stringify(params[k])}`)
      .join('&');

    return paramString ? `${prefix}:${paramString}` : prefix;
  }

  /**
   * 更新标签索引
   */
  private updateTagIndex(key: string, tags: string[] = []) {
    for (const tag of tags) {
      if (!this.tagIndex.has(tag)) {
        this.tagIndex.set(tag, new Set());
      }
      this.tagIndex.get(tag)!.add(key);
    }
  }

  /**
   * 设置缓存
   */
  set<T>(
    key: string,
    value: T,
    options: CacheOptions = {}
  ): void {
    const {
      ttl = this.defaultTTL,
      level = this.defaultLevel,
      tags = [],
      metadata = {},
      version,
    } = options;

    const entry: CacheEntry<T> = {
      key,
      value,
      ttl,
      createdAt: Date.now(),
      level,
      metadata: { ...metadata, version, tags },
    };

    // 根据级别存储
    if (level === 'memory') {
      this.memoryCache.set(entry);
    } else if (level === 'storage') {
      ls.set(`cache_${key}`, entry, { ttl });
      // 更新缓存键列表
      const keys = ls.get<string[]>('cache_keys') || [];
      if (!keys.includes(key)) {
        ls.set('cache_keys', [...keys, key]);
      }
    }

    // 更新标签索引
    this.updateTagIndex(key, tags);
  }

  /**
   * 获取缓存
   */
  get<T>(key: string, level?: CacheLevel): T | null {
    let entry: CacheEntry<T> | undefined;

    // 根据级别获取
    if (!level || level === 'memory') {
      entry = this.memoryCache.get(key);
    }

    if (!entry && (!level || level === 'storage')) {
      entry = ls.get<CacheEntry<T>>(`cache_${key}`);
    }

    // 检查是否过期
    if (!entry) {
      this.stats.misses++;
      return null;
    }

    const age = Date.now() - entry.createdAt;
    if (age > entry.ttl) {
      this.delete(key);
      this.stats.misses++;
      return null;
    }

    this.stats.hits++;
    return entry.value;
  }

  /**
   * 检查缓存是否存在
   */
  has(key: string, level?: CacheLevel): boolean {
    if (!level || level === 'memory') {
      if (this.memoryCache.has(key)) {
        return true;
      }
    }

    if (!level || level === 'storage') {
      const entry = ls.get<CacheEntry>(`cache_${key}`);
      if (entry) {
        const age = Date.now() - entry.createdAt;
        return age <= entry.ttl;
      }
    }

    return false;
  }

  /**
   * 删除缓存
   */
  delete(key: string): boolean {
    let deleted = false;

    // 从内存缓存删除
    if (this.memoryCache.has(key)) {
      deleted = this.memoryCache.delete(key) || deleted;
    }

    // 从存储删除
    const storageKey = `cache_${key}`;
    if (ls.has(storageKey)) {
      ls.remove(storageKey);
      deleted = true;

      // 从键列表移除
      const keys = ls.get<string[]>('cache_keys') || [];
      const updatedKeys = keys.filter((k) => k !== key);
      ls.set('cache_keys', updatedKeys);
    }

    // 从标签索引移除
    for (const [tag, keySet] of this.tagIndex.entries()) {
      keySet.delete(key);
      if (keySet.size === 0) {
        this.tagIndex.delete(tag);
      }
    }

    return deleted;
  }

  /**
   * 按标签删除缓存
   */
  deleteByTag(tag: string): number {
    const keySet = this.tagIndex.get(tag);
    if (!keySet) return 0;

    let deleted = 0;
    for (const key of keySet) {
      if (this.delete(key)) {
        deleted++;
      }
    }

    this.tagIndex.delete(tag);
    return deleted;
  }

  /**
   * 按前缀删除缓存
   */
  deleteByPrefix(prefix: string): number {
    let deleted = 0;

    // 内存缓存
    const memoryKeys = this.memoryCache.keys();
    for (const key of memoryKeys) {
      if (key.startsWith(prefix)) {
        if (this.memoryCache.delete(key)) {
          deleted++;
        }
      }
    }

    // 存储缓存
    const storageKeys = ls.get<string[]>('cache_keys') || [];
    for (const key of storageKeys) {
      if (key.startsWith(prefix)) {
        if (this.delete(key)) {
          deleted++;
        }
      }
    }

    return deleted;
  }

  /**
   * 清空所有缓存
   */
  clear(): void {
    this.memoryCache.clear();

    // 清空存储缓存
    const keys = ls.get<string[]>('cache_keys') || [];
    for (const key of keys) {
      ls.remove(`cache_${key}`);
    }
    ls.remove('cache_keys');

    // 清空标签索引
    this.tagIndex.clear();
  }

  /**
   * 获取或设置缓存（缓存穿透保护）
   */
  async getOrSet<T>(
    key: string,
    fetcher: () => Promise<T>,
    options: CacheOptions = {}
  ): Promise<T> {
    // 尝试从缓存获取
    const cached = this.get<T>(key, options.level);
    if (cached !== null) {
      return cached;
    }

    // 从数据源获取
    try {
      const value = await fetcher();
      this.set(key, value, options);
      return value;
    } catch (error) {
      console.error(`Cache fetch error for key "${key}":`, error);
      throw error;
    }
  }

  /**
   * 缓存预热
   */
  async warmup<T>(
    items: Array<{ key: string; fetcher: () => Promise<T>; options?: CacheOptions }>
  ): Promise<void> {
    await Promise.all(
      items.map(async ({ key, fetcher, options }) => {
        try {
          const value = await fetcher();
          this.set(key, value, options);
        } catch (error) {
          console.error(`Cache warmup error for key "${key}":`, error);
        }
      })
    );
  }

  /**
   * 获取缓存统计信息
   */
  getStats(level?: CacheLevel): CacheStats {
    const hits = this.stats.hits;
    const misses = this.stats.misses;
    const total = hits + misses;

    let size = 0;
    if (!level || level === 'memory') {
      size += this.memoryCache.size();
    }
    if (!level || level === 'storage') {
      const keys = ls.get<string[]>('cache_keys') || [];
      size += keys.length;
    }

    return {
      hits,
      misses,
      size,
      hitRate: total > 0 ? hits / total : 0,
    };
  }

  /**
   * 重置统计信息
   */
  resetStats(): void {
    this.stats = { hits: 0, misses: 0 };
  }

  /**
   * 获取所有缓存键
   */
  keys(level?: CacheLevel): string[] {
    const result: string[] = [];

    if (!level || level === 'memory') {
      result.push(...this.memoryCache.keys());
    }

    if (!level || level === 'storage') {
      const storageKeys = ls.get<string[]>('cache_keys') || [];
      result.push(...storageKeys);
    }

    return Array.from(new Set(result));
  }

  /**
   * 获取缓存大小（字节）
   */
  getSize(level?: CacheLevel): number {
    let size = 0;

    if (!level || level === 'memory') {
      for (const entry of this.memoryCache.values()) {
        size += JSON.stringify(entry).length;
      }
    }

    if (!level || level === 'storage') {
      const keys = ls.get<string[]>('cache_keys') || [];
      for (const key of keys) {
        const entry = ls.get<CacheEntry>(`cache_${key}`);
        if (entry) {
          size += JSON.stringify(entry).length;
        }
      }
    }

    return size;
  }

  /**
   * 持久化内存缓存到存储
   */
  persist(): void {
    const entries = this.memoryCache.values();
    for (const entry of entries) {
      if (entry.level === 'storage') {
        ls.set(`cache_${entry.key}`, entry, { ttl: entry.ttl });
      }
    }
  }

  /**
   * 销毁缓存服务
   */
  destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
    this.clear();
  }
}

// ============================================================================
// 导出单例
// ============================================================================

export const cacheService = new CacheService();

// ============================================================================
// React Hook
// ============================================================================

import { useEffect, useState } from 'react';

export function useCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: CacheOptions = {}
) {
  const [data, setData] = useState<T | null>(() => cacheService.get<T>(key, options.level));
  const [isLoading, setIsLoading] = useState(data === null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // 如果有缓存，直接返回
    if (data !== null) {
      return;
    }

    let cancelled = false;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const result = await cacheService.getOrSet(key, fetcher, options);

        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err as Error);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [key]);

  const refresh = async () => {
    cacheService.delete(key);
    setIsLoading(true);
    try {
      const result = await fetcher();
      cacheService.set(key, result, options);
      setData(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, error, refresh };
}

// ============================================================================
// 缓存装饰器
// ============================================================================

/**
 * 方法缓存装饰器
 */
export function Cached(options: CacheOptions = {}) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const key = `${target.constructor.name}.${propertyKey}:${JSON.stringify(args)}`;

      return cacheService.getOrSet(
        key,
        () => originalMethod.apply(this, args),
        options
      );
    };

    return descriptor;
  };
}

// ============================================================================
// 导出
// ============================================================================

export default cacheService;
