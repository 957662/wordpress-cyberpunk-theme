import { useState, useEffect, useCallback } from 'react';
import { eventBus } from '@/lib/event-bus';

/**
 * 跨组件状态同步 Hook
 * 使用事件总线实现简单的跨组件状态管理
 */
export function useSharedState<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(() => {
    // 尝试从事件总线的缓存中获取初始值
    const cached = (eventBus as any).getStateCache?.(key);
    return cached !== undefined ? cached : initialValue;
  });

  // 更新状态并通知其他组件
  const setSharedState = useCallback((value: T | ((prev: T) => T)) => {
    setState((prev) => {
      const newValue = typeof value === 'function' ? (value as (prev: T) => T)(prev) : value;
      // 通过事件总线通知其他组件
      eventBus.emit(`shared-state:${key}`, newValue);
      return newValue;
    });
  }, [key]);

  // 监听其他组件的状态更新
  useEffect(() => {
    const unsubscribe = eventBus.on<T>(`shared-state:${key}`, (newValue) => {
      setState(newValue);
    });

    return unsubscribe;
  }, [key]);

  return [state, setSharedState];
}

/**
 * 本地存储同步 Hook
 * 自动将状态同步到 localStorage
 */
export function useLocalStorageState<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  // 从 localStorage 获取初始值
  const [state, setState] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading from localStorage key "${key}":`, error);
      return initialValue;
    }
  ]);

  // 更新状态并同步到 localStorage
  const setLocalStorageState = useCallback((value: T | ((prev: T) => T)) => {
    setState((prev) => {
      const newValue = typeof value === 'function' ? (value as (prev: T) => T)(prev) : value;

      if (typeof window !== 'undefined') {
        try {
          window.localStorage.setItem(key, JSON.stringify(newValue));
        } catch (error) {
          console.error(`Error writing to localStorage key "${key}":`, error);
        }
      }

      return newValue;
    });
  }, [key]);

  // 清除 localStorage 中的值
  const clearLocalStorageState = useCallback(() => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.removeItem(key);
      } catch (error) {
        console.error(`Error removing localStorage key "${key}":`, error);
      }
    }
    setState(initialValue);
  }, [key, initialValue]);

  return [state, setLocalStorageState, clearLocalStorageState];
}

/**
 * 会话存储同步 Hook
 * 自动将状态同步到 sessionStorage
 */
export function useSessionStorageState<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const [state, setState] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;

    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading from sessionStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setSessionStorageState = useCallback((value: T | ((prev: T) => T)) => {
    setState((prev) => {
      const newValue = typeof value === 'function' ? (value as (prev: T) => T)(prev) : value;

      if (typeof window !== 'undefined') {
        try {
          window.sessionStorage.setItem(key, JSON.stringify(newValue));
        } catch (error) {
          console.error(`Error writing to sessionStorage key "${key}":`, error);
        }
      }

      return newValue;
    });
  }, [key]);

  const clearSessionStorageState = useCallback(() => {
    if (typeof window !== 'undefined') {
      try {
        window.sessionStorage.removeItem(key);
      } catch (error) {
        console.error(`Error removing sessionStorage key "${key}":`, error);
      }
    }
    setState(initialValue);
  }, [key, initialValue]);

  return [state, setSessionStorageState, clearSessionStorageState];
}

/**
 * URL 状态同步 Hook
 * 自动将状态同步到 URL 查询参数
 */
export function useURLState<T extends string | number>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  const [state, setState] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;

    const params = new URLSearchParams(window.location.search);
    const value = params.get(key);

    if (value === null) return initialValue;

    // 尝试转换为数字
    if (typeof initialValue === 'number') {
      const num = Number(value);
      return isNaN(num) ? initialValue : (num as T);
    }

    return value as T;
  });

  const setURLState = useCallback(
    (value: T) => {
      setState(value);

      if (typeof window === 'undefined') return;

      const url = new URL(window.location.href);
      const params = new URLSearchParams(url.search);

      if (value === initialValue) {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }

      url.search = params.toString();
      window.history.replaceState({}, '', url.toString());
    },
    [key, initialValue]
  );

  return [state, setURLState];
}

/**
 * 历史记录状态 Hook
 * 记录状态的历史变化
 */
export function useHistoryState<T>(initialValue: T) {
  const [history, setHistory] = useState<Array<{ value: T; timestamp: number }>>([
    { value: initialValue, timestamp: Date.now() },
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentValue = history[currentIndex]?.value ?? initialValue;

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    setHistory((prev) => {
      const newValue = typeof value === 'function' ? (value as (prev: T) => T)(currentValue) : value;

      // 如果不在历史记录末尾，删除后面的记录
      const newHistory = prev.slice(0, currentIndex + 1);

      return [
        ...newHistory,
        { value: newValue, timestamp: Date.now() },
      ];
    });

    setCurrentIndex((prev) => prev + 1);
  }, [currentIndex, currentValue]);

  const undo = useCallback(() => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const redo = useCallback(() => {
    setCurrentIndex((prev) => Math.min(history.length - 1, prev + 1));
  }, [history.length]);

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  const clear = useCallback(() => {
    setHistory([{ value: initialValue, timestamp: Date.now() }]);
    setCurrentIndex(0);
  }, [initialValue]);

  return {
    value: currentValue,
    setValue,
    undo,
    redo,
    canUndo,
    canRedo,
    history,
    currentIndex,
    clear,
  };
}
