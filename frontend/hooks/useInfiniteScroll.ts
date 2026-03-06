'use client';

import { useCallback, useEffect, useState, useRef } from 'react';

interface UseInfiniteScrollOptions {
  threshold?: number;
  rootMargin?: string;
  enabled?: boolean;
}

export function useInfiniteScroll(
  callback: () => void | Promise<void>,
  options: UseInfiniteScrollOptions = {}
) {
  const { threshold = 100, rootMargin = '0px', enabled = true } = options;
  const [isFetching, setIsFetching] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(async () => {
    if (isFetching || !enabled) return;

    const scrollTop = window.scrollY;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = window.innerHeight;

    if (scrollTop + clientHeight >= scrollHeight - threshold) {
      setIsFetching(true);
      try {
        await callback();
      } finally {
        setIsFetching(false);
      }
    }
  }, [isFetching, callback, threshold, enabled]);

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll, enabled]);

  // Intersection Observer as alternative
  useEffect(() => {
    if (!enabled || !observerTarget.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetching) {
          setIsFetching(true);
          callback().finally(() => setIsFetching(false));
        }
      },
      { rootMargin }
    );

    const target = observerTarget.current;
    observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
    };
  }, [enabled, callback, rootMargin, isFetching]);

  return { isFetching, observerTarget };
}

export default useInfiniteScroll;
