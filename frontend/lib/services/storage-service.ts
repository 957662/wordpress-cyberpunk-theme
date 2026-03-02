/**
 * Storage Service - 本地存储服务
 * 提供统一的 localStorage 和 sessionStorage 操作
 */

type StorageType = 'localStorage' | 'sessionStorage';

class StorageService {
  /**
   * 获取存储对象
   */
  private getStorage(type: StorageType): Storage {
    if (typeof window === 'undefined') {
      throw new Error('Storage is only available in the browser');
    }
    return type === 'localStorage' ? window.localStorage : window.sessionStorage;
  }

  /**
   * 设置值
   */
  set<T>(key: string, value: T, type: StorageType = 'localStorage'): void {
    try {
      const storage = this.getStorage(type);
      const serialized = JSON.stringify(value);
      storage.setItem(key, serialized);
    } catch (error) {
      console.error('Error setting storage:', error);
    }
  }

  /**
   * 获取值
   */
  get<T>(key: string, defaultValue?: T, type: StorageType = 'localStorage'): T | null {
    try {
      const storage = this.getStorage(type);
      const item = storage.getItem(key);
      if (item === null) {
        return defaultValue ?? null;
      }
      return JSON.parse(item) as T;
    } catch (error) {
      console.error('Error getting storage:', error);
      return defaultValue ?? null;
    }
  }

  /**
   * 删除值
   */
  remove(key: string, type: StorageType = 'localStorage'): void {
    try {
      const storage = this.getStorage(type);
      storage.removeItem(key);
    } catch (error) {
      console.error('Error removing storage:', error);
    }
  }

  /**
   * 清空所有
   */
  clear(type: StorageType = 'localStorage'): void {
    try {
      const storage = this.getStorage(type);
      storage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }

  /**
   * 检查键是否存在
   */
  has(key: string, type: StorageType = 'localStorage'): boolean {
    try {
      const storage = this.getStorage(type);
      return storage.getItem(key) !== null;
    } catch (error) {
      console.error('Error checking storage:', error);
      return false;
    }
  }

  /**
   * 获取所有键
   */
  keys(type: StorageType = 'localStorage'): string[] {
    try {
      const storage = this.getStorage(type);
      return Object.keys(storage);
    } catch (error) {
      console.error('Error getting storage keys:', error);
      return [];
    }
  }

  /**
   * 获取存储大小（字节）
   */
  getSize(type: StorageType = 'localStorage'): number {
    try {
      const storage = this.getStorage(type);
      let size = 0;
      for (const key in storage) {
        if (storage.hasOwnProperty(key)) {
          size += storage[key].length + key.length;
        }
      }
      return size;
    } catch (error) {
      console.error('Error calculating storage size:', error);
      return 0;
    }
  }

  /**
   * 设置带过期时间的值
   */
  setWithExpiry<T>(
    key: string,
    value: T,
    expiryMs: number,
    type: StorageType = 'localStorage'
  ): void {
    const expiry = Date.now() + expiryMs;
    this.set(key, { value, expiry }, type);
  }

  /**
   * 获取带过期时间的值
   */
  getWithExpiry<T>(key: string, type: StorageType = 'localStorage'): T | null {
    const item = this.get<{ value: T; expiry: number }>(key, undefined, type);
    if (!item) {
      return null;
    }

    if (Date.now() > item.expiry) {
      this.remove(key, type);
      return null;
    }

    return item.value;
  }
}

// 导出单例
export const storageService = new StorageService();

// 便捷方法
export const localStorage = {
  set: <T>(key: string, value: T) => storageService.set(key, value, 'localStorage'),
  get: <T>(key: string, defaultValue?: T) =>
    storageService.get<T>(key, defaultValue, 'localStorage'),
  remove: (key: string) => storageService.remove(key, 'localStorage'),
  clear: () => storageService.clear('localStorage'),
  has: (key: string) => storageService.has(key, 'localStorage'),
  keys: () => storageService.keys('localStorage'),
  getSize: () => storageService.getSize('localStorage'),
  setWithExpiry: <T>(key: string, value: T, expiryMs: number) =>
    storageService.setWithExpiry(key, value, expiryMs, 'localStorage'),
  getWithExpiry: <T>(key: string) =>
    storageService.getWithExpiry<T>(key, 'localStorage'),
};

export const sessionStorage = {
  set: <T>(key: string, value: T) => storageService.set(key, value, 'sessionStorage'),
  get: <T>(key: string, defaultValue?: T) =>
    storageService.get<T>(key, defaultValue, 'sessionStorage'),
  remove: (key: string) => storageService.remove(key, 'sessionStorage'),
  clear: () => storageService.clear('sessionStorage'),
  has: (key: string) => storageService.has(key, 'sessionStorage'),
  keys: () => storageService.keys('sessionStorage'),
  getSize: () => storageService.getSize('sessionStorage'),
};

export default storageService;
