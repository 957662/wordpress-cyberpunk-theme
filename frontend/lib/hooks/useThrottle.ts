/**
 * useThrottle Hook
 * 节流 Hook，用于限制函数执行频率
 */

import { useEffect, useRef } from 'react';

/**
 * 节流 Hook
 * @param callback 需要节流的回调函数
 * @param delay 节流时间（毫秒）
 * @returns 节流后的回调函数
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 300
): T {
  const lastRunRef = useRef<number>(Date.now());

  return ((...args: any[]) => {
    const now = Date.now();
    if (now - lastRunRef.current >= delay) {
      callback(...args);
      lastRunRef.current = now;
    }
  }) as T;
}

export default useThrottle;
