/**
 * useIntersectionObserver Hook
 * 交叉观察器 Hook - 用于检测元素是否在视口中
 */

import { useState, useEffect, RefObject } from 'react';

export interface UseIntersectionObserverOptions {
  threshold?: number | number[];
  rootMargin?: string;
  triggerOnce?: boolean;
  root?: Element | null;
}

export function useIntersectionObserver(
  ref: RefObject<Element>,
  options: UseIntersectionObserverOptions = {}
): boolean {
  const { threshold = 0, rootMargin = '0px', triggerOnce = false, root = null } = options;
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // 如果只需要触发一次且已经触发过，则不再观察
    if (triggerOnce && hasIntersected) {
      setIsIntersecting(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isElementIntersecting = entry.isIntersecting;
        setIsIntersecting(isElementIntersecting);

        if (isElementIntersecting && triggerOnce) {
          setHasIntersected(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin, root }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [ref, threshold, rootMargin, triggerOnce, root, hasIntersected]);

  return isIntersecting;
}

/**
 * useInfiniteScroll Hook
 * 无限滚动 Hook
 */
export interface UseInfiniteScrollOptions {
  threshold?: number;
  rootMargin?: string;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

export function useInfiniteScroll(
  ref: RefObject<Element>,
  options: UseInfiniteScrollOptions = {}
): boolean {
  const { threshold = 0.5, rootMargin = '200px', hasMore = true, onLoadMore } = options;
  const [isLoading, setIsLoading] = useState(false);

  const isIntersecting = useIntersectionObserver(ref, { threshold, rootMargin });

  useEffect(() => {
    if (isIntersecting && hasMore && !isLoading && onLoadMore) {
      setIsLoading(true);
      onLoadMore();
      // 简单的防抖处理，实际使用中应该由数据加载完成后再重置
      setTimeout(() => setIsLoading(false), 500);
    }
  }, [isIntersecting, hasMore, isLoading, onLoadMore]);

  return isLoading;
}
