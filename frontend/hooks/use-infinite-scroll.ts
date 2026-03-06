/**
 * useInfiniteScroll Hook
 * 无限滚动 Hook
 */

'use client';

import { useEffect, useState, useCallback, useRef } from 'react';

export interface UseInfiniteScrollOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function useInfiniteScroll(
  callback: () => void,
  options: UseInfiniteScrollOptions = {}
) {
  const { threshold = 100, rootMargin = '100px', triggerOnce = false } = options;
  const [isFetching, setIsFetching] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const hasTriggeredRef = useRef(false);

  const handleScroll = useCallback(() => {
    if (triggerOnce && hasTriggeredRef.current) {
      return;
    }

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = window.innerHeight;

    if (scrollHeight - scrollTop - clientHeight < threshold && !isFetching && hasMore) {
      setIsFetching(true);
      if (triggerOnce) {
        hasTriggeredRef.current = true;
      }
    }
  }, [isFetching, hasMore, threshold, triggerOnce]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    if (!isFetching) return;
    callback();
  }, [isFetching, callback]);

  const resetFetching = useCallback(() => {
    setIsFetching(false);
  }, []);

  const resetHasMore = useCallback(() => {
    setHasMore(true);
  }, []);

  const setNoMore = useCallback(() => {
    setHasMore(false);
  }, []);

  const reset = useCallback(() => {
    setIsFetching(false);
    setHasMore(true);
    hasTriggeredRef.current = false;
  }, []);

  return {
    isFetching,
    hasMore,
    resetFetching,
    resetHasMore,
    setNoMore,
    reset,
  };
}

export default useInfiniteScroll;
