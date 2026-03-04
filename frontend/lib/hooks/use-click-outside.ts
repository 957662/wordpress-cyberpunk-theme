/**
 * useClickOutside Hook
 * 点击外部 Hook - 检测点击是否在元素外部
 */

import { useEffect, useRef, RefObject } from 'react';

export function useClickOutside<T extends HTMLElement = HTMLElement>(
  callback: () => void,
  options: { ignore?: RefObject<HTMLElement>[] } = {}
): RefObject<T> {
  const ref = useRef<T>(null);
  const { ignore = [] } = options;
  const callbackRef = useRef(callback);

  // 更新回调引用
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as Node;

      // 检查点击是否在ref外部
      if (ref.current && !ref.current.contains(target)) {
        // 检查是否在忽略的元素内
        const isIgnored = ignore.some((ignoreRef) =>
          ignoreRef.current?.contains(target)
        );

        if (!isIgnored) {
          callbackRef.current();
        }
      }
    };

    document.addEventListener('mousedown', handleClick);
    document.addEventListener('touchstart', handleClick);

    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('touchstart', handleClick);
    };
  }, [ignore]);

  return ref;
}

/**
 * 使用示例:
 *
 * function MyComponent() {
 *   const [isOpen, setIsOpen] = useState(false);
 *   const ref = useClickOutside(() => setIsOpen(false));
 *
 *   return (
 *     <div ref={ref}>
 *       <button onClick={() => setIsOpen(!isOpen)}>
 *         Toggle
 *       </button>
 *       {isOpen && <div>Content</div>}
 *     </div>
 *   );
 * }
 */
