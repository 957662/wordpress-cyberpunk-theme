'use client';

import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  CSSProperties,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface InfiniteScrollProps {
  children: React.ReactNode;
  hasMore: boolean;
  loadMore: () => void | Promise<void>;
  loading?: boolean;
  loader?: React.ReactNode;
  endMessage?: React.ReactNode;
  error?: boolean;
  errorComponent?: React.ReactNode;
  className?: string;
  scrollThreshold?: number;
  initialLoad?: boolean;
  useWindow?: boolean;
  showScrollToTop?: boolean;
  scrollToTopThreshold?: number;
}

export function InfiniteScroll({
  children,
  hasMore,
  loadMore,
  loading = false,
  loader,
  endMessage,
  error = false,
  errorComponent,
  className,
  scrollThreshold = 200,
  initialLoad = true,
  useWindow = false,
  showScrollToTop = true,
  scrollToTopThreshold = 400,
}: InfiniteScrollProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 加载更多数据
  const handleLoadMore = useCallback(async () => {
    if (loading || isLoading || !hasMore || error) return;

    setIsLoading(true);
    try {
      await loadMore();
    } catch (err) {
      console.error('Error loading more data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [loadMore, hasMore, loading, isLoading, error]);

  // 检查滚动位置并触发加载
  const checkScroll = useCallback(() => {
    if (!hasMore || loading || isLoading) return;

    const container = useWindow ? window.documentElement : scrollContainerRef.current;
    if (!container) return;

    const scrollTop = useWindow ? container.scrollTop : container.scrollTop;
    const scrollHeight = useWindow ? container.scrollHeight : container.scrollHeight;
    const clientHeight = useWindow ? container.clientHeight : container.clientHeight;

    if (scrollHeight - scrollTop - clientHeight < scrollThreshold) {
      handleLoadMore();
    }

    // 显示/隐藏回到顶部按钮
    if (showScrollToTop) {
      setShowScrollTop(scrollTop > scrollToTopThreshold);
    }
  }, [hasMore, loading, isLoading, handleLoadMore, scrollThreshold, useWindow, showScrollToTop, scrollToTopThreshold]);

  // 滚动事件监听
  useEffect(() => {
    const target = useWindow ? window : scrollContainerRef.current;
    if (!target) return;

    const eventTarget = useWindow ? window : target;
    const eventHandler = useWindow
      ? () => checkScroll()
      : () => checkScroll();

    eventTarget.addEventListener('scroll', eventHandler, { passive: true });
    return () => eventTarget.removeEventListener('scroll', eventHandler);
  }, [checkScroll, useWindow]);

  // Intersection Observer 用于检测底部
  useEffect(() => {
    if (!hasMore || loading || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          handleLoadMore();
        }
      },
      { rootMargin: `${scrollThreshold}px` }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasMore, loading, isLoading, handleLoadMore, scrollThreshold]);

  // 初始加载
  useEffect(() => {
    if (initialLoad) {
      handleLoadMore();
    }
  }, []);

  // 滚动到顶部
  const scrollToTop = useCallback(() => {
    const container = useWindow ? window.documentElement : scrollContainerRef.current;
    if (!container) return;

    const scrollTo = useWindow
      ? () => window.scrollTo({ top: 0, behavior: 'smooth' })
      : () => container.scrollTo({ top: 0, behavior: 'smooth' });

    scrollTo();
  }, [useWindow]);

  const containerStyle: CSSProperties = useWindow
    ? {}
    : {
        height: '100%',
        overflowY: 'auto',
        position: 'relative',
      };

  return (
    <div
      ref={scrollContainerRef}
      className={cn('relative', className)}
      style={containerStyle}
    >
      {children}

      {/* 加载更多触发器 */}
      {hasMore && (
        <div ref={loadMoreRef} className="py-4">
          {(loading || isLoading) && (
            loader || (
              <div className="flex items-center justify-center gap-3 text-gray-500">
                <Loader2 className="w-5 h-5 animate-spin text-cyber-cyan" />
                <span>加载中...</span>
              </div>
            )
          )}
        </div>
      )}

      {/* 错误提示 */}
      {error && (
        <div className="py-4 text-center">
          {errorComponent || (
            <div className="text-cyber-pink">加载失败，请重试</div>
          )}
        </div>
      )}

      {/* 结束提示 */}
      {!hasMore && !loading && !isLoading && endMessage && (
        <div className="py-4 text-center text-gray-500">
          {endMessage}
        </div>
      )}

      {/* 回到顶部按钮 */}
      {showScrollToTop && (
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              onClick={scrollToTop}
              className="fixed bottom-8 right-8 z-50 p-3 rounded-full
                bg-gradient-to-r from-cyber-cyan to-cyber-purple
                hover:shadow-lg hover:shadow-cyber-cyan/25
                transition-all text-black"
              aria-label="回到顶部"
            >
              <ChevronUp className="w-5 h-5" />
            </motion.button>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}

// Hook: 无限滚动
export function useInfiniteScroll<T>(options: {
  fetchData: (page: number) => Promise<T[]>;
  initialPage?: number;
  pageSize?: number;
}) {
  const { fetchData, initialPage = 1, pageSize = 10 } = options;

  const [data, setData] = useState<T[]>([]);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError(null);

    try {
      const newData = await fetchData(page);
      setData((prev) => [...prev, ...newData]);

      if (newData.length < pageSize) {
        setHasMore(false);
      } else {
        setPage((prev) => prev + 1);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载失败');
    } finally {
      setLoading(false);
    }
  }, [fetchData, page, pageSize, loading, hasMore]);

  const reset = useCallback(() => {
    setData([]);
    setPage(initialPage);
    setHasMore(true);
    setError(null);
  }, [initialPage]);

  const refresh = useCallback(async () => {
    reset();
    await loadMore();
  }, [reset, loadMore]);

  return {
    data,
    loading,
    hasMore,
    error,
    loadMore,
    reset,
    refresh,
    page,
  };
}

// 瀑布流组件
export interface WaterfallProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T, index: number) => string;
  columns?: number;
  gap?: number;
  className?: string;
}

export function Waterfall<T extends Record<string, any>>({
  items,
  renderItem,
  keyExtractor,
  columns = 3,
  gap = 16,
  className,
}: WaterfallProps<T>) {
  const [columnHeights, setColumnHeights] = useState<number[]>(() =>
    Array(columns).fill(0)
  );

  // 分配项目到列
  const columnItems = useMemo(() => {
    const cols: Array<Array<{ item: T; index: number }>> = Array.from(
      { length: columns },
      () => []
    );
    const heights = [...columnHeights];

    items.forEach((item, index) => {
      // 找到最短的列
      const minHeight = Math.min(...heights);
      const columnIndex = heights.indexOf(minHeight);

      cols[columnIndex].push({ item, index });
      // 估算高度（实际应该从组件获取）
      heights[columnIndex] += 300; // 假设每个项目平均高度
    });

    return cols;
  }, [items, columns, columnHeights]);

  return (
    <div className={cn('grid gap-4', className)} style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
      {columnItems.map((column, colIndex) => (
        <div key={colIndex} className="flex flex-col gap-4">
          {column.map(({ item, index }) => (
            <motion.div
              key={keyExtractor(item, index)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              {renderItem(item, index)}
            </motion.div>
          ))}
        </div>
      ))}
    </div>
  );
}

// 带缓存的无限滚动
export function CachedInfiniteScroll<T extends Record<string, any>>({
  cacheKey,
  ...props
}: InfiniteScrollProps & {
  cacheKey: string;
  uniqueKey: (item: T) => string;
}) {
  const [cachedData, setCachedData] = useState<Set<string>>(() => {
    const cached = localStorage.getItem(`cache-${cacheKey}`);
    return cached ? new Set(JSON.parse(cached)) : new Set();
  });

  useEffect(() => {
    localStorage.setItem(
      `cache-${cacheKey}`,
      JSON.stringify(Array.from(cachedData))
    );
  }, [cacheKey, cachedData]);

  return <InfiniteScroll {...props} />;
}
