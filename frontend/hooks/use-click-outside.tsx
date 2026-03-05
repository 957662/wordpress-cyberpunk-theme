/**
 * useClickOutside Hook
 * 点击外部 Hook - 用于检测点击元素外部
 */

import { useRef, useEffect } from 'react';

export function useClickOutside<T extends HTMLElement>(
  callback: () => void,
  enabled = true
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!enabled) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [callback, enabled]);

  return ref;
}

// 使用示例:
// const ref = useClickOutside(() => setIsOpen(false));
// <div ref={ref}>...</div>
