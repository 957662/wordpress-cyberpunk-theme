/**
 * useThrottle Hook
 * 节流 Hook - 用于限制函数执行频率
 */

import { useCallback, useRef } from 'react';

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

// 使用示例:
// const throttledScroll = useThrottle(handleScroll, 100);
