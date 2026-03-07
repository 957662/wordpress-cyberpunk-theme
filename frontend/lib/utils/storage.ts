/**
 * Storage Utility Functions
 * 存储工具函数
 */

/**
 * LocalStorage 操作
 */
export const storage = {
  /**
   * 设置项
   */
  set(key: string, value: any): boolean {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(key, serialized);
      return true;
    } catch (error) {
      console.error('LocalStorage set error:', error);
      return false;
    }
  },

  /**
   * 获取项
   */
  get<T = any>(key: string, defaultValue?: T): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue ?? null;
    } catch (error) {
      console.error('LocalStorage get error:', error);
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
      console.error('LocalStorage remove error:', error);
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
      console.error('LocalStorage clear error:', error);
      return false;
    }
  },

  /**
   * 检查键是否存在
   */
  has(key: string): boolean {
    return localStorage.getItem(key) !== null;
  },

  /**
   * 获取所有键
   */
  keys(): string[] {
    return Object.keys(localStorage);
  },

  /**
   * 获取存储大小（字节）
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
};

/**
 * SessionStorage 操作
 */
export const sessionStorage = {
  /**
   * 设置项
   */
  set(key: string, value: any): boolean {
    try {
      const serialized = JSON.stringify(value);
      window.sessionStorage.setItem(key, serialized);
      return true;
    } catch (error) {
      console.error('SessionStorage set error:', error);
      return false;
    }
  },

  /**
   * 获取项
   */
  get<T = any>(key: string, defaultValue?: T): T | null {
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue ?? null;
    } catch (error) {
      console.error('SessionStorage get error:', error);
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
      console.error('SessionStorage remove error:', error);
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
      console.error('SessionStorage clear error:', error);
      return false;
    }
  },

  /**
   * 检查键是否存在
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
    key: string,
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
      let cookieString = `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;

      if (options.expires) {
        if (typeof options.expires === 'number') {
          const date = new Date();
          date.setTime(date.getTime() + options.expires * 1000);
          cookieString += `; expires=${date.toUTCString()}`;
        } else {
          cookieString += `; expires=${options.expires.toUTCString()}`;
        }
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
      console.error('Cookie set error:', error);
      return false;
    }
  },

  /**
   * 获取 cookie
   */
  get(key: string): string | null {
    try {
      const encodedKey = encodeURIComponent(key);
      const cookies = document.cookie.split(';');
      
      for (const cookie of cookies) {
        const [cookieKey, cookieValue] = cookie.trim().split('=');
        if (cookieKey === encodedKey) {
          return decodeURIComponent(cookieValue);
        }
      }
      
      return null;
    } catch (error) {
      console.error('Cookie get error:', error);
      return null;
    }
  },

  /**
   * 删除 cookie
   */
  remove(key: string, options: { domain?: string; path?: string } = {}): boolean {
    try {
      let cookieString = `${encodeURIComponent(key)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      
      if (options.domain) {
        cookieString += `; domain=${options.domain}`;
      }
      
      if (options.path) {
        cookieString += `; path=${options.path}`;
      }
      
      document.cookie = cookieString;
      return true;
    } catch (error) {
      console.error('Cookie remove error:', error);
      return false;
    }
  },

  /**
   * 检查 cookie 是否存在
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  },

  /**
   * 获取所有 cookies
   */
  getAll(): Record<string, string> {
    const cookies: Record<string, string> = {};
    const cookieStrings = document.cookie.split(';');

    for (const cookieString of cookieStrings) {
      const [key, value] = cookieString.trim().split('=');
      if (key && value) {
        cookies[decodeURIComponent(key)] = decodeURIComponent(value);
      }
    }

    return cookies;
  },
};

/**
 * IndexedDB 操作（简化版）
 */
export const indexedDB = {
  /**
   * 打开数据库
   */
  async open(
    dbName: string,
    version: number = 1
  ): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName, version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        // 在这里创建对象存储空间
      };
    });
  },

  /**
   * 添加数据
   */
  async add<T>(
    dbName: string,
    storeName: string,
    data: T
  ): Promise<IDBValidKey> {
    const db = await this.open(dbName);
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.add(data);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

  /**
   * 获取数据
   */
  async get<T>(
    dbName: string,
    storeName: string,
    key: IDBValidKey
  ): Promise<T | undefined> {
    const db = await this.open(dbName);
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

  /**
   * 删除数据
   */
  async remove(
    dbName: string,
    storeName: string,
    key: IDBValidKey
  ): Promise<void> {
    const db = await this.open(dbName);
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(key);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },
};
