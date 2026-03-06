/**
 * 本地存储管理工具
 * 提供统一的本地存储接口,支持 localStorage, sessionStorage, IndexedDB
 */

import { performanceTracker } from '@/lib/monitoring/performance-tracker';

// =====================================================
// 存储类型定义
// =====================================================

export type StorageType = 'local' | 'session' | 'indexedDB' | 'memory';

export interface StorageOptions {
  prefix?: string;
  expiration?: number; // 过期时间(毫秒)
  serialize?: boolean; // 是否序列化
  compress?: boolean; // 是否压缩
}

export interface StoredValue<T = any> {
  value: T;
  timestamp: number;
  expiration?: number;
  version?: string;
}

export interface StorageStats {
  type: StorageType;
  count: number;
  size: number;
  keys: string[];
}

// =====================================================
// 内存存储 (作为 fallback)
// =====================================================

class MemoryStorage {
  private store = new Map<string, StoredValue>();

  setItem(key: string, value: string): void {
    this.store.set(key, JSON.parse(value));
  }

  getItem(key: string): string | null {
    const value = this.store.get(key);
    return value ? JSON.stringify(value) : null;
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }

  key(index: number): string | null {
    const keys = Array.from(this.store.keys());
    return keys[index] || null;
  }

  get length(): number {
    return this.store.size;
  }
}

// =====================================================
// 存储管理器类
// =====================================================

class StorageManager {
  private prefix = 'cyberpress_';
  private defaultExpiration = 7 * 24 * 60 * 60 * 1000; // 7天
  private memoryStorage = new MemoryStorage();
  private indexedDB: IDBDatabase | null = null;

  // =====================================================
  // 公共方法
  // =====================================================

  /**
   * 设置前缀
   */
  setPrefix(prefix: string) {
    this.prefix = prefix;
  }

  /**
   * 设置默认过期时间
   */
  setDefaultExpiration(ms: number) {
    this.defaultExpiration = ms;
  }

  // =====================================================
  // localStorage 操作
  // =====================================================

  /**
   * 保存到 localStorage
   */
  setLocal<T>(key: string, value: T, options: StorageOptions = {}): boolean {
    return this.set(key, value, 'local', options);
  }

  /**
   * 从 localStorage 获取
   */
  getLocal<T>(key: string, defaultValue?: T): T | null {
    return this.get(key, 'local') ?? defaultValue ?? null;
  }

  /**
   * 从 localStorage 删除
   */
  removeLocal(key: string): void {
    this.remove(key, 'local');
  }

  /**
   * 清空 localStorage
   */
  clearLocal(): void {
    this.clear('local');
  }

  // =====================================================
  // sessionStorage 操作
  // =====================================================

  /**
   * 保存到 sessionStorage
   */
  setSession<T>(key: string, value: T, options: StorageOptions = {}): boolean {
    return this.set(key, value, 'session', options);
  }

  /**
   * 从 sessionStorage 获取
   */
  getSession<T>(key: string, defaultValue?: T): T | null {
    return this.get(key, 'session') ?? defaultValue ?? null;
  }

  /**
   * 从 sessionStorage 删除
   */
  removeSession(key: string): void {
    this.remove(key, 'session');
  }

  /**
   * 清空 sessionStorage
   */
  clearSession(): void {
    this.clear('session');
  }

  // =====================================================
  // IndexedDB 操作
  // =====================================================

