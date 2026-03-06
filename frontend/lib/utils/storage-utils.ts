/**
 * Storage Utilities - 存储工具函数
 * 提供 localStorage 和 sessionStorage 的类型安全操作
 */

type StorageType = 'localStorage' | 'sessionStorage';

/**
 * 从存储中获取值
 * @param key 存储键
 * @param storageType 存储类型
 * @param defaultValue 默认值
 * @returns 存储的值或默认值
 */
export function getStorage<T>(
  key: string,
  storageType: StorageType = 'localStorage',
  defaultValue?: T
): T | undefined {
  if (typeof window === 'undefined') return defaultValue;

  try {
    const storage = window[storageType];
    const item = storage.getItem(key);

    if (item === null) return defaultValue;

    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Error reading from ${storageType}:`, error);
    return defaultValue;
  }
}

/**
 * 设置存储值
 * @param key 存储键
 * @param value 要存储的值
 * @param storageType 存储类型
 * @returns 是否成功
 */
export function setStorage<T>(
  key: string,
  value: T,
  storageType: StorageType = 'localStorage'
): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const storage = window[storageType];
    storage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error writing to ${storageType}:`, error);
    return false;
  }
}

/**
 * 从存储中删除值
 * @param key 存储键
 * @param storageType 存储类型
 * @returns 是否成功
 */
export function removeStorage(
  key: string,
  storageType: StorageType = 'localStorage'
): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const storage = window[storageType];
    storage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing from ${storageType}:`, error);
    return false;
  }
}

/**
 * 清空存储
 * @param storageType 存储类型
 * @returns 是否成功
 */
export function clearStorage(storageType: StorageType = 'localStorage'): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const storage = window[storageType];
    storage.clear();
    return true;
  } catch (error) {
    console.error(`Error clearing ${storageType}:`, error);
    return false;
  }
}

/**
 * 获取存储的所有键
 * @param storageType 存储类型
 * @returns 所有键的数组
 */
export function getStorageKeys(storageType: StorageType = 'localStorage'): string[] {
  if (typeof window === 'undefined') return [];

  try {
    const storage = window[storageType];
    return Object.keys(storage);
  } catch (error) {
    console.error(`Error getting keys from ${storageType}:`, error);
    return [];
  }
}

/**
 * 获取存储的大小（字节）
 * @param storageType 存储类型
 * @returns 存储大小
 */
export function getStorageSize(storageType: StorageType = 'localStorage'): number {
  if (typeof window === 'undefined') return 0;

  try {
    const storage = window[storageType];
    let size = 0;

    for (let key in storage) {
      if (storage.hasOwnProperty(key)) {
        size += storage[key].length + key.length;
      }
    }

    return size;
  } catch (error) {
    console.error(`Error calculating ${storageType} size:`, error);
    return 0;
  }
}

/**
 * 格式化存储大小
 * @param bytes 字节数
 * @returns 格式化的大小字符串
 */
export function formatStorageSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
}

/**
 * 检查存储是否可用
 * @param storageType 存储类型
 * @returns 是否可用
 */
export function isStorageAvailable(storageType: StorageType = 'localStorage'): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const storage = window[storageType];
    const testKey = '__storage_test__';
    storage.setItem(testKey, 'test');
    storage.removeItem(testKey);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * localStorage 工具
 */
export const localStorage = {
  get: <T>(key: string, defaultValue?: T) => getStorage<T>(key, 'localStorage', defaultValue),
  set: <T>(key: string, value: T) => setStorage<T>(key, value, 'localStorage'),
  remove: (key: string) => removeStorage(key, 'localStorage'),
  clear: () => clearStorage('localStorage'),
  getKeys: () => getStorageKeys('localStorage'),
  getSize: () => getStorageSize('localStorage'),
  isAvailable: () => isStorageAvailable('localStorage'),
};

/**
 * sessionStorage 工具
 */
export const sessionStorage = {
  get: <T>(key: string, defaultValue?: T) => getStorage<T>(key, 'sessionStorage', defaultValue),
  set: <T>(key: string, value: T) => setStorage<T>(key, value, 'sessionStorage'),
  remove: (key: string) => removeStorage(key, 'sessionStorage'),
  clear: () => clearStorage('sessionStorage'),
  getKeys: () => getStorageKeys('sessionStorage'),
  getSize: () => getStorageSize('sessionStorage'),
  isAvailable: () => isStorageAvailable('sessionStorage'),
};
