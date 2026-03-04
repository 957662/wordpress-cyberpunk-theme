/**
 * 本地存储工具函数
 */

/**
 * LocalStorage 工具类
 */
export const storage = {
  /**
   * 设置 LocalStorage
   */
  set<T>(key: string, value: T): void {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(key, serialized);
    } catch (error) {
      console.error('[Storage] Set error:', error);
    }
  },

  /**
   * 获取 LocalStorage
   */
  get<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue ?? null;
    } catch (error) {
      console.error('[Storage] Get error:', error);
      return defaultValue ?? null;
    }
  },

  /**
   * 删除 LocalStorage
   */
  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('[Storage] Remove error:', error);
    }
  },

  /**
   * 清空 LocalStorage
   */
  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('[Storage] Clear error:', error);
    }
  },

  /**
   * 检查 LocalStorage 是否存在某个 key
   */
  has(key: string): boolean {
    try {
      return localStorage.getItem(key) !== null;
    } catch (error) {
      console.error('[Storage] Has error:', error);
      return false;
    }
  },
};

/**
 * SessionStorage 工具类
 */
export const sessionStorage = {
  /**
   * 设置 SessionStorage
   */
  set<T>(key: string, value: T): void {
    try {
      const serialized = JSON.stringify(value);
      window.sessionStorage.setItem(key, serialized);
    } catch (error) {
      console.error('[SessionStorage] Set error:', error);
    }
  },

  /**
   * 获取 SessionStorage
   */
  get<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue ?? null;
    } catch (error) {
      console.error('[SessionStorage] Get error:', error);
      return defaultValue ?? null;
    }
  },

  /**
   * 删除 SessionStorage
   */
  remove(key: string): void {
    try {
      window.sessionStorage.removeItem(key);
    } catch (error) {
      console.error('[SessionStorage] Remove error:', error);
    }
  },

  /**
   * 清空 SessionStorage
   */
  clear(): void {
    try {
      window.sessionStorage.clear();
    } catch (error) {
      console.error('[SessionStorage] Clear error:', error);
    }
  },
};

/**
 * IndexedDB 工具类
 */
export class IndexedDBHelper {
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
  async open(stores: { name: string; keyPath: string; indexes?: { name: string; keyPath: string; unique?: boolean }[] }[]): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        stores.forEach((store) => {
          if (!db.objectStoreNames.contains(store.name)) {
            const objectStore = db.createObjectStore(store.name, { keyPath: store.keyPath });

            if (store.indexes) {
              store.indexes.forEach((index) => {
                objectStore.createIndex(index.name, index.keyPath, { unique: index.unique });
              });
            }
          }
        });
      };
    });
  }

  /**
   * 添加数据
   */
  async add<T>(storeName: string, data: T): Promise<void> {
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
   */
  async get<T>(storeName: string, key: string): Promise<T | null> {
    if (!this.db) throw new Error('Database not opened');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);

      request.onsuccess = () => resolve(request.result as T);
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

      request.onsuccess = () => resolve(request.result as T[]);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * 更新数据
   */
  async update<T>(storeName: string, data: T): Promise<void> {
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
   */
  async delete(storeName: string, key: string): Promise<void> {
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
   * 清空对象存储
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
 * Cookie 工具类
 */
export const cookie = {
  /**
   * 设置 Cookie
   */
  set(name: string, value: string, days: number = 7): void {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
  },

  /**
   * 获取 Cookie
   */
  get(name: string): string | null {
    const nameEQ = `${name}=`;
    const cookies = document.cookie.split(';');

    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i];
      while (cookie.charAt(0) === ' ') {
        cookie = cookie.substring(1, cookie.length);
      }
      if (cookie.indexOf(nameEQ) === 0) {
        return cookie.substring(nameEQ.length, cookie.length);
      }
    }

    return null;
  },

  /**
   * 删除 Cookie
   */
  remove(name: string): void {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
  },

  /**
   * 检查 Cookie 是否存在
   */
  has(name: string): boolean {
    return this.get(name) !== null;
  },
};
