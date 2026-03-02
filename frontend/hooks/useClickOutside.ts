/**
 * useClickOutside Hook
 * 点击外部检测 Hook
 */

import { useEffect, useRef } from 'react';

export function useClickOutside(
  callback: () => void,
  enabled: boolean = true
) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [callback, enabled]);

  return ref;
}
