'use client';

/**
 * InfiniteScroll Component - 无限滚动组件
 * 支持自动加载、手动加载、加载状态、错误处理
 */

import { useEffect, useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Loader2, AlertCircle, RefreshCw } from 'lucide-react';

// 加载状态
export type LoadingState = 'idle' | 'loading' | 'error' | 'has-more' | 'end';

// 组件Props
export interface InfiniteScrollProps<T> {
  /** 数据获取函数 */
  fetchData: (page: number) => Promise<T[]>;
  /** 渲染函数 */
  renderItem: (item: T, index: number) => React.ReactNode;
  /** 初始数据 */
  initialData?: T[];
  /** 每页数量 */
  pageSize?: number;
  /** 触发加载的阈值（距离底部多少像素） */
  threshold?: number;
  /** 是否自动加载 */
  autoLoad?: boolean;
  /** 加载中渲染函数 */
  renderLoading?: () => React.ReactNode;
  /** 错误渲染函数 */
  renderError?: (error: Error, retry: () => void) => React.ReactNode;
  /** 数据结束渲染函数 */
  renderEnd?: () => React.ReactNode;
  /** 加载更多按钮渲染函数 */
  renderLoadMore?: (loadMore: () => void, isLoading: boolean) => React.ReactNode;
  /** 数据加载完成回调 */
  onLoad?: (data: T[], page: number) => void;
  /** 错误回调 */
  onError?: (error: Error) => void;
  /** 自定义样式类名 */
  className?: string;
  /** 容器元素类型 */
  containerClassName?: string;
}

export function InfiniteScroll<T>({
  fetchData,
  renderItem,
  initialData = [],
  pageSize = 10,
  threshold = 200,
  autoLoad = true,
  renderLoading,
  renderError,
  renderEnd,
  renderLoadMore,
  onLoad,
  onError,
  className = '',
  containerClassName = '',
}: InfiniteScrollProps<T>) {
  const [data, setData] = useState<T[]>(initialData);
  const [page, setPage] = useState(1);
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const observerTarget = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);
  const currentPageRef = useRef(1);

  // 加载数据
  const loadMore = useCallback(async () => {
    // 防止重复加载
    if (loadingRef.current || loadingState === 'loading' || !hasMore) {
      return;
    }

    loadingRef.current = true;
    setLoadingState('loading');
    setError(null);

    try {
      const nextPage = currentPageRef.current + 1;
      const newData = await fetchData(nextPage);

      if (newData.length === 0) {
        setHasMore(false);
        setLoadingState('end');
      } else if (newData.length < pageSize) {
        // 返回的数据少于页大小，说明是最后一页
        setData((prev) => [...prev, ...newData]);
        setHasMore(false);
        setLoadingState('end');
        setPage(nextPage);
        currentPageRef.current = nextPage;
        onLoad?.(newData, nextPage);
      } else {
        setData((prev) => [...prev, ...newData]);
        setHasMore(true);
        setLoadingState('has-more');
        setPage(nextPage);
        currentPageRef.current = nextPage;
        onLoad?.(newData, nextPage);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('加载失败');
      setError(error);
      setLoadingState('error');
      onError?.(error);
    } finally {
      loadingRef.current = false;
    }
  }, [fetchData, pageSize, loadingState, hasMore, onLoad, onError]);

  // 重试加载
  const retry = useCallback(() => {
    setHasMore(true);
    loadMore();
  }, [loadMore]);

  // Intersection Observer 监听滚动
  useEffect(() => {
    if (!autoLoad || loadingState === 'loading' || loadingState === 'end' || !hasMore) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting) {
          loadMore();
        }
      },
      {
        rootMargin: `${threshold}px 0px 0px 0px`,
        threshold: 0.1,
      }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [autoLoad, loadMore, loadingState, hasMore, threshold]);

  // 渲染加载状态
  const renderLoadingState = () => {
    if (loadingState === 'loading') {
      return renderLoading ? (
        renderLoading()
      ) : (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 text-cyber-cyan animate-spin" />
          <span className="ml-2 text-gray-400">加载中...</span>
        </div>
      );
    }

    if (loadingState === 'error' && error) {
      return renderError ? (
        renderError(error, retry)
      ) : (
        <div className="flex flex-col items-center justify-center py-8 space-y-4">
          <AlertCircle className="w-12 h-12 text-red-400" />
          <p className="text-gray-400">{error.message}</p>
          <button
            onClick={retry}
            className="flex items-center gap-2 px-4 py-2 bg-cyber-cyan/20 text-cyber-cyan rounded-lg hover:bg-cyber-cyan/30 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            重试
          </button>
        </div>
      );
    }

    if (loadingState === 'end') {
      return renderEnd ? (
        renderEnd()
      ) : (
        <div className="flex items-center justify-center py-8 text-gray-500">
          <span>— 没有更多数据了 —</span>
        </div>
      );
    }

    return null;
  };

  return (
    <div className={className}>
      {/* 数据列表 */}
      <div className={containerClassName}>
        {data.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.02 }}
          >
            {renderItem(item, index)}
          </motion.div>
        ))}
      </div>

      {/* 观察目标 */}
      {autoLoad && <div ref={observerTarget} className="h-1" />}

      {/* 加载状态 */}
      {renderLoadingState()}

      {/* 手动加载按钮 */}
      {!autoLoad && hasMore && loadingState !== 'loading' && (
        <div className="flex justify-center py-8">
          {renderLoadMore ? (
            renderLoadMore(loadMore, loadingState === 'loading')
          ) : (
            <button
              onClick={loadMore}
              disabled={loadingState === 'loading'}
              className="flex items-center gap-2 px-6 py-3 bg-cyber-card border border-cyber-cyan/30 rounded-lg hover:border-cyber-cyan/60 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingState === 'loading' ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  加载中...
                </>
              ) : (
                <>
                  <ChevronDown className="w-5 h-5" />
                  加载更多
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default InfiniteScroll;
