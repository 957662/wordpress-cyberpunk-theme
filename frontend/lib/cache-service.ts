/**
 * Cache Service - Client-side caching with TTL support
 * Provides simple in-memory caching for frequently accessed data.
 */

interface CacheEntry<T> {
  value: T;
  expiry: number;
}

interface CacheStats {
  hits: number;
  misses: number;
  sets: number;
  deletes: number;
  size: number;
  hitRate: number;
}

export class CacheService<T = any> {
  private cache: Map<string, CacheEntry<T>> = new Map();
  private stats = {
    hits: 0,
    misses: 0,
    sets: 0,
    deletes: 0,
  };

  /**
   * Get a value from the cache.
   */
  get(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      this.stats.misses++;
      return null;
    }

    // Check if expired
    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      this.stats.misses++;
      return null;
    }

    this.stats.hits++;
    return entry.value;
  }

  /**
   * Set a value in the cache with TTL.
   */
  set(key: string, value: T, ttl: number = 300000): void {
    const expiry = Date.now() + ttl * 1000;
    this.cache.set(key, { value, expiry });
    this.stats.sets++;
  }

  /**
   * Delete a value from the cache.
   */
  delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    if (deleted) {
      this.stats.deletes++;
    }
    return deleted;
  }

  /**
   * Clear all cached values.
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Remove all expired entries from the cache.
   */
  cleanup(): number {
    let removed = 0;
    const now = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiry) {
        this.cache.delete(key);
        removed++;
      }
    }

    return removed;
  }

  /**
   * Get cache statistics.
   */
  getStats(): CacheStats {
    const totalRequests = this.stats.hits + this.stats.misses;
    const hitRate = totalRequests > 0 ? (this.stats.hits / totalRequests) * 100 : 0;

    return {
      ...this.stats,
      size: this.cache.size,
      hitRate: Math.round(hitRate * 100) / 100,
    };
  }

  /**
   * Generate a cache key from arguments.
   */
  generateKey(...args: any[]): string {
    return args
      .map((arg) => {
        if (typeof arg === 'string' || typeof arg === 'number') {
          return String(arg);
        } else if (arg && typeof arg === 'object') {
          return JSON.stringify(arg);
        }
        return String(arg);
      })
      .join(':');
  }
}

// Global cache instance
export const cache = new CacheService();

/**
 * Decorator pattern for caching async function results.
 */
export function cached<T extends (...args: any[]) => Promise<any>>(
  ttl: number = 300,
  keyPrefix: string = ''
) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const key = `${keyPrefix}:${cache.generateKey(propertyKey, ...args)}`;

      // Try to get from cache
      const cachedValue = cache.get(key);
      if (cachedValue !== null) {
        return cachedValue;
      }

      // Execute function
      const result = await originalMethod.apply(this, args);

      // Cache result
      cache.set(key, result, ttl);

      return result;
    };

    return descriptor;
  };
}

/**
 * Cache invalidator utility.
 */
export class CacheInvalidator {
  /**
   * Invalidate all cache entries matching a pattern.
   */
  static invalidatePattern(pattern: string): number {
    let invalidated = 0;

    for (const key of cache['cache'].keys()) {
      if (key.includes(pattern)) {
        cache.delete(key);
        invalidated++;
      }
    }

    return invalidated;
  }

  /**
   * Invalidate user-related cache entries.
   */
  static invalidateUser(userId: number): number {
    return this.invalidatePattern(`user:${userId}`);
  }

  /**
   * Invalidate post-related cache entries.
   */
  static invalidatePost(postId: number): number {
    return this.invalidatePattern(`post:${postId}`);
  }

  /**
   * Invalidate posts list cache.
   */
  static invalidatePostsList(): number {
    let invalidated = 0;
    invalidated += cache.delete('posts:all') ? 1 : 0;
    invalidated += cache.delete('posts:featured') ? 1 : 0;
    return invalidated;
  }
}

/**
 * Start periodic cache cleanup.
 */
export function startCacheCleanup(interval: number = 300000): () => void {
  const timer = setInterval(() => {
    const removed = cache.cleanup();
    if (removed > 0) {
      console.log(`Cache cleanup: removed ${removed} expired entries`);
    }
  }, interval);

  return () => clearInterval(timer);
}

/**
 * React hook for using the cache service.
 */
export function useCache<T = any>() {
  const [stats, setStats] = useState(cache.getStats());

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(cache.getStats());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return {
    cache,
    stats,
    get: cache.get.bind(cache),
    set: cache.set.bind(cache),
    delete: cache.delete.bind(cache),
    clear: cache.clear.bind(cache),
  };
}

import { useState, useEffect } from 'react';
