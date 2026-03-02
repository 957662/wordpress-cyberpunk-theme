// 本地存储工具函数

/**
 * 获取 localStorage 值
 */
export function getStorageItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;

  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
}

/**
 * 设置 localStorage 值
 */
export function setStorageItem<T>(key: string, value: T): boolean {
  if (typeof window === 'undefined') return false;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error setting localStorage key "${key}":`, error);
    return false;
  }
}

/**
 * 删除 localStorage 值
 */
export function removeStorageItem(key: string): boolean {
  if (typeof window === 'undefined') return false;

  try {
    window.localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing localStorage key "${key}":`, error);
    return false;
  }
}

/**
 * 清空所有 localStorage
 */
export function clearStorage(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    window.localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
}

/**
 * 获取 sessionStorage 值
 */
export function getSessionItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;

  try {
    const item = window.sessionStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading sessionStorage key "${key}":`, error);
    return defaultValue;
  }
}

/**
 * 设置 sessionStorage 值
 */
export function setSessionItem<T>(key: string, value: T): boolean {
  if (typeof window === 'undefined') return false;

  try {
    window.sessionStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error setting sessionStorage key "${key}":`, error);
    return false;
  }
}

/**
 * 删除 sessionStorage 值
 */
export function removeSessionItem(key: string): boolean {
  if (typeof window === 'undefined') return false;

  try {
    window.sessionStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing sessionStorage key "${key}":`, error);
    return false;
  }
}

/**
 * Cookie 工具函数
 */
export const cookie = {
  /**
   * 获取 Cookie 值
   */
  get(name: string): string | null {
    if (typeof window === 'undefined') return null;

    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  },

  /**
   * 设置 Cookie
   */
  set(name: string, value: string, days: number = 7): boolean {
    if (typeof window === 'undefined') return false;

    try {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
      return true;
    } catch (error) {
      console.error(`Error setting cookie "${name}":`, error);
      return false;
    }
  },

  /**
   * 删除 Cookie
   */
  remove(name: string): boolean {
    if (typeof window === 'undefined') return false;

    try {
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
      return true;
    } catch (error) {
      console.error(`Error removing cookie "${name}":`, error);
      return false;
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

  async init(storeName: string, keyPath: string = 'id'): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath });
        }
      };
    });
  }

  async add<T>(storeName: string, data: T): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.add(data);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async get<T>(storeName: string, key: IDBValidKey): Promise<T | undefined> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getAll<T>(storeName: string): Promise<T[]> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async delete(storeName: string, key: IDBValidKey): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(key);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}
