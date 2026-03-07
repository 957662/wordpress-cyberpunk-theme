/**
 * VirtualList Component
 * 虚拟列表组件 - 用于渲染大量数据的高性能列表
 */

'use client';

import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { cn } from '@/lib/utils';

/**
 * 列表项渲染器
 */
export type ItemRenderer<T> = (item: T, index: number) => React.ReactNode;

/**
 * 虚拟列表配置
 */
export interface VirtualListConfig<T> {
  items: T[];
  itemHeight: number | ((item: T, index: number) => number);
  renderItem: ItemRenderer<T>;
  overscan?: number;
  className?: string;
  height?: number | string;
  onEndReached?: () => void;
  endReachedThreshold?: number;
}

/**
 * VirtualList 组件
 */
export function VirtualList<T>({
  items,
  itemHeight,
  renderItem,
  overscan = 3,
  className,
  height = '100%',
  onEndReached,
  endReachedThreshold = 200,
}: VirtualListConfig<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  // 计算所有项的高度
  const itemPositions = useMemo(() => {
    const positions: Array<{ top: number; height: number }> = [];
    let currentTop = 0;

    items.forEach((item, index) => {
      const height = typeof itemHeight === 'function' ? itemHeight(item, index) : itemHeight;
      positions.push({ top: currentTop, height });
      currentTop += height;
    });

    return positions;
  }, [items, itemHeight]);

  // 总高度
  const totalHeight = useMemo(() => {
    return itemPositions.reduce((sum, pos) => sum + pos.height, 0);
  }, [itemPositions]);

  // 计算可见范围
  const { startIndex, endIndex } = useMemo(() => {
    let start = 0;
    let end = items.length - 1;

    for (let i = 0; i < itemPositions.length; i++) {
      const pos = itemPositions[i];
      if (pos.top + pos.height < scrollTop - overscan * 50) {
        start = i + 1;
      }
      if (pos.top < scrollTop + containerHeight + overscan * 50) {
        end = i;
      }
    }

    return { startIndex: Math.max(0, start), endIndex: Math.min(items.length - 1, end) };
  }, [itemPositions, scrollTop, containerHeight, overscan, items.length]);

  // 处理滚动事件
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const newScrollTop = e.currentTarget.scrollTop;
    setScrollTop(newScrollTop);

    // 检查是否滚动到底部
    if (onEndReached) {
      const scrollHeight = e.currentTarget.scrollHeight;
      const clientHeight = e.currentTarget.clientHeight;
      const isNearBottom = scrollHeight - newScrollTop - clientHeight < endReachedThreshold;

      if (isNearBottom) {
        onEndReached();
      }
    }
  }, [onEndReached, endReachedThreshold]);

  // 更新容器高度
  useEffect(() => {
    if (containerRef.current) {
      setContainerHeight(containerRef.current.clientHeight);
    }
  }, []);

  // 渲染可见项
  const visibleItems = useMemo(() => {
    const result: React.ReactNode[] = [];

    for (let i = startIndex; i <= endIndex; i++) {
      const item = items[i];
      const pos = itemPositions[i];

      result.push(
        <div
          key={i}
          className="absolute left-0 right-0"
          style={{
            top: pos.top,
            height: pos.height,
          }}
        >
          {renderItem(item, i)}
        </div>
      );
    }

    return result;
  }, [startIndex, endIndex, items, itemPositions, renderItem]);

  return (
    <div
      ref={containerRef}
      className={cn('overflow-auto', className)}
      style={{ height }}
      onScroll={handleScroll}
    >
      <div
        ref={innerRef}
        className="relative"
        style={{ height: totalHeight }}
      >
        {visibleItems}
      </div>
    </div>
  );
}

/**
 * VirtualGrid 组件
 * 虚拟网格组件
 */
export interface VirtualGridConfig<T> {
  items: T[];
  itemHeight: number;
  itemWidth: number;
  renderItem: ItemRenderer<T>;
  columns: number;
  gap?: number;
  overscan?: number;
  className?: string;
  height?: number | string;
}