  /**
   * 初始化 IndexedDB
   */
  private async initIndexedDB(): Promise<IDBDatabase> {
    if (this.indexedDB) {
      return this.indexedDB;
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open('CyberPressDB', 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.indexedDB = request.result;
        resolve(request.result);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // 创建存储对象
        if (!db.objectStoreNames.contains('storage')) {
          const store = db.createObjectStore('storage', { keyPath: 'key' });
          store.createIndex('timestamp', 'timestamp', { unique: false });
          store.createIndex('expiration', 'expiration', { unique: false });
        }
      };
    });
  }

  /**
   * 保存到 IndexedDB
   */
  async setIndexedDB<T>(key: string, value: T, options: StorageOptions = {}): Promise<boolean> {
    try {
      const db = await this.initIndexedDB();
      const store = db.transaction(['storage'], 'readwrite').objectStore('storage');

      const storedValue: StoredValue<T> = {
        value,
        timestamp: Date.now(),
        expiration: options.expiration || (Date.now() + this.defaultExpiration),
      };

      const request = store.put({ key: this.getKey(key), ...storedValue });

      return new Promise((resolve) => {
        request.onsuccess = () => resolve(true);
        request.onerror = () => resolve(false);
      });
    } catch (error) {
      console.error('IndexedDB set error:', error);
      return false;
    }
  }

  /**
   * 从 IndexedDB 获取
   */
  async getIndexedDB<T>(key: string): Promise<T | null> {
    try {
      const db = await this.initIndexedDB();
      const store = db.transaction(['storage'], 'readonly').objectStore('storage');

      return new Promise((resolve) => {
        const request = store.get(this.getKey(key));

        request.onsuccess = () => {
          const result = request.result as StoredValue<T> | undefined;

          if (!result) {
            resolve(null);
            return;
          }

          // 检查是否过期
          if (result.expiration && result.expiration < Date.now()) {
            this.removeIndexedDB(key);
            resolve(null);
            return;
          }

          resolve(result.value);
        };

        request.onerror = () => resolve(null);
      });
    } catch (error) {
      console.error('IndexedDB get error:', error);
      return null;
    }
  }

  /**
   * 从 IndexedDB 删除
   */
  async removeIndexedDB(key: string): Promise<void> {
    try {
      const db = await this.initIndexedDB();
      const store = db.transaction(['storage'], 'readwrite').objectStore('storage');

      return new Promise((resolve) => {
        const request = store.delete(this.getKey(key));

        request.onsuccess = () => resolve();
        request.onerror = () => resolve();
      });
    } catch (error) {
      console.error('IndexedDB remove error:', error);
    }
  }

  // =====================================================
  // 通用存储操作
  // =====================================================

  /**
   * 保存数据
   */
  private set<T>(key: string, value: T, type: 'local' | 'session', options: StorageOptions = {}): boolean {
    try {
      const storage = this.getStorage(type);
      const fullKey = this.getKey(key, options.prefix);

      const storedValue: StoredValue<T> = {
        value,
        timestamp: Date.now(),
        expiration: options.expiration || (Date.now() + this.defaultExpiration),
        version: options.serialize ? 'v1' : undefined,
      };

      const serialized = JSON.stringify(storedValue);
      storage.setItem(fullKey, serialized);

      return true;
    } catch (error) {
      console.error(`Storage set error (${type}):`, error);

      // 如果是 quota exceeded error,尝试清理过期数据
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        this.cleanExpired(type);
      }

      return false;
    }
  }

  /**
   * 获取数据
   */
  private get<T>(key: string, type: 'local' | 'session'): T | null {
    try {
      const storage = this.getStorage(type);
      const fullKey = this.getKey(key);
      const serialized = storage.getItem(fullKey);

      if (!serialized) {
        return null;
      }

      const storedValue: StoredValue<T> = JSON.parse(serialized);

      // 检查是否过期
      if (storedValue.expiration && storedValue.expiration < Date.now()) {
        this.remove(key, type);
        return null;
      }

      return storedValue.value;
    } catch (error) {
      console.error(`Storage get error (${type}):`, error);
      return null;
    }
  }

  /**
   * 删除数据
   */
  private remove(key: string, type: 'local' | 'session'): void {
    try {
      const storage = this.getStorage(type);
      const fullKey = this.getKey(key);
      storage.removeItem(fullKey);
    } catch (error) {
      console.error(`Storage remove error (${type}):`, error);
    }
  }

  /**
   * 清空存储
   */
  private clear(type: 'local' | 'session'): void {
    try {
      const storage = this.getStorage(type);
      const keys = this.getAllKeys(type);

      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          storage.removeItem(key);
        }
      });
    } catch (error) {
      console.error(`Storage clear error (${type}):`, error);
    }
  }

  // =====================================================
  // 工具方法
  // =====================================================

  /**
   * 获取存储对象
   */
  private getStorage(type: 'local' | 'session'): Storage {
    try {
      return type === 'local' ? window.localStorage : window.sessionStorage;
    } catch (error) {
      console.error(`Storage unavailable (${type}), using memory storage`);
      return this.memoryStorage;
    }
  }

  /**
   * 获取完整键名
   */
  private getKey(key: string, prefix?: string): string {
    return `${prefix || this.prefix}${key}`;
  }

  /**
   * 获取所有键
   */
  private getAllKeys(type: 'local' | 'session'): string[] {
    const storage = this.getStorage(type);
    const keys: string[] = [];

    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i);
      if (key) {
        keys.push(key);
      }
    }

    return keys;
  }

  /**
   * 清理过期数据
   */
  private cleanExpired(type: 'local' | 'session'): void {
    const keys = this.getAllKeys(type);
    const now = Date.now();

    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        try {
          const storage = this.getStorage(type);
          const serialized = storage.getItem(key);

          if (serialized) {
            const storedValue: StoredValue = JSON.parse(serialized);

            if (storedValue.expiration && storedValue.expiration < now) {
              storage.removeItem(key);
            }
          }
        } catch (error) {
          // 忽略解析错误,直接删除
          const storage = this.getStorage(type);
          storage.removeItem(key);
        }
      }
    });
  }

  // =====================================================
  // 高级功能
  // =====================================================

  /**
   * 获取存储统计信息
   */
  getStats(type: 'local' | 'session' | 'indexedDB' = 'local'): StorageStats {
    if (type === 'indexedDB') {
      return {
        type,
        count: 0,
        size: 0,
        keys: [],
      };
    }

    const storage = this.getStorage(type);
    const keys = this.getAllKeys(type).filter(key => key.startsWith(this.prefix));
    let size = 0;

    keys.forEach(key => {
      const value = storage.getItem(key);
      if (value) {
        size += value.length;
      }
    });

    return {
      type,
      count: keys.length,
      size,
      keys,
    };
  }

  /**
   * 批量操作
   */
  async batchSet<T>(items: Array<{ key: string; value: T }>, type: 'local' | 'session' = 'local'): Promise<boolean[]> {
    return Promise.all(items.map(item => Promise.resolve(this.set(item.key, item.value, type))));
  }

  async batchGet<T>(keys: string[], type: 'local' | 'session' = 'local'): Promise<(T | null)[]> {
    return Promise.all(keys.map(key => Promise.resolve(this.get<T>(key, type))));
  }

  async batchRemove(keys: string[], type: 'local' | 'session' = 'local'): Promise<void> {
    keys.forEach(key => this.remove(key, type));
  }

  /**
   * 导出数据
   */
  exportData(type: 'local' | 'session' = 'local'): Record<string, any> {
    const keys = this.getAllKeys(type).filter(key => key.startsWith(this.prefix));
    const storage = this.getStorage(type);
    const data: Record<string, any> = {};

    keys.forEach(key => {
      const value = storage.getItem(key);
      if (value) {
        try {
          const parsed = JSON.parse(value);
          data[key.replace(this.prefix, '')] = parsed;
        } catch {
          data[key.replace(this.prefix, '')] = value;
        }
      }
    });

    return data;
  }

  /**
   * 导入数据
   */
  importData(data: Record<string, any>, type: 'local' | 'session' = 'local'): boolean {
    try {
      const storage = this.getStorage(type);

      Object.entries(data).forEach(([key, value]) => {
        const fullKey = this.getKey(key);
        const serialized = typeof value === 'string' ? value : JSON.stringify(value);
        storage.setItem(fullKey, serialized);
      });

      return true;
    } catch (error) {
      console.error('Import error:', error);
      return false;
    }
  }
}

