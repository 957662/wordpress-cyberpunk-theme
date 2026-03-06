/**
 * VirtualList - 虚拟滚动列表组件
 * 用于高效渲染大量数据
 */

'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface VirtualListProps<T> {
  /**
   * 数据源
   */
  data: T[];
  /**
   * 渲染函数
   */
  renderItem: (item: T, index: number) => React.ReactNode;
  /**
   * 项目高度 (固定高度) 或计算函数
   */
  itemHeight: number | ((index: number, item: T) => number);
  /**
   * 容器高度
   */
  height: number;
  /**
   * 缓冲区大小 (额外渲染的项目数)
   */
  overscan?: number;
  /**
   * 唯一键获取函数
   */
  getKey?: (item: T, index: number) => string | number;
  /**
   * 自定义样式
   */
  className?: string;
  /**
   * 滚动到指定索引
   */
  scrollToIndex?: number;
  /**
   * 是否平滑滚动
   */
  smoothScroll?: boolean;
}

export function VirtualList<T>({
  data,
  renderItem,
  itemHeight,
  height,
  overscan = 5,
  getKey,
  className,
  scrollToIndex,
  smoothScroll = false,
}: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // 计算项目位置
  const itemPositions = useMemo(() => {
    const positions: { top: number; height: number }[] = [];
    let currentTop = 0;

    for (let i = 0; i < data.length; i++) {
      const h = typeof itemHeight === 'function' ? itemHeight(i, data[i]) : itemHeight;
      positions.push({ top: currentTop, height: h });
      currentTop += h;
    }

    return positions;
  }, [data, itemHeight]);

  // 总高度
  const totalHeight = useMemo(() => {
    if (itemPositions.length === 0) return 0;
    const lastItem = itemPositions[itemPositions.length - 1];
    return lastItem.top + lastItem.height;
  }, [itemPositions]);

  // 计算可见范围
  const { startIndex, endIndex } = useMemo(() => {
    let start = 0;
    let end = data.length - 1;
    let currentTop = scrollTop;

    // 找到第一个可见项
    for (let i = 0; i < itemPositions.length; i++) {
      if (currentTop < itemPositions[i].top + itemPositions[i].height) {
        start = Math.max(0, i - overscan);
        break;
      }
    }

    // 找到最后一个可见项
    for (let i = itemPositions.length - 1; i >= 0; i--) {
      if (currentTop + height > itemPositions[i].top) {
        end = Math.min(data.length - 1, i + overscan);
        break;
      }
    }

    return { startIndex: start, endIndex: end };
  }, [scrollTop, height, itemPositions, data.length, overscan]);

  // 滚动到指定索引
  useEffect(() => {
    if (scrollToIndex !== undefined && containerRef.current) {
      const targetPosition = itemPositions[scrollToIndex]?.top || 0;
      containerRef.current.scrollTo({
        top: targetPosition,
        behavior: smoothScroll ? 'smooth' : 'auto',
      });
    }
  }, [scrollToIndex, itemPositions, smoothScroll]);

  // 处理滚动
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  // 可见项目
  const visibleItems = useMemo(() => {
    return data.slice(startIndex, endIndex + 1).map((item, index) => ({
      item,
      index: startIndex + index,
      position: itemPositions[startIndex + index],
    }));
  }, [data, startIndex, endIndex, itemPositions]);

  return (
    <div
      ref={containerRef}
      className={cn('overflow-auto', className)}
      style={{ height }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems.map(({ item, index, position }) => (
          <motion.div
            key={getKey ? getKey(item, index) : index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'absolute',
              top: position.top,
              left: 0,
              right: 0,
              height: position.height,
            }}
          >
            {renderItem(item, index)}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/**
 * 可变高度虚拟列表
 */
export interface VariableVirtualListProps<T> {
  data: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  estimatedItemHeight: number;
  height: number;
  overscan?: number;
  getKey?: (item: T, index: number) => string | number;
  className?: string;
  onItemsRendered?: (startIndex: number, endIndex: number) => void;
}

export function VariableVirtualList<T>({
  data,
  renderItem,
  estimatedItemHeight,
  height,
  overscan = 5,
  getKey,
  className,
  onItemsRendered,
}: VariableVirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const [itemSizes, setItemSizes] = useState<Map<number, number>>(new Map());
  const containerRef = useRef<HTMLDivElement>(null);
  const resizeObserverRef = useRef<ResizeObserver>();

  // 更新项目尺寸
  useEffect(() => {
    if (!containerRef.current) return;

    resizeObserverRef.current = new ResizeObserver((entries) => {
      const newSizes = new Map(itemSizes);

      entries.forEach((entry) => {
        const index = parseInt(entry.target.getAttribute('data-index') || '-1');
        if (index >= 0) {
          newSizes.set(index, entry.contentRect.height);
        }
      });

      setItemSizes(newSizes);
    });

    return () => {
      resizeObserverRef.current?.disconnect();
    };
  }, [itemSizes]);

  // 计算项目位置
  const itemPositions = useMemo(() => {
    const positions: { top: number; height: number }[] = [];
    let currentTop = 0;

    for (let i = 0; i < data.length; i++) {
      const height = itemSizes.get(i) || estimatedItemHeight;
      positions.push({ top: currentTop, height });
      currentTop += height;
    }

    return positions;
  }, [data, itemSizes, estimatedItemHeight]);

  // 总高度
  const totalHeight = useMemo(() => {
    if (itemPositions.length === 0) return 0;
    const lastItem = itemPositions[itemPositions.length - 1];
    return lastItem.top + lastItem.height;
  }, [itemPositions]);

  // 计算可见范围
  const { startIndex, endIndex } = useMemo(() => {
    let start = 0;
    let end = data.length - 1;
    let currentTop = scrollTop;

    for (let i = 0; i < itemPositions.length; i++) {
      if (currentTop < itemPositions[i].top + itemPositions[i].height) {
        start = Math.max(0, i - overscan);
        break;
      }
    }

    for (let i = itemPositions.length - 1; i >= 0; i--) {
      if (currentTop + height > itemPositions[i].top) {
        end = Math.min(data.length - 1, i + overscan);
        break;
      }
    }

    return { startIndex: start, endIndex: end };
  }, [scrollTop, height, itemPositions, data.length, overscan]);

  // 通知渲染的项目
  useEffect(() => {
    onItemsRendered?.(startIndex, endIndex);
  }, [startIndex, endIndex, onItemsRendered]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  const visibleItems = useMemo(() => {
    return data.slice(startIndex, endIndex + 1).map((item, index) => ({
      item,
      index: startIndex + index,
      position: itemPositions[startIndex + index],
    }));
  }, [data, startIndex, endIndex, itemPositions]);

  return (
    <div
      ref={containerRef}
      className={cn('overflow-auto', className)}
      style={{ height }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems.map(({ item, index, position }) => (
          <div
            key={getKey ? getKey(item, index) : index}
            data-index={index}
            style={{
              position: 'absolute',
              top: position.top,
              left: 0,
              right: 0,
            }}
          >
            {renderItem(item, index)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default VirtualList;