export function VirtualGrid<T>({
  items,
  itemHeight,
  itemWidth,
  renderItem,
  columns,
  gap = 0,
  overscan = 3,
  className,
  height = '100%',
}: VirtualGridConfig<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);

  // 计算实际列宽
  const actualColumnWidth = useMemo(() => {
    return (containerWidth - gap * (columns - 1)) / columns;
  }, [containerWidth, columns, gap]);

  // 计算行数
  const rowCount = useMemo(() => {
    return Math.ceil(items.length / columns);
  }, [items.length, columns]);

  // 总高度
  const totalHeight = useMemo(() => {
    return rowCount * (itemHeight + gap) - gap;
  }, [rowCount, itemHeight, gap]);

  // 计算可见范围
  const { startRow, endRow } = useMemo(() => {
    const itemHeightWithGap = itemHeight + gap;
    const start = Math.floor(scrollTop / itemHeightWithGap);
    const visibleCount = Math.ceil(containerHeight / itemHeightWithGap);

    return {
      startRow: Math.max(0, start - overscan),
      endRow: Math.min(rowCount - 1, start + visibleCount + overscan),
    };
  }, [scrollTop, containerHeight, itemHeight, gap, rowCount, overscan]);

  // 处理滚动事件
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  // 更新容器尺寸
  const updateContainerSize = useCallback(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.clientWidth);
      setContainerHeight(containerRef.current.clientHeight);
    }
  }, []);

  useEffect(() => {
    updateContainerSize();
    window.addEventListener('resize', updateContainerSize);
    return () => window.removeEventListener('resize', updateContainerSize);
  }, [updateContainerSize]);

  // 渲染可见项
  const visibleItems = useMemo(() => {
    const result: React.ReactNode[] = [];

    for (let row = startRow; row <= endRow; row++) {
      for (let col = 0; col < columns; col++) {
        const index = row * columns + col;
        if (index >= items.length) break;

        const item = items[index];
        const top = row * (itemHeight + gap);
        const left = col * (actualColumnWidth + gap);

        result.push(
          <div
            key={index}
            className="absolute"
            style={{
              top,
              left,
              width: actualColumnWidth,
              height: itemHeight,
            }}
          >
            {renderItem(item, index)}
          </div>
        );
      }
    }

    return result;
  }, [startRow, endRow, items, columns, actualColumnWidth, itemHeight, gap, renderItem]);

  return (
    <div
      ref={containerRef}
      className={cn('overflow-auto', className)}
      style={{ height }}
      onScroll={handleScroll}
    >
      <div
        className="relative"
        style={{ height: totalHeight }}
      >
        {visibleItems}
      </div>
    </div>
  );
}

/**
 * useVirtualList Hook
 */
export function useVirtualList<T>(options: {
  items: T[];
  itemHeight: number | ((item: T, index: number) => number);
  containerHeight: number;
  overscan?: number;
}) {
  const { items, itemHeight, containerHeight, overscan = 3 } = options;
  const [scrollTop, setScrollTop] = useState(0);

  // 计算所有项的位置
  const itemPositions = useMemo(() => {
    const positions: Array<{ top: number; height: number; index: number }> = [];
    let currentTop = 0;

    items.forEach((item, index) => {
      const height = typeof itemHeight === 'function' ? itemHeight(item, index) : itemHeight;
      positions.push({ top: currentTop, height, index });
      currentTop += height;
    });

    return positions;
  }, [items, itemHeight]);

  // 总高度
  const totalHeight = useMemo(() => {
    return itemPositions.reduce((sum, pos) => sum + pos.height, 0);
  }, [itemPositions]);

  // 计算可见范围
  const { startIndex, endIndex, offsetY } = useMemo(() => {
    let start = 0;
    let end = items.length - 1;
    let offset = 0;

    for (let i = 0; i < itemPositions.length; i++) {
      const pos = itemPositions[i];
      if (pos.top + pos.height < scrollTop - overscan * 50) {
        start = i + 1;
      }
      if (pos.top < scrollTop + containerHeight + overscan * 50) {
        end = i;
        offset = pos.top;
      }
    }

    return { startIndex: Math.max(0, start), endIndex: Math.min(items.length - 1, end), offsetY: offset };
  }, [itemPositions, scrollTop, containerHeight, overscan, items.length]);

  const handleScroll = useCallback((scrollTop: number) => {
    setScrollTop(scrollTop);
  }, []);

  return {
    itemPositions,
    totalHeight,
    startIndex,
    endIndex,
    offsetY,
    handleScroll,
  };
}

// 默认导出
export default {
  VirtualList,
  VirtualGrid,
  useVirtualList,
};
