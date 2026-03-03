/**
 * useVirtualScroll Hook
 * 虚拟滚动钩子 - 优化大列表渲染性能
 */

'use client';

import { useState, useRef, useEffect, useMemo } from 'react';

interface UseVirtualScrollOptions {
  itemCount: number;
  itemHeight: number | ((index: number) => number);
  containerHeight: number;
  overscan?: number;
  getScrollElement?: () => HTMLElement | null;
}

interface UseVirtualScrollReturn {
  visibleItems: Array<{ index: number; offsetTop: number }>;
  totalHeight: number;
  scrollTop: number;
  scrollRef: React.RefObject<HTMLDivElement>;
}

export function useVirtualScroll({
  itemCount,
  itemHeight,
  containerHeight,
  overscan = 3,
  getScrollElement,
}: UseVirtualScrollOptions): UseVirtualScrollReturn {
  const [scrollTop, setScrollTop] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Calculate total height of all items
  const totalHeight = useMemo(() => {
    if (typeof itemHeight === 'number') {
      return itemCount * itemHeight;
    }

    // For dynamic heights, we need to calculate
    let height = 0;
    for (let i = 0; i < itemCount; i++) {
      height += itemHeight(i);
    }
    return height;
  }, [itemCount, itemHeight]);

  // Calculate visible range
  const { startIndex, endIndex } = useMemo(() => {
    let start = 0;
    let currentHeight = 0;

    // Find start index based on scrollTop
    if (typeof itemHeight === 'number') {
      start = Math.floor(scrollTop / itemHeight);
    } else {
      for (let i = 0; i < itemCount; i++) {
        const h = itemHeight(i);
        if (currentHeight + h > scrollTop) {
          start = i;
          break;
        }
        currentHeight += h;
      }
    }

    // Apply overscan
    start = Math.max(0, start - overscan);

    // Find end index based on container height
    let end = start;
    let visibleHeight = 0;

    if (typeof itemHeight === 'number') {
      const visibleCount = Math.ceil(containerHeight / itemHeight);
      end = Math.min(itemCount - 1, start + visibleCount + overscan * 2);
    } else {
      for (let i = start; i < itemCount; i++) {
        visibleHeight += itemHeight(i);
        end = i;
        if (visibleHeight > containerHeight + overscan * itemHeight(i)) {
          break;
        }
      }
      end = Math.min(itemCount - 1, end + overscan);
    }

    return { startIndex: start, endIndex: end };
  }, [scrollTop, itemCount, itemHeight, containerHeight, overscan]);

  // Calculate visible items with their offsets
  const visibleItems = useMemo(() => {
    const items: Array<{ index: number; offsetTop: number }> = [];
    let offsetTop = 0;

    // Calculate offset to start index
    if (typeof itemHeight === 'number') {
      offsetTop = startIndex * itemHeight;
    } else {
      for (let i = 0; i < startIndex; i++) {
        offsetTop += itemHeight(i);
      }
    }

    // Generate visible items
    for (let i = startIndex; i <= endIndex; i++) {
      items.push({ index: i, offsetTop });
      if (typeof itemHeight === 'number') {
        offsetTop += itemHeight;
      } else {
        offsetTop += itemHeight(i);
      }
    }

    return items;
  }, [startIndex, endIndex, itemHeight]);

  // Handle scroll events
  useEffect(() => {
    const scrollElement = getScrollElement?.() || scrollRef.current;
    if (!scrollElement) return;

    const handleScroll = () => {
      setScrollTop(scrollElement.scrollTop);
    };

    scrollElement.addEventListener('scroll', handleScroll, { passive: true });
    return () => scrollElement.removeEventListener('scroll', handleScroll);
  }, [getScrollElement]);

  return {
    visibleItems,
    totalHeight,
    scrollTop,
    scrollRef,
  };
}

interface VirtualListProps<T> {
  items: T[];
  itemHeight: number | ((index: number, item: T) => number);
  height: number;
  overscan?: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
}

export function VirtualList<T>({
  items,
  itemHeight,
  height,
  overscan = 3,
  renderItem,
  className = '',
}: VirtualListProps<T>) {
  const { visibleItems, totalHeight, scrollRef } = useVirtualScroll({
    itemCount: items.length,
    itemHeight,
    containerHeight: height,
    overscan,
  });

  const getItemHeight = (index: number) => {
    return typeof itemHeight === 'function' ? itemHeight(index, items[index]) : itemHeight;
  };

  return (
    <div
      ref={scrollRef}
      className={`overflow-auto ${className}`}
      style={{ height }}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems.map(({ index, offsetTop }) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              top: offsetTop,
              left: 0,
              right: 0,
              height: getItemHeight(index),
            }}
          >
            {renderItem(items[index], index)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default useVirtualScroll;
