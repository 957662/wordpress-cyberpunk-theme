/**
 * Storage Utilities
 * 本地存储工具函数
 */

/**
 * LocalStorage 封装
 */
export const localStorage = {
  /**
   * 设置项
   * @param key - 键
   * @param value - 值
   */
  set<T>(key: string, value: T): void {
    try {
      const serialized = JSON.stringify(value);
      window.localStorage.setItem(key, serialized);
    } catch (error) {
      console.error('LocalStorage set error:', error);
    }
  },

  /**
   * 获取项
   * @param key - 键
   * @param defaultValue - 默认值
   * @returns 值
   */
  get<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue ?? null;
    } catch (error) {
      console.error('LocalStorage get error:', error);
      return defaultValue ?? null;
    }
  },

  /**
   * 移除项
   * @param keys - 键数组
   */
  remove(...keys: string[]): void {
    keys.forEach((key) => {
      try {
        window.localStorage.removeItem(key);
      } catch (error) {
        console.error('LocalStorage remove error:', error);
      }
    });
  },

  /**
   * 清空所有项
   */
  clear(): void {
    try {
      window.localStorage.clear();
    } catch (error) {
      console.error('LocalStorage clear error:', error);
    }
  },

  /**
   * 获取所有键
   * @returns 键数组
   */
  keys(): string[] {
    try {
      return Object.keys(window.localStorage);
    } catch (error) {
      console.error('LocalStorage keys error:', error);
      return [];
    }
  },

  /**
   * 获取存储大小（字节）
   * @returns 大小
   */
  size(): number {
    try {
      let size = 0;
      for (const key in window.localStorage) {
        if (window.localStorage.hasOwnProperty(key)) {
          size += key.length + window.localStorage[key].length;
        }
      }
      return size;
    } catch (error) {
      console.error('LocalStorage size error:', error);
      return 0;
    }
  },

  /**
   * 检查是否存在
   * @param key - 键
   * @returns 是否存在
   */
  has(key: string): boolean {
    try {
      return window.localStorage.hasOwnProperty(key);
    } catch (error) {
      console.error('LocalStorage has error:', error);
      return false;
    }
  },
};

/**
 * SessionStorage 封装
 */
export const sessionStorage = {
  /**
   * 设置项
   * @param key - 键
   * @param value - 值
   */
  set<T>(key: string, value: T): void {
    try {
      const serialized = JSON.stringify(value);
      window.sessionStorage.setItem(key, serialized);
    } catch (error) {
      console.error('SessionStorage set error:', error);
    }
  },

  /**
   * 获取项
   * @param key - 键
   * @param defaultValue - 默认值
   * @returns 值
   */
  get<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue ?? null;
    } catch (error) {
      console.error('SessionStorage get error:', error);
      return defaultValue ?? null;
    }
  },

  /**
   * 移除项
   * @param keys - 键数组
   */
  remove(...keys: string[]): void {
    keys.forEach((key) => {
      try {
        window.sessionStorage.removeItem(key);
      } catch (error) {
        console.error('SessionStorage remove error:', error);
      }
    });
  },

  /**
   * 清空所有项
   */
  clear(): void {
    try {
      window.sessionStorage.clear();
    } catch (error) {
      console.error('SessionStorage clear error:', error);
    }
  },

  /**
   * 获取所有键
   * @returns 键数组
   */
  keys(): string[] {
    try {
      return Object.keys(window.sessionStorage);
    } catch (error) {
      console.error('SessionStorage keys error:', error);
      return [];
    }
  },

  /**
   * 检查是否存在
   * @param key - 键
   * @returns 是否存在
   */
  has(key: string): boolean {
    try {
      return window.sessionStorage.hasOwnProperty(key);
    } catch (error) {
      console.error('SessionStorage has error:', error);
      return false;
    }
  },
};

/**
 * IndexedDB 封装
 */
