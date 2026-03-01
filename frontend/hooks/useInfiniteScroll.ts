/**
 * useInfiniteScroll Hook
 * 无限滚动 Hook
 */

'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

export interface UseInfiniteScrollOptions {
  threshold?: number;
  rootMargin?: string;
  enabled?: boolean;
}

export function useInfiniteScroll(
  callback: () => void | Promise<void>,
  options: UseInfiniteScrollOptions = {}
): {
  ref: React.RefObject<HTMLDivElement>;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
} {
  const { threshold = 100, rootMargin = '100px', enabled = true } = options;

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const observerTarget = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (isLoading || !enabled) return;

    setIsLoading(true);
    setIsError(false);
    setError(null);

    try {
      await callback();
    } catch (err) {
      setIsError(true);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [callback, isLoading, enabled]);

  useEffect(() => {
    const element = observerTarget.current;
    if (!element || !enabled) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

      if (scrollTop + clientHeight >= scrollHeight - threshold) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold, enabled, loadMore]);

  // 使用 IntersectionObserver
  useEffect(() => {
    const element = observerTarget.current;
    if (!element || !enabled) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [rootMargin, enabled, loadMore]);

  return { ref: observerTarget, isLoading, isError, error };
}

/**
 * useInfiniteScrollItems Hook（带数据管理）
 */
export interface UseInfiniteScrollItemsOptions<T> {
  fetchItems: (page: number) => Promise<T[]>;
  threshold?: number;
  enabled?: boolean;
}

export function useInfiniteScrollItems<T>({
  fetchItems,
  threshold = 100,
  enabled = true,
}: UseInfiniteScrollItemsOptions<T>): {
  items: T[];
  isLoading: boolean;
  hasMore: boolean;
  error: Error | null;
  ref: React.RefObject<HTMLDivElement>;
  reset: () => void;
} {
  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const observerTarget = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore || !enabled) return;

    setIsLoading(true);
    setError(null);

    try {
      const newItems = await fetchItems(page);

      if (newItems.length === 0) {
        setHasMore(false);
      } else {
        setItems((prev) => [...prev, ...newItems]);
        setPage((prev) => prev + 1);
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchItems, page, isLoading, hasMore, enabled]);

  // 重置
  const reset = useCallback(() => {
    setItems([]);
    setPage(1);
    setHasMore(true);
    setError(null);
  }, []);

  // 监听滚动
  useEffect(() => {
    if (!enabled) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

      if (scrollTop + clientHeight >= scrollHeight - threshold) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold, enabled, loadMore]);

  // 使用 IntersectionObserver
  useEffect(() => {
    const element = observerTarget.current;
    if (!element || !enabled) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      { rootMargin: '100px' }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [enabled, hasMore, isLoading, loadMore]);

  return {
    items,
    isLoading,
    hasMore,
    error,
    ref: observerTarget,
    reset,
  };
}
