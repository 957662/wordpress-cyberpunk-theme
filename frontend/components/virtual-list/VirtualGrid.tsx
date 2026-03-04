'use client';

import React, { useState, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface VirtualGridProps<T> {
  items: T[];
  itemHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
  containerHeight?: number;
  columns?: number;
  gap?: number;
  overscan?: number;
  onEndReached?: () => void;
  endReachedThreshold?: number;
}

export function VirtualGrid<T>({
  items,
  itemHeight,
  renderItem,
  className,
  containerHeight = 600,
  columns = 3,
  gap = 16,
  overscan = 2,
  onEndReached,
  endReachedThreshold = 200,
}: VirtualGridProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // 计算每行实际高度（包含间距）
  const rowHeight = itemHeight + gap;
  const totalRows = Math.ceil(items.length / columns);
  const totalHeight = totalRows * rowHeight;

  const visibleStartRow = Math.floor(scrollTop / rowHeight);
  const visibleEndRow = Math.min(
    totalRows - 1,
    Math.floor((scrollTop + containerHeight) / rowHeight)
  );

  const startIndexRow = Math.max(0, visibleStartRow - overscan);
  const endIndexRow = Math.min(totalRows - 1, visibleEndRow + overscan);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    setScrollTop(scrollTop);

    if (onEndReached) {
      const scrollHeight = e.currentTarget.scrollHeight;
      const clientHeight = e.currentTarget.clientHeight;
      if (scrollHeight - scrollTop - clientHeight < endReachedThreshold) {
        onEndReached();
      }
    }
  }, [onEndReached, endReachedThreshold]);

  const offsetY = startIndexRow * rowHeight;
  const itemWidth = `calc((100% - ${(columns - 1) * gap}px) / ${columns})`;

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
          className="absolute left-0 right-0 top-0"
          style={{ transform: `translateY(${offsetY}px)` }}
        >
          {Array.from({ length: endIndexRow - startIndexRow + 1 }).map((_, rowIndex) => {
            const actualRow = startIndexRow + rowIndex;
            return (
              <div
                key={actualRow}
                className="flex"
                style={{
                  marginBottom: actualRow < totalRows - 1 ? gap : 0,
                }}
              >
                {Array.from({ length: columns }).map((_, colIndex) => {
                  const itemIndex = actualRow * columns + colIndex;
                  if (itemIndex >= items.length) {
                    return <div key={colIndex} style={{ width: itemWidth }} />;
                  }
                  return (
                    <div
                      key={itemIndex}
                      style={{
                        width: itemWidth,
                        marginRight: colIndex < columns - 1 ? gap : 0,
                      }}
                    >
                      {renderItem(items[itemIndex], itemIndex)}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
