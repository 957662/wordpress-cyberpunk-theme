/**
 * 本地存储相关 Hooks
 * 提供 localStorage, sessionStorage 的同步和状态管理
 */

import { useState, useEffect, useCallback } from 'react';

export interface StorageOptions<T> {
  defaultValue: T;
  serializer?: {
    read: (value: string) => T;
    write: (value: T) => string;
  };
}

/**
 * localStorage Hook
 */
export function useLocalStorage<T>(
  key: string,
  options: StorageOptions<T>
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const { defaultValue, serializer } = options;

  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') {
      return defaultValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? (serializer ? serializer.read(item) : (JSON.parse(item) as T)) : defaultValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  }, [defaultValue, key, serializer]);

  const [storedValue, setStoredValue] = useState<T>(readValue);

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);

        if (typeof window !== 'undefined') {
          const serialized = serializer ? serializer.write(valueToStore) : JSON.stringify(valueToStore);
          window.localStorage.setItem(key, serialized);
        }
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue, serializer]
  );

  const removeValue = useCallback(() => {
    try {
      setStoredValue(defaultValue);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }, [defaultValue, key]);

  // 监听其他标签页的变化
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          const newValue = serializer ? serializer.read(e.newValue) : JSON.parse(e.newValue);
          setStoredValue(newValue);
        } catch (error) {
          console.warn(`Error parsing storage value for key "${key}":`, error);
        }
      } else if (e.key === key && e.newValue === null) {
        setStoredValue(defaultValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [defaultValue, key, serializer]);

  return [storedValue, setValue, removeValue];
}

/**
 * sessionStorage Hook
 */
export function useSessionStorage<T>(
  key: string,
  options: StorageOptions<T>
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const { defaultValue, serializer } = options;

  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') {
      return defaultValue;
    }

    try {
      const item = window.sessionStorage.getItem(key);
      return item ? (serializer ? serializer.read(item) : (JSON.parse(item) as T)) : defaultValue;
    } catch (error) {
      console.warn(`Error reading sessionStorage key "${key}":`, error);
      return defaultValue;
    }
  }, [defaultValue, key, serializer]);

  const [storedValue, setStoredValue] = useState<T>(readValue);

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);

        if (typeof window !== 'undefined') {
          const serialized = serializer ? serializer.write(valueToStore) : JSON.stringify(valueToStore);
          window.sessionStorage.setItem(key, serialized);
        }
      } catch (error) {
        console.warn(`Error setting sessionStorage key "${key}":`, error);
      }
    },
    [key, storedValue, serializer]
  );

  const removeValue = useCallback(() => {
    try {
      setStoredValue(defaultValue);
      if (typeof window !== 'undefined') {
        window.sessionStorage.removeItem(key);
      }
    } catch (error) {
      console.warn(`Error removing sessionStorage key "${key}":`, error);
    }
  }, [defaultValue, key]);

  return [storedValue, setValue, removeValue];
}

/**
 * Cookie Hook
 */
export function useCookie(
  name: string,
  defaultValue: string = ''
): [string, (value: string, options?: CookieOptions) => void, () => void] {
  const [value, setValue] = useState<string>(() => {
    if (typeof window === 'undefined') {
      return defaultValue;
    }

    const cookie = document.cookie
      .split('; ')
      .find((c) => c.startsWith(`${name}=`))
      ?.split('=')[1];

    return cookie || defaultValue;
  });

  const setCookie = useCallback(
    (newValue: string, options: CookieOptions = {}) => {
      setValue(newValue);

      if (typeof window !== 'undefined') {
        let cookieString = `${name}=${newValue}`;

        if (options.days) {
          const date = new Date();
          date.setTime(date.getTime() + options.days * 24 * 60 * 60 * 1000);
          cookieString += `; expires=${date.toUTCString()}`;
        }

        if (options.path) {
          cookieString += `; path=${options.path}`;
        }

        if (options.domain) {
          cookieString += `; domain=${options.domain}`;
        }

        if (options.secure) {
          cookieString += '; secure';
        }

        if (options.sameSite) {
          cookieString += `; samesite=${options.sameSite}`;
        }

        document.cookie = cookieString;
      }
    },
    [name]
  );

  const removeCookie = useCallback(() => {
    setValue(defaultValue);

    if (typeof window !== 'undefined') {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
    }
  }, [defaultValue, name]);

  return [value, setCookie, removeCookie];
}

