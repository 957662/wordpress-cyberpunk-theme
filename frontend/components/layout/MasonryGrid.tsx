'use client';

import React, { useState, useEffect, useRef, ReactNode } from 'react';

interface MasonryGridProps {
  children: ReactNode[];
  columnCount?: number;
  gap?: number;
  className?: string;
}

export function MasonryGrid({
  children,
  columnCount = 3,
  gap = 16,
  className = '',
}: MasonryGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [columns, setColumns] = useState(columnCount);

  useEffect(() => {
    const updateColumns = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.offsetWidth;
      if (width < 640) setColumns(1);
      else if (width < 1024) setColumns(2);
      else setColumns(columnCount);
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, [columnCount]);

  const columnElements: ReactNode[][] = Array.from({ length: columns }, () => []);

  children.forEach((child, index) => {
    columnElements[index % columns].push(child);
  });

  return (
    <div ref={containerRef} className={`flex gap-4 ${className}`}>
      {columnElements.map((column, columnIndex) => (
        <div
          key={columnIndex}
          className="flex flex-col gap-4 flex-1"
          style={{ gap: `${gap}px` }}
        >
          {column.map((child, itemIndex) => (
            <div key={itemIndex}>{child}</div>
          ))}
        </div>
      ))}
    </div>
  );
}
