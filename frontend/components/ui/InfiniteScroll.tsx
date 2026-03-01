/**
 * 无限滚动组件
 * 自动加载更多内容
 */

'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { LoaderIcon } from '@/components/icons';

export interface InfiniteScrollProps {
  children: React.ReactNode;
  loadMore: () => Promise<void> | void;
  hasMore: boolean;
  isLoading?: boolean;
  threshold?: number;
  loader?: React.ReactNode;
  endMessage?: React.ReactNode;
  className?: string;
}

export function InfiniteScroll({
  children,
  loadMore,
  hasMore,
  isLoading = false,
  threshold = 200,
  loader,
  endMessage,
  className,
}: InfiniteScrollProps) {
  const [isFetching, setIsFetching] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  const handleLoadMore = useCallback(async () => {
    if (!hasMore || isFetching || isLoading) return;

    setIsFetching(true);
    try {
      await loadMore();
    } finally {
      setIsFetching(false);
    }
  }, [hasMore, isFetching, isLoading, loadMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetching && !isLoading) {
          handleLoadMore();
        }
      },
      { rootMargin: `${threshold}px` }
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
  }, [hasMore, isFetching, isLoading, threshold, handleLoadMore]);

  const defaultLoader = (
    <div className="flex justify-center py-8">
      <LoaderIcon className="w-8 h-8 text-cyber-cyan animate-spin" />
    </div>
  );

  const defaultEndMessage = (
    <div className="text-center py-8 text-cyber-muted">
      <p>没有更多内容了</p>
    </div>
  );

  return (
    <div className={className}>
      {children}

      {/* 触发元素 */}
      {hasMore && (
        <div ref={observerTarget} className="py-4">
          {(isFetching || isLoading) && (loader || defaultLoader)}
        </div>
      )}

      {/* 结束消息 */}
      {!hasMore && endMessage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {endMessage || defaultEndMessage}
        </motion.div>
      )}
    </div>
  );
}

// 列表项包装器（带动画）
export interface InfiniteScrollItemProps {
  children: React.ReactNode;
  index?: number;
  className?: string;
}

export function InfiniteScrollItem({
  children,
  index = 0,
  className,
}: InfiniteScrollItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay: Math.min(index * 0.05, 0.5), // 最大延迟0.5秒
        ease: [0.4, 0, 0.2, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// 虚拟滚动列表
export interface VirtualScrollListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  overscan?: number;
  className?: string;
}

export function VirtualScrollList<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  overscan = 3,
  className,
}: VirtualScrollListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);

  const scrollTopRef = useRef(0);
  const scrollHandlerRef = useRef<((e: React.UIEvent<HTMLDivElement>) => void) | null>(null);

  scrollHandlerRef.current = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    scrollTopRef.current = target.scrollTop;
    setScrollTop(target.scrollTop);
  };

  const totalHeight = items.length * itemHeight;
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );
  const visibleItems = items.slice(startIndex, endIndex);

  return (
    <div
      className={cn('overflow-auto custom-scrollbar', className)}
      style={{ height: containerHeight }}
      onScroll={scrollHandlerRef.current!}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems.map((item, index) => (
          <div
            key={startIndex + index}
            style={{
              position: 'absolute',
              top: (startIndex + index) * itemHeight,
              height: itemHeight,
              left: 0,
              right: 0,
            }}
          >
            {renderItem(item, startIndex + index)}
          </div>
        ))}
      </div>
    </div>
  );
}
