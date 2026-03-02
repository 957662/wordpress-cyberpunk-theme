'use client';

/**
 * Virtualized List Component
 * 虚拟滚动列表组件，支持大数据量高性能渲染
 */

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

// Types
export interface VirtualizedListProps<T> {
  /**
   * 数据项
   */
  items: T[];
  /**
   * 渲染函数
   */
  renderItem: (item: T, index: number) => React.ReactNode;
  /**
   * 项目高度（固定或函数）
   */
  itemHeight: number | ((item: T, index: number) => number);
  /**
   * 容器高度
   */
  height: number | string;
  /**
   * 额外渲染的项目数（缓冲）
   */
  overscan?: number;
  /**
   * 唯一键
   */
  getKey?: (item: T, index: number) => string | number;
  /**
   * 加载更多
   */
  onLoadMore?: () => void;
  /**
   * 是否还有更多
   */
  hasMore?: boolean;
  /**
   * 加载中状态
   */
  isLoading?: boolean;
  /**
   * 加载更多组件
   */
  LoadMoreComponent?: React.ReactNode;
  /**
   * 空状态组件
   */
  EmptyComponent?: React.ReactNode;
  /**
   * 自定义样式
   */
  className?: string;
  /**
   * 滚动到指定索引
   */
  scrollToIndex?: number;
  /**
   * 滚动对齐方式
   */
  scrollAlign?: 'start' | 'center' | 'end' | 'nearest';
}

