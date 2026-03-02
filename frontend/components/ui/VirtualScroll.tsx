/**
 * VirtualScroll Component - 虚拟滚动组件
 * 高效渲染大量数据，只渲染可见区域的项目
 */

'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface VirtualScrollItem {
  id: string | number;
  [key: string]: any;
}

export interface VirtualScrollProps<T extends VirtualScrollItem> {
  items: T[];
  itemHeight: number | ((item: T, index: number) => number);
  renderItem: (item: T, index: number) => React.ReactNode;
  overscan?: number;
  className?: string;
  containerClassName?: string;
  height?: number | string;
  onEndReached?: () => void;
  endReachedThreshold?: number;
  loading?: boolean;
  loadingComponent?: React.ReactNode;
  emptyComponent?: React.ReactNode;
  onScroll?: (scrollTop: number) => void;
}

export function VirtualScroll<T extends VirtualScrollItem>({
  items,
  itemHeight,
  renderItem,
  overscan = 3,
  className,
  containerClassName,
  height = '100%',
  onEndReached,
  endReachedThreshold = 200,
  loading = false,
  loadingComponent,
  emptyComponent,
  onScroll,
}: VirtualScrollProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const endReachedCalled = useRef(false);

  // 计算项目高度
  const getItemHeight = useCallback(
    (item: T, index: number) => {
      return typeof itemHeight === 'function' ? itemHeight(item, index) : itemHeight;
    },
    [itemHeight]
  );

  // 计算所有项目的位置和总高度
  const { itemPositions, totalHeight } = useMemo(() => {
    let currentTop = 0;
    const positions: { top: number; height: number }[] = [];

    for (let i = 0; i < items.length; i++) {
      const h = getItemHeight(items[i], i);
      positions.push({ top: currentTop, height: h });
      currentTop += h;
    }

    return { itemPositions: positions, totalHeight: currentTop };
  }, [items, getItemHeight]);

  // 计算可见范围
  const { startIndex, endIndex, visibleItems } = useMemo(() => {
    if (!containerRef.current) {
      return { startIndex: 0, endIndex: 0, visibleItems: [] };
    }

    const containerHeight = containerRef.current.offsetHeight;
    const viewportTop = scrollTop;
    const viewportBottom = scrollTop + containerHeight;

    let start = items.length;
    let end = 0;

    for (let i = 0; i < itemPositions.length; i++) {
      const { top, height } = itemPositions[i];
      const itemBottom = top + height;

      if (itemBottom > viewportTop - overscan * getItemHeight(items[i], i)) {
        start = Math.min(start, i);
      }
      if (top < viewportBottom + overscan * getItemHeight(items[i], i)) {
        end = Math.max(end, i);
      }
    }

    start = Math.max(0, start);
    end = Math.min(items.length - 1, end);

    const visible: { item: T; index: number; top: number; height: number }[] = [];
    for (let i = start; i <= end; i++) {
      visible.push({
        item: items[i],
        index: i,
        top: itemPositions[i].top,
        height: itemPositions[i].height,
      });
    }

    return { startIndex: start, endIndex: end, visibleItems: visible };
  }, [scrollTop, itemPositions, items, overscan, getItemHeight]);

  // 滚动处理
  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const currentScrollTop = e.currentTarget.scrollTop;
      setScrollTop(currentScrollTop);
      onScroll?.(currentScrollTop);

      // 检查是否到达底部
      if (
        onEndReached &&
        !loading &&
        !endReachedCalled.current
      ) {
        const containerHeight = e.currentTarget.offsetHeight;
        const scrollHeight = e.currentTarget.scrollHeight;
        const distanceFromBottom = scrollHeight - (currentScrollTop + containerHeight);

        if (distanceFromBottom < endReachedThreshold) {
          endReachedCalled.current = true;
          onEndReached();
        }
      }
    },
    [onEndReached, endReachedThreshold, loading, onScroll]
  );

  // 重置 endReached 标记
  useEffect(() => {
    if (!loading) {
      endReachedCalled.current = false;
    }
  }, [loading]);

  // 空状态
  if (items.length === 0 && !loading) {
    return (
      <div
        className={cn('flex items-center justify-center', className)}
        style={{ height }}
      >
        {emptyComponent || (
          <div className="text-center text-cyber-text-secondary">
            <p className="text-lg">暂无数据</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn('overflow-auto', className)}
      style={{ height }}
      onScroll={handleScroll}
    >
      <div className="relative" style={{ height: totalHeight }}>
        <AnimatePresence mode="popLayout">
          {visibleItems.map(({ item, index, top, height }) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="absolute left-0 right-0"
              style={{ top, height }}
            >
              {renderItem(item, index)}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 加载更多指示器 */}
      {loading && loadingComponent && (
        <div className="py-4 flex justify-center">
          {loadingComponent}
        </div>
      )}
    </div>
  );
}

/**
 * VirtualList Component - 简化的虚拟列表
 * 固定高度的虚拟列表
 */
export interface VirtualListProps<T extends VirtualScrollItem> {
  items: T[];
  itemHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  height?: number | string;
  className?: string;
  onEndReached?: () => void;
  loading?: boolean;
}

export function VirtualList<T extends VirtualScrollItem>({
  items,
  itemHeight,
  renderItem,
  height = 400,
  className,
  onEndReached,
  loading,
}: VirtualListProps<T>) {
  return (
    <VirtualScroll
      items={items}
      itemHeight={itemHeight}
      renderItem={renderItem}
      height={height}
      className={className}
      onEndReached={onEndReached}
      loading={loading}
      loadingComponent={
        <div className="flex items-center justify-center space-x-2 text-cyber-cyan">
          <div className="w-2 h-2 bg-cyber-cyan rounded-full animate-bounce" />
          <div className="w-2 h-2 bg-cyber-cyan rounded-full animate-bounce delay-100" />
          <div className="w-2 h-2 bg-cyber-cyan rounded-full animate-bounce delay-200" />
        </div>
      }
    />
  );
}
