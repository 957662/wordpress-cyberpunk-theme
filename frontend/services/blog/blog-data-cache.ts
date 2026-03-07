/**
 * Blog Data Cache Service
 * 博客数据缓存服务
 * 提供智能缓存和数据预加载
 */

import { wordpressDataService } from './wordpress-data-service';
import type { BlogPost, Category, Tag } from '@/types/models';

interface CacheConfig {
  ttl: number; // Time to live in milliseconds
  maxSize: number;
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  hits: number;
}

class BlogDataCache {
  private cache: Map<string, CacheEntry<any>>;
  private config: CacheConfig;
  private prefetchQueue: Set<string>;

  constructor(config: Partial<CacheConfig> = {}) {
    this.cache = new Map();
    this.prefetchQueue = new Set();
    this.config = {
      ttl: config.ttl || 5 * 60 * 1000, // 5 minutes default
      maxSize: config.maxSize || 100,
    };
  }

  /**
   * 生成缓存键
   */
  private generateKey(type: string, params: any): string {
    return `${type}:${JSON.stringify(params)}`;
  }

  /**
   * 检查缓存是否有效
   */
  private isValid(entry: CacheEntry<any>): boolean {
    const now = Date.now();
    return (now - entry.timestamp) < this.config.ttl;
  }

  /**
   * 清理过期缓存
   */
  private cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    this.cache.forEach((entry, key) => {
      if ((now - entry.timestamp) >= this.config.ttl) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => this.cache.delete(key));

    // 如果缓存过大，删除最少使用的项
    if (this.cache.size > this.config.maxSize) {
      const entries = Array.from(this.cache.entries())
        .sort((a, b) => a[1].hits - b[1].hits);

      const toDelete = entries.slice(0, this.cache.size - this.config.maxSize);
      toDelete.forEach(([key]) => this.cache.delete(key));
    }
  }

  /**
   * 获取缓存数据
   */
  get<T>(type: string, params: any): T | null {
    const key = this.generateKey(type, params);
    const entry = this.cache.get(key);

    if (entry && this.isValid(entry)) {
      entry.hits++;
      return entry.data as T;
    }

    if (entry) {
      this.cache.delete(key);
    }

    return null;
  }

  /**
   * 设置缓存数据
   */
  set<T>(type: string, params: any, data: T): void {
    this.cleanup();

    const key = this.generateKey(type, params);
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      hits: 0,
    });
  }

  /**
   * 清除特定缓存
   */
  invalidate(type: string, params?: any): void {
    if (params) {
      const key = this.generateKey(type, params);
      this.cache.delete(key);
    } else {
      // 清除该类型的所有缓存
      const keysToDelete: string[] = [];
      this.cache.forEach((_, key) => {
        if (key.startsWith(type)) {
          keysToDelete.push(key);
        }
      });
      keysToDelete.forEach(key => this.cache.delete(key));
    }
  }

  /**
   * 清除所有缓存
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * 预加载数据
   */
  async prefetch(type: string, params: any): Promise<void> {
    const key = this.generateKey(type, params);

    if (this.prefetchQueue.has(key) || this.get(type, params)) {
      return;
    }

    this.prefetchQueue.add(key);

    try {
      let data;
      switch (type) {
        case 'posts':
          data = await wordpressDataService.getPosts(params);
          break;
        case 'post':
          data = await wordpressDataService.getPost(params.id);
          break;
        case 'categories':
          data = await wordpressDataService.getCategories(params);
          break;
        case 'tags':
          data = await wordpressDataService.getTags(params);
          break;
        default:
          return;
      }

      this.set(type, params, data);
    } catch (error) {
      console.error('Prefetch error:', error);
    } finally {
      this.prefetchQueue.delete(key);
    }
  }

  /**
   * 获取缓存统计
   */
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.config.maxSize,
      ttl: this.config.ttl,
      entries: Array.from(this.cache.entries()).map(([key, entry]) => ({
        key,
        hits: entry.hits,
        age: Date.now() - entry.timestamp,
      })),
    };
  }
}

// 创建默认缓存实例
export const blogCache = new BlogDataCache({
  ttl: 5 * 60 * 1000, // 5 minutes
  maxSize: 100,
});

// 创建长缓存实例（用于不常变化的数据）
export const blogLongCache = new BlogDataCache({
  ttl: 60 * 60 * 1000, // 1 hour
  maxSize: 50,
});

export default blogCache;