// 可变高度的虚拟列表
export function VirtualizedList<T>({
  items,
  renderItem,
  itemHeight,
  height,
  overscan = 3,
  getKey,
  onLoadMore,
  hasMore = false,
  isLoading = false,
  LoadMoreComponent,
  EmptyComponent,
  className,
  scrollToIndex,
  scrollAlign = 'start',
}: VirtualizedListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();

  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<Map<string | number, HTMLDivElement>>(new Map());

  // 计算项目位置和高度
  const { itemPositions, totalHeight } = useMemo(() => {
    const positions: Array<{ offset: number; height: number }> = [];
    let currentOffset = 0;

    for (let i = 0; i < items.length; i++) {
      const h = typeof itemHeight === 'function' ? itemHeight(items[i], i) : itemHeight;
      positions.push({ offset: currentOffset, height: h });
      currentOffset += h;
    }

    return { itemPositions: positions, totalHeight: currentOffset };
  }, [items, itemHeight]);

  // 计算可见项目
  const { visibleItems, startIndex, endIndex } = useMemo(() => {
    const containerHeight = typeof height === 'number' ? height : containerRef.current?.clientHeight || 600;
    const startIdx = Math.max(0, itemPositions.findIndex(p => p.offset + p.height > scrollTop) - overscan);
    const endIdx = Math.min(
      items.length - 1,
      itemPositions.findIndex(p => p.offset > scrollTop + containerHeight) + overscan
    );

    const visible = [];
    for (let i = startIdx; i <= endIdx; i++) {
      if (i >= 0 && i < items.length) {
        visible.push({ item: items[i], index: i, ...itemPositions[i] });
      }
    }

    return { visibleItems: visible, startIndex: startIdx, endIndex: endIdx };
  }, [scrollTop, itemPositions, items, overscan, height]);

  // 滚动处理
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const newScrollTop = e.currentTarget.scrollTop;
    setScrollTop(newScrollTop);
    setIsScrolling(true);

    // 清除之前的超时
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // 设置新的超时
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 150);

    // 检查是否需要加载更多
    if (onLoadMore && hasMore && !isLoading) {
      const scrollHeight = e.currentTarget.scrollHeight;
      const clientHeight = e.currentTarget.clientHeight;
      const scrollPercentage = (newScrollTop + clientHeight) / scrollHeight;

      if (scrollPercentage > 0.8) {
        onLoadMore();
      }
    }
  }, [onLoadMore, hasMore, isLoading]);

  // 滚动到指定索引
  useEffect(() => {
    if (scrollToIndex !== undefined && containerRef.current) {
      const position = itemPositions[scrollToIndex];
      if (position) {
        const containerHeight = typeof height === 'number' ? height : containerRef.current.clientHeight;
        let targetScroll = position.offset;

        // 根据对齐方式调整
        switch (scrollAlign) {
          case 'center':
            targetScroll = position.offset - containerHeight / 2 + position.height / 2;
            break;
          case 'end':
            targetScroll = position.offset - containerHeight + position.height;
            break;
          case 'nearest':
            if (position.offset < scrollTop) {
              targetScroll = position.offset;
            } else if (position.offset + position.height > scrollTop + containerHeight) {
              targetScroll = position.offset - containerHeight + position.height;
            }
            break;
        }

        containerRef.current.scrollTop = targetScroll;
      }
    }
  }, [scrollToIndex, itemPositions, height, scrollAlign]);

  // 清理超时
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // 空状态
  if (items.length === 0 && EmptyComponent) {
    return (
      <div className={cn('flex items-center justify-center', className)} style={{ height }}>
        {EmptyComponent}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn('overflow-auto relative', className)}
      style={{ height }}
      onScroll={handleScroll}
    >
      {/* 内部容器 */}
      <div
        ref={innerRef}
        className="relative"
        style={{ height: totalHeight }}
      >
        {visibleItems.map(({ item, index, offset, height: itemH }) => (
          <motion.div
            key={getKey ? getKey(item, index) : index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 right-0"
            style={{
              transform: `translateY(${offset}px)`,
              height: itemH,
            }}
          >
            {renderItem(item, index)}
          </motion.div>
        ))}
      </div>

      {/* 滚动指示器 */}
      {isScrolling && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-1 bg-black/80 backdrop-blur-sm rounded-lg p-2">
          <button
            onClick={() => {
              if (containerRef.current) {
                containerRef.current.scrollBy({ top: -100, behavior: 'smooth' });
              }
            }}
            className="p-1 hover:bg-white/10 rounded transition-colors"
          >
            <ChevronUp className="w-4 h-4 text-white" />
          </button>
          <div className="h-px bg-white/20 my-1" />
          <button
            onClick={() => {
              if (containerRef.current) {
                containerRef.current.scrollBy({ top: 100, behavior: 'smooth' });
              }
            }}
            className="p-1 hover:bg-white/10 rounded transition-colors"
          >
            <ChevronDown className="w-4 h-4 text-white" />
          </button>
        </div>
      )}

      {/* 加载更多 */}
      {hasMore && LoadMoreComponent && (
        <div className="absolute bottom-0 left-0 right-0 p-4">
          {LoadMoreComponent}
        </div>
      )}
    </div>
  );
}

// 简化版虚拟列表（固定高度）
export interface SimpleVirtualListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  itemHeight: number;
  height: number | string;
  className?: string;
}

export function SimpleVirtualList<T>({
  items,
  renderItem,
  itemHeight,
  height,
  className,
}: SimpleVirtualListProps<T>) {
  return (
    <VirtualizedList
      items={items}
      renderItem={renderItem}
      itemHeight={itemHeight}
      height={height}
      className={className}
    />
  );
}

// 默认加载更多组件
export const DefaultLoadMore: React.FC<{ isLoading: boolean }> = ({ isLoading }) => (
  <div className="flex items-center justify-center py-4">
    <div className="flex items-center gap-2">
      <div className="w-4 h-4 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      <span className="text-sm text-gray-400">加载更多...</span>
    </div>
  </div>
);

// 默认空状态组件
export const DefaultEmptyState: React.FC<{ message?: string }> = ({ message = '暂无数据' }) => (
  <div className="text-center py-12">
    <p className="text-gray-500">{message}</p>
  </div>
);

export default VirtualizedList;
