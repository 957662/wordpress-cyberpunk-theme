'use client';

import React, { useRef, useState, useCallback } from 'react';

interface VirtualListProps<T> {
  items: T[];
  itemHeight: number;
  height: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  overscan?: number;
  className?: string;
  onScroll?: (scrollTop: number) => void;
  onEndReached?: () => void;
  endReachedThreshold?: number;
}

export default function VirtualList<T>({
  items,
  itemHeight,
  height,
  renderItem,
  overscan = 3,
  className = '',
  onScroll,
  onEndReached,
  endReachedThreshold = 200,
}: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalHeight = items.length * itemHeight;
  const visibleStart = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const visibleEnd = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + height) / itemHeight) + overscan
  );

  const visibleItems = items.slice(visibleStart, visibleEnd + 1);

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const currentScrollTop = e.currentTarget.scrollTop;
      setScrollTop(currentScrollTop);
      onScroll?.(currentScrollTop);

      if (
        onEndReached &&
        totalHeight - currentScrollTop - height < endReachedThreshold
      ) {
        onEndReached();
      }
    },
    [height, onScroll, onEndReached, totalHeight, endReachedThreshold]
  );

  return (
    <div
      ref={containerRef}
      className={`overflow-auto ${className}`}
      style={{ height }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems.map((item, index) => (
          <div
            key={visibleStart + index}
            style={{
              position: 'absolute',
              top: (visibleStart + index) * itemHeight,
              height: itemHeight,
              width: '100%',
            }}
          >
            {renderItem(item, visibleStart + index)}
          </div>
        ))}
      </div>
    </div>
  );
}
