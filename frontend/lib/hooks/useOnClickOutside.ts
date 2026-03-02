import { useEffect, useRef } from 'react';

/**
 * 监听点击元素外部的 Hook
 * @param ref - 要监听的元素 ref
 * @param handler - 点击外部时的回调函数
 */
export function useOnClickOutside<T extends HTMLElement = HTMLElement>(
  ref: React.RefObject<T>,
  handler: (event: MouseEvent | TouchEvent) => void,
  options: { ignoreClass?: string } = {}
) {
  const { ignoreClass } = options;
  const handlerRef = useRef(handler);

  // 保持 handler 引用最新
  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const el = ref?.current;

      if (!el || el.contains((event?.target as Node) || null)) {
        return;
      }

      // 检查点击的元素是否有需要忽略的类名
      if (ignoreClass) {
        const target = event.target as HTMLElement;
        if (target.closest(`.${ignoreClass}`)) {
          return;
        }
      }

      handlerRef.current(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, ignoreClass]);
}

/**
 * 监听 Escape 键的 Hook
 */
export function useOnEscapePress(
  callback: () => void,
  isActive: boolean = true
) {
  useEffect(() => {
    if (!isActive) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        callback();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [callback, isActive]);
}

/**
 * 组合使用：点击外部或按 Escape 键触发
 */
export function useModalClose<T extends HTMLElement = HTMLElement>(
  ref: React.RefObject<T>,
  onClose: () => void,
  isOpen: boolean
) {
  useOnClickOutside(ref, onClose, { isOpen });
  useOnEscapePress(onClose, isOpen);
}
