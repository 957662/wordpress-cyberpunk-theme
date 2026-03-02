import { useState, useEffect } from 'react';

/**
 * LocalStorage Hook
 * @param key - 存储键名
 * @param initialValue - 初始值
 * @returns [value, setValue] 状态和更新函数
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // 获取初始值
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`读取 localStorage key "${key}" 失败:`, error);
      return initialValue;
    }
  });

  // 更新 localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);

      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`设置 localStorage key "${key}" 失败:`, error);
    }
  };

  return [storedValue, setValue];
}
