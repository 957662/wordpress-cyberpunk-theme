'use client';

import React, { useState, useRef, useEffect, MouseEvent } from 'react';
import { cn } from '@/lib/utils';

interface SplitPaneProps {
  children: [React.ReactNode, React.ReactNode];
  direction?: 'horizontal' | 'vertical';
  defaultSize?: number;
  minSize?: number;
  maxSize?: number;
  className?: string;
  showHandle?: boolean;
}

/**
 * SplitPane - 分栏面板组件
 * 可调整大小的分栏布局
 */
export const SplitPane: React.FC<SplitPaneProps> = ({
  children,
  direction = 'horizontal',
  defaultSize = 50,
  minSize = 20,
  maxSize = 80,
  className,
  showHandle = true,
}) => {
  const [size, setSize] = useState(defaultSize);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      let newSize: number;

      if (direction === 'horizontal') {
        const containerWidth = containerRect.width;
        const newWidth = ((e.clientX - containerRect.left) / containerWidth) * 100;
        newSize = newWidth;
      } else {
        const containerHeight = containerRect.height;
        const newHeight = ((e.clientY - containerRect.top) / containerHeight) * 100;
        newSize = newHeight;
      }

      setSize(Math.max(minSize, Math.min(maxSize, newSize)));
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove as any);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove as any);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, direction, minSize, maxSize]);

  const isHorizontal = direction === 'horizontal';

  return (
    <div
      ref={containerRef}
      className={cn('flex', className)}
      style={{
        flexDirection: isHorizontal ? 'row' : 'column',
      }}
    >
      <div
        style={{
          [isHorizontal ? 'width' : 'height']: `${size}%`,
        }}
        className="overflow-hidden"
      >
        {children[0]}
      </div>

      {showHandle && (
        <div
          onMouseDown={handleMouseDown}
          className={cn(
            'flex-shrink-0 bg-gray-800 hover:bg-cyan-600 transition-colors cursor-col-resize',
            isHorizontal ? 'w-1 cursor-col-resize' : 'h-1 cursor-row-resize',
            isDragging && 'bg-cyan-600'
          )}
        />
      )}

      <div
        className="flex-1 overflow-hidden"
        style={{
          [isHorizontal ? 'width' : 'height']: `${100 - size}%`,
        }}
      >
        {children[1]}
      </div>
    </div>
  );
};

export default SplitPane;
