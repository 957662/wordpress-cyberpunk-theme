/**
 * StorageService
 * 本地存储服务 - 统一的存储 API
 */

'use client';

// ============================================
// 类型定义
// ============================================

export interface StorageOptions {
  /** 前缀（用于命名空间隔离） */
  prefix?: string;
  /** 是否序列化为 JSON */
  json?: boolean;
  /** 过期时间（毫秒） */
  ttl?: number;
}

export interface StorageItem<T = any> {
  value: T;
  expires?: number;
}

// ============================================
// StorageService 类
// ============================================

class StorageService {
  private prefix: string;
  private defaultJSON: boolean;
  private storage: Storage;

  constructor(
    storage: Storage,
    options: StorageOptions = {}
  ) {
    this.storage = storage;
    this.prefix = options.prefix ?? 'app_';
    this.defaultJSON = options.json ?? true;
  }

  /**
   * 生成带前缀的键
   */
  private getKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  /**
   * 检查项是否过期
   */
  private isExpired(item: StorageItem): boolean {
    if (!item.expires) return false;
    return Date.now() > item.expires;
  }

  /**
   * 设置值
   */
  set<T>(key: string, value: T, options: StorageOptions = {}): void {
    const { json = this.defaultJSON, ttl } = options;
    const storageKey = this.getKey(key);

    const item: StorageItem<T> = {
      value,
    };

    // 设置过期时间
    if (ttl) {
      item.expires = Date.now() + ttl;
    }

    const serialized = json ? JSON.stringify(item) : String(item.value);
    this.storage.setItem(storageKey, serialized);
  }

  /**
   * 获取值
   */
  get<T>(key: string, defaultValue?: T): T | undefined {
    const storageKey = this.getKey(key);
    const item = this.storage.getItem(storageKey);

    if (!item) {
      return defaultValue;
    }

    try {
      const parsed = JSON.parse(item) as StorageItem<T>;

      // 检查是否过期
      if (this.isExpired(parsed)) {
        this.remove(key);
        return defaultValue;
      }

      return parsed.value;
    } catch {
      // 如果不是 JSON，直接返回
      return item as unknown as T;
    }
  }

  /**
   * 删除值
   */
  remove(key: string): void {
    const storageKey = this.getKey(key);
    this.storage.removeItem(storageKey);
  }

  /**
   * 清空所有带前缀的项
   */
  clear(): void {
    const keys = this.keys();
    keys.forEach((key) => this.remove(key));
  }

  /**
   * 检查键是否存在
   */
  has(key: string): boolean {
    const storageKey = this.getKey(key);
    return this.storage.getItem(storageKey) !== null;
  }

  /**
   * 获取所有带前缀的键
   */
  keys(): string[] {
    const allKeys = Object.keys(this.storage);
    return allKeys
      .filter((key) => key.startsWith(this.prefix))
      .map((key) => key.slice(this.prefix.length));
  }

  /**
   * 获取存储大小（字节）
   */
  size(): number {
    let total = 0;
    const keys = this.keys();

    keys.forEach((key) => {
      const storageKey = this.getKey(key);
      const item = this.storage.getItem(storageKey);
      if (item) {
        total += item.length * 2; // UTF-16 编码，每个字符 2 字节
      }
    });

    return total;
  }

  /**
   * 获取项的数量
   */
  length(): number {
    return this.keys().length;
  }

  /**
   * 批量设置
   */
  setMany<T extends Record<string, any>>(items: T): void {
    Object.entries(items).forEach(([key, value]) => {
      this.set(key, value);
    });
  }

  /**
   * 批量获取
   */
  getMany<T extends string[]>(keys: T): Record<T[number], any> {
    const result = {} as Record<T[number], any>;

    keys.forEach((key) => {
      result[key] = this.get(key);
    });

    return result;
  }

  /**
   * 批量删除
   */
  removeMany(keys: string[]): void {
    keys.forEach((key) => this.remove(key));
  }
}

// ============================================
// 预定义实例
// ============================================

let localStorageInstance: StorageService | null = null;
let sessionStorageInstance: StorageService | null = null;

/**
 * 获取 LocalStorage 实例
 */
export function getLocalStorage(options?: StorageOptions): StorageService {
  if (typeof window === 'undefined') {
    // SSR 环境
    return new StorageService(
      {} as Storage,
      options
    );
  }

  if (!localStorageInstance) {
    localStorageInstance = new StorageService(
      window.localStorage,
      { prefix: 'cp_local_', ...options }
    );
  }

  return localStorageInstance;
}

/**
 * 获取 SessionStorage 实例
 */
