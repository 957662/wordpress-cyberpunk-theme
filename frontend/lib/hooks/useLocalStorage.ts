/**
 * LocalStorage Hook
 * 用于持久化状态到 localStorage
 */

import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error loading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);

        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}

/**
 * 使用多个 localStorage 键
 */
export function useMultipleLocalStorage<T extends Record<string, any>>(
  keys: string[],
  initialValues: T
): [T, (key: keyof T, value: any) => void] {
  const [values, setValues] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValues;
    }

    const result: any = {};
    keys.forEach(key => {
      try {
        const item = window.localStorage.getItem(key);
        result[key] = item ? JSON.parse(item) : initialValues[key];
      } catch (error) {
        result[key] = initialValues[key];
      }
    });

    return result;
  });

  const setValue = useCallback(
    (key: keyof T, value: any) => {
      setValues(prev => ({ ...prev, [key]: value }));

      if (typeof window !== 'undefined') {
        try {
          window.localStorage.setItem(String(key), JSON.stringify(value));
        } catch (error) {
          console.error(`Error setting localStorage key "${key}":`, error);
        }
      }
    },
    []
  );

  return [values, setValue];
}
