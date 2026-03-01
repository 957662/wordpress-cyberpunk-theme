/**
 * useVirtualList Hook
 * 虚拟列表 Hook
 */

'use client';

import { useRef, useState, useEffect, useMemo, useCallback, ReactNode } from 'react';

export interface UseVirtualListOptions<T> {
  items: T[];
  itemHeight: number | ((index: number, data: T) => number);
  containerHeight: number;
  overscan?: number;
  renderItem: (item: T, index: number) => ReactNode;
}

export function useVirtualList<T>({
  items,
  itemHeight,
  containerHeight,
  overscan = 3,
  renderItem,
}: UseVirtualListOptions<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // 计算所有项目的位置和高度
  const itemMetadata = useMemo(() => {
    const metadata: Array<{ offset: number; height: number }> = [];
    let offset = 0;

    items.forEach((item, index) => {
      const height = typeof itemHeight === 'function'
        ? itemHeight(index, item)
        : itemHeight;

      metadata.push({ offset, height });
      offset += height;
    });

    return metadata;
  }, [items, itemHeight]);

  // 计算总高度
  const totalHeight = useMemo(() => {
    return itemMetadata.reduce((sum, meta) => sum + meta.height, 0);
  }, [itemMetadata]);

  // 计算可见范围
  const { startIndex, endIndex, visibleItems } = useMemo(() => {
    let start = 0;
    let end = items.length - 1;

    // 二分查找起始索引
    let low = 0;
    let high = items.length - 1;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const metadata = itemMetadata[mid];

      if (metadata.offset + metadata.height < scrollTop) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }

    start = Math.max(0, low - overscan);

    // 找到结束索引
    let currentHeight = itemMetadata[start]?.offset || 0;

    for (let i = start; i < items.length; i++) {
      currentHeight += itemMetadata[i].height;

      if (currentHeight > scrollTop + containerHeight) {
        end = Math.min(items.length - 1, i + overscan);
        break;
      }
    }

    const visible = items.slice(start, end + 1).map((item, i) => ({
      item,
      index: start + i,
      offset: itemMetadata[start + i].offset,
    }));

    return {
      startIndex: start,
      endIndex: end,
      visibleItems: visible,
    };
  }, [itemMetadata, items, scrollTop, containerHeight, overscan]);

  // 滚动处理
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return {
    containerRef,
    totalHeight,
    visibleItems,
    startIndex,
    endIndex,
    handleScroll,
  };
}

/**
 * useVirtualListDynamic Hook（动态高度虚拟列表）
 */
export interface UseVirtualListDynamicOptions<T> {
  items: T[];
  estimatedItemHeight: number;
  containerHeight: number;
  overscan?: number;
  renderItem: (item: T, index: number) => ReactNode;
  getItemKey?: (item: T, index: number) => string | number;
}

export function useVirtualListDynamic<T>({
  items,
  estimatedItemHeight,
  containerHeight,
  overscan = 3,
  renderItem,
  getItemKey = (_, index) => index,
}: UseVirtualListDynamicOptions<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemOffsetsRef = useRef<Map<string | number, number>>(new Map());
  const itemHeightsRef = useRef<Map<string | number, number>>(new Map());

  // 计算项目的偏移量
  const calculateOffset = useCallback((index: number): number => {
    let offset = 0;

    for (let i = 0; i < index; i++) {
      const key = getItemKey(items[i], i);
      const height = itemHeightsRef.current.get(key) || estimatedItemHeight;
      offset += height;
    }

    return offset;
  }, [items, estimatedItemHeight, getItemKey]);

  // 计算总高度
  const totalHeight = useMemo(() => {
    let height = 0;

    for (let i = 0; i < items.length; i++) {
      const key = getItemKey(items[i], i);
      const itemHeight = itemHeightsRef.current.get(key) || estimatedItemHeight;
      height += itemHeight;
    }

    return height;
  }, [items, estimatedItemHeight, getItemKey]);

  // 计算可见范围
  const { startIndex, endIndex, visibleItems } = useMemo(() => {
    let start = 0;
    let end = items.length - 1;

    // 查找起始索引
    for (let i = 0; i < items.length; i++) {
      const offset = calculateOffset(i);
      const key = getItemKey(items[i], i);
      const height = itemHeightsRef.current.get(key) || estimatedItemHeight;

      if (offset + height >= scrollTop) {
        start = Math.max(0, i - overscan);
        break;
      }
    }

    // 查找结束索引
    let currentHeight = calculateOffset(start);

    for (let i = start; i < items.length; i++) {
      const key = getItemKey(items[i], i);
      const height = itemHeightsRef.current.get(key) || estimatedItemHeight;
      currentHeight += height;

      if (currentHeight >= scrollTop + containerHeight) {
        end = Math.min(items.length - 1, i + overscan);
        break;
      }
    }

    const visible = items.slice(start, end + 1).map((item, i) => {
      const index = start + i;
      return {
        item,
        index,
        offset: calculateOffset(index),
      };
    });

    return {
      startIndex: start,
      endIndex: end,
      visibleItems: visible,
    };
  }, [items, scrollTop, containerHeight, overscan, estimatedItemHeight, getItemKey, calculateOffset]);

  // 测量项目高度
  const measureItem = useCallback((key: string | number, height: number) => {
    const oldHeight = itemHeightsRef.current.get(key);
    if (oldHeight !== height) {
      itemHeightsRef.current.set(key, height);
    }
  }, []);

  // 滚动处理
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return {
    containerRef,
    totalHeight,
    visibleItems,
    startIndex,
    endIndex,
    handleScroll,
    measureItem,
  };
}
