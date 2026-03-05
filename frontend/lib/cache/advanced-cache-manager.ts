/**
 * Advanced Cache Manager
 * 高级缓存管理器 - 支持多层缓存、过期策略、持久化
 * CyberPress Platform
 */

import { promises as fs } from 'fs';
import path from 'path';

export interface CacheEntry<T> {
  value: T;
  timestamp: number;
  ttl: number;
  hits: number;
  metadata?: Record<string, any>;
}

export interface CacheStats {
  size: number;
  hits: number;
  misses: number;
  hitRate: number;
  memoryUsage: number;
}

export interface CacheConfig {
  maxSize?: number;
  defaultTTL?: number;
  persistToDisk?: boolean;
  persistPath?: string;
  persistInterval?: number;
  compressionEnabled?: boolean;
  evictionPolicy?: 'lru' | 'lfu' | 'fifo';
}

/**
 * 高级缓存管理器
 */
export class AdvancedCacheManager<T = any> {
  private cache: Map<string, CacheEntry<T>> = new Map();
  private accessOrder: string[] = [];
  private accessFrequency: Map<string, number> = new Map();
  private stats = { hits: 0, misses: 0 };
  private config: Required<CacheConfig>;
  private persistTimer?: NodeJS.Timeout;

  constructor(config: CacheConfig = {}) {
    this.config = {
      maxSize: config.maxSize ?? 1000,
      defaultTTL: config.defaultTTL ?? 3600000, // 1 hour
      persistToDisk: config.persistToDisk ?? false,
      persistPath: config.persistPath ?? '.cache',
      persistInterval: config.persistInterval ?? 60000, // 1 minute
      compressionEnabled: config.compressionEnabled ?? false,
      evictionPolicy: config.evictionPolicy ?? 'lru',
    };

    if (this.config.persistToDisk) {
      this.initPersistence();
    }
  }

  /**
   * 设置缓存
   */
  set(key: string, value: T, ttl?: number, metadata?: Record<string, any>): void {
    const entry: CacheEntry<T> = {
      value,
      timestamp: Date.now(),
      ttl: ttl ?? this.config.defaultTTL,
      hits: 0,
      metadata,
    };

    // 检查是否超过最大容量
    if (this.cache.size >= this.config.maxSize && !this.cache.has(key)) {
      this.evict();
    }

    this.cache.set(key, entry);
    this.updateAccess(key);
  }

  /**
   * 获取缓存
   */
  get(key: string): T | undefined {
    const entry = this.cache.get(key);

    if (!entry) {
      this.stats.misses++;
      return undefined;
    }

    // 检查是否过期
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.delete(key);
      this.stats.misses++;
      return undefined;
    }

