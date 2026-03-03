/**
 * 点击外部 Hook
 * 检测点击是否发生在元素外部
 */

'use client';

import { useEffect, RefObject } from 'react';

export function useClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  callback: () => void,
  isActive: boolean = true
) {
  useEffect(() => {
    if (!isActive) return;

    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [ref, callback, isActive]);
}

// 使用示例:
// const ref = useRef<HTMLDivElement>(null);
// const [isOpen, setIsOpen] = useState(true);
//
// useClickOutside(ref, () => setIsOpen(false), isOpen);
//
// return (
//   <div ref={ref}>
//     {isOpen && <Dropdown />}
//   </div>
// );
