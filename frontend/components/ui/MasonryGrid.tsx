/**
 * MasonryGrid Component
 * 瀑布流网格组件 - 自适应高度的网格布局
 */

'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface MasonryGridProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  columns?: number | { sm: number; md: number; lg: number; xl: number };
  gap?: number;
  className?: string;
  itemClassName?: string;
}

export function MasonryGrid<T>({
  items,
  renderItem,
  columns = { sm: 1, md: 2, lg: 3, xl: 4 },
  gap = 16,
  className = '',
  itemClassName = '',
}: MasonryGridProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [columnCount, setColumnCount] = useState(4);

  useEffect(() => {
    const updateColumnCount = () => {
      if (!containerRef.current) return;

      const width = containerRef.current.offsetWidth;
      let cols = 4;

      if (typeof columns === 'number') {
        cols = columns;
      } else {
        if (width < 640) cols = columns.sm;
        else if (width < 768) cols = columns.md;
        else if (width < 1024) cols = columns.lg;
        else cols = columns.xl;
      }

      setColumnCount(cols);
    };

    updateColumnCount();
    window.addEventListener('resize', updateColumnCount);
    return () => window.removeEventListener('resize', updateColumnCount);
  }, [columns]);

  // Distribute items into columns
  const columnItems: T[][] = Array.from({ length: columnCount }, () => []);
  items.forEach((item, index) => {
    const columnIndex = index % columnCount;
    columnItems[columnIndex].push(item);
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
      },
    },
  };

  return (
    <motion.div
      ref={containerRef}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`flex gap-${gap / 4} ${className}`}
      style={{ gap: `${gap}px` }}
    >
      {columnItems.map((columnItems, columnIndex) => (
        <motion.div
          key={columnIndex}
          variants={itemVariants}
          className="flex-1 flex flex-col gap-4"
          style={{ gap: `${gap}px` }}
        >
          {columnItems.map((item, itemIndex) => (
            <div key={itemIndex} className={itemClassName}>
              {renderItem(item, columnIndex * columnItems.length + itemIndex)}
            </div>
          ))}
        </motion.div>
      ))}
    </motion.div>
  );
}

interface MasonryItemProps {
  children: React.ReactNode;
  className?: string;
}

export function MasonryItem({ children, className = '' }: MasonryItemProps) {
  return <div className={className}>{children}</div>;
}

// Simplified version with CSS Grid
interface SimpleMasonryGridProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  minColumnWidth?: number;
  gap?: number;
  className?: string;
}

export function SimpleMasonryGrid<T>({
  items,
  renderItem,
  minColumnWidth = 300,
  gap = 16,
  className = '',
}: SimpleMasonryGridProps<T>) {
  return (
    <div
      className={className}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fill, minmax(${minColumnWidth}px, 1fr))`,
        gap: `${gap}px`,
      }}
    >
      {items.map((item, index) => (
        <div key={index}>{renderItem(item, index)}</div>
      ))}
    </div>
  );
}

export default MasonryGrid;
