import { useEffect, RefObject } from 'react';

/**
 * useClickAway Hook
 * 用于检测点击是否在元素外部
 */
export function useClickAway(
  refs: RefObject<HTMLElement> | RefObject<HTMLElement>[],
  callback: () => void
): void {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as Node;

      const refArray = Array.isArray(refs) ? refs : [refs];
      const isClickAway = refArray.every(
        (ref) => !ref.current || !ref.current.contains(target)
      );

      if (isClickAway) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClick);
    document.addEventListener('touchstart', handleClick);

    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('touchstart', handleClick);
    };
  }, [refs, callback]);
}

export default useClickAway;
