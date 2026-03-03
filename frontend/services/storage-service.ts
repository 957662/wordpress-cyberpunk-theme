/**
 * CyberPress Platform - 本地存储服务
 * 统一的 LocalStorage/SessionStorage 封装，支持加密和压缩
 */

import { compressToUTF16, decompressFromUTF16 } from 'lz-string';

// ============================================================================
// 类型定义
// ============================================================================

export type StorageType = 'localStorage' | 'sessionStorage';

export interface StorageOptions {
  prefix?: string; // 键名前缀
  encrypt?: boolean; // 是否加密（Base64）
  compress?: boolean; // 是否压缩
  ttl?: number; // 过期时间（毫秒）
}

export interface StorageItem<T = any> {
  value: T;
  expiresAt?: number; // 过期时间戳
}

// ============================================================================
// 加密工具
// ============================================================================

class CryptoUtils {
  /**
   * Base64 编码
   */
  static encode(str: string): string {
    try {
      return btoa(encodeURIComponent(str));
    } catch {
      return str;
    }
  }

  /**
   * Base64 解码
   */
  static decode(str: string): string {
    try {
      return decodeURIComponent(atob(str));
    } catch {
      return str;
    }
  }

  /**
   * 简单的 XOR 加密（用于轻度混淆）
   */
  static xorEncrypt(str: string, key: string = 'cyberpress'): string {
    let result = '';
    for (let i = 0; i < str.length; i++) {
      const charCode = str.charCodeAt(i) ^ key.charCodeAt(i % key.length);
      result += String.fromCharCode(charCode);
    }
    return btoa(result);
  }

  /**
   * XOR 解密
   */
  static xorDecrypt(encrypted: string, key: string = 'cyberpress'): string {
    try {
      const decoded = atob(encrypted);
      let result = '';
      for (let i = 0; i < decoded.length; i++) {
        const charCode = decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length);
        result += String.fromCharCode(charCode);
      }
      return result;
    } catch {
      return encrypted;
    }
  }
}

// ============================================================================
// 存储服务类
// ============================================================================

export class StorageService {
  private prefix: string;
  private storage: Storage;

  constructor(type: StorageType = 'localStorage', options: StorageOptions = {}) {
    this.prefix = options.prefix || 'cp_';
    this.storage = type === 'localStorage' ? window.localStorage : window.sessionStorage;
  }

  /**
   * 生成完整键名
   */
  private getKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  /**
   * 序列化值
   */
  private serialize<T>(value: T, options: StorageOptions): string {
    let json = JSON.stringify(value);

    // 压缩
    if (options.compress) {
      json = compressToUTF16(json);
    }

    // 加密
    if (options.encrypt) {
      json = CryptoUtils.xorEncrypt(json);
    }

    return json;
  }

  /**
   * 反序列化值
   */
  private deserialize<T>(value: string, options: StorageOptions): T | null {
    try {
      // 解密
      if (options.encrypt) {
        value = CryptoUtils.xorDecrypt(value);
      }

      // 解压
      if (options.compress) {
        value = decompressFromUTF16(value);
      }

      return JSON.parse(value) as T;
    } catch {
      return null;
    }
  }

  /**
   * 检查项目是否过期
   */
  private isExpired(item: StorageItem): boolean {
    if (!item.expiresAt) return false;
    return Date.now() > item.expiresAt;
  }

  /**
   * 存储值
   */
  set<T>(key: string, value: T, options: StorageOptions = {}): boolean {
    try {
      const fullKey = this.getKey(key);
      const item: StorageItem<T> = {
        value,
        expiresAt: options.ttl ? Date.now() + options.ttl : undefined,
      };

      const serialized = this.serialize(item, options);
      this.storage.setItem(fullKey, serialized);
      return true;
    } catch (error) {
      console.error('[StorageService] Set error:', error);
      return false;
    }
  }

  /**
   * 获取值
   */
  get<T>(key: string, options: StorageOptions = {}): T | null {
    try {
      const fullKey = this.getKey(key);
      const serialized = this.storage.getItem(fullKey);

      if (!serialized) return null;

      const item = this.deserialize<StorageItem<T>>(serialized, options);

      if (!item) return null;

      // 检查过期
      if (this.isExpired(item)) {
        this.remove(key);
        return null;
      }

      return item.value;
    } catch (error) {
      console.error('[StorageService] Get error:', error);
      return null;
    }
  }

  /**
   * 删除值
   */
  remove(key: string): boolean {
    try {
      const fullKey = this.getKey(key);
      this.storage.removeItem(fullKey);
      return true;
    } catch (error) {
      console.error('[StorageService] Remove error:', error);
      return false;
    }
  }

  /**
   * 清空所有带前缀的项
   */
  clear(): boolean {
    try {
      const keysToRemove: string[] = [];

      // 收集所有带前缀的键
      for (let i = 0; i < this.storage.length; i++) {
        const key = this.storage.key(i);
        if (key && key.startsWith(this.prefix)) {
          keysToRemove.push(key);
        }
      }

      // 删除收集的键
      keysToRemove.forEach((key) => this.storage.removeItem(key));

      return true;
    } catch (error) {
      console.error('[StorageService] Clear error:', error);
      return false;
    }
  }

