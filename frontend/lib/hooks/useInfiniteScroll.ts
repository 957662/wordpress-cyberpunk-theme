/**
 * useInfiniteScroll - 无限滚动 Hook
 *
 * 用于实现无限滚动加载更多内容的功能
 *
 * @example
 * const { data, loading, error, hasMore, loadMore } = useInfiniteScroll({
 *   fetchMore: (page) => fetchItems(page),
 *   threshold: 200,
 * });
 */

import { useState, useEffect, useCallback, useRef } from 'react';

interface UseInfiniteScrollOptions<T> {
  /**
   * 获取更多数据的函数
   */
  fetchMore: (page: number) => Promise<T[]>;

  /**
   * 初始页码，默认为 1
   */
  initialPage?: number;

  /**
   * 触发加载的阈值（像素），默认为 200px
   */
  threshold?: number;

  /**
   * 是否启用，默认为 true
   */
  enabled?: boolean;

  /**
   * 每页数据量，用于计算是否还有更多数据
   */
  pageSize?: number;
}

interface UseInfiniteScrollReturn<T> {
  /**
   * 所有已加载的数据
   */
  data: T[];

  /**
   * 是否正在加载
   */
  loading: boolean;

  /**
   * 错误信息
   */
  error: Error | null;

  /**
   * 是否还有更多数据
   */
  hasMore: boolean;

  /**
   * 当前页码
   */
  page: number;

  /**
   * 加载更多数据
   */
  loadMore: () => Promise<void>;

  /**
   * 重置所有数据
   */
  reset: () => void;

  /**
   * 滚动容器的 ref
   */
  sentinelRef: React.RefObject<HTMLDivElement>;
}

export function useInfiniteScroll<T>({
  fetchMore,
  initialPage = 1,
  threshold = 200,
  enabled = true,
  pageSize = 10,
}: UseInfiniteScrollOptions<T>): UseInfiniteScrollReturn<T> {
  const [data, setData] = useState<T[]>([]);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const sentinelRef = useRef<HTMLDivElement>(null);

  // 加载更多数据
  const loadMore = useCallback(async () => {
    if (loading || !hasMore || !enabled) return;

    setLoading(true);
    setError(null);

    try {
      const newData = await fetchMore(page);

      if (newData.length === 0 || newData.length < pageSize) {
        setHasMore(false);
      }

      setData((prev) => [...prev, ...newData]);
      setPage((prev) => prev + 1);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load more data'));
      console.error('Error loading more data:', err);
    } finally {
      setLoading(false);
    }
  }, [fetchMore, page, loading, hasMore, enabled, pageSize]);

  // 重置数据
  const reset = useCallback(() => {
    setData([]);
    setPage(initialPage);
    setLoading(false);
    setError(null);
    setHasMore(true);
  }, [initialPage]);

  // 设置交叉观察器
  useEffect(() => {
    if (!enabled) return;

    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !loading && hasMore) {
          loadMore();
        }
      },
      {
        rootMargin: `${threshold}px`,
        threshold: 0.01,
      }
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [enabled, threshold, loading, hasMore, loadMore]);

  return {
    data,
    loading,
    error,
    hasMore,
    page,
    loadMore,
    reset,
    sentinelRef,
  };
}

/**
 * useInfiniteScrollWithWindow - 使用窗口滚动的无限滚动 Hook
 *
 * 适用于整个页面滚动的情况
 */

export function useInfiniteScrollWithWindow<T>(
  options: UseInfiniteScrollOptions<T>
): UseInfiniteScrollReturn<T> & {
  /**
   * 滚动监听器的启用/禁用
   */
  toggleScrollListener: (enabled: boolean) => void;
} {
  const baseHook = useInfiniteScroll<T>(options);
  const [scrollEnabled, setScrollEnabled] = useState(true);

  // 设置窗口滚动监听
  useEffect(() => {
    if (!scrollEnabled || !options.enabled) return;

    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;

      if (scrollTop + clientHeight >= scrollHeight - options.threshold) {
        if (!baseHook.loading && baseHook.hasMore) {
          baseHook.loadMore();
        }
      }
    };

    // 添加节流
    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledHandleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
    };
  }, [scrollEnabled, options.enabled, options.threshold, baseHook]);

  const toggleScrollListener = useCallback((enabled: boolean) => {
    setScrollEnabled(enabled);
  }, []);

  return {
    ...baseHook,
    toggleScrollListener,
  };
}

/**
 * useVirtualizedInfiniteScroll - 虚拟化无限滚动 Hook
 *
 * 结合虚拟滚动和无限滚动，适用于大量数据
 */

interface VirtualizedInfiniteScrollOptions<T> extends UseInfiniteScrollOptions<T> {
  /**
   * 每个项目的预估高度（像素）
   */
  itemHeight: number;

  /**
   * 容器高度（像素）
   */
  containerHeight: number;

  /**
   * 额外渲染的项目数量（缓冲区）
   */
  overscan?: number;
}

interface VirtualizedInfiniteScrollReturn<T> extends UseInfiniteScrollReturn<T> {
  /**
   * 可见项目的数据和索引
   */
  visibleItems: Array<{ item: T; index: number }>;

  /**
   * 虚拟滚动的总高度
   */
  totalHeight: number;

  /**
   * 虚拟滚动的偏移量
   */
  offsetY: number;
}

export function useVirtualizedInfiniteScroll<T>({
  itemHeight,
  containerHeight,
  overscan = 5,
  ...options
}: VirtualizedInfiniteScrollOptions<T>): VirtualizedInfiniteScrollReturn<T> {
  const baseHook = useInfiniteScroll<T>(options);
  const [scrollTop, setScrollTop] = useState(0);

  // 计算可见项目的范围
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    baseHook.data.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const visibleItems = baseHook.data
    .slice(startIndex, endIndex + 1)
    .map((item, i) => ({ item, index: startIndex + i }));

  const totalHeight = baseHook.data.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  // 滚动处理
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    setScrollTop(target.scrollTop);

    // 检查是否需要加载更多
    const scrollBottom = target.scrollHeight - target.scrollTop - target.clientHeight;
    if (scrollBottom < options.threshold && !baseHook.loading && baseHook.hasMore) {
      baseHook.loadMore();
    }
  }, [options.threshold, baseHook.loading, baseHook.hasMore, baseHook.loadMore]);

  return {
    ...baseHook,
    visibleItems,
    totalHeight,
    offsetY,
    // @ts-ignore - 添加滚动处理器
    onScroll: handleScroll,
  };
}

export default useInfiniteScroll;
