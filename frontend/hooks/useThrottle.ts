/**
 * CyberPress Platform - useThrottle Hook
 * ============================================================================
 * 功能: 节流 Hook
 * 版本: 1.0.0
 * 日期: 2026-03-03
 * ============================================================================
 */

import { useRef, useEffect } from 'react';

/**
 * 节流 Hook
 * @param callback 需要节流的函数
 * @param delay 延迟时间（毫秒）
 * @returns 节流后的函数
 */
function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 500
): T {
  const lastRun = useRef(Date.now());

  return ((...args: any[]) => {
    const now = Date.now();
    if (now - lastRun.current >= delay) {
      callback(...args);
      lastRun.current = now;
    }
  }) as T;
}

export default useThrottle;
