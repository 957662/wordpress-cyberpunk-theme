'use client';

import React, { ReactNode } from 'react';

interface GridProps {
  children: ReactNode[];
  cols?: number;
  rows?: number;
  gap?: number;
  className?: string;
}

export function Grid({
  children,
  cols = 3,
  rows,
  gap = 16,
  className = '',
}: GridProps) {
  return (
    <div
      className={`grid ${className}`}
      style={{
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: rows ? `repeat(${rows}, 1fr)` : undefined,
        gap: `${gap}px`,
      }}
    >
      {children}
    </div>
  );
}
