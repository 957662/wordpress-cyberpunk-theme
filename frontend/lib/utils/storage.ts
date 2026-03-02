/**
 * Storage Utility Functions
 * 存储工具函数 - localStorage 和 sessionStorage 封装
 */

type StorageType = 'localStorage' | 'sessionStorage';

/**
 * Get storage instance
 */
function getStorage(type: StorageType): Storage {
  if (typeof window === 'undefined') {
    throw new Error('Storage is not available on the server');
  }
  return type === 'localStorage' ? window.localStorage : window.sessionStorage;
}

/**
 * Set item in storage
 */
export function setItem<T>(key: string, value: T, type: StorageType = 'localStorage'): void {
  try {
    const storage = getStorage(type);
    const serialized = JSON.stringify(value);
    storage.setItem(key, serialized);
  } catch (error) {
    console.error(`Error setting ${type} item:`, error);
  }
}

/**
 * Get item from storage
 */
export function getItem<T>(key: string, defaultValue?: T, type: StorageType = 'localStorage'): T | undefined {
  try {
    const storage = getStorage(type);
    const item = storage.getItem(key);
    if (item === null) {
      return defaultValue;
    }
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Error getting ${type} item:`, error);
    return defaultValue;
  }
}

/**
 * Remove item from storage
 */
export function removeItem(key: string, type: StorageType = 'localStorage'): void {
  try {
    const storage = getStorage(type);
    storage.removeItem(key);
  } catch (error) {
    console.error(`Error removing ${type} item:`, error);
  }
}

/**
 * Clear all items from storage
 */
export function clearStorage(type: StorageType = 'localStorage'): void {
  try {
    const storage = getStorage(type);
    storage.clear();
  } catch (error) {
    console.error(`Error clearing ${type}:`, error);
  }
}

/**
 * Get all keys from storage
 */
export function getKeys(type: StorageType = 'localStorage'): string[] {
  try {
    const storage = getStorage(type);
    return Object.keys(storage);
  } catch (error) {
    console.error(`Error getting ${type} keys:`, error);
    return [];
  }
}

/**
 * Check if key exists in storage
 */
export function hasKey(key: string, type: StorageType = 'localStorage'): boolean {
  try {
    const storage = getStorage(type);
    return storage.getItem(key) !== null;
  } catch (error) {
    console.error(`Error checking ${type} key:`, error);
    return false;
  }
}

/**
 * Get storage size in bytes
 */
export function getStorageSize(type: StorageType = 'localStorage'): number {
  try {
    const storage = getStorage(type);
    let total = 0;
    for (let key in storage) {
      if (storage.hasOwnProperty(key)) {
        total += storage[key].length + key.length;
      }
    }
    return total;
  } catch (error) {
    console.error(`Error calculating ${type} size:`, error);
    return 0;
  }
}

/**
 * LocalStorage helper functions
 */
export const local = {
  set: <T>(key: string, value: T) => setItem(key, value, 'localStorage'),
  get: <T>(key: string, defaultValue?: T) => getItem(key, defaultValue, 'localStorage'),
  remove: (key: string) => removeItem(key, 'localStorage'),
  clear: () => clearStorage('localStorage'),
  has: (key: string) => hasKey(key, 'localStorage'),
  keys: () => getKeys('localStorage'),
  size: () => getStorageSize('localStorage'),
};

/**
 * SessionStorage helper functions
 */
export const session = {
  set: <T>(key: string, value: T) => setItem(key, value, 'sessionStorage'),
  get: <T>(key: string, defaultValue?: T) => getItem(key, defaultValue, 'sessionStorage'),
  remove: (key: string) => removeItem(key, 'sessionStorage'),
  clear: () => clearStorage('sessionStorage'),
  has: (key: string) => hasKey(key, 'sessionStorage'),
  keys: () => getKeys('sessionStorage'),
  size: () => getStorageSize('sessionStorage'),
};

/**
 * Storage class for managing items with expiration
 */
export class ExpiringStorage {
  private prefix: string;
  private type: StorageType;

  constructor(prefix = 'exp_', type: StorageType = 'localStorage') {
    this.prefix = prefix;
    this.type = type;
  }

  set(key: string, value: unknown, ttl: number): void {
    const now = new Date().getTime();
    const item = {
      value,
      expiry: now + ttl,
    };
    setItem(this.prefix + key, item, this.type);
  }

  get<T>(key: string): T | null {
    const item = getItem<{ value: T; expiry: number }>(this.prefix + key);

    if (!item) {
      return null;
    }

    const now = new Date().getTime();

    if (now > item.expiry) {
      this.remove(key);
      return null;
    }

    return item.value;
  }

  remove(key: string): void {
    removeItem(this.prefix + key, this.type);
  }

  has(key: string): boolean {
    const item = this.get(key);
    return item !== null;
  }

  clear(): void {
    const keys = getKeys(this.type);
    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        removeItem(key, this.type);
      }
    });
  }
}

/**
 * Create a storage instance for a specific namespace
 */
export function createNamespacedStorage(
  namespace: string,
  type: StorageType = 'localStorage'
) {
  const prefix = `${namespace}_`;

  return {
    set: <T>(key: string, value: T) => setItem(prefix + key, value, type),
    get: <T>(key: string, defaultValue?: T) => getItem(prefix + key, defaultValue, type),
    remove: (key: string) => removeItem(prefix + key, type),
    has: (key: string) => hasKey(prefix + key, type),
    keys: () => getKeys(type).filter(k => k.startsWith(prefix)),
    clear: () => {
      const keys = getKeys(type);
      keys.forEach(key => {
        if (key.startsWith(prefix)) {
          removeItem(key, type);
        }
      });
    },
  };
}

/**
 * Reactive storage hook for React
 */
export function useStorage<T>(
  key: string,
  initialValue: T,
  type: StorageType = 'localStorage'
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  if (typeof window === 'undefined') {
    return [initialValue, () => {}, () => {}];
  }

  // Initialize state
  const [storedValue, setStoredValue] = React.useState<T>(() => {
    return getItem(key, initialValue, type);
  });

  // Update localStorage when state changes
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      setItem(key, valueToStore, type);
    } catch (error) {
      console.error('Error setting storage value:', error);
    }
  };

  // Remove value
  const removeValue = () => {
    try {
      setStoredValue(initialValue);
      removeItem(key, type);
    } catch (error) {
      console.error('Error removing storage value:', error);
    }
  };

  // Listen for changes in other tabs
  React.useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        setStoredValue(JSON.parse(e.newValue));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue, removeValue];
}
