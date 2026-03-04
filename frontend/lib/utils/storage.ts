/**
 * Storage Utilities
 * 存储工具函数
 */

/**
 * LocalStorage 操作
 */
export const storage = {
  /**
   * 设置项
   */
  set<T>(key: string, value: T): boolean {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(key, serialized);
      return true;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      return false;
    }
  },

  /**
   * 获取项
   */
  get<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue ?? null;
      return JSON.parse(item);
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue ?? null;
    }
  },

  /**
   * 删除项
   */
  remove(key: string): boolean {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      return false;
    }
  },

  /**
   * 清空所有
   */
  clear(): boolean {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  },

  /**
   * 获取所有键
   */
  keys(): string[] {
    return Object.keys(localStorage);
  },

  /**
   * 获取大小（字节）
   */
  getSize(): number {
    let size = 0;
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        size += localStorage[key].length + key.length;
      }
    }
    return size;
  },

  /**
   * 判断键是否存在
   */
  has(key: string): boolean {
    return localStorage.getItem(key) !== null;
  },
};

/**
 * SessionStorage 操作
 */
export const sessionStorage = {
  /**
   * 设置项
   */
  set<T>(key: string, value: T): boolean {
    try {
      const serialized = JSON.stringify(value);
      window.sessionStorage.setItem(key, serialized);
      return true;
    } catch (error) {
      console.error('Error saving to sessionStorage:', error);
      return false;
    }
  },

  /**
   * 获取项
   */
  get<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = window.sessionStorage.getItem(key);
      if (item === null) return defaultValue ?? null;
      return JSON.parse(item);
    } catch (error) {
      console.error('Error reading from sessionStorage:', error);
      return defaultValue ?? null;
    }
  },

  /**
   * 删除项
   */
  remove(key: string): boolean {
    try {
      window.sessionStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from sessionStorage:', error);
      return false;
    }
  },

  /**
   * 清空所有
   */
  clear(): boolean {
    try {
      window.sessionStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing sessionStorage:', error);
      return false;
    }
  },

  /**
   * 获取所有键
   */
  keys(): string[] {
    return Object.keys(window.sessionStorage);
  },

  /**
   * 判断键是否存在
   */
  has(key: string): boolean {
    return window.sessionStorage.getItem(key) !== null;
  },
};

/**
 * Cookie 操作
 */
export const cookie = {
  /**
   * 设置 cookie
   */
  set(
    name: string,
    value: string,
    options: {
      expires?: number | Date;
      maxAge?: number;
      domain?: string;
      path?: string;
      secure?: boolean;
      sameSite?: 'strict' | 'lax' | 'none';
    } = {}
  ): boolean {
    try {
      let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

      if (options.expires) {
        if (typeof options.expires === 'number') {
          const date = new Date();
          date.setTime(date.getTime() + options.expires * 1000);
          options.expires = date;
        }
        cookieString += `; expires=${options.expires.toUTCString()}`;
      }

      if (options.maxAge) {
        cookieString += `; max-age=${options.maxAge}`;
      }

      if (options.domain) {
        cookieString += `; domain=${options.domain}`;
      }

      if (options.path) {
        cookieString += `; path=${options.path}`;
      }

      if (options.secure) {
        cookieString += '; secure';
      }

      if (options.sameSite) {
        cookieString += `; samesite=${options.sameSite}`;
      }

      document.cookie = cookieString;
      return true;
    } catch (error) {
      console.error('Error setting cookie:', error);
      return false;
    }
  },

  /**
   * 获取 cookie
   */
  get(name: string): string | null {
    try {
      const nameEQ = `${encodeURIComponent(name)}=`;
      const cookies = document.cookie.split(';');

      for (const cookie of cookies) {
        let c = cookie;
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) {
          return decodeURIComponent(c.substring(nameEQ.length, c.length));
        }
      }

      return null;
    } catch (error) {
      console.error('Error getting cookie:', error);
      return null;
    }
  },

  /**
   * 删除 cookie
   */
  remove(name: string, options: { domain?: string; path?: string } = {}): boolean {
    return cookie.set(name, '', {
      ...options,
      expires: new Date('Thu, 01 Jan 1970 00:00:00 GMT'),
    });
  },

  /**
   * 获取所有 cookies
   */
  getAll(): Record<string, string> {
    const cookies: Record<string, string> = {};
    const allCookies = document.cookie.split(';');

    for (const cookie of allCookies) {
      const [name, value] = cookie.split('=').map((c) => c.trim());
      if (name && value) {
        cookies[decodeURIComponent(name)] = decodeURIComponent(value);
      }
    }

    return cookies;
  },
};
