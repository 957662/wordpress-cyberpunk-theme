import { useState, useEffect } from 'react';

/**
 * 延迟值 Hook
 * @param value 原始值
 * @param delay 延迟时间（毫秒）
 */
export function useDeferredValue<T>(value: T, delay: number = 0): T {
  const [deferredValue, setDeferredValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDeferredValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return deferredValue;
}
