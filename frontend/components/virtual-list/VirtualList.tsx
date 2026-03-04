'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface VirtualListProps<T> {
  items: T[];
  itemHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
  containerHeight?: number;
  overscan?: number;
  onEndReached?: () => void;
  endReachedThreshold?: number;
}

export function VirtualList<T>({
  items,
  itemHeight,
  renderItem,
  className,
  containerHeight = 600,
  overscan = 5,
  onEndReached,
  endReachedThreshold = 200,
}: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalHeight = items.length * itemHeight;
  const visibleStart = Math.floor(scrollTop / itemHeight);
  const visibleEnd = Math.min(
    items.length - 1,
    Math.floor((scrollTop + containerHeight) / itemHeight)
  );

  const startIndex = Math.max(0, visibleStart - overscan);
  const endIndex = Math.min(items.length - 1, visibleEnd + overscan);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    setScrollTop(scrollTop);

    // 触发触底加载
    if (onEndReached) {
      const scrollHeight = e.currentTarget.scrollHeight;
      const clientHeight = e.currentTarget.clientHeight;
      if (scrollHeight - scrollTop - clientHeight < endReachedThreshold) {
        onEndReached();
      }
    }
  }, [onEndReached, endReachedThreshold]);

  const offsetY = startIndex * itemHeight;

  return (
    <div
      ref={containerRef}
      className={cn('overflow-auto relative', className)}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div
        className="relative w-full"
        style={{ height: totalHeight }}
      >
        <div
          className="absolute left-0 right-0"
          style={{ transform: `translateY(${offsetY}px)` }}
        >
          {items.slice(startIndex, endIndex + 1).map((item, index) => (
            <div
              key={startIndex + index}
              style={{ height: itemHeight }}
              className="flex items-stretch"
            >
              {renderItem(item, startIndex + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 可无限滚动的虚拟列表组件
export function InfiniteVirtualList<T>({
  items,
  itemHeight,
  renderItem,
  className,
  containerHeight = 600,
  overscan = 5,
  onLoadMore,
  hasMore = false,
  isLoading = false,
  loadingElement,
}: Omit<VirtualListProps<T>, 'onEndReached' | 'endReachedThreshold'> & {
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
  loadingElement?: React.ReactNode;
}) {
  const handleEndReached = useCallback(() => {
    if (hasMore && !isLoading) {
      onLoadMore();
    }
  }, [hasMore, isLoading, onLoadMore]);

  return (
    <>
      <VirtualList
        items={items}
        itemHeight={itemHeight}
        renderItem={renderItem}
        className={className}
        containerHeight={containerHeight}
        overscan={overscan}
        onEndReached={handleEndReached}
      />
      {isLoading && (
        <div className="flex justify-center p-4">
          {loadingElement || (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-cyber-cyan border-t-transparent rounded-full animate-spin" />
              <span className="text-cyber-cyan text-sm">加载中...</span>
            </div>
          )}
        </div>
      )}
      {!hasMore && items.length > 0 && (
        <div className="text-center py-4 text-gray-500 text-sm">
          已加载全部内容
        </div>
      )}
    </>
  );
}
