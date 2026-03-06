'use client';

import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface MasonryGridProps {
  children: React.ReactNode[];
  columns?: number | 'responsive';
  minColumnWidth?: number;
  gap?: number;
  className?: string;
}

/**
 * MasonryGrid - 瀑布流布局组件
 * 用于创建瀑布流网格布局
 */
export const MasonryGrid: React.FC<MasonryGridProps> = ({
  children,
  columns = 'responsive',
  minColumnWidth = 300,
  gap = 16,
  className,
}) => {
  const [columnCount, setColumnCount] = useState(4);
  const [columnHeights, setColumnHeights] = useState<number[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemHeightsRef = useRef<number[]>([]);

  useEffect(() => {
    const updateColumnCount = () => {
      if (!containerRef.current) return;

      const containerWidth = containerRef.current.offsetWidth;

      if (typeof columns === 'number') {
        setColumnCount(columns);
        return;
      }

      const newColumnCount = Math.max(1, Math.floor(containerWidth / (minColumnWidth + gap)));
      setColumnCount(newColumnCount);
    };

    updateColumnCount();

    const resizeObserver = new ResizeObserver(updateColumnCount);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [columns, minColumnWidth, gap]);

  useEffect(() => {
    setColumnHeights(new Array(columnCount).fill(0));
  }, [columnCount]);

  const distributeItems = () => {
    const cols: React.ReactNode[][] = Array.from({ length: columnCount }, () => []);
    const heights = [...columnHeights];

    children.forEach((child, index) => {
      const minHeight = Math.min(...heights);
      const columnIndex = heights.indexOf(minHeight);

      cols[columnIndex].push(child);
      heights[columnIndex] += itemHeightsRef.current[index] || 0;
    });

    setColumnHeights(heights);
    return cols;
  };

  const columnItems = distributeItems();

  return (
    <div
      ref={containerRef}
      className={cn('flex', className)}
      style={{ gap: `${gap}px` }}
    >
      {columnItems.map((column, columnIndex) => (
        <div
          key={columnIndex}
          className="flex flex-col"
          style={{ gap: `${gap}px`, flex: 1 }}
        >
          {column.map((item, itemIndex) => (
            <div key={itemIndex}>{item}</div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default MasonryGrid;
