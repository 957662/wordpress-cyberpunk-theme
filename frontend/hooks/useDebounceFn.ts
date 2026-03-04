/**
 * useDebounceFn Hook
 * 防抖函数Hook
 */

import { useCallback, useRef, useState, useEffect } from 'react';

export function useDebounceFn<T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 300
): T {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return useCallback(
    ((...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        fn(...args);
      }, delay);
    }) as T,
    [fn, delay]
  );
}

// 导出便捷Hook
export function useDebounceCallback<T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 300
): [T, () => void] {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const debouncedFnRef = useRef<T | null>(null);

  debouncedFnRef.current = useCallback(
    ((...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        fn(...args);
      }, delay);
    }) as T,
    [fn, delay]
  );

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  return [debouncedFnRef.current as T, cancel];
}

// 防抖值Hook
export function useDebounceValue<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

// 节流函数Hook
export function useThrottleFn<T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 300
): T {
  const lastRunRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return useCallback(
    ((...args: Parameters<T>) => {
      const now = Date.now();
      const timeSinceLastRun = now - lastRunRef.current;

      if (timeSinceLastRun >= delay) {
        lastRunRef.current = now;
        fn(...args);
      } else {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
          lastRunRef.current = Date.now();
          fn(...args);
        }, delay - timeSinceLastRun);
      }
    }) as T,
    [fn, delay]
  );
}

// 导出便捷节流Hook
export function useThrottleCallback<T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 300
): [T, () => void] {
  const lastRunRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const throttledFnRef = useRef<T | null>(null);

  throttledFnRef.current = useCallback(
    ((...args: Parameters<T>) => {
      const now = Date.now();
      const timeSinceLastRun = now - lastRunRef.current;

      if (timeSinceLastRun >= delay) {
        lastRunRef.current = now;
        fn(...args);
      } else {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
          lastRunRef.current = Date.now();
          fn(...args);
        }, delay - timeSinceLastRun);
      }
    }) as T,
    [fn, delay]
  );

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  return [throttledFnRef.current as T, cancel];
}
