/**
 * CyberPress Platform - useOnClickOutside Hook
 * 点击外部 Hook
 */

import { useEffect, RefObject } from 'react';

/**
 * 点击外部 Hook
 * 在点击元素外部时触发回调
 * 
 * @param ref - 元素的 ref
 * @param handler - 点击外部的回调函数
 * 
 * @example
 * ```tsx
 * const ref = useRef<HTMLDivElement>(null);
 * useOnClickOutside(ref, () => {
 *   console.log('Clicked outside');
 * });
 * 
 * return <div ref={ref}>Content</div>;
 * ```
 */
export function useOnClickOutside<T extends HTMLElement>(
  ref: RefObject<T>,
  handler: (event: MouseEvent | TouchEvent) => void
): void {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      // 如果 ref 为空或点击的是 ref 内部的元素，不触发
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }

      handler(event);
    };

    // 添加事件监听器
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    // 清理函数
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}

export default useOnClickOutside;
