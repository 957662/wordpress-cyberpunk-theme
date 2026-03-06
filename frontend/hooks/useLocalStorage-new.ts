/**
 * useLocalStorage Hook
 * 本地存储Hook - 与localStorage同步状态
 * CyberPress Platform
 */

import { useState, useEffect, useCallback } from 'react';

export interface UseLocalStorageOptions<T> {
  serializer?: {
    stringify: (value: T) => string;
    parse: (value: string) => T;
  };
  syncAcrossTabs?: boolean;
  onError?: (error: Error) => void;
}

/**
 * 本地存储Hook
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options?: UseLocalStorageOptions<T>
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const {
    serializer = JSON,
    syncAcrossTabs = false,
    onError,
  } = options ?? {};

  // 获取初始值
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? serializer.parse(item) : initialValue;
    } catch (error) {
      onError?.(error as Error);
      return initialValue;
    }
  });

  // 更新localStorage
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, serializer.stringify(valueToStore));

        // 触发自定义事件以便其他标签页同步
        if (syncAcrossTabs) {
          window.dispatchEvent(
            new StorageEvent('local-storage', {
              key,
              newValue: serializer.stringify(valueToStore),
            })
          );
        }
      } catch (error) {
        onError?.(error as Error);
      }
    },
    [key, storedValue, serializer, syncAcrossTabs, onError]
  );

  // 删除值
  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);

      if (syncAcrossTabs) {
        window.dispatchEvent(
          new StorageEvent('local-storage', {
            key,
            newValue: null,
          })
        );
      }
    } catch (error) {
      onError?.(error as Error);
    }
  }, [key, initialValue, syncAcrossTabs, onError]);

  // 监听其他标签页的变化
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent | CustomEvent) => {
      if ((e as StorageEvent).key === key && (e as StorageEvent).newValue !== null) {
        try {
          setStoredValue(serializer.parse((e as StorageEvent).newValue));
        } catch (error) {
          onError?.(error as Error);
        }
      } else if ((e as CustomEvent).detail?.key === key && (e as CustomEvent).detail?.newValue === null) {
        setStoredValue(initialValue);
      }
    };

    window.addEventListener('storage', handleStorageChange as EventListener);
    window.addEventListener('local-storage', handleStorageChange as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange as EventListener);
      window.removeEventListener('local-storage', handleStorageChange as EventListener);
    };
  }, [key, initialValue, serializer, onError]);

  return [storedValue, setValue, removeValue];
}

/**
 * 使用本地存储的对象
 */
export function useLocalStorageObject<T extends Record<string, any>>(
  key: string,
  initialValue: T
): [T, (updates: Partial<T>) => void, () => void] {
  const [value, setValue, removeValue] = useLocalStorage<T>(key, initialValue);

  const updateValue = useCallback(
    (updates: Partial<T>) => {
      setValue((prev) => ({ ...prev, ...updates }));
    },
    [setValue]
  );

  return [value, updateValue, removeValue];
}

/**
 * 使用本地存储的数组
 */
export function useLocalStorageArray<T>(
  key: string,
  initialValue: T[]
): [
  T[],
  {
    addItem: (item: T) => void;
    removeItem: (index: number) => void;
    updateItem: (index: number, item: T) => void;
    clear: () => void;
  }
] {
  const [value, setValue] = useLocalStorage<T[]>(key, initialValue);

  const addItem = useCallback(
    (item: T) => {
      setValue((prev) => [...prev, item]);
    },
    [setValue]
  );

  const removeItem = useCallback(
    (index: number) => {
      setValue((prev) => prev.filter((_, i) => i !== index));
    },
    [setValue]
  );

  const updateItem = useCallback(
    (index: number, item: T) => {
      setValue((prev) => {
        const newArray = [...prev];
        newArray[index] = item;
        return newArray;
      });
    },
    [setValue]
  );

  const clear = useCallback(() => {
    setValue([]);
  }, [setValue]);

  return [value, { addItem, removeItem, updateItem, clear }];
}
