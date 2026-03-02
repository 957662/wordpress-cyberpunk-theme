/**
 * 虚拟滚动组件
 * 高性能渲染大列表，只渲染可见区域的项
 */

'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface VirtualScrollProps<T> {
  items: T[];
  itemHeight: number;
  height: number;
  overscan?: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
  onEndReached?: () => void;
  endReachedThreshold?: number;
}

export function VirtualScroll<T>({
  items,
  itemHeight,
  height,
  overscan = 3,
  renderItem,
  className,
  onEndReached,
  endReachedThreshold = 200
}: VirtualScrollProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const endReachedRef = useRef(false);

  const totalHeight = items.length * itemHeight;
  const containerHeight = height;

  // 计算可见范围
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.floor((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const visibleItems = items.slice(startIndex, endIndex + 1);
  const offsetY = startIndex * itemHeight;

  // 滚动处理
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const currentScrollTop = e.currentTarget.scrollTop;
    setScrollTop(currentScrollTop);

    // 检测是否到达底部
    if (
      onEndReached &&
      !endReachedRef.current &&
      currentScrollTop + containerHeight >= totalHeight - endReachedThreshold
    ) {
      endReachedRef.current = true;
      onEndReached();
      setTimeout(() => {
        endReachedRef.current = false;
      }, 500);
    }
  }, [containerHeight, totalHeight, onEndReached, endReachedThreshold]);

  // 重置滚动位置
  useEffect(() => {
    if (containerRef.current) {
      setScrollTop(containerRef.current.scrollTop);
    }
  }, [items]);

  return (
    <div
      ref={containerRef}
      className={cn('overflow-auto', className)}
      style={{ height: `${containerHeight}px` }}
      onScroll={handleScroll}
    >
      <div
        className="relative"
        style={{ height: `${totalHeight}px` }}
      >
        {visibleItems.map((item, index) => (
          <motion.div
            key={startIndex + index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 right-0"
            style={{
              top: `${(startIndex + index) * itemHeight}px`,
              height: `${itemHeight}px`
            }}
          >
            {renderItem(item, startIndex + index)}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