export interface CookieOptions {
  days?: number;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
}

/**
 * IndexedDB Hook
 */
export function useIndexedDB<T>(
  dbName: string,
  storeName: string,
  key: string
): [T | null, (value: T) => Promise<void>, () => Promise<void>] {
  const [value, setValue] = useState<T | null>(null);
  const [db, setDb] = useState<IDBDatabase | null>(null);

  // 初始化 IndexedDB
  useEffect(() => {
    const request = indexedDB.open(dbName, 1);

    request.onerror = () => {
      console.error('Error opening IndexedDB');
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;
      if (!database.objectStoreNames.contains(storeName)) {
        database.createObjectStore(storeName);
      }
    };

    request.onsuccess = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;
      setDb(database);

      // 读取初始值
      const transaction = database.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const getRequest = store.get(key);

      getRequest.onsuccess = () => {
        setValue(getRequest.result as T);
      };
    };

    return () => {
      if (db) {
        db.close();
      }
    };
  }, [dbName, storeName, key]);

  const updateValue = useCallback(
    async (newValue: T) => {
      if (!db) return;

      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      store.put(newValue, key);

      return new Promise<void>((resolve, reject) => {
        transaction.oncomplete = () => {
          setValue(newValue);
          resolve();
        };
        transaction.onerror = () => {
          reject(new Error('Error updating IndexedDB'));
        };
      });
    },
    [db, storeName, key]
  );

  const removeValue = useCallback(async () => {
    if (!db) return;

    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    store.delete(key);

    return new Promise<void>((resolve, reject) => {
      transaction.oncomplete = () => {
        setValue(null);
        resolve();
      };
      transaction.onerror = () => {
        reject(new Error('Error removing from IndexedDB'));
      };
    });
  }, [db, storeName, key]);

  return [value, updateValue, removeValue];
}

/**
 * 存储大小监控 Hook
 */
export function useStorageSize(storage: 'localStorage' | 'sessionStorage' = 'localStorage') {
  const [size, setSize] = useState<number>(0);

  useEffect(() => {
    const calculateSize = () => {
      let total = 0;
      for (let key in window[storage]) {
        if (window[storage].hasOwnProperty(key)) {
          total += window[storage][key].length + key.length;
        }
      }
      return total;
    };

    const updateSize = () => {
      setSize(calculateSize());
    };

    updateSize();

    window.addEventListener('storage', updateSize);
    return () => window.removeEventListener('storage', updateSize);
  }, [storage]);

  const getFormattedSize = useCallback(() => {
    const bytes = size;
    const kb = bytes / 1024;
    const mb = kb / 1024;

    if (mb >= 1) {
      return `${mb.toFixed(2)} MB`;
    } else if (kb >= 1) {
      return `${kb.toFixed(2)} KB`;
    } else {
      return `${bytes} bytes`;
    }
  }, [size]);

  return { size, getFormattedSize };
}

/**
 * 清除存储 Hook
 */
export function useClearStorage() {
  const clearLocalStorage = useCallback(() => {
    try {
      window.localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }, []);

  const clearSessionStorage = useCallback(() => {
    try {
      window.sessionStorage.clear();
    } catch (error) {
      console.error('Error clearing sessionStorage:', error);
    }
  }, []);

  const clearAllStorage = useCallback(() => {
    clearLocalStorage();
    clearSessionStorage();
  }, [clearLocalStorage, clearSessionStorage]);

  return { clearLocalStorage, clearSessionStorage, clearAllStorage };
}

/**
 * 存储序列化器
 */
export const Serializers = {
  JSON: {
    read: (value: string) => JSON.parse(value),
    write: (value: any) => JSON.stringify(value),
  },
  Number: {
    read: (value: string) => Number(value),
    write: (value: number) => String(value),
  },
  Boolean: {
    read: (value: string) => value === 'true',
    write: (value: boolean) => String(value),
  },
  String: {
    read: (value: string) => value,
    write: (value: string) => value,
  },
  Date: {
    read: (value: string) => new Date(value),
    write: (value: Date) => value.toISOString(),
  },
  Array: {
    read: (value: string) => JSON.parse(value),
    write: (value: any[]) => JSON.stringify(value),
  },
};
