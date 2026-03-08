/**
 * Cache Service
 * 缓存服务 - 用于管理应用数据缓存
 */

export interface CacheEntry<T = any> {
  key: string;
  value: T;
  timestamp: number;
  ttl?: number;
  metadata?: Record<string, any>;
}

export interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  persistent?: boolean; // Whether to persist to localStorage
  metadata?: Record<string, any>;
}

export interface CacheStats {
  size: number;
  hits: number;
  misses: number;
  hitRate: number;
  keys: string[];
}

type CacheEventListener = (event: 'set' | 'get' | 'delete' | 'clear', key: string) => void;

class CacheService {
  private memoryCache: Map<string, CacheEntry>;
  private prefix: string = 'cyberpress_cache_';
  private stats: {
    hits: number;
    misses: number;
  };
  private listeners: Set<CacheEventListener>;

  constructor() {
    this.memoryCache = new Map();
    this.stats = {
      hits: 0,
      misses: 0,
    };
    this.listeners = new Set();

    if (typeof window !== 'undefined') {
      this.loadFromStorage();
      this.setupStorageListener();
    }
  }

  /**
   * Set cache entry
   */
  set<T>(key: string, value: T, options: CacheOptions = {}): void {
    const entry: CacheEntry<T> = {
      key,
      value,
      timestamp: Date.now(),
      ttl: options.ttl,
      metadata: options.metadata,
    };

    this.memoryCache.set(key, entry);

    if (options.persistent !== false) {
      this.setToStorage(key, entry);
    }

    this.notify('set', key);
  }

  /**
   * Get cache entry
   */
  get<T>(key: string): T | null {
    const entry = this.memoryCache.get(key);

    if (!entry) {
      this.stats.misses++;
      return null;
    }

    // Check if expired
    if (this.isExpired(entry)) {
      this.delete(key);
      this.stats.misses++;
      return null;
    }

    this.stats.hits++;
    this.notify('get', key);
    return entry.value as T;
  }

  /**
   * Check if key exists and is not expired
   */
  has(key: string): boolean {
    const entry = this.memoryCache.get(key);
    return entry !== undefined && !this.isExpired(entry);
  }

  /**
   * Delete cache entry
   */
  delete(key: string): boolean {
    const deleted = this.memoryCache.delete(key);
    if (deleted) {
      this.deleteFromStorage(key);
      this.notify('delete', key);
    }
    return deleted;
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.memoryCache.clear();
    this.clearFromStorage();
    this.notify('clear', '*');
  }

  /**
   * Get multiple entries
   */
  getMany<T>(keys: string[]): Map<string, T> {
    const result = new Map<string, T>();

    keys.forEach(key => {
      const value = this.get<T>(key);
      if (value !== null) {
        result.set(key, value);
      }
    });

    return result;
  }

  /**
   * Set multiple entries
   */
  setMany<T>(entries: Map<string, T>, options: CacheOptions = {}): void {
    entries.forEach((value, key) => {
      this.set(key, value, options);
    });
  }

  /**
   * Get or set - retrieve value or compute and cache it
   */
  getOrSet<T>(
    key: string,
    factory: () => T | Promise<T>,
    options: CacheOptions = {}
  ): T | Promise<T> {
    const cached = this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const value = factory();
    if (value instanceof Promise) {
      return value.then(v => {
        this.set(key, v, options);
        return v;
      });
    } else {
      this.set(key, value, options);
      return value;
    }
  }

  /**
   * Get all keys
   */
  keys(): string[] {
    return Array.from(this.memoryCache.keys());
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    const total = this.stats.hits + this.stats.misses;
    const hitRate = total > 0 ? this.stats.hits / total : 0;

    return {
      size: this.memoryCache.size,
      hits: this.stats.hits,
      misses: this.stats.misses,
      hitRate,
      keys: this.keys(),
    };
  }

  /**
   * Reset statistics
   */
  resetStats(): void {
    this.stats = {
      hits: 0,
      misses: 0,
    };
  }

  /**
   * Clean expired entries
   */
  cleanExpired(): number {
    let cleaned = 0;

    this.memoryCache.forEach((entry, key) => {
      if (this.isExpired(entry)) {
        this.delete(key);
        cleaned++;
      }
    });

    return cleaned;
  }

  /**
   * Get entries by pattern
   */
  getByPattern(pattern: string): Map<string, any> {
    const regex = new RegExp(pattern);
    const result = new Map<string, any>();

    this.memoryCache.forEach((entry, key) => {
      if (regex.test(key) && !this.isExpired(entry)) {
        result.set(key, entry.value);
      }
    });

    return result;
  }

