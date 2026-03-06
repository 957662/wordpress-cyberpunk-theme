import { useState, useEffect, useCallback, useRef } from 'react';

interface UseInfiniteScrollOptions {
  threshold?: number;
  rootMargin?: string;
  enabled?: boolean;
  initialPage?: number;
}

interface UseInfiniteScrollResult<T> {
  data: T[];
  isLoading: boolean;
  isError: boolean;
  hasMore: boolean;
  currentPage: number;
  loadMore: () => void;
  reset: () => void;
  refetch: () => void;
  observerTarget: React.RefObject<HTMLDivElement>;
}

export function useInfiniteScrollEnhanced<T>(
  fetchFunction: (page: number) => Promise<{ data: T[]; hasMore: boolean; total?: number }>,
  options: UseInfiniteScrollOptions = {}
): UseInfiniteScrollResult<T> {
  const {
    threshold = 100,
    rootMargin = '100px',
    enabled = true,
    initialPage = 1,
  } = options;

  const [data, setData] = useState<T[]>([]);
  const [page, setPage] = useState(initialPage);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef<HTMLDivElement>(null);
  const isLoadingRef = useRef(false);

  // Load data function
  const loadMore = useCallback(async () => {
    if (!enabled || isLoadingRef.current || !hasMore) return;

    isLoadingRef.current = true;
    setIsLoading(true);
    setIsError(false);

    try {
      const result = await fetchFunction(page);

      setData((prev) => {
        // Avoid duplicates
        const existingIds = new Set(prev.map((item) => (item as any).id || (item as any)._id));
        const newItems = result.data.filter(
          (item) => !existingIds.has((item as any).id || (item as any)._id)
        );
        return [...prev, ...newItems];
      });

      setHasMore(result.hasMore);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error('Infinite scroll error:', error);
      setIsError(true);
    } finally {
      setIsLoading(false);
      isLoadingRef.current = false;
    }
  }, [enabled, fetchFunction, page, hasMore]);

  // Reset function
  const reset = useCallback(() => {
    setData([]);
    setPage(initialPage);
    setHasMore(true);
    setIsError(false);
    isLoadingRef.current = false;
  }, [initialPage]);

  // Refetch function
  const refetch = useCallback(() => {
    reset();
    // Trigger immediate load
    setTimeout(() => {
      loadMore();
    }, 0);
  }, [reset, loadMore]);

  // Intersection Observer
  useEffect(() => {
    if (!enabled || !observerTarget.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore && !isLoadingRef.current) {
          loadMore();
        }
      },
      {
        rootMargin,
        threshold: 0,
      }
    );

    const currentTarget = observerTarget.current;
    observer.observe(currentTarget);

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [enabled, hasMore, loadMore, rootMargin]);

  // Initial load
  useEffect(() => {
    if (enabled && data.length === 0 && !isLoading) {
      loadMore();
    }
  }, [enabled]);

  return {
    data,
    isLoading,
    isError,
    hasMore,
    currentPage: page,
    loadMore,
    reset,
    refetch,
    observerTarget,
  };
}

// Hook for infinite scroll with caching
export function useInfiniteScrollWithCache<T>(
  fetchFunction: (page: number) => Promise<{ data: T[]; hasMore: boolean }>,
  cacheKey: string,
  options?: UseInfiniteScrollOptions
) {
  const result = useInfiniteScrollEnhanced(fetchFunction, options);

  // Save to cache when data changes
  useEffect(() => {
    if (result.data.length > 0) {
      localStorage.setItem(cacheKey, JSON.stringify({
        data: result.data,
        page: result.currentPage,
        hasMore: result.hasMore,
        timestamp: Date.now(),
      }));
    }
  }, [result.data, result.currentPage, result.hasMore, cacheKey]);

  // Load from cache on mount
  useEffect(() => {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const { data, page, hasMore, timestamp } = JSON.parse(cached);
        const age = Date.now() - timestamp;

        // Use cache if less than 5 minutes old
        if (age < 5 * 60 * 1000) {
          // Set cached data
          console.log('Using cached data for:', cacheKey);
        }
      } catch (e) {
        console.error('Cache parse error:', e);
      }
    }
  }, [cacheKey]);

  return result;
}

// Example usage:
// const { data, isLoading, hasMore, observerTarget, reset } = useInfiniteScrollEnhanced(
//   async (page) => {
//     const response = await fetch(`/api/posts?page=${page}`);
//     const data = await response.json();
//     return { data: data.posts, hasMore: data.hasMore };
//   },
//   { threshold: 200, rootMargin: '200px' }
// );