// =====================================================
// 导出单例
// =====================================================

export const storageManager = new StorageManager();

// =====================================================
// 便捷函数
// =====================================================

export const storage = {
  // LocalStorage
  set: <T>(key: string, value: T, options?: StorageOptions) => storageManager.setLocal(key, value, options),
  get: <T>(key: string, defaultValue?: T) => storageManager.getLocal<T>(key, defaultValue),
  remove: (key: string) => storageManager.removeLocal(key),
  clear: () => storageManager.clearLocal(),

  // SessionStorage
  setSession: <T>(key: string, value: T, options?: StorageOptions) => storageManager.setSession(key, value, options),
  getSession: <T>(key: string, defaultValue?: T) => storageManager.getSession<T>(key, defaultValue),
  removeSession: (key: string) => storageManager.removeSession(key),
  clearSession: () => storageManager.clearSession(),

  // IndexedDB
  setIndexedDB: <T>(key: string, value: T, options?: StorageOptions) => storageManager.setIndexedDB(key, value, options),
  getIndexedDB: <T>(key: string) => storageManager.getIndexedDB<T>(key),
  removeIndexedDB: (key: string) => storageManager.removeIndexedDB(key),

  // 批量操作
  batchSet: <T>(items: Array<{ key: string; value: T }>, type?: 'local' | 'session') => storageManager.batchSet(items, type),
  batchGet: <T>(keys: string[], type?: 'local' | 'session') => storageManager.batchGet<T>(keys, type),
  batchRemove: (keys: string[], type?: 'local' | 'session') => storageManager.batchRemove(keys, type),

  // 统计
  getStats: (type?: 'local' | 'session' | 'indexedDB') => storageManager.getStats(type),
  exportData: (type?: 'local' | 'session') => storageManager.exportData(type),
  importData: (data: Record<string, any>, type?: 'local' | 'session') => storageManager.importData(data, type),
};

// =====================================================
// 默认导出
// =====================================================

export default storageManager;
