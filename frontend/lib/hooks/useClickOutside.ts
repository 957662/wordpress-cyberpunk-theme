/**
 * useClickOutside Hook
 *
 * 点击外部 Hook - 检测是否在元素外部点击
 */

import { useEffect, RefObject } from 'react';

/**
 * 点击外部事件处理器类型
 */
export type ClickOutsideHandler = (event: MouseEvent | TouchEvent) => void;

/**
 * 点击外部 Hook
 * @param ref - 元素的 ref
 * @param handler - 点击外部时的回调函数
 * @param isEnabled - 是否启用（默认 true）
 */
export function useClickOutside(
  ref: RefObject<HTMLElement> | RefObject<HTMLElement>[],
  handler: ClickOutsideHandler,
  isEnabled: boolean = true
): void {
  useEffect(() => {
    if (!isEnabled) return;

    const listener = (event: MouseEvent | TouchEvent) => {
      const refs = Array.isArray(ref) ? ref : [ref];

      // 检查是否点击在任何 ref 元素外部
      const isOutside = refs.every(
        (r) => !r.current || r.current.contains(event.target as Node)
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
  }, [ref, handler, isEnabled]);
}

/**
 * 逃生键 Hook - 检测是否按下 ESC 键
 * @param handler - 按下 ESC 键时的回调函数
 * @param isEnabled - 是否启用（默认 true）
 */
export function useEscapeKey(
  handler: () => void,
  isEnabled: boolean = true
): void {
  useEffect(() => {
    if (!isEnabled) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' || event.keyCode === 27) {
        handler();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [handler, isEnabled]);
}

/**
 * 组合 Hook - 点击外部或按 ESC 键
 * @param ref - 元素的 ref
 * @param handler - 关闭回调函数
 * @param isEnabled - 是否启用（默认 true）
 */
export function useClickOutsideOrEscape(
  ref: RefObject<HTMLElement> | RefObject<HTMLElement>[],
  handler: () => void,
  isEnabled: boolean = true
): void {
  useClickOutside(ref, handler as any, isEnabled);
  useEscapeKey(handler, isEnabled);
}
