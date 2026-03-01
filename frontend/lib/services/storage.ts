/**
 * 存储服务
 * 封装本地存储和会话存储的操作
 */

interface StorageOptions {
  prefix?: string;
  serialize?: boolean;
}

class StorageService {
  private prefix: string;
  private serialize: boolean;

  constructor(options: StorageOptions = {}) {
    this.prefix = options.prefix || 'cyberpress_';
    this.serialize = options.serialize !== false;
  }

  /**
   * 生成键名
   */
  private getKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  /**
   * 序列化值
   */
  private serializeValue(value: unknown): string {
    if (this.serialize) {
      return JSON.stringify(value);
    }
    return value as string;
  }

  /**
   * 反序列化值
   */
  private deserializeValue<T>(value: string | null): T | null {
    if (value === null) return null;

    if (this.serialize) {
      try {
        return JSON.parse(value) as T;
      } catch {
        return value as T;
      }
    }

    return value as T;
  }

  /**
   * 设置本地存储
   */
  setItem<T>(key: string, value: T): boolean {
    try {
      const serializedValue = this.serializeValue(value);
      localStorage.setItem(this.getKey(key), serializedValue);
      return true;
    } catch (error) {
      console.error('Failed to set localStorage item:', error);
      return false;
    }
  }

  /**
   * 获取本地存储
   */
  getItem<T>(key: string): T | null {
    try {
      const value = localStorage.getItem(this.getKey(key));
      return this.deserializeValue<T>(value);
    } catch (error) {
      console.error('Failed to get localStorage item:', error);
      return null;
    }
  }

  /**
   * 删除本地存储
   */
  removeItem(key: string): boolean {
    try {
      localStorage.removeItem(this.getKey(key));
      return true;
    } catch (error) {
      console.error('Failed to remove localStorage item:', error);
      return false;
    }
  }

  /**
   * 清空所有本地存储
   */
  clear(): boolean {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
      return true;
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
      return false;
    }
  }

  /**
   * 检查键是否存在
   */
  hasItem(key: string): boolean {
    return localStorage.getItem(this.getKey(key)) !== null;
  }

  /**
   * 获取所有键
   */
  keys(): string[] {
    const allKeys = Object.keys(localStorage);
    return allKeys
      .filter((key) => key.startsWith(this.prefix))
      .map((key) => key.slice(this.prefix.length));
  }

  /**
   * 获取存储大小（字节）
   */
  getSize(): number {
    let total = 0;
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length + key.length;
      }
    }
    return total;
  }

  /**
   * 会话存储 - 设置
   */
  setSessionItem<T>(key: string, value: T): boolean {
    try {
      const serializedValue = this.serializeValue(value);
      sessionStorage.setItem(this.getKey(key), serializedValue);
      return true;
    } catch (error) {
      console.error('Failed to set sessionStorage item:', error);
      return false;
    }
  }

  /**
   * 会话存储 - 获取
   */
  getSessionItem<T>(key: string): T | null {
    try {
      const value = sessionStorage.getItem(this.getKey(key));
      return this.deserializeValue<T>(value);
    } catch (error) {
      console.error('Failed to get sessionStorage item:', error);
      return null;
    }
  }

  /**
   * 会话存储 - 删除
   */
  removeSessionItem(key: string): boolean {
    try {
      sessionStorage.removeItem(this.getKey(key));
      return true;
    } catch (error) {
      console.error('Failed to remove sessionStorage item:', error);
      return false;
    }
  }

  /**
   * 清空所有会话存储
   */
  clearSession(): boolean {
    try {
      const keys = Object.keys(sessionStorage);
      keys.forEach((key) => {
        if (key.startsWith(this.prefix)) {
          sessionStorage.removeItem(key);
        }
      });
      return true;
    } catch (error) {
      console.error('Failed to clear sessionStorage:', error);
      return false;
    }
  }

  /**
   * Cookie - 设置
   */
  setCookie(
    key: string,
    value: string,
    options: {
      expires?: Date | number;
      path?: string;
      domain?: string;
      secure?: boolean;
      sameSite?: 'strict' | 'lax' | 'none';
    } = {}
  ): boolean {
    try {
      let cookie = `${this.getKey(key)}=${encodeURIComponent(value)}`;

      if (options.expires) {
        const expires =
          options.expires instanceof Date
            ? options.expires
            : new Date(Date.now() + options.expires * 1000);
        cookie += `; expires=${expires.toUTCString()}`;
      }

      if (options.path) {
        cookie += `; path=${options.path}`;
      }

      if (options.domain) {
        cookie += `; domain=${options.domain}`;
      }

      if (options.secure) {
        cookie += '; secure';
      }

      if (options.sameSite) {
        cookie += `; samesite=${options.sameSite}`;
      }

      document.cookie = cookie;
      return true;
    } catch (error) {
      console.error('Failed to set cookie:', error);
      return false;
    }
  }

  /**
   * Cookie - 获取
   */
  getCookie(key: string): string | null {
    try {
      const name = `${this.getKey(key)}=`;
      const cookies = document.cookie.split(';');

      for (const cookie of cookies) {
        let c = cookie;
        while (c.charAt(0) === ' ') {
          c = c.slice(1);
        }
        if (c.indexOf(name) === 0) {
          return decodeURIComponent(c.slice(name.length));
        }
      }

      return null;
    } catch (error) {
      console.error('Failed to get cookie:', error);
      return null;
    }
  }

  /**
   * Cookie - 删除
   */
  removeCookie(
    key: string,
    options: { path?: string; domain?: string } = {}
  ): boolean {
    try {
      this.setCookie(key, '', {
        ...options,
        expires: new Date(0),
      });
      return true;
    } catch (error) {
      console.error('Failed to remove cookie:', error);
      return false;
    }
  }
}

// 创建默认实例
export const storageService = new StorageService();

// 导出类
export { StorageService };
export default storageService;
