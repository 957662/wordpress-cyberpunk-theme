/**
 * useClickOutside Hook
 * 监听点击元素外部的事件
 */

import { useEffect, RefObject } from 'react';

export function useClickOutside(
  ref: RefObject<Element> | RefObject<Element>[],
  handler: (event: MouseEvent | TouchEvent) => void,
  enabled: boolean = true
): void {
  useEffect(() => {
    if (!enabled) return;

    const listener = (event: MouseEvent | TouchEvent) => {
      const refs = Array.isArray(ref) ? ref : [ref];
      const target = event.target as Element;

      // 检查点击是否在任何 ref 外部
      const isOutside = refs.every(
        (r) => !r.current || !r.current.contains(target)
      );

      if (isOutside) {
        handler(event);
      }
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler, enabled]);
}

/**
 * useEscapeKey Hook
 * 监听 ESC 键按下事件
 */
export function useEscapeKey(
  handler: () => void,
  enabled: boolean = true
): void {
  useEffect(() => {
    if (!enabled) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handler();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [handler, enabled]);
}
