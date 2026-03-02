import { useRef, useEffect } from 'react';

/**
 * 点击外部 Hook
 * @param callback - 点击外部时的回调函数
 * @returns ref 对象
 */
export function useClickOutside<T extends HTMLElement = any>(
  callback: () => void
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [callback]);

  return ref;
}
