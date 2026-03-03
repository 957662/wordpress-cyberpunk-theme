/**
 * useHover Hook
 * 悬停状态 Hook
 */

import { useState, useRef, useCallback, MouseEvent as ReactMouseEvent } from 'react';

export interface UseHoverResult<T> {
  hovered: boolean;
  ref: React.RefObject<T>;
  onHoverStart: (e: ReactMouseEvent<T>) => void;
  onHoverEnd: (e: ReactMouseEvent<T>) => void;
}

export function useHover<T extends HTMLElement = HTMLElement>(): UseHoverResult<T> {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<T>(null);

  const onHoverStart = useCallback((e: ReactMouseEvent<T>) => {
    setHovered(true);
  }, []);

  const onHoverEnd = useCallback((e: ReactMouseEvent<T>) => {
    setHovered(false);
  }, []);

  return {
    hovered,
    ref,
    onHoverStart,
    onHoverEnd,
  };
}

/**
 * 简化版本的 Hover Hook
 */
export function useSimpleHover<T extends HTMLElement = HTMLElement>(): [
  React.RefObject<T>,
  boolean
] {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseEnter = () => setHovered(true);
    const handleMouseLeave = () => setHovered(false);

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return [ref, hovered];
}
