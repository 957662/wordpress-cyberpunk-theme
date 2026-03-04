/**
 * Throttle Utility
 * 节流工具函数
 */

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;
  let lastResult: ReturnType<T>;

  return function (this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      inThrottle = true;
      lastResult = func.apply(this, args);

      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }

    return lastResult;
  };
}

/**
 * 节流 Hook
 */
export function useThrottle<T>(value: T, limit: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const [lastUpdated, setLastUpdated] = useState<number>(Date.now());

  useEffect(() => {
    const handler = setTimeout(() => {
      const now = Date.now();
      if (now - lastUpdated >= limit) {
        setThrottledValue(value);
        setLastUpdated(now);
      }
    }, limit - (Date.now() - lastUpdated));

    return () => {
      clearTimeout(handler);
    };
  }, [value, limit, lastUpdated]);

  return throttledValue;
}

import { useState, useEffect } from 'react';
