'use client';

import { useMemo, useRef, useState, useEffect, useCallback } from 'react';

interface VirtualListOptions<T> {
  items: T[];
  itemHeight: number | ((item: T, index: number) => number);
  containerHeight: number;
  overscan?: number;
  estimateItemHeight?: (index: number) => number;
}

interface VirtualListResult<T> {
  visibleItems: Array<{ item: T; index: number; offset: number }>;
  totalHeight: number;
  scrollTop: number;
  containerRef: React.RefObject<HTMLDivElement>;
  handleScroll: () => void;
}

/**
 * 虚拟列表钩子
 * 用于高性能渲染大量列表项
 */
export function useVirtualList<T>({
  items,
  itemHeight,
  containerHeight,
  overscan = 3,
  estimateItemHeight,
}: VirtualListOptions<T>): VirtualListResult<T> {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemHeightsRef = useRef<Map<number, number>>(new Map());
  const [measuredHeight, setMeasuredHeight] = useState(0);

  // 计算项目高度
  const getItemHeight = useCallback((index: number): number => {
    const measured = itemHeightsRef.current.get(index);
    if (measured !== undefined) return measured;

    if (typeof itemHeight === 'function') {
      return itemHeight(items[index], index);
    }

    return itemHeight;
  }, [items, itemHeight]);

  // 计算总高度
  const totalHeight = useMemo(() => {
    let height = 0;
    for (let i = 0; i < items.length; i++) {
      height += getItemHeight(i);
    }
    return height;
  }, [items.length, getItemHeight]);

  // 计算可见项目
  const visibleItems = useMemo(() => {
    const result: Array<{ item: T; index: number; offset: number }> = [];
    let currentOffset = 0;
    let startIndex = -1;
    let endIndex = -1;

    // 找到起始索引
    for (let i = 0; i < items.length; i++) {
      const height = getItemHeight(i);
      if (currentOffset + height > scrollTop - overscan * getItemHeight(0) && startIndex === -1) {
        startIndex = Math.max(0, i - overscan);
      }
      if (currentOffset > scrollTop + containerHeight) {
        endIndex = Math.min(items.length - 1, i + overscan);
        break;
      }
      currentOffset += height;
    }

    if (startIndex === -1) startIndex = 0;
    if (endIndex === -1) endIndex = items.length - 1;

    // 收集可见项目
    currentOffset = 0;
    for (let i = 0; i < items.length; i++) {
      const height = getItemHeight(i);
      if (i >= startIndex && i <= endIndex) {
        result.push({
          item: items[i],
          index: i,
          offset: currentOffset,
        });
      }
      currentOffset += height;
    }

    return result;
  }, [items, scrollTop, containerHeight, getItemHeight, overscan]);

  // 处理滚动
  const handleScroll = useCallback(() => {
    if (containerRef.current) {
      setScrollTop(containerRef.current.scrollTop);
    }
  }, []);

  // 更新测量高度的回调
  const measureItem = useCallback((index: number, height: number) => {
    if (itemHeightsRef.current.get(index) !== height) {
      itemHeightsRef.current.set(index, height);
      setMeasuredHeight(prev => prev + 1);
    }
  }, []);

  return {
    visibleItems,
    totalHeight,
    scrollTop,
    containerRef,
    handleScroll,
    measureItem,
  };
}

/**
 * 虚拟网格钩子
 * 用于高性能渲染网格列表
 */
interface VirtualGridOptions<T> {
  items: T[];
  itemHeight: number;
  itemWidth: number;
  containerWidth: number;
  containerHeight: number;
  gap?: number;
  overscan?: number;
}

interface VirtualGridResult<T> {
  visibleItems: Array<{
    item: T;
    index: number;
    top: number;
    left: number;
  }>;
  totalHeight: number;
  columns: number;
  containerRef: React.RefObject<HTMLDivElement>;
  handleScroll: () => void;
}

export function useVirtualGrid<T>({
  items,
  itemHeight,
  itemWidth,
  containerWidth,
  containerHeight,
  gap = 0,
  overscan = 2,
}: VirtualGridOptions<T>): VirtualGridResult<T> {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // 计算列数
  const columns = useMemo(() => {
    const totalGapWidth = gap * (Math.floor(containerWidth / itemWidth) - 1);
    const availableWidth = containerWidth - totalGapWidth;
    return Math.floor((availableWidth + gap) / (itemWidth + gap)) || 1;
  }, [containerWidth, itemWidth, gap]);

  // 计算行数
  const rows = Math.ceil(items.length / columns);

  // 计算总高度
  const totalHeight = useMemo(() => {
    return rows * (itemHeight + gap) - gap;
  }, [rows, itemHeight, gap]);

  // 计算可见项目
  const visibleItems = useMemo(() => {
    const result: Array<{
      item: T;
      index: number;
      top: number;
      left: number;
    }> = [];

    const startRow = Math.max(0, Math.floor(scrollTop / (itemHeight + gap)) - overscan);
    const endRow = Math.min(
      rows - 1,
      Math.ceil((scrollTop + containerHeight) / (itemHeight + gap)) + overscan
    );

    for (let row = startRow; row <= endRow; row++) {
      for (let col = 0; col < columns; col++) {
        const index = row * columns + col;
        if (index >= items.length) break;

        result.push({
          item: items[index],
          index,
          top: row * (itemHeight + gap),
          left: col * (itemWidth + gap),
        });
      }
    }

    return result;
  }, [items, columns, rows, itemHeight, itemWidth, gap, containerHeight, scrollTop, overscan]);

  // 处理滚动
  const handleScroll = useCallback(() => {
    if (containerRef.current) {
      setScrollTop(containerRef.current.scrollTop);
    }
  }, []);

  return {
    visibleItems,
    totalHeight,
    columns,
    containerRef,
    handleScroll,
  };
}
