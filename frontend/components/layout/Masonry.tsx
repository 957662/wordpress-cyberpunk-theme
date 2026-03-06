/**
 * Masonry - 瀑布流布局组件
 * 瀑布流式布局
 */

'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils/cn';

export interface MasonryProps {
  children: ReactNode[];
  columns?: number;
  gap?: number;
  className?: string;
  minWidth?: number;
}

export function Masonry({
  children,
  columns = 3,
  gap = 16,
  className,
  minWidth = 300,
}: MasonryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [columnCount, setColumnCount] = useState(columns);

  useEffect(() => {
    const updateColumns = () => {
      if (!containerRef.current) return;

      const containerWidth = containerRef.current.offsetWidth;
      const newColumns = Math.max(1, Math.floor(containerWidth / (minWidth + gap)));

      setColumnCount(Math.min(newColumns, columns));
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);

    return () => window.removeEventListener('resize', updateColumns);
  }, [columns, gap, minWidth]);

  // 将子元素分配到各列
  const columnElements: ReactNode[][] = Array.from({ length: columnCount }, () => []);

  children.forEach((child, index) => {
    const columnIndex = index % columnCount;
    columnElements[columnIndex].push(child);
  });

  return (
    <div
      ref={containerRef}
      className={cn('flex w-full', className)}
      style={{ gap: `${gap}px` }}
    >
      {columnElements.map((column, columnIndex) => (
        <div
          key={columnIndex}
          className="flex-1 flex flex-col"
          style={{ gap: `${gap}px` }}
        >
          {column.map((item, itemIndex) => (
            <div key={itemIndex} className="w-full">
              {item}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
