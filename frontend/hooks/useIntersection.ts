/**
 * useIntersection Hook
 * 监听元素是否进入视口
 */

import { useState, useEffect, RefObject } from 'react';

export interface UseIntersectionOptions {
  threshold?: number | number[];
  rootMargin?: string;
  root?: Element | null;
  triggerOnce?: boolean;
}

export function useIntersection(
  ref: RefObject<Element>,
  options: UseIntersectionOptions = {}
): [boolean, IntersectionObserverEntry | null] {
  const {
    threshold = 0,
    rootMargin = '0px',
    root = null,
    triggerOnce = false,
  } = options;

  const [isIntersecting, setIsIntersecting] = useState(false);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const hasSupported = 'IntersectionObserver' in window;
    if (!hasSupported) {
      console.warn('IntersectionObserver is not supported');
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        setEntry(entry);

        if (entry.isIntersecting && triggerOnce) {
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin,
        root,
      }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [ref, threshold, rootMargin, root, triggerOnce]);

  return [isIntersecting, entry];
}

/**
 * useInfiniteScroll Hook
 * 无限滚动加载
 */
export interface UseInfiniteScrollOptions {
  threshold?: number;
  rootMargin?: string;
  onLoadMore: () => void;
  hasMore: boolean;
  loading?: boolean;
}

export function useInfiniteScroll(
  ref: RefObject<Element>,
  options: UseInfiniteScrollOptions
): void {
  const { threshold = 0.5, rootMargin = '0px', onLoadMore, hasMore, loading = false } = options;

  useEffect(() => {
    const node = ref.current;
    if (!node || !hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          onLoadMore();
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [ref, threshold, rootMargin, onLoadMore, hasMore, loading]);
}
