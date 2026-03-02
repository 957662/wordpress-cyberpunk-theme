'use client';

/**
 * 虚拟滚动组件 - 优化大数据列表性能
 */

import { useState, useCallback, useMemo } from 'react';
import { cn } from '@/lib/utils';

interface VirtualScrollProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  itemHeight: number;
  height: number;
  overscan?: number;
  getKey?: (item: T, index: number) => string | number;
  className?: string;
  onReachBottom?: () => void;
}

export function VirtualScroll<T>({
  items,
  renderItem,
  itemHeight,
  height,
  overscan = 3,
  getKey,
  className,
  onReachBottom,
}: VirtualScrollProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);

  const { visibleRange, totalHeight, offsetY } = useMemo(() => {
    const totalHeight = items.length * itemHeight;
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(items.length, Math.ceil((scrollTop + height) / itemHeight) + overscan);

    return {
      visibleRange: { start: startIndex, end: endIndex },
      totalHeight,
      offsetY: startIndex * itemHeight,
    };
  }, [scrollTop, items.length, itemHeight, height, overscan]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    setScrollTop(target.scrollTop);

    if (onReachBottom) {
      const scrollHeight = target.scrollHeight;
      const clientHeight = target.clientHeight;
      if (scrollHeight - target.scrollTop - clientHeight < 100) {
        onReachBottom();
      }
    }
  }, [onReachBottom]);

  const defaultKey = useCallback((item: T, index: number) => {
    return getKey ? getKey(item, index) : index;
  }, [getKey]);

  return (
    <div className={cn('overflow-auto', className)} style={{ height }} onScroll={handleScroll}>
      <div className="relative" style={{ height: totalHeight }}>
        <div className="absolute left-0 right-0" style={{ transform: \`translateY(\${offsetY}px)\` }}>
          {items.slice(visibleRange.start, visibleRange.end).map((item, index) => (
            <div key={defaultKey(item, visibleRange.start + index)} style={{ height: itemHeight }} className="flex items-center">
              {renderItem(item, visibleRange.start + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default VirtualScroll;