export function getSessionStorage(options?: StorageOptions): StorageService {
  if (typeof window === 'undefined') {
    // SSR 环境
    return new StorageService(
      {} as Storage,
      options
    );
  }

  if (!sessionStorageInstance) {
    sessionStorageInstance = new StorageService(
      window.sessionStorage,
      { prefix: 'cp_session_', ...options }
    );
  }

  return sessionStorageInstance;
}

/**
 * 创建自定义存储实例
 */
export function createStorage(
  storage: Storage,
  options: StorageOptions = {}
): StorageService {
  return new StorageService(storage, options);
}

// ============================================
// React Hooks
// ============================================

import { useState, useEffect, useCallback } from 'react';

export interface UseStorageOptions<T> extends StorageOptions {
  /** 默认值 */
  defaultValue?: T;
  /** 是否在值变化时同步到状态 */
  sync?: boolean;
}

/**
 * LocalStorage Hook
 */
export function useLocalStorage<T>(
  key: string,
  options: UseStorageOptions<T> = {}
): [T | undefined, (value: T) => void, () => void] {
  const { defaultValue, sync = true, ...storageOptions } = options;
  const storage = getLocalStorage();
  const [value, setValue] = useState<T>(() => storage.get(key, defaultValue));

  // 更新存储
  const setStoredValue = useCallback(
    (newValue: T) => {
      setValue(newValue);
      if (newValue !== undefined) {
        storage.set(key, newValue, storageOptions);
      } else {
        storage.remove(key);
      }
    },
    [key, storage, storageOptions]
  );

  // 删除值
  const removeStoredValue = useCallback(() => {
    setValue(defaultValue);
    storage.remove(key);
  }, [key, storage, defaultValue]);

  // 跨标签页同步
  useEffect(() => {
    if (!sync) return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === storage.getKey(key)) {
        const newValue = storage.get(key, defaultValue);
        setValue(newValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, storage, sync, defaultValue]);

  return [value, setStoredValue, removeStoredValue];
}

/**
 * SessionStorage Hook
 */
export function useSessionStorage<T>(
  key: string,
  options: UseStorageOptions<T> = {}
): [T | undefined, (value: T) => void, () => void] {
  const { defaultValue, ...storageOptions } = options;
  const storage = getSessionStorage();
  const [value, setValue] = useState<T>(() => storage.get(key, defaultValue));

  // 更新存储
  const setStoredValue = useCallback(
    (newValue: T) => {
      setValue(newValue);
      if (newValue !== undefined) {
        storage.set(key, newValue, storageOptions);
      } else {
        storage.remove(key);
      }
    },
    [key, storage, storageOptions]
  );

  // 删除值
  const removeStoredValue = useCallback(() => {
    setValue(defaultValue);
    storage.remove(key);
  }, [key, storage, defaultValue]);

  return [value, setStoredValue, removeStoredValue];
}

// ============================================
// 工具函数
// ============================================

/**
 * 存储管理器 - 管理多个存储键
 */
export class StorageManager {
  private storage: StorageService;

  constructor(storage: StorageService) {
    this.storage = storage;
  }

  /**
   * 创建命名空间
   */
  namespace(prefix: string) {
    return new StorageManager(
      createStorage(this.storage['storage'], {
        prefix: this.storage['prefix'] + prefix + '_',
      })
    );
  }

  /**
   * 便捷方法
   */
  set = <T>(key: string, value: T, options?: StorageOptions) =>
    this.storage.set(key, value, options);
  get = <T>(key: string, defaultValue?: T) =>
    this.storage.get(key, defaultValue);
  remove = (key: string) => this.storage.remove(key);
  has = (key: string) => this.storage.has(key);
  clear = () => this.storage.clear();
  keys = () => this.storage.keys();
  size = () => this.storage.size();
  length = () => this.storage.length();
}

/**
 * 使用示例:
 *
 * // 使用 LocalStorage
 * const storage = getLocalStorage();
 * storage.set('user', { name: 'John', age: 30 });
 * const user = storage.get('user');
 *
 * // 使用 Hook
 * function MyComponent() {
 *   const [theme, setTheme] = useLocalStorage('theme', {
 *     defaultValue: 'dark',
 *     json: false
 *   });
 *
 *   return (
 *     <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
 *       Current theme: {theme}
 *     </button>
 *   );
 * }
 *
 * // 使用命名空间
 * const userStorage = new StorageManager(storage).namespace('user');
 * userStorage.set('profile', { name: 'John' });
 * userStorage.set('settings', { theme: 'dark' });
 */