    entry.hits++;
    this.stats.hits++;
    this.updateAccess(key);
    return entry.value;
  }

  /**
   * 检查缓存是否存在且未过期
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    if (Date.now() - entry.timestamp > entry.ttl) {
      this.delete(key);
      return false;
    }

    return true;
  }

  /**
   * 删除缓存
   */
  delete(key: string): boolean {
    this.accessOrder = this.accessOrder.filter(k => k !== key);
    this.accessFrequency.delete(key);
    return this.cache.delete(key);
  }

  /**
   * 清空所有缓存
   */
  clear(): void {
    this.cache.clear();
    this.accessOrder = [];
    this.accessFrequency.clear();
    this.stats = { hits: 0, misses: 0 };
  }

  /**
   * 获取或设置缓存
   */
  getOrSet(key: string, factory: () => T | Promise<T>, ttl?: number): T | Promise<T> {
    if (this.has(key)) {
      return this.get(key)!;
    }

    const value = factory();
    if (value instanceof Promise) {
      return value.then(v => {
        this.set(key, v, ttl);
        return v;
      });
    }

    this.set(key, value, ttl);
    return value;
  }

  /**
   * 批量获取
   */
  getMany(keys: string[]): Map<string, T> {
    const result = new Map<string, T>();
    for (const key of keys) {
      const value = this.get(key);
      if (value !== undefined) {
        result.set(key, value);
      }
    }
    return result;
  }

  /**
   * 批量设置
   */
  setMany(entries: Record<string, T>, ttl?: number): void {
    for (const [key, value] of Object.entries(entries)) {
      this.set(key, value, ttl);
    }
  }

  /**
   * 获取缓存统计信息
   */
  getStats(): CacheStats {
    const total = this.stats.hits + this.stats.misses;
    return {
      size: this.cache.size,
      hits: this.stats.hits,
      misses: this.stats.misses,
      hitRate: total > 0 ? this.stats.hits / total : 0,
      memoryUsage: this.estimateMemorySize(),
    };
  }

  /**
   * 获取所有键
   */
  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  /**
   * 获取所有值
   */
  values(): T[] {
    return Array.from(this.cache.values()).map(entry => entry.value);
  }

  /**
   * 根据模式获取键
   */
  keysByPattern(pattern: string): string[] {
    const regex = new RegExp(pattern);
    return this.keys().filter(key => regex.test(key));
  }

  /**
   * 根据模式删除缓存
   */
  deleteByPattern(pattern: string): number {
    const regex = new RegExp(pattern);
    const keysToDelete = this.keys().filter(key => regex.test(key));
    keysToDelete.forEach(key => this.delete(key));
    return keysToDelete.length;
  }

  /**
   * 更新访问记录
   */
  private updateAccess(key: string): void {
    // 更新访问顺序
    this.accessOrder = this.accessOrder.filter(k => k !== key);
    this.accessOrder.push(key);

    // 更新访问频率
    const freq = this.accessFrequency.get(key) || 0;
    this.accessFrequency.set(key, freq + 1);
  }

  /**
   * 淘汰缓存
   */
  private evict(): void {
    switch (this.config.evictionPolicy) {
      case 'lru':
        this.evictLRU();
        break;
      case 'lfu':
        this.evictLFU();
        break;
      case 'fifo':
        this.evictFIFO();
        break;
    }
  }

  /**
   * LRU 淘汰策略
   */
  private evictLRU(): void {
    if (this.accessOrder.length > 0) {
      const key = this.accessOrder[0];
      this.delete(key);
    }
  }

  /**
   * LFU 淘汰策略
   */
  private evictLFU(): void {
    let minFreq = Infinity;
    let keyToDelete = '';

    for (const [key, freq] of this.accessFrequency) {
      if (freq < minFreq) {
        minFreq = freq;
        keyToDelete = key;
      }
    }

    if (keyToDelete) {
      this.delete(keyToDelete);
    }
  }

  /**
   * FIFO 淘汰策略
   */
  private evictFIFO(): void {
    if (this.accessOrder.length > 0) {
      const key = this.accessOrder[0];
      this.delete(key);
    }
  }

  /**
   * 估算内存使用
   */
  private estimateMemorySize(): number {
    let size = 0;
    for (const [key, entry] of this.cache) {
      size += key.length + JSON.stringify(entry).length * 2;
    }
    return size;
  }

  /**
   * 初始化持久化
   */
  private async initPersistence(): Promise<void> {
    try {
      // 确保目录存在
      await fs.mkdir(this.config.persistPath, { recursive: true });

      // 从磁盘加载缓存
      await this.loadFromDisk();

      // 定期保存到磁盘
      this.persistTimer = setInterval(() => {
        this.saveToDisk().catch(console.error);
      }, this.config.persistInterval);
    } catch (error) {
      console.error('Failed to initialize cache persistence:', error);
    }
  }

  /**
   * 保存到磁盘
   */
  private async saveToDisk(): Promise<void> {
    try {
      const data = {
        cache: Array.from(this.cache.entries()),
        stats: this.stats,
        timestamp: Date.now(),
      };

      const filePath = path.join(this.config.persistPath, 'cache.json');
      await fs.writeFile(filePath, JSON.stringify(data), 'utf-8');
    } catch (error) {
      console.error('Failed to save cache to disk:', error);
    }
  }

  /**
   * 从磁盘加载
   */
  private async loadFromDisk(): Promise<void> {
    try {
      const filePath = path.join(this.config.persistPath, 'cache.json');
      const data = await fs.readFile(filePath, 'utf-8');
      const parsed = JSON.parse(data);

      this.cache = new Map(parsed.cache);
      this.stats = parsed.stats;

      // 重建访问顺序和频率
      for (const [key] of this.cache) {
        this.accessOrder.push(key);
        this.accessFrequency.set(key, 0);
      }
    } catch (error) {
      console.error('Failed to load cache from disk:', error);
    }
  }

  /**
   * 清理过期缓存
   */
  cleanup(): number {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, entry] of this.cache) {
      if (now - entry.timestamp > entry.ttl) {
        this.delete(key);
        cleaned++;
      }
    }

    return cleaned;
  }

  /**
   * 销毁缓存管理器
   */
  destroy(): void {
    if (this.persistTimer) {
      clearInterval(this.persistTimer);
    }

    if (this.config.persistToDisk) {
      this.saveToDisk().catch(console.error);
    }

    this.clear();
  }
}

/**
 * 创建全局缓存实例
 */
export function createCache<T = any>(config?: CacheConfig): AdvancedCacheManager<T> {
  return new AdvancedCacheManager<T>(config);
}

/**
 * 默认缓存实例
 */
export const defaultCache = new AdvancedCacheManager({
  maxSize: 1000,
  defaultTTL: 3600000,
  persistToDisk: false,
  evictionPolicy: 'lru',
});
