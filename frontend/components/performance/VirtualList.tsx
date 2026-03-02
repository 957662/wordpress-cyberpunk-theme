'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

interface VirtualListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
  className?: string;
  onEndReached?: () => void;
  endReachedThreshold?: number;
}

export function VirtualList<T>({
  items,
  renderItem,
  itemHeight,
  containerHeight,
  overscan = 3,
  className = '',
  onEndReached,
  endReachedThreshold = 200,
}: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const endReachedCalledRef = useRef(false);

  const totalHeight = items.length * itemHeight;
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(items.length - 1, startIndex + visibleCount + overscan * 2);
  const offsetY = startIndex * itemHeight;

  const visibleItems = items.slice(startIndex, endIndex + 1);

  // Handle scroll events
  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const currentScrollTop = e.currentTarget.scrollTop;
      setScrollTop(currentScrollTop);

      // Trigger end reached callback
      if (
        onEndReached &&
        !endReachedCalledRef.current &&
        currentScrollTop >= totalHeight - containerHeight - endReachedThreshold
      ) {
        endReachedCalledRef.current = true;
        onEndReached();
      }
    },
    [containerHeight, totalHeight, onEndReached, endReachedThreshold]
  );

  // Reset end reached flag when items change
  useEffect(() => {
    endReachedCalledRef.current = false;
  }, [items]);

  return (
    <motion.div
      ref={containerRef}
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Spacer for total height */}
      <div style={{ height: totalHeight, position: 'relative' }}>
        {/* Visible items */}
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item, index) => (
            <div
              key={startIndex + index}
              style={{
                height: itemHeight,
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
              }}
            >
              {renderItem(item, startIndex + index)}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// Hook for infinite scroll
export function useInfiniteScroll(
  fetchData: () => Promise<void>,
  hasMore: boolean
): {
  onLoadMore: () => void;
  isLoading: boolean;
} {
  const [isLoading, setIsLoading] = useState(false);

  const onLoadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      await fetchData();
    } finally {
      setIsLoading(false);
    }
  }, [fetchData, hasMore, isLoading]);

  return {
    onLoadMore,
    isLoading,
  };
}

export default VirtualList;
