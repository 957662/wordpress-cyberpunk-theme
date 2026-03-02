'use client';

/**
 * 虚拟网格组件
 * 高性能渲染大量网格数据
 */

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { cn } from '@/lib/utils';

interface VirtualGridProps<T> {
  /**
   * 数据源
   */
  data: T[];

  /**
   * 渲染项
   */
  renderItem: (item: T, rowIndex: number, colIndex: number) => React.ReactNode;

  /**
   * 列数
   */
  columns: number;

  /**
   * 行高
   */
  rowHeight: number;

  /**
   * 列宽
   */
  columnWidth: number;

  /**
   * 容器高度
   */
  height: number;

  /**
   * 水平间距
   */
  gapX?: number;

  /**
   * 垂直间距
   */
  gapY?: number;

  /**
   * 预渲染的额外行列数
   */
  overscan?: number;

  /**
   * 唯一键
   */
  getKey?: (item: T, index: number) => string | number;

  /**
   * 自定义类名
   */
  className?: string;

  /**
   * 加载更多
   */
  onLoadMore?: () => void;

  /**
   * 是否有更多数据
   */
  hasMore?: boolean;

  /**
   * 加载中
   */
  loading?: boolean;
}

export function VirtualGrid<T>({
  data,
  renderItem,
  columns,
  rowHeight,
  columnWidth,
  height,
  gapX = 16,
  gapY = 16,
  overscan = 2,
  getKey,
  className,
  onLoadMore,
  hasMore = false,
  loading = false,
}: VirtualGridProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastScrollTopRef = useRef(0);

  // 计算总行数
  const totalRows = Math.ceil(data.length / columns);

  // 计算网格宽度
  const gridWidth = columns * columnWidth + (columns - 1) * gapX;

  // 计算总高度
  const totalHeight = totalRows * rowHeight + (totalRows - 1) * gapY;

  // 计算可见范围
  const { startRow, endRow, visibleItems } = useMemo(() => {
    const startRow = Math.max(0, Math.floor(scrollTop / (rowHeight + gapY)) - overscan);
    const endRow = Math.min(
      totalRows - 1,
      Math.ceil((scrollTop + height) / (rowHeight + gapY)) + overscan
    );

    const visibleItems = [];
    for (let row = startRow; row <= endRow; row++) {
      for (let col = 0; col < columns; col++) {
        const index = row * columns + col;
        if (index < data.length) {
          visibleItems.push({
            item: data[index],
            index,
            row,
            col,
          });
        }
      }
    }

    return { startRow, endRow, visibleItems };
  }, [scrollTop, rowHeight, gapY, height, overscan, totalRows, columns, data]);

  // 滚动处理
  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const currentScrollTop = e.currentTarget.scrollTop;
      setScrollTop(currentScrollTop);

      // 检测是否滚动到底部
      const scrollHeight = e.currentTarget.scrollHeight;
      const clientHeight = e.currentTarget.clientHeight;
      const scrollBottom = scrollHeight - currentScrollTop - clientHeight;

      if (onLoadMore && hasMore && !loading && scrollBottom < rowHeight * 2) {
        if (currentScrollTop > lastScrollTopRef.current) {
          onLoadMore();
        }
      }

      lastScrollTopRef.current = currentScrollTop;
    },
    [rowHeight, onLoadMore, hasMore, loading]
  );

  return (
    <div
      ref={containerRef}
      className={cn('overflow-auto', className)}
      style={{ height }}
      onScroll={handleScroll}
    >
      <div
        style={{
          height: totalHeight,
          width: gridWidth,
          position: 'relative',
        }}
      >
        {visibleItems.map(({ item, index, row, col }) => (
          <div
            key={getKey ? getKey(item, index) : index}
            style={{
              position: 'absolute',
              top: row * (rowHeight + gapY),
              left: col * (columnWidth + gapX),
              width: columnWidth,
              height: rowHeight,
            }}
          >
            {renderItem(item, row, col)}
          </div>
        ))}

        {/* 加载更多 */}
        {loading && (
          <div
            style={{
              position: 'absolute',
              top: totalHeight,
              left: 0,
              right: 0,
              padding: '20px',
              textAlign: 'center',
            }}
          >
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-gray-400">加载中...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default VirtualGrid;
