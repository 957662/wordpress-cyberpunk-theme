/**
 * Storage Utilities
 * 本地存储工具函数
 */

type StorageType = 'localStorage' | 'sessionStorage';

/**
 * Safely get storage
 */
function getStorage(type: StorageType): Storage | null {
  if (typeof window === 'undefined') return null;

  try {
    return type === 'localStorage' ? window.localStorage : window.sessionStorage;
  } catch {
    return null;
  }
}

/**
 * Set item in storage
 */
export function setStorageItem<T>(
  key: string,
  value: T,
  type: StorageType = 'localStorage'
): boolean {
  const storage = getStorage(type);
  if (!storage) return false;

  try {
    const serialized = JSON.stringify(value);
    storage.setItem(key, serialized);
    return true;
  } catch (error) {
    console.error(`Failed to set ${key} in ${type}:`, error);
    return false;
  }
}

/**
 * Get item from storage
 */
export function getStorageItem<T>(
  key: string,
  defaultValue: T | null = null,
  type: StorageType = 'localStorage'
): T | null {
  const storage = getStorage(type);
  if (!storage) return defaultValue;

  try {
    const serialized = storage.getItem(key);
    if (serialized === null) return defaultValue;
    return JSON.parse(serialized) as T;
  } catch (error) {
    console.error(`Failed to get ${key} from ${type}:`, error);
    return defaultValue;
  }
}

/**
 * Remove item from storage
 */
export function removeStorageItem(
  key: string,
  type: StorageType = 'localStorage'
): boolean {
  const storage = getStorage(type);
  if (!storage) return false;

  try {
    storage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Failed to remove ${key} from ${type}:`, error);
    return false;
  }
}

/**
 * Clear all items from storage
 */
export function clearStorage(type: StorageType = 'localStorage'): boolean {
  const storage = getStorage(type);
  if (!storage) return false;

  try {
    storage.clear();
    return true;
  } catch (error) {
    console.error(`Failed to clear ${type}:`, error);
    return false;
  }
}

/**
 * Check if key exists in storage
 */
export function hasStorageKey(
  key: string,
  type: StorageType = 'localStorage'
): boolean {
  const storage = getStorage(type);
  if (!storage) return false;

  try {
    return storage.getItem(key) !== null;
  } catch {
    return false;
  }
}

/**
 * Get all keys from storage
 */
export function getStorageKeys(type: StorageType = 'localStorage'): string[] {
  const storage = getStorage(type);
  if (!storage) return [];

  try {
    return Object.keys(storage);
  } catch {
    return [];
  }
}

/**
 * Get storage size (approximate, in bytes)
 */
export function getStorageSize(type: StorageType = 'localStorage'): number {
  const storage = getStorage(type);
  if (!storage) return 0;

  try {
    let size = 0;
    for (let key in storage) {
      if (storage.hasOwnProperty(key)) {
        size += key.length + storage[key].length;
      }
    }
    return size;
  } catch {
    return 0;
  }
}

/**
 * Compress data before storing (basic compression)
 */
export function compressData(data: any): string {
  const json = JSON.stringify(data);
  return btoa(encodeURIComponent(json));
}

/**
 * Decompress data from storage
 */
export function decompressData<T>(compressed: string): T | null {
  try {
    const json = decodeURIComponent(atob(compressed));
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

/**
 * Storage with expiration
 */
export function setStorageWithExpiration<T>(
  key: string,
  value: T,
  ttl: number, // milliseconds
  type: StorageType = 'localStorage'
): boolean {
  const item = {
    value,
    expires: Date.now() + ttl,
  };
  return setStorageItem(key, item, type);
}

/**
 * Get item with expiration check
 */
export function getStorageWithExpiration<T>(
  key: string,
  type: StorageType = 'localStorage'
): T | null {
  const item = getStorageItem<{ value: T; expires: number }>(key, null, type);

  if (!item) return null;

  if (Date.now() > item.expires) {
    removeStorageItem(key, type);
    return null;
  }

  return item.value;
}

/**
 * Subscribe to storage changes (cross-tab)
 */
export function subscribeToStorageChanges(
  key: string,
  callback: (newValue: any, oldValue: any) => void,
  type: StorageType = 'localStorage'
): () => void {
  const storage = getStorage(type);
  if (!storage) return () => {};

  const handler = (e: StorageEvent) => {
    if (e.storageArea === storage && e.key === key) {
      const newValue = e.newValue ? JSON.parse(e.newValue) : null;
      const oldValue = e.oldValue ? JSON.parse(e.oldValue) : null;
      callback(newValue, oldValue);
    }
  };

  window.addEventListener('storage', handler);

  return () => window.removeEventListener('storage', handler);
}

/**
 * IndexedDB helper (for larger data)
 */
export class IndexedDBHelper {
  private db: IDBDatabase | null = null;
  private dbName: string;
  private version: number;

  constructor(dbName: string, version = 1) {
    this.dbName = dbName;
    this.version = version;
  }

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        // Create object store if needed
        if (!db.objectStoreNames.contains('data')) {
          db.createObjectStore('data', { keyPath: 'key' });
        }
      };
    });
  }

  async set(key: string, value: any): Promise<void> {
    if (!this.db) await this.connect();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['data'], 'readwrite');
      const store = transaction.objectStore('data');
      const request = store.put({ key, value });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.db) await this.connect();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['data'], 'readonly');
      const store = transaction.objectStore('data');
      const request = store.get(key);

      request.onsuccess = () => {
        const result = request.result;
        resolve(result ? result.value : null);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async delete(key: string): Promise<void> {
    if (!this.db) await this.connect();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['data'], 'readwrite');
      const store = transaction.objectStore('data');
      const request = store.delete(key);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async clear(): Promise<void> {
    if (!this.db) await this.connect();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['data'], 'readwrite');
      const store = transaction.objectStore('data');
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  close(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }
}