  /**
   * Delete entries by pattern
   */
  deleteByPattern(pattern: string): number {
    const regex = new RegExp(pattern);
    let deleted = 0;

    this.memoryCache.forEach((entry, key) => {
      if (regex.test(key)) {
        this.delete(key);
        deleted++;
      }
    });

    return deleted;
  }

  /**
   * Subscribe to cache events
   */
  on(event: CacheEventListener): () => void {
    this.listeners.add(event);

    // Return unsubscribe function
    return () => {
      this.listeners.delete(event);
    };
  }

  private notify(event: 'set' | 'get' | 'delete' | 'clear', key: string): void {
    this.listeners.forEach(listener => listener(event, key));
  }

  private isExpired(entry: CacheEntry): boolean {
    if (!entry.ttl) return false;
    return Date.now() - entry.timestamp > entry.ttl;
  }

  private getStorageKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  private setToStorage(key: string, entry: CacheEntry): void {
    if (typeof window === 'undefined') return;

    try {
      const storageKey = this.getStorageKey(key);
      localStorage.setItem(storageKey, JSON.stringify(entry));
    } catch (error) {
      console.error('Failed to save cache to storage:', error);
    }
  }

  private getFromStorage(key: string): CacheEntry | null {
    if (typeof window === 'undefined') return null;

    try {
      const storageKey = this.getStorageKey(key);
      const item = localStorage.getItem(storageKey);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Failed to load cache from storage:', error);
      return null;
    }
  }

  private deleteFromStorage(key: string): void {
    if (typeof window === 'undefined') return;

    try {
      const storageKey = this.getStorageKey(key);
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.error('Failed to delete cache from storage:', error);
    }
  }

  private clearFromStorage(): void {
    if (typeof window === 'undefined') return;

    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Failed to clear cache from storage:', error);
    }
  }

  private loadFromStorage(): void {
    if (typeof window === 'undefined') return;

    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          const entry = this.getFromStorage(key.replace(this.prefix, ''));
          if (entry && !this.isExpired(entry)) {
            this.memoryCache.set(entry.key, entry);
          }
        }
      });
    } catch (error) {
      console.error('Failed to load cache from storage:', error);
    }
  }

  private setupStorageListener(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('storage', (event) => {
      if (event.key && event.key.startsWith(this.prefix)) {
        const key = event.key.replace(this.prefix, '');

        if (event.newValue === null) {
          // Key was deleted
          this.memoryCache.delete(key);
        } else {
          // Key was updated
          try {
            const entry = JSON.parse(event.newValue) as CacheEntry;
            if (!this.isExpired(entry)) {
              this.memoryCache.set(key, entry);
            }
          } catch (error) {
            console.error('Failed to parse storage event:', error);
          }
        }
      }
    });
  }

  /**
   * Export cache as JSON
   */
  export(): string {
    const data: Record<string, CacheEntry> = {};

    this.memoryCache.forEach((entry, key) => {
      if (!this.isExpired(entry)) {
        data[key] = entry;
      }
    });

    return JSON.stringify(data);
  }

  /**
   * Import cache from JSON
   */
  import(json: string): void {
    try {
      const data = JSON.parse(json) as Record<string, CacheEntry>;

      Object.entries(data).forEach(([key, entry]) => {
        if (!this.isExpired(entry)) {
          this.memoryCache.set(key, entry);
        }
      });
    } catch (error) {
      console.error('Failed to import cache:', error);
    }
  }

  /**
   * Get cache size in bytes (approximate)
   */
  getSize(): number {
    let size = 0;

    this.memoryCache.forEach((entry) => {
      size += JSON.stringify(entry).length * 2; // UTF-16
    });

    return size;
  }

  /**
   * Get human-readable size
   */
  getReadableSize(): string {
    const bytes = this.getSize();
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`;
  }
}

// Create singleton instance
const cacheService = new CacheService();

export default cacheService;
export function getCacheService(): CacheService {
  return cacheService;
}

// Convenience functions
export function cache<T>(
  key: string,
  factory: () => T | Promise<T>,
  options?: CacheOptions
): T | Promise<T> {
  return cacheService.getOrSet(key, factory, options);
}

export function getCached<T>(key: string): T | null {
  return cacheService.get<T>(key);
}

export function setCached<T>(key: string, value: T, options?: CacheOptions): void {
  cacheService.set(key, value, options);
}

export function deleteCached(key: string): boolean {
  return cacheService.delete(key);
}

export function clearCache(): void {
  cacheService.clear();
}
