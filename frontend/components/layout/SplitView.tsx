'use client';

import React, { useState, ReactNode, MouseEvent } from 'react';

interface SplitViewProps {
  left: ReactNode;
  right: ReactNode;
  initialSplit?: number;
  minSplit?: number;
  maxSplit?: number;
  direction?: 'horizontal' | 'vertical';
  className?: string;
}

export function SplitView({
  left,
  right,
  initialSplit = 50,
  minSplit = 20,
  maxSplit = 80,
  direction = 'horizontal',
  className = '',
}: SplitViewProps) {
  const [split, setSplit] = useState(initialSplit);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const container = document.querySelector('[data-split-container]');
      if (!container) return;

      const rect = container.getBoundingClientRect();
      let newSplit: number;

      if (direction === 'horizontal') {
        newSplit = ((e.clientX - rect.left) / rect.width) * 100;
      } else {
        newSplit = ((e.clientY - rect.top) / rect.height) * 100;
      }

      newSplit = Math.max(minSplit, Math.min(maxSplit, newSplit));
      setSplit(newSplit);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove as any);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove as any);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, direction, minSplit, maxSplit]);

  const isHorizontal = direction === 'horizontal';

  return (
    <div
      data-split-container
      className={`flex ${isHorizontal ? 'flex-row' : 'flex-col'} h-full ${className}`}
    >
      <div
        style={{
          [isHorizontal ? 'width' : 'height']: `${split}%`,
        }}
        className="overflow-hidden"
      >
        {left}
      </div>

      <div
        className={`${
          isHorizontal
            ? 'w-1 cursor-col-resize hover:bg-cyan-400'
            : 'h-1 cursor-row-resize hover:bg-cyan-400'
        } flex-shrink-0 relative group`}
        onMouseDown={handleMouseDown}
      >
        <div
          className={`absolute ${
            isHorizontal
              ? 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
              : 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
          } w-6 h-6 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity`}
        />
      </div>

      <div
        style={{
          [isHorizontal ? 'width' : 'height']: `${100 - split}%`,
        }}
        className="flex-1 overflow-hidden"
      >
        {right}
      </div>
    </div>
  );
}
