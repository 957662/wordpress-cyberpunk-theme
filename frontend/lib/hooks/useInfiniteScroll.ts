/**
 * 无限滚动 Hook
 * 用于加载更多数据
 */

import { useState, useEffect, useCallback, RefObject } from 'react';

export interface UseInfiniteScrollOptions {
  threshold?: number;
  rootMargin?: string;
  enabled?: boolean;
}

export function useInfiniteScroll(
  callback: () => void,
  options: UseInfiniteScrollOptions = {}
) {
  const { threshold = 100, rootMargin = '0px', enabled = true } = options;
  const [isFetching, setIsFetching] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const handleScroll = useCallback(() => {
    if (!enabled || isFetching || !hasMore) return;

    const scrollTop = window.scrollY;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = window.innerHeight;

    if (scrollHeight - (scrollTop + clientHeight) < threshold) {
      setIsFetching(true);
    }
  }, [enabled, isFetching, hasMore, threshold]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    if (!isFetching) return;

    callback().finally(() => {
      setIsFetching(false);
    });
  }, [isFetching, callback]);

  return { isFetching, hasMore, setHasMore };
}

/**
 * 使用 Intersection Observer 的无限滚动
 */
export function useInfiniteScrollWithObserver(
  targetRef: RefObject<HTMLElement>,
  callback: () => void,
  options: IntersectionObserverInit = {}
) {
  const [isEnabled, setIsEnabled] = useState(true);

  useEffect(() => {
    const target = targetRef.current;
    if (!target || !isEnabled) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          callback();
        }
      },
      {
        rootMargin: '100px',
        ...options,
      }
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [targetRef, callback, isEnabled, options]);

  return { isEnabled, setIsEnabled };
}
