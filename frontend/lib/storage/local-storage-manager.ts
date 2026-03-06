/**
 * Local Storage Manager - 本地存储管理器
 *
 * 提供类型安全的本地存储操作
 */

interface StorageItem<T = any> {
  value: T;
  expires?: number;
  version?: string;
}

type StorageSerializer = {
  stringify: (value: any) => string;
  parse: (value: string) => any;
};

class StorageManager {
  private storage: Storage;
  private prefix: string;
  private defaultVersion: string;
  private serializer: StorageSerializer;

  constructor(
    storage: Storage,
    prefix: string = 'app_',
    version: string = '1.0.0',
    serializer?: StorageSerializer
  ) {
    this.storage = storage;
    this.prefix = prefix;
    this.defaultVersion = version;
    this.serializer = serializer || JSON;
  }

  /**
   * 生成带前缀的键
   */
  private getKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  /**
   * 设置存储项
   */
  set<T>(key: string, value: T, ttl?: number): boolean {
    try {
      const item: StorageItem<T> = {
        value,
        version: this.defaultVersion,
      };

      if (ttl) {
        item.expires = Date.now() + ttl;
      }

      const serialized = this.serializer.stringify(item);
      this.storage.setItem(this.getKey(key), serialized);

      return true;
    } catch (error) {
      console.error('Storage set error:', error);
      return false;
    }
  }

  /**
   * 获取存储项
   */
  get<T>(key: string, defaultValue?: T): T | null {
    try {
      const serialized = this.storage.getItem(this.getKey(key));

      if (!serialized) {
        return defaultValue ?? null;
      }

      const item: StorageItem<T> = this.serializer.parse(serialized);

      // 检查是否过期
      if (item.expires && Date.now() > item.expires) {
        this.remove(key);
        return defaultValue ?? null;
      }

      return item.value ?? defaultValue ?? null;
    } catch (error) {
      console.error('Storage get error:', error);
      return defaultValue ?? null;
    }
  }

  /**
   * 检查存储项是否存在
   */
  has(key: string): boolean {
    const serialized = this.storage.getItem(this.getKey(key));

    if (!serialized) {
      return false;
    }

    try {
      const item: StorageItem = this.serializer.parse(serialized);

      // 检查是否过期
      if (item.expires && Date.now() > item.expires) {
        this.remove(key);
        return false;
      }

      return true;
    } catch {
      return false;
    }
  }

  /**
   * 移除存储项
   */
  remove(key: string): boolean {
    try {
      this.storage.removeItem(this.getKey(key));
      return true;
    } catch (error) {
      console.error('Storage remove error:', error);
      return false;
    }
  }

  /**
   * 清空所有带前缀的存储项
   */
  clear(): boolean {
    try {
      const keysToRemove: string[] = [];

      // 找到所有带前缀的键
      for (let i = 0; i < this.storage.length; i++) {
        const key = this.storage.key(i);
        if (key && key.startsWith(this.prefix)) {
          keysToRemove.push(key);
        }
      }

      // 移除这些键
      keysToRemove.forEach((key) => {
        this.storage.removeItem(key);
      });

      return true;
    } catch (error) {
      console.error('Storage clear error:', error);
      return false;
    }
  }

  /**
   * 获取所有带前缀的键
   */
  keys(): string[] {
    const result: string[] = [];

    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i);
      if (key && key.startsWith(this.prefix)) {
        result.push(key.substring(this.prefix.length));
      }
    }

    return result;
  }

  /**
   * 获取存储大小（字节）
   */
  size(): number {
    let total = 0;

    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i);
      if (key && key.startsWith(this.prefix)) {
        const value = this.storage.getItem(key);
        total += key.length + (value?.length || 0);
      }
    }

    return total;
  }

  /**
   * 清理过期的存储项
   */
  cleanup(): number {
    let removed = 0;
    const keys = this.keys();

    keys.forEach((key) => {
      const serialized = this.storage.getItem(this.getKey(key));
      if (serialized) {
        try {
          const item: StorageItem = this.serializer.parse(serialized);
          if (item.expires && Date.now() > item.expires) {
            this.remove(key);
            removed++;
          }
        } catch {
          // 无效的数据，删除
          this.remove(key);
          removed++;
        }
      }
    });

    return removed;
  }

  /**
   * 批量操作
   */
  batch(operations: Array<{
    type: 'set' | 'remove';
    key: string;
    value?: any;
    ttl?: number;
  }>): boolean {
    try {
      operations.forEach((op) => {
        if (op.type === 'set') {
          this.set(op.key, op.value, op.ttl);
        } else if (op.type === 'remove') {
          this.remove(op.key);
        }
      });

      return true;
    } catch (error) {
      console.error('Storage batch error:', error);
      return false;
    }
  }

  /**
   * 监听存储变化
   */
  onChange(callback: (key: string, newValue: any, oldValue: any) => void): () => void {
    const handler = (e: StorageEvent) => {
      if (e.key && e.key.startsWith(this.prefix)) {
        const key = e.key.substring(this.prefix.length);
        const newValue = e.newValue ? this.serializer.parse(e.newValue) : null;
        const oldValue = e.oldValue ? this.serializer.parse(e.oldValue) : null;

        callback(key, newValue, oldValue);
      }
    };

    window.addEventListener('storage', handler);

    return () => {
      window.removeEventListener('storage', handler);
    };
  }
}

/**
 * Local Storage 实例
 */
export const localStorage = new StorageManager(
  typeof window !== 'undefined' ? window.localStorage : ({} as Storage),
  'cp_local_',
  '1.0.0'
);

/**
 * Session Storage 实例
 */
export const sessionStorage = new StorageManager(
  typeof window !== 'undefined' ? window.sessionStorage : ({} as Storage),
  'cp_session_',
  '1.0.0'
);

/**
 * 创建自定义存储实例
 */
export function createStorage(
  type: 'local' | 'session' = 'local',
  prefix: string = 'app_',
  version: string = '1.0.0'
): StorageManager {
  const storage =
    typeof window !== 'undefined'
      ? type === 'local'
        ? window.localStorage
        : window.sessionStorage
      : ({} as Storage);

  return new StorageManager(storage, prefix, version);
}

/**
 * 存储键常量
 */
export const StorageKeys = {
  // 用户相关
  USER_TOKEN: 'user_token',
  USER_INFO: 'user_info',
  USER_PREFERENCES: 'user_preferences',

  // 主题相关
  THEME: 'theme',
  DARK_MODE: 'dark_mode',

  // 语言相关
  LANGUAGE: 'language',

  // 缓存相关
  CACHE_POSTS: 'cache_posts',
  CACHE_CATEGORIES: 'cache_categories',
  CACHE_TAGS: 'cache_tags',

  // 搜索相关
  SEARCH_HISTORY: 'search_history',
  RECENT_SEARCHES: 'recent_searches',

  // 阅读相关
  READING_HISTORY: 'reading_history',
  BOOKMARKS: 'bookmarks',
  FAVORITES: 'favorites',

  // 表单相关
  FORM_DRAFTS: 'form_drafts',

  // 其他
  NOTIFICATIONS: 'notifications',
  COOKIES_CONSENT: 'cookies_consent',
} as const;

/**
 * 快捷方法
 */
export const storage = {
  set: <T>(key: string, value: T, ttl?: number) => localStorage.set(key, value, ttl),
  get: <T>(key: string, defaultValue?: T) => localStorage.get(key, defaultValue),
  remove: (key: string) => localStorage.remove(key),
  has: (key: string) => localStorage.has(key),
  clear: () => localStorage.clear(),
  keys: () => localStorage.keys(),
};

export default StorageManager;