export class IndexedDB {
  private dbName: string;
  private version: number;
  private db: IDBDatabase | null = null;

  constructor(dbName: string, version: number = 1) {
    this.dbName = dbName;
    this.version = version;
  }

  /**
   * 打开数据库
   * @param storeNames - 存储名称数组
   * @returns Promise
   */
  async open(storeNames: string[]): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => {
        reject(new Error('Failed to open IndexedDB'));
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        storeNames.forEach((storeName) => {
          if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName, { keyPath: 'id' });
          }
        });
      };
    });
  }

  /**
   * 添加数据
   * @param storeName - 存储名称
   * @param data - 数据
   * @returns Promise
   */
  async add<T extends { id: string | number }>(
    storeName: string,
    data: T
  ): Promise<void> {
    if (!this.db) throw new Error('Database not opened');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.add(data);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * 获取数据
   * @param storeName - 存储名称
   * @param id - ID
   * @returns Promise
   */
  async get<T>(storeName: string, id: string | number): Promise<T | null> {
    if (!this.db) throw new Error('Database not opened');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * 获取所有数据
   * @param storeName - 存储名称
   * @returns Promise
   */
  async getAll<T>(storeName: string): Promise<T[]> {
    if (!this.db) throw new Error('Database not opened');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * 更新数据
   * @param storeName - 存储名称
   * @param data - 数据
   * @returns Promise
   */
  async update<T extends { id: string | number }>(
    storeName: string,
    data: T
  ): Promise<void> {
    if (!this.db) throw new Error('Database not opened');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(data);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * 删除数据
   * @param storeName - 存储名称
   * @param id - ID
   * @returns Promise
   */
  async delete(storeName: string, id: string | number): Promise<void> {
    if (!this.db) throw new Error('Database not opened');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * 清空存储
   * @param storeName - 存储名称
   * @returns Promise
   */
  async clear(storeName: string): Promise<void> {
    if (!this.db) throw new Error('Database not opened');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * 关闭数据库
   */
  close(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }
}

/**
 * Cookie 操作
 */
export const cookie = {
  /**
   * 设置 Cookie
   * @param name - 名称
   * @param value - 值
   * @param options - 选项
   */
  set(name: string, value: string, options: {
    expires?: Date | number;
    maxAge?: number;
    domain?: string;
    path?: string;
    secure?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
  } = {}): void {
    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

    if (options.expires) {
      const expires = options.expires instanceof Date
        ? options.expires.toUTCString()
        : new Date(Date.now() + options.expires * 864e5).toUTCString();
      cookieString += `; expires=${expires}`;
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
  },

  /**
   * 获取 Cookie
   * @param name - 名称
   * @returns 值
   */
  get(name: string): string | null {
    const encodedName = encodeURIComponent(name);
    const cookies = document.cookie.split(';');

    for (const cookie of cookies) {
      const [key, value] = cookie.trim().split('=');
      if (key === encodedName) {
        return decodeURIComponent(value);
      }
    }

    return null;
  },

  /**
   * 删除 Cookie
   * @param name - 名称
   * @param options - 选项
   */
  remove(name: string, options: {
    domain?: string;
    path?: string;
  } = {}): void {
    this.set(name, '', {
      ...options,
      expires: new Date(0),
    });
  },

  /**
   * 获取所有 Cookie
   * @returns Cookie 对象
   */
  getAll(): Record<string, string> {
    const cookies: Record<string, string> = {};
    const cookieStrings = document.cookie.split(';');

    for (const cookie of cookieStrings) {
      const [key, value] = cookie.trim().split('=');
      if (key && value) {
        cookies[decodeURIComponent(key)] = decodeURIComponent(value);
      }
    }

    return cookies;
  },

  /**
   * 检查 Cookie 是否存在
   * @param name - 名称
   * @returns 是否存在
   */
  has(name: string): boolean {
    return this.get(name) !== null;
  },
};
