/**
 * useClickOutside Hook
 * 检测点击是否发生在元素外部
 */

import { useEffect, useRef } from 'react';

type ClickOutsideHandler = (event: MouseEvent | TouchEvent) => void;

interface ClickOutsideOptions {
  /**
   * 是否启用
   * @default true
   */
  enabled?: boolean;

  /**
   * 触发的事件类型
   * @default ['mousedown', 'touchstart']
   */
  events?: string[];
}

export function useClickOutside(
  callback: ClickOutsideHandler,
  options: ClickOutsideOptions = {}
) {
  const { enabled = true, events = ['mousedown', 'touchstart'] } = options;
  const ref = useRef<HTMLElement>(null);
  const callbackRef = useRef(callback);

  // 更新最新的 callback
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!enabled) return;

    const handleEvent = (event: Event) => {
      const target = event.target as Node;
      const refElement = ref.current;

      // 检查点击是否发生在元素外部
      if (
        refElement &&
        target &&
        !refElement.contains(target) &&
        !event.defaultPrevented
      ) {
        callbackRef.current(event as MouseEvent | TouchEvent);
      }
    };

    events.forEach((event) => {
      document.addEventListener(event, handleEvent);
    });

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleEvent);
      });
    };
  }, [enabled, events]);

  return ref;
}
