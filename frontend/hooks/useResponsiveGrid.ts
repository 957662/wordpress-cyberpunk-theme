/**
 * useResponsiveGrid Hook
 * 响应式网格钩子 - 根据屏幕尺寸计算网格布局
 */

'use client';

import { useState, useEffect } from 'react';

interface ResponsiveGridOptions {
  minItemWidth: number;
  gap?: number;
  breakpoints?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  maxColumns?: number;
}

interface ResponsiveGridReturn {
  columnCount: number;
  itemWidth: number;
  containerRef: React.RefObject<HTMLDivElement>;
}

export function useResponsiveGrid({
  minItemWidth,
  gap = 16,
  breakpoints = { sm: 640, md: 768, lg: 1024, xl: 1280 },
  maxColumns = Infinity,
}: ResponsiveGridOptions): ResponsiveGridReturn {
  const [columnCount, setColumnCount] = useState(1);
  const [itemWidth, setItemWidth] = useState(minItemWidth);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateGrid = () => {
      if (!containerRef.current) return;

      const containerWidth = containerRef.current.offsetWidth;

      // Calculate how many columns fit
      const availableWidth = containerWidth - gap;
      let columns = Math.floor(availableWidth / (minItemWidth + gap));

      // Apply max columns limit
      columns = Math.min(columns, maxColumns);

      // Ensure at least 1 column
      columns = Math.max(1, columns);

      // Calculate actual item width
      const totalGapWidth = (columns - 1) * gap;
      const actualItemWidth = (containerWidth - totalGapWidth) / columns;

      setColumnCount(columns);
      setItemWidth(actualItemWidth);
    };

    updateGrid();

    const resizeObserver = new ResizeObserver(updateGrid);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [minItemWidth, gap, maxColumns]);

  return {
    columnCount,
    itemWidth,
    containerRef,
  };
}

interface ResponsiveGridProps {
  children: React.ReactNode[];
  minItemWidth: number;
  gap?: number;
  maxColumns?: number;
  className?: string;
}

export function ResponsiveGrid({
  children,
  minItemWidth,
  gap = 16,
  maxColumns = Infinity,
  className = '',
}: ResponsiveGridProps) {
  const { columnCount, itemWidth, containerRef } = useResponsiveGrid({
    minItemWidth,
    gap,
    maxColumns,
  });

  // Distribute items into columns
  const columnItems: React.ReactNode[][] = Array.from({ length: columnCount }, () => []);
  children.forEach((child, index) => {
    const columnIndex = index % columnCount;
    columnItems[columnIndex].push(child);
  });

  return (
    <div
      ref={containerRef}
      className={`grid ${className}`}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
        gap: `${gap}px`,
      }}
    >
      {children}
    </div>
  );
}

export default useResponsiveGrid;
