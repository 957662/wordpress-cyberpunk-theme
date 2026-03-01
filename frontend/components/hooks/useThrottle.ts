import { useRef, useEffect, useCallback } from 'react';

export function useThrottle<T extends (...args: any[]) => any>(
  func: T,
  delay: number = 500
): T {
  const lastRun = useRef(Date.now());

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastRun.current >= delay) {
        lastRun.current = now;
        return func(...args);
      }
    },
    [func, delay]
  ) as T;
}
