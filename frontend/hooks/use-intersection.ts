/**
 * useIntersection Hook
 * 用于检测元素是否进入视口
 */

import { useEffect, useRef, useState } from 'react';

interface UseIntersectionOptions {
  threshold?: number | number[];
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function useIntersection(
  options: UseIntersectionOptions = {}
): [React.RefObject<HTMLDivElement>, boolean] {
  const { threshold = 0, rootMargin = '0px', triggerOnce = false } = options;
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          if (triggerOnce) {
            observer.disconnect();
          }
        } else if (!triggerOnce) {
          setIsIntersecting(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce]);

  return [ref, isIntersecting];
}

/**
 * useInfiniteScroll Hook
 * 用于无限滚动加载
 */
interface UseInfiniteScrollOptions {
  threshold?: number;
  rootMargin?: string;
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
}

export function useInfiniteScroll(
  options: UseInfiniteScrollOptions
): React.RefObject<HTMLDivElement> {
  const { threshold = 0.1, rootMargin = '100px', onLoadMore, hasMore, isLoading } = options;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || !hasMore || isLoading) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onLoadMore();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, onLoadMore, hasMore, isLoading]);

  return ref;
}
