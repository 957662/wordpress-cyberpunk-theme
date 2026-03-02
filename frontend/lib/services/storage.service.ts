/**
 * Storage Service for CyberPress Platform
 *
 * This service provides a unified interface for various storage operations:
 * - Local storage (browser localStorage)
 * - Session storage (browser sessionStorage)
 * - IndexedDB for larger data
 * - Cookie management
 */

/**
 * Storage service for managing different types of browser storage
 */
export class StorageService {
  private static instance: StorageService;
  private readonly prefix = 'cyberpress_';

  private constructor() {}

  /**
   * Get singleton instance
   */
  public static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  /**
   * Generate prefixed key
   */
  private getPrefixedKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  /**
   * Local Storage Methods
   */

  /**
   * Set item in local storage
   */
  setLocalItem<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;

    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(this.getPrefixedKey(key), serializedValue);
    } catch (error) {
      console.error('Error saving to local storage:', error);
    }
  }

  /**
   * Get item from local storage
   */
  getLocalItem<T>(key: string): T | null {
    if (typeof window === 'undefined') return null;

    try {
      const item = localStorage.getItem(this.getPrefixedKey(key));
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading from local storage:', error);
      return null;
    }
  }

  /**
   * Remove item from local storage
   */
  removeLocalItem(key: string): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.removeItem(this.getPrefixedKey(key));
    } catch (error) {
      console.error('Error removing from local storage:', error);
    }
  }

  /**
   * Clear all items from local storage (with prefix)
   */
  clearLocalItems(): void {
    if (typeof window === 'undefined') return;

    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Error clearing local storage:', error);
    }
  }

  /**
   * Session Storage Methods
   */

  /**
   * Set item in session storage
   */
  setSessionItem<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;

    try {
      const serializedValue = JSON.stringify(value);
      sessionStorage.setItem(this.getPrefixedKey(key), serializedValue);
    } catch (error) {
      console.error('Error saving to session storage:', error);
    }
  }

  /**
   * Get item from session storage
   */
  getSessionItem<T>(key: string): T | null {
    if (typeof window === 'undefined') return null;

    try {
      const item = sessionStorage.getItem(this.getPrefixedKey(key));
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading from session storage:', error);
      return null;
    }
  }

  /**
   * Remove item from session storage
   */
  removeSessionItem(key: string): void {
    if (typeof window === 'undefined') return;

    try {
      sessionStorage.removeItem(this.getPrefixedKey(key));
    } catch (error) {
      console.error('Error removing from session storage:', error);
    }
  }

  /**
   * Clear all items from session storage (with prefix)
   */
  clearSessionItems(): void {
    if (typeof window === 'undefined') return;

    try {
      const keys = Object.keys(sessionStorage);
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          sessionStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Error clearing session storage:', error);
    }
  }

  /**
   * Cookie Methods
   */

  /**
   * Set cookie
   */
  setCookie(
    name: string,
    value: string,
    options: {
      days?: number;
      path?: string;
      domain?: string;
      secure?: boolean;
      sameSite?: 'strict' | 'lax' | 'none';
    } = {}
  ): void {
    if (typeof window === 'undefined') return;

    const {
      days = 7,
      path = '/',
      secure = true,
      sameSite = 'lax',
    } = options;

    let expires = '';

    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = '; expires=' + date.toUTCString();
    }

    const cookieValue = `${this.getPrefixedKey(name)}=${value}${expires}; path=${path}`;

    const cookieOptions = [
      secure ? '; secure' : '',
      sameSite ? `; samesite=${sameSite}` : '',
      options.domain ? `; domain=${options.domain}` : '',
    ].join('');

    document.cookie = cookieValue + cookieOptions;
  }

  /**
   * Get cookie
   */
  getCookie(name: string): string | null {
    if (typeof window === 'undefined') return null;

    const nameEQ = `${this.getPrefixedKey(name)}=`;
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
  }

  /**
   * Remove cookie
   */
  removeCookie(name: string, options: { path?: string; domain?: string } = {}): void {
    if (typeof window === 'undefined') return;

    const { path = '/', domain } = options;
    const domainStr = domain ? `; domain=${domain}` : '';

    document.cookie = `${this.getPrefixedKey(name)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}${domainStr}`;
  }

  /**
   * IndexedDB Methods (for larger data storage)
   */

  /**
   * Open IndexedDB database
   */
  private async openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('CyberPressDB', 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create object stores if they don't exist
        if (!db.objectStoreNames.contains('storage')) {
          db.createObjectStore('storage', { keyPath: 'key' });
        }
      };
    });
  }

  /**
   * Set item in IndexedDB
   */
  async setIndexedDBItem<T>(key: string, value: T): Promise<void> {
    if (typeof window === 'undefined' || !window.indexedDB) {
      throw new Error('IndexedDB not supported');
    }

    try {
      const db = await this.openDB();
      const transaction = db.transaction(['storage'], 'readwrite');
      const store = transaction.objectStore('storage');

      await new Promise<void>((resolve, reject) => {
        const request = store.put({
          key: this.getPrefixedKey(key),
          value,
          timestamp: Date.now(),
        });

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });

      db.close();
    } catch (error) {
      console.error('Error saving to IndexedDB:', error);
      throw error;
    }
  }

  /**
   * Get item from IndexedDB
   */
  async getIndexedDBItem<T>(key: string): Promise<T | null> {
    if (typeof window === 'undefined' || !window.indexedDB) {
      throw new Error('IndexedDB not supported');
    }

    try {
      const db = await this.openDB();
      const transaction = db.transaction(['storage'], 'readonly');
      const store = transaction.objectStore('storage');

      const result = await new Promise<T | null>((resolve, reject) => {
        const request = store.get(this.getPrefixedKey(key));

        request.onsuccess = () => {
          const data = request.result;
          resolve(data ? data.value : null);
        };
        request.onerror = () => reject(request.error);
      });

      db.close();
      return result;
    } catch (error) {
      console.error('Error reading from IndexedDB:', error);
      throw error;
    }
  }

  /**
   * Remove item from IndexedDB
   */
  async removeIndexedDBItem(key: string): Promise<void> {
    if (typeof window === 'undefined' || !window.indexedDB) {
      throw new Error('IndexedDB not supported');
    }

    try {
      const db = await this.openDB();
      const transaction = db.transaction(['storage'], 'readwrite');
      const store = transaction.objectStore('storage');

      await new Promise<void>((resolve, reject) => {
        const request = store.delete(this.getPrefixedKey(key));

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });

      db.close();
    } catch (error) {
      console.error('Error removing from IndexedDB:', error);
      throw error;
    }
  }

  /**
   * Clear all items from IndexedDB
   */
  async clearIndexedDB(): Promise<void> {
    if (typeof window === 'undefined' || !window.indexedDB) {
      throw new Error('IndexedDB not supported');
    }

    try {
      const db = await this.openDB();
      const transaction = db.transaction(['storage'], 'readwrite');
      const store = transaction.objectStore('storage');

      await new Promise<void>((resolve, reject) => {
        const request = store.clear();

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });

      db.close();
    } catch (error) {
      console.error('Error clearing IndexedDB:', error);
      throw error;
    }
  }

  /**
   * Utility Methods
   */

  /**
   * Get storage usage
   */
  getStorageUsage(): { localStorage: number; sessionStorage: number } {
    if (typeof window === 'undefined') {
      return { localStorage: 0, sessionStorage: 0 };
    }

    let localStorageSize = 0;
    let sessionStorageSize = 0;

    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        localStorageSize += key.length + localStorage[key].length;
      }
    }

    for (let key in sessionStorage) {
      if (sessionStorage.hasOwnProperty(key)) {
        sessionStorageSize += key.length + sessionStorage[key].length;
      }
    }

    return {
      localStorage: localStorageSize,
      sessionStorage: sessionStorageSize,
    };
  }

  /**
   * Clear all storage
   */
  clearAll(): void {
    this.clearLocalItems();
    this.clearSessionItems();
    // Note: Cookies are not cleared as they may be used for authentication
  }
}

// Export singleton instance
export const storageService = StorageService.getInstance();

// Export default
export default StorageService;