  /**
   * 检查键是否存在
   */
  has(key: string): boolean {
    const fullKey = this.getKey(key);
    return this.storage.getItem(fullKey) !== null;
  }

  /**
   * 获取所有键
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
  getSize(): number {
    let size = 0;

    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i);
      if (key && key.startsWith(this.prefix)) {
        const value = this.storage.getItem(key);
        size += (key + value).length;
      }
    }

    return size;
  }

  /**
   * 清理过期项
   */
  cleanExpired(options: StorageOptions = {}): number {
    let cleaned = 0;

    this.keys().forEach((key) => {
      const fullKey = this.getKey(key);
      const serialized = this.storage.getItem(fullKey);

      if (serialized) {
        const item = this.deserialize<StorageItem>(serialized, options);
        if (item && this.isExpired(item)) {
          this.remove(key);
          cleaned++;
        }
      }
    });

    return cleaned;
  }
}

// ============================================================================
// 默认实例
// ============================================================================

export const localStorageService = new StorageService('localStorage', {
  prefix: 'cp_',
});

export const sessionStorageService = new StorageService('sessionStorage', {
  prefix: 'cp_session_',
});

// ============================================================================
// 便捷方法
// ============================================================================

/**
 * LocalStorage 操作
 */
export const ls = {
  set: <T>(key: string, value: T, ttl?: number) =>
    localStorageService.set(key, value, { ttl }),
  get: <T>(key: string) => localStorageService.get<T>(key),
  remove: (key: string) => localStorageService.remove(key),
  has: (key: string) => localStorageService.has(key),
  clear: () => localStorageService.clear(),
  keys: () => localStorageService.keys(),
  size: () => localStorageService.getSize(),
  clean: () => localStorageService.cleanExpired(),
};

/**
 * SessionStorage 操作
 */
export const ss = {
  set: <T>(key: string, value: T, ttl?: number) =>
    sessionStorageService.set(key, value, { ttl }),
  get: <T>(key: string) => sessionStorageService.get<T>(key),
  remove: (key: string) => sessionStorageService.remove(key),
  has: (key: string) => sessionStorageService.has(key),
  clear: () => sessionStorageService.clear(),
  keys: () => sessionStorageService.keys(),
  size: () => sessionStorageService.getSize(),
  clean: () => sessionStorageService.cleanExpired(),
};

// ============================================================================
// 特定功能的封装
// ============================================================================

/**
 * 用户偏好设置
 */
export const userPreferences = {
  setTheme: (theme: 'light' | 'dark' | 'auto') =>
    ls.set('theme', theme),
  getTheme: () => ls.get<'light' | 'dark' | 'auto'>('theme') || 'auto',
  setLanguage: (lang: string) => ls.set('language', lang),
  getLanguage: () => ls.get<string>('language') || 'zh-CN',
  setFontSize: (size: number) => ls.set('fontSize', size),
  getFontSize: () => ls.get<number>('fontSize') || 16,
};

/**
 * 搜索历史
 */
export const searchHistory = {
  add: (query: string, maxItems = 10) => {
    const history = ss.get<string[]>('search_history') || [];
    const filtered = history.filter((h) => h !== query);
    const updated = [query, ...filtered].slice(0, maxItems);
    ss.set('search_history', updated);
  },
  get: () => ss.get<string[]>('search_history') || [],
  clear: () => ss.remove('search_history'),
};

/**
 * 阅读历史
 */
export const readingHistory = {
  add: (postId: number, title: string, slug: string) => {
    const history = ls.get<any[]>('reading_history') || [];
    const exists = history.findIndex((h) => h.postId === postId);

    const item = {
      postId,
      title,
      slug,
      timestamp: Date.now(),
    };

    if (exists >= 0) {
      history[exists] = item;
    } else {
      history.unshift(item);
    }

    // 只保留最近 100 条
    const trimmed = history.slice(0, 100);
    ls.set('reading_history', trimmed);
  },
  get: () => ls.get<any[]>('reading_history') || [],
  clear: () => ls.remove('reading_history'),
};

/**
 * 认证令牌
 */
export const authTokens = {
  setAccessToken: (token: string) =>
    ls.set('access_token', token, 7 * 24 * 60 * 60 * 1000), // 7天
  getAccessToken: () => ls.get<string>('access_token'),
  setRefreshToken: (token: string) =>
    ls.set('refresh_token', token, 30 * 24 * 60 * 60 * 1000), // 30天
  getRefreshToken: () => ls.get<string>('refresh_token'),
  clear: () => {
    ls.remove('access_token');
    ls.remove('refresh_token');
  },
};

// ============================================================================
// 导出
// ============================================================================

export default StorageService;
