/**
 * useThrottle Hook
 * 节流函数执行
 */

import { useRef, useCallback } from 'react';

export function useThrottle<T extends (...args: any[]) => any>(
  func: T,
  delay: number = 500
): T {
  const lastRun = useRef(Date.now());

  return useCallback(
    ((...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastRun.current >= delay) {
        func(...args);
        lastRun.current = now;
      }
    }) as T,
    [func, delay]
  );
}
