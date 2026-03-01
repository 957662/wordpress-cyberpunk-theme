/**
 * 拖拽组件
 * 支持拖放功能的容器
 */

'use client';

import { useState, useRef, ReactNode, cloneElement, ReactElement } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface DraggableItem {
  id: string | number;
  content: ReactNode;
}

export interface DraggableProps {
  items: DraggableItem[];
  onChange?: (items: DraggableItem[]) => void;
  orientation?: 'horizontal' | 'vertical';
  itemClassName?: string;
  className?: string;
  renderItem?: (item: DraggableItem, index: number) => ReactNode;
}

export function Draggable({
  items,
  onChange,
  orientation = 'vertical',
  itemClassName,
  className,
  renderItem,
}: DraggableProps) {
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const dragStartPos = useRef({ x: 0, y: 0 });

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggingIndex(index);
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggingIndex === null || draggingIndex === index) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const isHorizontal = orientation === 'horizontal';

    const offset = isHorizontal
      ? e.clientX - dragStartPos.current.x
      : e.clientY - dragStartPos.current.y;

    const threshold = isHorizontal ? rect.width / 2 : rect.height / 2;

    if (Math.abs(offset) > threshold) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggingIndex === null || draggingIndex === dropIndex) return;

    const newItems = [...items];
    const [draggedItem] = newItems.splice(draggingIndex, 1);
    newItems.splice(dropIndex, 0, draggedItem);

    onChange?.(newItems);
    setDraggingIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggingIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div
      className={cn(
        'flex gap-2',
        orientation === 'horizontal' ? 'flex-row' : 'flex-col',
        className
      )}
    >
      {items.map((item, index) => {
        const isDragging = draggingIndex === index;
        const isDragOver = dragOverIndex === index;

        const defaultContent = (
          <motion.div
            drag
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            dragElastic={0.1}
            whileDrag={{ scale: 1.05, zIndex: 10 }}
            className={cn(
              'cursor-move select-none p-4 rounded-lg border-2 transition-all',
              'bg-cyber-card border-cyber-border hover:border-cyber-cyan',
              isDragging && 'border-cyber-cyan shadow-neon-cyan',
              isDragOver && 'border-dashed border-cyber-cyan',
              itemClassName
            )}
          >
            {item.content}
          </motion.div>
        );

        return (
          <div
            key={item.id}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
            className="flex-shrink-0"
          >
            {renderItem ? renderItem(item, index) : defaultContent}
          </div>
        );
      })}
    </div>
  );
}

// 拖放区域组件
export interface DropZoneProps {
  onDrop: (data: any) => void;
  children?: ReactNode;
  accept?: string[];
  multiple?: boolean;
  disabled?: boolean;
  className?: string;
  isDragging?: boolean;
}

export function DropZone({
  onDrop,
  children,
  accept,
  multiple = false,
  disabled = false,
  className,
  isDragging: isDraggingProp,
}: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (disabled) return;

    const data = e.dataTransfer;
    const items: any[] = [];

    // 处理文件
    if (data.files && data.files.length > 0) {
      const files = Array.from(data.files);

      // 检查文件类型
      if (accept) {
        const acceptedFiles = files.filter((file) => {
          const extension = file.name.split('.').pop()?.toLowerCase();
          return accept.includes(`.${extension}`);
        });

        if (!multiple) {
          onDrop(acceptedFiles[0]);
        } else {
          onDrop(acceptedFiles);
        }
      } else {
        if (!multiple) {
          onDrop(files[0]);
        } else {
          onDrop(files);
        }
      }
    }
  };

  const showDragging = isDraggingProp ?? isDragging;

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={cn(
        'relative rounded-lg border-2 border-dashed transition-all',
        'bg-cyber-card/50 border-cyber-border',
        isDragOver && 'border-cyber-cyan bg-cyber-cyan/10',
        disabled && 'opacity-50 cursor-not-allowed',
        !disabled && !children && 'cursor-pointer',
        className
      )}
    >
      {children || (
        <div className="flex flex-col items-center justify-center py-12 text-cyber-muted">
          <svg
            className="w-12 h-12 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <p className="text-sm">
            {isDragOver ? '释放以上传' : '拖拽文件到此处'}
          </p>
        </div>
      )}
    </div>
  );
}

// 可排序列表项
export interface SortableItemProps {
  id: string | number;
  children: ReactNode;
  className?: string;
}

export function SortableItem({ id, children, className }: SortableItemProps) {
  return (
    <div className={className} data-id={id}>
      {children}
    </div>
  );
}
