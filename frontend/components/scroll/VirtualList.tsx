'use client';

/**
 * VirtualList Component - 虚拟滚动列表组件
 * 用于渲染大量数据的高性能列表，只渲染可见区域的项
 */

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';

// 列表项尺寸
export interface ItemSize {
  width?: number;
  height: number;
}

// 组件Props
export interface VirtualListProps<T> {
  /** 数据列表 */
  items: T[];
  /** 渲染函数 */
  renderItem: (item: T, index: number, style: React.CSSProperties) => React.ReactNode;
  /** 列表项高度（固定高度） */
  itemHeight?: number;
  /** 列表项高度计算函数（动态高度） */
  getItemSize?: (index: number) => number;
  /** 列表项宽度（可选） */
  itemWidth?: number;
  /** 容器高度 */
  height: number;
  /** 容器宽度（可选） */
  width?: number;
  /** 缓冲区大小（额外渲染的项数） */
  overscan?: number;
  /** 是否启用动画 */
  enableAnimation?: boolean;
  /** 自定义样式类名 */
  className?: string;
  /** 容器样式 */
  style?: React.CSSProperties;
}

export function VirtualList<T>({
  items,
  renderItem,
  itemHeight: fixedItemHeight,
  getItemSize,
  itemWidth,
  height,
  width = '100%',
  overscan = 5,
  enableAnimation = true,
  className = '',
  style,
}: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(height);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemSizesRef = useRef<Map<number, number>>(new Map());
  const measurementsRef = useRef<Map<number, { top: number; bottom: number }>>(new Map());

  // 判断是否使用动态高度
  const isDynamicHeight = !!getItemSize;

  // 计算所有项的位置和尺寸
  const measurements = useMemo(() => {
    const measurements = new Map<number, { top: number; bottom: number }>();
    let currentTop = 0;

    for (let i = 0; i < items.length; i++) {
      const itemHeight = isDynamicHeight
        ? itemSizesRef.current.get(i) || getItemSize!(i)
        : fixedItemHeight!;

      measurements.set(i, {
        top: currentTop,
        bottom: currentTop + itemHeight,
      });

      currentTop += itemHeight;
    }

    measurementsRef.current = measurements;
    return measurements;
  }, [items.length, isDynamicHeight, fixedItemHeight, getItemSize]);

  // 计算总高度
  const totalHeight = useMemo(() => {
    if (items.length === 0) return 0;

    const lastMeasurement = measurements.get(items.length - 1);
    return lastMeasurement ? lastMeasurement.bottom : 0;
  }, [items.length, measurements]);

  // 计算可见范围
  const { startIndex, endIndex } = useMemo(() => {
    const containerTop = scrollTop;
    const containerBottom = scrollTop + containerHeight;

    let start = 0;
    let end = items.length - 1;

    // 二分查找起始索引
    let left = 0;
    let right = items.length - 1;
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const measurement = measurements.get(mid);
      if (!measurement) break;

      if (measurement.bottom < containerTop) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
    start = Math.max(0, left - overscan);

    // 二分查找结束索引
    left = 0;
    right = items.length - 1;
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const measurement = measurements.get(mid);
      if (!measurement) break;

      if (measurement.top > containerBottom) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    }
    end = Math.min(items.length - 1, right + overscan);

    return { startIndex: start, endIndex: end };
  }, [scrollTop, containerHeight, measurements, items.length, overscan]);

  // 处理滚动事件
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  // 更新容器高度
  useEffect(() => {
    if (containerRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          setContainerHeight(entry.contentRect.height);
        }
      });

      resizeObserver.observe(containerRef.current);

      return () => {
        resizeObserver.disconnect();
      };
    }
  }, []);

  // 可见项
  const visibleItems = useMemo(() => {
    const result: Array<{ item: T; index: number; top: number }> = [];

    for (let i = startIndex; i <= endIndex; i++) {
      const measurement = measurements.get(i);
      if (measurement) {
        result.push({
          item: items[i],
          index: i,
          top: measurement.top,
        });
      }
    }

    return result;
  }, [startIndex, endIndex, measurements, items]);

  return (
    <div
      ref={containerRef}
      className={`overflow-auto ${className}`}
      style={{
        height: `${height}px`,
        width: typeof width === 'number' ? `${width}px` : width,
        position: 'relative',
        ...style,
      }}
      onScroll={handleScroll}
    >
      {/* 占位容器 */}
      <div
        style={{
          height: `${totalHeight}px`,
          position: 'relative',
          width: '100%',
        }}
      >
        {/* 可见项 */}
        {visibleItems.map(({ item, index, top }) => {
          const itemStyle: React.CSSProperties = {
            position: 'absolute',
            top: `${top}px`,
            left: 0,
            right: 0,
            width: itemWidth ? `${itemWidth}px` : '100%',
          };

          const content = renderItem(item, index, itemStyle);

          if (enableAnimation) {
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                style={itemStyle}
              >
                {content}
              </motion.div>
            );
          }

          return (
            <div key={index} style={itemStyle}>
              {content}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default VirtualList;
