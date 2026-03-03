/**
 * useThrottle Hook
 * Throttle a function
 */

import { useCallback, useRef } from 'react';

export function useThrottle<T extends (...args: any[]) => any>(
  func: T,
  delay: number = 500
): (...args: Parameters<T>) => void {
  const lastRun = useRef<Date>(new Date(0));

  return useCallback(
    (...args: Parameters<T>) => {
      const now = new Date();
      if (now.getTime() - lastRun.current.getTime() >= delay) {
        func(...args);
        lastRun.current = now;
      }
    },
    [func, delay]
  );
}
