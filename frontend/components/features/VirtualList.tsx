'use client';

import React, {
  useRef,
  useState,
  useEffect,
  useMemo,
  useCallback,
  ReactNode,
} from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface VirtualListProps<T> {
  items: T[];
  itemHeight: number | ((item: T, index: number) => number);
  renderItem: (item: T, index: number) => ReactNode;
  keyExtractor: (item: T, index: number) => string;
  overscan?: number;
  className?: string;
  containerHeight?: number;
  loading?: boolean;
  loadingComponent?: ReactNode;
  emptyComponent?: ReactNode;
  onEndReached?: () => void;
  onEndReachedThreshold?: number;
}

export function VirtualList<T extends Record<string, any>>({
  items,
  itemHeight,
  renderItem,
  keyExtractor,
  overscan = 3,
  className,
  containerHeight = 600,
  loading = false,
  loadingComponent,
  emptyComponent,
  onEndReached,
  onEndReachedThreshold = 0.8,
}: VirtualListProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [isEndReached, setIsEndReached] = useState(false);

  // 计算项目高度
  const getItemHeight = useCallback(
    (item: T, index: number): number => {
      return typeof itemHeight === 'function' ? itemHeight(item, index) : itemHeight;
    },
    [itemHeight]
  );

  // 计算总高度和位置映射
  const { totalHeight, offsetMap } = useMemo(() => {
    let totalHeight = 0;
    const offsetMap: number[] = [];

    items.forEach((item, index) => {
      offsetMap.push(totalHeight);
      totalHeight += getItemHeight(item, index);
    });

    return { totalHeight, offsetMap };
  }, [items, getItemHeight]);

  // 计算可见项目
  const { visibleItems, startIndex, endIndex } = useMemo(() => {
    const containerHeightNum = containerHeight;

    let startIndex = 0;
    let endIndex = items.length - 1;
    let offsetTop = 0;

    // 找到起始索引
    for (let i = 0; i < items.length; i++) {
      const itemHeight = getItemHeight(items[i], i);
      if (offsetTop + itemHeight > scrollTop - overscan * itemHeight) {
        startIndex = Math.max(0, i - overscan);
        break;
      }
      offsetTop += itemHeight;
    }

    // 找到结束索引
    offsetTop = 0;
    for (let i = 0; i < items.length; i++) {
      const itemHeight = getItemHeight(items[i], i);
      offsetTop += itemHeight;

      if (offsetTop > scrollTop + containerHeightNum + overscan * itemHeight) {
        endIndex = Math.min(items.length - 1, i + overscan);
        break;
      }
    }

    const visibleItems = [];
    for (let i = startIndex; i <= endIndex; i++) {
      visibleItems.push({
        item: items[i],
        index: i,
        offset: offsetMap[i],
        height: getItemHeight(items[i], i),
      });
    }

    return { visibleItems, startIndex, endIndex };
  }, [items, scrollTop, containerHeight, overscan, getItemHeight, offsetMap]);

  // 处理滚动事件
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    setScrollTop(scrollTop);

    // 检查是否到达底部
    if (onEndReached && !isEndReached) {
      const scrollHeight = e.currentTarget.scrollHeight;
      const clientHeight = e.currentTarget.clientHeight;
      const threshold = scrollHeight * (1 - onEndReachedThreshold);

      if (scrollTop + clientHeight >= threshold) {
        setIsEndReached(true);
        onEndReached();
      }
    }
  }, [onEndReached, onEndReachedThreshold, isEndReached]);

  // 重置 end reached 标记
  useEffect(() => {
    if (!loading && isEndReached) {
      setIsEndReached(false);
    }
  }, [loading, isEndReached]);

  // 渲染空状态
  if (items.length === 0 && !loading) {
    return (
      <div className={cn('flex items-center justify-center', className)}>
        {emptyComponent || (
          <div className="text-center text-gray-500 py-12">
            <p>暂无数据</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className={cn('overflow-auto', className)}
      style={{ height: containerHeight }}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems.map(({ item, index, offset, height }) => (
          <motion.div
            key={keyExtractor(item, index)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: (index - startIndex) * 0.02 }}
            style={{
              position: 'absolute',
              top: offset,
              left: 0,
              right: 0,
              height,
            }}
          >
            {renderItem(item, index)}
          </motion.div>
        ))}
      </div>

      {/* 加载更多 */}
      {loading && (
        <div className="py-4 text-center">
          {loadingComponent || (
            <div className="inline-flex items-center gap-2 text-gray-500">
              <div className="w-4 h-4 border-2 border-cyber-cyan border-t-transparent rounded-full animate-spin" />
              <span>加载中...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// 网格虚拟列表
export interface VirtualGridProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  keyExtractor: (item: T, index: number) => string;
  itemHeight: number;
  columns: number;
  gap?: number;
  className?: string;
  containerHeight?: number;
  loading?: boolean;
  loadingComponent?: ReactNode;
  emptyComponent?: ReactNode;
  onEndReached?: () => void;
}

export function VirtualGrid<T extends Record<string, any>>({
  items,
  renderItem,
  keyExtractor,
  itemHeight,
  columns,
  gap = 16,
  className,
  containerHeight = 600,
  loading = false,
  loadingComponent,
  emptyComponent,
  onEndReached,
}: VirtualGridProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);

  const rowHeight = itemHeight + gap;
  const totalRows = Math.ceil(items.length / columns);
  const totalHeight = totalRows * rowHeight;

  // 计算可见行
  const { visibleRows, startRow, endRow } = useMemo(() => {
    const startRow = Math.max(0, Math.floor(scrollTop / rowHeight) - 1);
    const endRow = Math.min(
      totalRows - 1,
      Math.ceil((scrollTop + containerHeight) / rowHeight) + 1
    );

    const visibleRows = [];
    for (let row = startRow; row <= endRow; row++) {
      const startCol = row * columns;
      const endCol = Math.min(startCol + columns, items.length);
      const rowItems = [];

      for (let col = startCol; col < endCol; col++) {
        rowItems.push({
          item: items[col],
          index: col,
        });
      }

      visibleRows.push({
        row,
        items: rowItems,
        offset: row * rowHeight,
      });
    }

    return { visibleRows, startRow, endRow };
  }, [items, scrollTop, rowHeight, totalRows, columns, containerHeight]);

  // 处理滚动事件
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);

    // 检查是否到达底部
    if (onEndReached) {
      const scrollHeight = e.currentTarget.scrollHeight;
      const clientHeight = e.currentTarget.clientHeight;
      const scrollTop = e.currentTarget.scrollTop;

      if (scrollTop + clientHeight >= scrollHeight - 100) {
        onEndReached();
      }
    }
  }, [onEndReached]);

  // 渲染空状态
  if (items.length === 0 && !loading) {
    return (
      <div className={cn('flex items-center justify-center', className)}>
        {emptyComponent || (
          <div className="text-center text-gray-500 py-12">
            <p>暂无数据</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className={cn('overflow-auto', className)}
      style={{ height: containerHeight }}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleRows.map(({ row, items: rowItems, offset }) => (
          <div
            key={row}
            style={{
              position: 'absolute',
              top: offset,
              left: 0,
              right: 0,
              height: itemHeight,
            }}
          >
            <div
              className="grid gap-4"
              style={{
                gridTemplateColumns: `repeat(${columns}, 1fr)`,
                gap: `${gap}px`,
              }}
            >
              {rowItems.map(({ item, index }) => (
                <motion.div
                  key={keyExtractor(item, index)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: (index % columns) * 0.05 }}
                >
                  {renderItem(item, index)}
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 加载更多 */}
      {loading && (
        <div className="py-4 text-center">
          {loadingComponent || (
            <div className="inline-flex items-center gap-2 text-gray-500">
              <div className="w-4 h-4 border-2 border-cyber-cyan border-t-transparent rounded-full animate-spin" />
              <span>加载中...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Hook: 虚拟滚动
export function useVirtualList<T>(options: {
  items: T[];
  itemHeight: number | ((item: T, index: number) => number);
  containerHeight: number;
  overscan?: number;
}) {
  const { items, itemHeight, containerHeight, overscan = 3 } = options;
  const [scrollTop, setScrollTop] = useState(0);

  const getItemHeight = useCallback(
    (item: T, index: number): number => {
      return typeof itemHeight === 'function' ? itemHeight(item, index) : itemHeight;
    },
    [itemHeight]
  );

  const { totalHeight, startIndex, endIndex } = useMemo(() => {
    let totalHeight = 0;
    let offset = 0;
    let startIndex = 0;
    let endIndex = items.length - 1;

    items.forEach((item, index) => {
      const height = getItemHeight(item, index);

      if (offset + height >= scrollTop - overscan * height && startIndex === 0) {
        startIndex = Math.max(0, index - overscan);
      }

      if (offset <= scrollTop + containerHeight + overscan * height) {
        endIndex = Math.min(items.length - 1, index + overscan);
      }

      offset += height;
      totalHeight += height;
    });

    return { totalHeight, startIndex, endIndex };
  }, [items, scrollTop, containerHeight, overscan, getItemHeight]);

  const visibleItems = useMemo(() => {
    return items.slice(startIndex, endIndex + 1);
  }, [items, startIndex, endIndex]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return {
    visibleItems,
    totalHeight,
    startIndex,
    endIndex,
    handleScroll,
  };
}
