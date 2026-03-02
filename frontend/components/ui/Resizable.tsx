/**
 * Resizable Component - 可调整大小组件
 * 允许用户通过拖动边框来调整组件大小
 */

'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface ResizableProps {
  children: React.ReactNode;
  className?: string;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  initialWidth?: number;
  initialHeight?: number;
  enable?: {
    top?: boolean;
    right?: boolean;
    bottom?: boolean;
    left?: boolean;
    topRight?: boolean;
    bottomRight?: boolean;
    bottomLeft?: boolean;
    topLeft?: boolean;
  };
  onResize?: (size: { width: number; height: number }) => void;
  onResizeStart?: () => void;
  onResizeEnd?: () => void;
  resizeHandlesClass?: string;
}

export function Resizable({
  children,
  className,
  minWidth = 100,
  maxWidth = Infinity,
  minHeight = 100,
  maxHeight = Infinity,
  initialWidth,
  initialHeight,
  enable = {
    right: true,
    bottom: true,
    bottomRight: true,
  },
  onResize,
  onResizeStart,
  onResizeEnd,
  resizeHandlesClass,
}: ResizableProps) {
  const [size, setSize] = useState({ width: initialWidth, height: initialHeight });
  const [isResizing, setIsResizing] = useState(false);
  const [direction, setDirection] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);
  const startPos = useRef({ x: 0, y: 0 });
  const startSize = useRef({ width: 0, height: 0 });

  // 计算新大小
  const calculateSize = useCallback(
    (deltaX: number, deltaY: number, dir: string) => {
      let newWidth = startSize.current.width || 0;
      let newHeight = startSize.current.height || 0;

      if (dir.includes('right')) {
        newWidth = Math.min(
          Math.max(newWidth + deltaX, minWidth),
          maxWidth
        );
      }
      if (dir.includes('left')) {
        newWidth = Math.min(
          Math.max(newWidth - deltaX, minWidth),
          maxWidth
        );
      }
      if (dir.includes('bottom')) {
        newHeight = Math.min(
          Math.max(newHeight + deltaY, minHeight),
          maxHeight
        );
      }
      if (dir.includes('top')) {
        newHeight = Math.min(
          Math.max(newHeight - deltaY, minHeight),
          maxHeight
        );
      }

      return { width: newWidth, height: newHeight };
    },
    [minWidth, maxWidth, minHeight, maxHeight]
  );

  // 开始调整大小
  const handleMouseDown = (e: React.MouseEvent, dir: string) => {
    e.preventDefault();
    e.stopPropagation();

    setIsResizing(true);
    setDirection(dir);
    startPos.current = { x: e.clientX, y: e.clientY };

    if (containerRef.current) {
      startSize.current = {
        width: containerRef.current.offsetWidth,
        height: containerRef.current.offsetHeight,
      };
    }

    onResizeStart?.();
  };

  // 鼠标移动处理
  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startPos.current.x;
      const deltaY = e.clientY - startPos.current.y;
      const newSize = calculateSize(deltaX, deltaY, direction);

      setSize(newSize);
      onResize?.(newSize);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      setDirection('');
      onResizeEnd?.();
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, direction, calculateSize, onResize, onResizeEnd]);

  // 渲染调整大小的手柄
  const renderHandle = (dir: string, className: string) => (
    <div
      onMouseDown={e => handleMouseDown(e, dir)}
      className={cn(
        "absolute bg-transparent hover:bg-cyber-cyan/30 transition-colors z-10",
        className,
        resizeHandlesClass
      )}
    />
  );

  return (
    <div
      ref={containerRef}
      className={cn("relative", className)}
      style={{
        width: size.width || undefined,
        height: size.height || undefined,
        minWidth: !size.width ? minWidth : undefined,
        minHeight: !size.height ? minHeight : undefined,
      }}
    >
      {children}

      {/* 调整大小的手柄 */}
      {enable.top && renderHandle('top', 'top-0 left-0 right-0 h-1 cursor-n-resize')}
      {enable.right && renderHandle('right', 'top-0 bottom-0 right-0 w-1 cursor-e-resize')}
      {enable.bottom && renderHandle('bottom', 'bottom-0 left-0 right-0 h-1 cursor-s-resize')}
      {enable.left && renderHandle('left', 'top-0 bottom-0 left-0 w-1 cursor-w-resize')}
      {enable.topRight && renderHandle('topRight', 'top-0 right-0 w-3 h-3 cursor-ne-resize rounded-tr-sm')}
      {enable.bottomRight && renderHandle('bottomRight', 'bottom-0 right-0 w-3 h-3 cursor-se-resize rounded-br-sm')}
      {enable.bottomLeft && renderHandle('bottomLeft', 'bottom-0 left-0 w-3 h-3 cursor-sw-resize rounded-bl-sm')}
      {enable.topLeft && renderHandle('topLeft', 'top-0 left-0 w-3 h-3 cursor-nw-resize rounded-tl-sm')}

      {/* 调整大小时的指示器 */}
      {isResizing && (
        <div className="absolute inset-0 border-2 border-cyber-cyan pointer-events-none rounded-lg" />
      )}
    </div>
  );
}

/**
 * ResizablePanel Component - 可调整大小的面板
 * 带有标题和内容的可调整大小面板
 */
export interface ResizablePanelProps extends Omit<ResizableProps, 'children'> {
  title?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  contentClassName?: string;
}

export function ResizablePanel({
  title,
  header,
  footer,
  contentClassName,
  ...resizableProps
}: ResizablePanelProps) {
  return (
    <Resizable {...resizableProps}>
      <div className="h-full flex flex-col bg-cyber-card border border-cyber-border rounded-lg overflow-hidden">
        {/* 标题栏 */}
        {(title || header) && (
          <div className="flex items-center justify-between px-4 py-3 border-b border-cyber-border">
            {title && (
              <h3 className="text-lg font-semibold text-cyber-text">{title}</h3>
            )}
            {header}
          </div>
        )}

        {/* 内容区域 */}
        <div className={cn("flex-1 overflow-auto p-4", contentClassName)}>
          {resizableProps.children}
        </div>

        {/* 底部栏 */}
        {footer && (
          <div className="px-4 py-3 border-t border-cyber-border">
            {footer}
          </div>
        )}
      </div>
    </Resizable>
  );
}
