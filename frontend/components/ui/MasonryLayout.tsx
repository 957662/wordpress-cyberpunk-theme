/**
 * MasonryLayout Component - 瀑布流布局组件
 * 不规则高度的元素以瀑布流方式排列
 */

'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface MasonryItem {
  id: string | number;
  height?: number;
  content: React.ReactNode;
}

export interface MasonryLayoutProps {
  items: MasonryItem[];
  columns?: number | 'responsive';
  columnWidth?: number;
  gap?: number;
  className?: string;
  itemClassName?: string;
  onEndReached?: () => void;
  endReachedThreshold?: number;
}

export function MasonryLayout({
  items,
  columns = 'responsive',
  columnWidth = 300,
  gap = 16,
  className,
  itemClassName,
  onEndReached,
  endReachedThreshold = 300,
}: MasonryLayoutProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [columnCount, setColumnCount] = useState(1);
  const [itemPositions, setItemPositions] = useState<Array<{ top: number; left: number; height: number }>>([]);
  const endReachedCalled = useRef(false);

  // 计算列数
  const calculateColumnCount = useCallback(() => {
    if (typeof columns === 'number') {
      return columns;
    }

    if (!containerRef.current) return 1;

    const containerWidth = containerRef.current.offsetWidth;
    return Math.max(1, Math.floor((containerWidth + gap) / (columnWidth + gap)));
  }, [columns, columnWidth, gap]);

  // 计算项目位置
  const calculatePositions = useCallback(() => {
    const cols = calculateColumnCount();
    const columnHeights = new Array(cols).fill(0);
    const positions: Array<{ top: number; left: number; height: number }> = [];

    items.forEach((item, index) => {
      // 找到最短的列
      const minHeight = Math.min(...columnHeights);
      const columnIndex = columnHeights.indexOf(minHeight);

      // 计算位置
      const left = columnIndex * (columnWidth + gap);
      const top = minHeight;
      const height = item.height || 300; // 默认高度

      positions.push({ top, left, height });
      columnHeights[columnIndex] += height + gap;
    });

    setItemPositions(positions);
  }, [items, calculateColumnCount, columnWidth, gap]);

  // 更新列数和位置
  useEffect(() => {
    const cols = calculateColumnCount();
    setColumnCount(cols);
    calculatePositions();
  }, [calculateColumnCount, calculatePositions]);

  // 监听窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      const cols = calculateColumnCount();
      setColumnCount(cols);
      calculatePositions();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [calculateColumnCount, calculatePositions]);

  // 滚动检测
  useEffect(() => {
    if (!onEndReached) return;

    const handleScroll = () => {
      if (!containerRef.current || endReachedCalled.current) return;

      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop;
      const clientHeight = document.documentElement.clientHeight;
      const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);

      if (distanceFromBottom < endReachedThreshold) {
        endReachedCalled.current = true;
        onEndReached();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [onEndReached, endReachedThreshold]);

  // 重置 endReached 标记
  useEffect(() => {
    endReachedCalled.current = false;
  }, [items]);

  const containerHeight = itemPositions.length > 0
    ? Math.max(...itemPositions.map(p => p.top + p.height))
    : 0;

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full", className)}
      style={{ height: containerHeight }}
    >
      {items.map((item, index) => {
        const position = itemPositions[index];
        if (!position) return null;

        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className={cn("absolute", itemClassName)}
            style={{
              left: position.left,
              top: position.top,
              width: columnWidth,
              height: position.height,
            }}
          >
            {item.content}
          </motion.div>
        );
      })}
    </div>
  );
}

/**
 * MasonryGrid Component - 固定列数的瀑布流
 */
export interface MasonryGridProps {
  items: MasonryItem[];
  columns: number;
  gap?: number;
  className?: string;
  itemClassName?: string;
}

export function MasonryGrid({
  items,
  columns,
  gap = 16,
  className,
  itemClassName,
}: MasonryGridProps) {
  // 将项目分配到各列
  const columnItems: MasonryItem[][] = Array.from({ length: columns }, () => []);
  items.forEach((item, index) => {
    const columnIndex = index % columns;
    columnItems[columnIndex].push(item);
  });

  return (
    <div className={cn("grid gap-4", className)} style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
      {columnItems.map((column, columnIndex) => (
        <div key={columnIndex} className="flex flex-col gap-4">
          {column.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={itemClassName}
            >
              {item.content}
            </motion.div>
          ))}
        </div>
      ))}
    </div>
  );
}
