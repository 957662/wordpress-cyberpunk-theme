/**
 * 存储工具函数
 * 封装 localStorage、sessionStorage 和 IndexedDB
 */

/**
 * LocalStorage 封装
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
      console.error('LocalStorage set error:', error);
      return false;
    }
  },

  /**
   * 获取项
   */
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('LocalStorage get error:', error);
      return null;
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
   * 获取所有键
   */
  keys(): string[] {
    try {
      return Object.keys(localStorage);
    } catch (error) {
      console.error('LocalStorage keys error:', error);
      return [];
    }
  },

  /**
   * 获取存储大小（字节）
   */
  getSize(): number {
    try {
      let total = 0;
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          total += localStorage[key].length + key.length;
        }
      }
      return total;
    } catch (error) {
      console.error('LocalStorage getSize error:', error);
      return 0;
    }
  },
};

/**
 * SessionStorage 封装
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
      console.error('SessionStorage set error:', error);
      return false;
    }
  },

  /**
   * 获取项
   */
  get<T>(key: string): T | null {
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('SessionStorage get error:', error);
      return null;
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
   * 获取所有键
   */
  keys(): string[] {
    try {
      return Object.keys(window.sessionStorage);
    } catch (error) {
      console.error('SessionStorage keys error:', error);
      return [];
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
   */
  async open(stores: { name: string; keyPath?: string; indexes?: { name: string; keyPath: string }[] }[]): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        stores.forEach(store => {
          if (!db.objectStoreNames.contains(store.name)) {
            const objectStore = db.createObjectStore(store.name, {
              keyPath: store.keyPath || 'id',
              autoIncrement: true,
            });

            store.indexes?.forEach(index => {
              objectStore.createIndex(index.name, index.keyPath, { unique: false });
            });
          }
        });
      };
    });
  }

  /**
   * 添加数据
   */
  async add<T>(storeName: string, data: T): Promise<IDBValidKey> {
    if (!this.db) throw new Error('Database not opened');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.add(data);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * 获取数据
   */
  async get<T>(storeName: string, key: IDBValidKey): Promise<T | undefined> {
    if (!this.db) throw new Error('Database not opened');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * 获取所有数据
   */
  async getAll<T>(storeName: string): Promise<T[]> {
    if (!this.db) throw new Error('Database not opened');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * 更新数据
   */
  async put<T>(storeName: string, data: T): Promise<IDBValidKey> {
    if (!this.db) throw new Error('Database not opened');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(data);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * 删除数据
   */
  async delete(storeName: string, key: IDBValidKey): Promise<void> {
    if (!this.db) throw new Error('Database not opened');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(key);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * 清空存储
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
 * Cookie 封装
 */
export const cookie = {
  /**
   * 设置 Cookie
   */
  set(
    name: string,
    value: string,
    options: {
      expires?: Date | number;
      maxAge?: number;
      domain?: string;
      path?: string;
      secure?: boolean;
      httpOnly?: boolean;
      sameSite?: 'strict' | 'lax' | 'none';
    } = {}
  ): void {
    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

    if (options.expires) {
      const expires = options.expires instanceof Date
        ? options.expires
        : new Date(Date.now() + options.expires * 1000);
      cookieString += `; expires=${expires.toUTCString()}`;
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

    if (options.httpOnly) {
      cookieString += '; httponly';
    }

    if (options.sameSite) {
      cookieString += `; samesite=${options.sameSite}`;
    }

    document.cookie = cookieString;
  },

  /**
   * 获取 Cookie
   */
  get(name: string): string | null {
    const encodedName = encodeURIComponent(name);
    const cookies = document.cookie.split(';');

    for (const cookie of cookies) {
      const [cookieName, cookieValue] = cookie.trim().split('=');
      if (cookieName === encodedName) {
        return decodeURIComponent(cookieValue);
      }
    }

    return null;
  },

  /**
   * 删除 Cookie
   */
  remove(name: string, options: { domain?: string; path?: string } = {}): void {
    this.set(name, '', {
      ...options,
      expires: new Date(0),
    });
  },

  /**
   * 获取所有 Cookie
   */
  getAll(): Record<string, string> {
    const cookies: Record<string, string> = {};
    const cookieStrings = document.cookie.split(';');

    for (const cookie of cookieStrings) {
      const [name, value] = cookie.trim().split('=');
      if (name && value) {
        cookies[decodeURIComponent(name)] = decodeURIComponent(value);
      }
    }

    return cookies;
  },
};
