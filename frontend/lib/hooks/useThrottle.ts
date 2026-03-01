/**
 * useThrottle Hook
 *
 * 节流 Hook - 限制函数执行频率
 */

import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * 节流回调 Hook
 * @param callback - 需要节流的回调函数
 * @param delay - 节流时间间隔（毫秒）
 * @returns 节流后的回调函数
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 300
): T {
  const lastRun = useRef(Date.now());
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return useCallback(
    ((...args: Parameters<T>) => {
      const now = Date.now();
      const timeSinceLastRun = now - lastRun.current;

      if (timeSinceLastRun >= delay) {
        // 如果已经过了节流时间，立即执行
        lastRun.current = now;
        callback(...args);
      } else {
        // 否则，在节流时间结束后执行
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        const remainingDelay = delay - timeSinceLastRun;
        timeoutRef.current = setTimeout(() => {
          lastRun.current = Date.now();
          callback(...args);
        }, remainingDelay);
      }
    }) as T,
    [callback, delay]
  );
}

/**
 * 节流值 Hook
 * @param value - 需要节流的值
 * @param delay - 节流时间间隔（毫秒）
 * @returns 节流后的值
 */
export function useThrottledValue<T>(value: T, delay: number = 300): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastExecuted = useRef(Date.now());

  useEffect(() => {
    const now = Date.now();
    const timeSinceLastExecuted = now - lastExecuted.current;

    const updateValue = () => {
      setThrottledValue(value);
      lastExecuted.current = Date.now();
    };

    if (timeSinceLastExecuted >= delay) {
      // 如果已经过了节流时间，立即更新
      updateValue();
    } else {
      // 否则，在节流时间结束后更新
      const timeoutId = setTimeout(updateValue, delay - timeSinceLastExecuted);
      return () => clearTimeout(timeoutId);
    }
  }, [value, delay]);

  return throttledValue;
}
