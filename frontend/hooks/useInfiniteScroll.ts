'use client';

import { useEffect, useState, useCallback, useRef } from 'react';

interface UseInfiniteScrollOptions {
  threshold?: number;
  rootMargin?: string;
  enabled?: boolean;
}

interface UseInfiniteScrollReturn {
  isNearBottom: boolean;
  targetRef: React.RefObject<HTMLDivElement>;
  resetBottom: () => void;
}

/**
 * 无限滚动 Hook
 * 检测滚动是否接近底部，用于实现无限加载功能
 */
export function useInfiniteScroll(
  options: UseInfiniteScrollOptions = {}
): UseInfiniteScrollReturn {
  const { threshold = 100, rootMargin = '0px', enabled = true } = options;
  const [isNearBottom, setIsNearBottom] = useState(false);
  const targetRef = useRef<HTMLDivElement>(null);

  const resetBottom = useCallback(() => {
    setIsNearBottom(false);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const element = targetRef.current;
    if (!element) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = element;
      const distanceToBottom = scrollHeight - (scrollTop + clientHeight);

      if (distanceToBottom <= threshold) {
        setIsNearBottom(true);
      } else {
        setIsNearBottom(false);
      }
    };

    element.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      element.removeEventListener('scroll', handleScroll);
    };
  }, [threshold, enabled]);

  return {
    isNearBottom,
    targetRef,
    resetBottom,
  };
}

export default useInfiniteScroll;
