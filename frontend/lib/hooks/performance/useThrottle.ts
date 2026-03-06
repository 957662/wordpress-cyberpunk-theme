import { useCallback, useRef } from 'react';

export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 300
): T {
  const lastRun = useRef(Date.now());

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastRun.current >= delay) {
        callback(...args);
        lastRun.current = now;
      }
    },
    [callback, delay]
  ) as T;
}

export function useThrottledState<T>(initialValue: T, delay: number = 300) {
  const [value, setValue] = React.useState(initialValue);
  const throttledSetValue = useThrottle(setValue, delay);

  return [value, throttledSetValue] as const;
}
