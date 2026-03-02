'use client';

import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface VirtualScrollProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  overscan?: number;
  className?: containerClassName?: string;
  onScroll?: (scrollTop: number) => void;
  onEndReached?: () => void;
  endReachedThreshold?: number;
  loading?: boolean;
  loadingComponent?: React.ReactNode;
  emptyComponent?: React.ReactNode;
}

export function VirtualScroll<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  overscan = 3,
  className,
  containerClassName,
  onScroll,
  onEndReached,
  endReachedThreshold = 200,
  loading = false,
  loadingComponent,
  emptyComponent,
}: VirtualScrollProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const endReachedRef = useRef(false);

  const totalHeight = items.length * itemHeight;
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const visibleItems = useMemo(() => {
    return items.slice(startIndex, endIndex).map((item, index) => ({
      item,
      index: startIndex + index,
    }));
  }, [items, startIndex, endIndex]);

  const offsetY = startIndex * itemHeight;

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    setScrollTop(scrollTop);
    onScroll?.(scrollTop);

    // Check if reached end
    if (
      onEndReached &&
      !endReachedRef.current &&
      !loading &&
      scrollTop + containerHeight >= totalHeight - endReachedThreshold
    ) {
      endReachedRef.current = true;
      onEndReached();
      setTimeout(() => {
        endReachedRef.current = false;
      }, 500);
    }
  }, [containerHeight, totalHeight, onEndReached, onScroll, loading, endReachedThreshold]);

  // Reset endReachedRef when items change
  useEffect(() => {
    endReachedRef.current = false;
  }, [items.length]);

  if (items.length === 0 && !loading) {
    return (
      <div className={cn('flex items-center justify-center', containerClassName)}>
        {emptyComponent || (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">暂无数据</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn('overflow-auto', containerClassName)}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div
        className="relative"
        style={{ height: totalHeight }}
      >
        <div
          className="absolute left-0 right-0"
          style={{ transform: `translateY(${offsetY}px)` }}
        >
          <AnimatePresence mode="popLayout">
            {visibleItems.map(({ item, index }) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                style={{ height: itemHeight }}
                className="overflow-hidden"
              >
                {renderItem(item, index)}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {loading && (
        <div className="py-4 flex justify-center">
          {loadingComponent || (
            <div className="flex items-center gap-2 text-gray-500">
              <div className="w-4 h-4 border-2 border-cyber-cyan border-t-transparent rounded-full animate-spin" />
              <span>加载中...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export interface VirtualGridProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  columns: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  gap?: number;
  overscan?: number;
  className?: string;
  containerClassName?: string;
  onScroll?: (scrollTop: number) => void;
  onEndReached?: () => void;
  endReachedThreshold?: number;
  loading?: boolean;
  loadingComponent?: React.ReactNode;
  emptyComponent?: React.ReactNode;
}

export function VirtualGrid<T>({
  items,
  itemHeight,
  containerHeight,
  columns,
  renderItem,
  gap = 16,
  overscan = 2,
  className,
  containerClassName,
  onScroll,
  onEndReached,
  endReachedThreshold = 200,
  loading = false,
  loadingComponent,
  emptyComponent,
}: VirtualGridProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const endReachedRef = useRef(false);

  const rowHeight = itemHeight + gap;
  const totalRows = Math.ceil(items.length / columns);
  const totalHeight = totalRows * rowHeight;

  const startRow = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
  const endRow = Math.min(
    totalRows,
    Math.ceil((scrollTop + containerHeight) / rowHeight) + overscan
  );

  const visibleItems = useMemo(() => {
    const result: Array<{ item: T; index: number; row: number; col: number }> = [];

    for (let row = startRow; row < endRow; row++) {
      for (let col = 0; col < columns; col++) {
        const index = row * columns + col;
        if (index < items.length) {
          result.push({ item: items[index], index, row, col });
        }
      }
    }

    return result;
  }, [items, startRow, endRow, columns]);

  const columnWidth = `calc((100% - ${(columns - 1) * gap}px) / ${columns})`;

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    setScrollTop(scrollTop);
    onScroll?.(scrollTop);

    if (
      onEndReached &&
      !endReachedRef.current &&
      !loading &&
      scrollTop + containerHeight >= totalHeight - endReachedThreshold
    ) {
      endReachedRef.current = true;
      onEndReached();
      setTimeout(() => {
        endReachedRef.current = false;
      }, 500);
    }
  }, [containerHeight, totalHeight, onEndReached, onScroll, loading, endReachedThreshold]);

  useEffect(() => {
    endReachedRef.current = false;
  }, [items.length]);

  if (items.length === 0 && !loading) {
    return (
      <div className={cn('flex items-center justify-center', containerClassName)}>
        {emptyComponent || (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">暂无数据</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn('overflow-auto', containerClassName)}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div
        className="relative"
        style={{ height: totalHeight }}
      >
        <div
          className="absolute left-0 right-0 top-0"
          style={{ transform: `translateY(${startRow * rowHeight}px)` }}
        >
          <div className="flex flex-wrap" style={{ gap }}>
            <AnimatePresence mode="popLayout">
              {visibleItems.map(({ item, index, row, col }) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2, delay: (row * columns + col) * 0.02 }}
                  style={{
                    height: itemHeight,
                    width: columnWidth,
                    marginBottom: row < endRow - 1 ? gap : 0,
                  }}
                  className="overflow-hidden"
                >
                  {renderItem(item, index)}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {loading && (
        <div className="py-4 flex justify-center">
          {loadingComponent || (
            <div className="flex items-center gap-2 text-gray-500">
              <div className="w-4 h-4 border-2 border-cyber-cyan border-t-transparent rounded-full animate-spin" />
              <span>加载中...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default VirtualScroll;
