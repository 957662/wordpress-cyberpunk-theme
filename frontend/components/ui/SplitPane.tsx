/**
 * 分割面板组件
 * 可拖拽调整大小的分割布局
 */

'use client';

import { useState, useRef, ReactNode, CSSProperties } from 'react';
import { cn } from '@/lib/utils';

export interface SplitPaneProps {
  children: [ReactNode, ReactNode];
  direction?: 'horizontal' | 'vertical';
  defaultSize?: number;
  minSize?: number;
  maxSize?: number;
  className?: string;
  resizerClassName?: string;
  firstPaneClassName?: string;
  secondPaneClassName?: string;
}

export function SplitPane({
  children,
  direction = 'horizontal',
  defaultSize = 50,
  minSize = 10,
  maxSize = 90,
  className,
  resizerClassName,
  firstPaneClassName,
  secondPaneClassName,
}: SplitPaneProps) {
  const [size, setSize] = useState(defaultSize);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    let newSize: number;

    if (direction === 'horizontal') {
      const containerSize = rect.width;
      newSize = ((e.clientX - rect.left) / containerSize) * 100;
    } else {
      const containerSize = rect.height;
      newSize = ((e.clientY - rect.top) / containerSize) * 100;
    }

    newSize = Math.max(minSize, Math.min(maxSize, newSize));
    setSize(newSize);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  const firstPaneStyle: CSSProperties =
    direction === 'horizontal'
      ? { width: `${size}%`, height: '100%' }
      : { width: '100%', height: `${size}%` };

  const secondPaneStyle: CSSProperties =
    direction === 'horizontal'
      ? { width: `${100 - size}%`, height: '100%' }
      : { width: '100%', height: `${100 - size}%` };

  return (
    <div
      ref={containerRef}
      className={cn(
        'flex bg-cyber-card overflow-hidden',
        direction === 'horizontal' ? 'flex-row' : 'flex-col',
        className
      )}
    >
      {/* 第一个面板 */}
      <div
        className={cn('overflow-auto', firstPaneClassName)}
        style={firstPaneStyle}
      >
        {children[0]}
      </div>

      {/* 调整大小的分隔条 */}
      <div
        onMouseDown={handleMouseDown}
        className={cn(
          'flex-shrink-0 bg-cyber-border hover:bg-cyber-cyan transition-colors cursor-col-resize',
          direction === 'horizontal' ? 'w-1 cursor-col-resize' : 'h-1 cursor-row-resize',
          isDragging && 'bg-cyber-cyan',
          resizerClassName
        )}
      >
        {/* 拖拽指示器 */}
        <div
          className={cn(
            'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
            direction === 'horizontal'
              ? 'h-8 w-2 flex flex-col items-center justify-center gap-1'
              : 'w-8 h-2 flex flex-row items-center justify-center gap-1'
          )}
        >
          {direction === 'horizontal' ? (
            <>
              <div className="w-1 h-1 bg-cyber-cyan rounded-full" />
              <div className="w-1 h-1 bg-cyber-cyan rounded-full" />
              <div className="w-1 h-1 bg-cyber-cyan rounded-full" />
            </>
          ) : (
            <>
              <div className="h-1 w-1 bg-cyber-cyan rounded-full" />
              <div className="h-1 w-1 bg-cyber-cyan rounded-full" />
              <div className="h-1 w-1 bg-cyber-cyan rounded-full" />
            </>
          )}
        </div>
      </div>

      {/* 第二个面板 */}
      <div
        className={cn('overflow-auto', secondPaneClassName)}
        style={secondPaneStyle}
      >
        {children[1]}
      </div>
    </div>
  );
}

// 三栏分割面板
export interface TripleSplitPaneProps {
  children: [ReactNode, ReactNode, ReactNode];
  direction?: 'horizontal' | 'vertical';
  firstPaneSize?: number;
  secondPaneSize?: number;
  className?: string;
}

export function TripleSplitPane({
  children,
  direction = 'horizontal',
  firstPaneSize = 33.33,
  secondPaneSize = 33.33,
  className,
}: TripleSplitPaneProps) {
  const thirdPaneSize = 100 - firstPaneSize - secondPaneSize;

  const paneStyle = (size: number): CSSProperties =>
    direction === 'horizontal'
      ? { width: `${size}%`, height: '100%' }
      : { width: '100%', height: `${size}%` };

  return (
    <div
      className={cn(
        'flex bg-cyber-card overflow-hidden',
        direction === 'horizontal' ? 'flex-row' : 'flex-col',
        className
      )}
    >
      <div className="overflow-auto" style={paneStyle(firstPaneSize)}>
        {children[0]}
      </div>

      <div
        className={cn(
          'flex-shrink-0 bg-cyber-border',
          direction === 'horizontal' ? 'w-px' : 'h-px'
        )}
      />

      <div className="overflow-auto" style={paneStyle(secondPaneSize)}>
        {children[1]}
      </div>

      <div
        className={cn(
          'flex-shrink-0 bg-cyber-border',
          direction === 'horizontal' ? 'w-px' : 'h-px'
        )}
      />

      <div className="overflow-auto" style={paneStyle(thirdPaneSize)}>
        {children[2]}
      </div>
    </div>
  );
}
