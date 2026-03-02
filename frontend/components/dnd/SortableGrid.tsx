/**
 * 可拖拽排序网格组件
 * 支持网格布局拖拽、自动调整、动画效果
 */

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import {
  GripVertical,
  X,
  Plus,
  Grid3x3,
  List
} from 'lucide-react';

export interface SortableGridItem {
  id: string;
  content: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

export interface SortableGridProps {
  items: SortableGridItem[];
  onChange?: (items: SortableGridItem[]) => void;
  onRemove?: (id: string) => void;
  onAdd?: () => void;
  columns?: number;
  gap?: number;
  showHandles?: boolean;
  showRemove?: boolean;
  allowResize?: boolean;
  className?: string;
}

export function SortableGrid({
  items,
  onChange,
  onRemove,
  onAdd,
  columns = 3,
  gap = 16,
  showHandles = true,
  showRemove = true,
  allowResize = false,
  className
}: SortableGridProps) {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dragOverItem, setDragOverItem] = useState<string | null>(null);
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedItem(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    if (draggedItem && draggedItem !== id) {
      setDragOverItem(id);
    }
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverItem(null);
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();

    if (draggedItem && draggedItem !== targetId && onChange) {
      const newItems = [...items];
      const draggedIndex = newItems.findIndex(item => item.id === draggedItem);
      const targetIndex = newItems.findIndex(item => item.id === targetId);

      const [removed] = newItems.splice(draggedIndex, 1);
      newItems.splice(targetIndex, 0, removed);

      onChange(newItems);
    }

    setDraggedItem(null);
    setDragOverItem(null);
  };

  const handleRemove = (id: string) => {
    if (onRemove) {
      onRemove(id);
    }
  };

  const handleResize = (id: string) => {
    if (!allowResize || !onChange) return;

    const newItems = items.map(item => {
      if (item.id === id) {
        const sizes: ('small' | 'medium' | 'large')[] = ['small', 'medium', 'large'];
        const currentIndex = sizes.indexOf(item.size || 'medium');
        const nextIndex = (currentIndex + 1) % sizes.length;
        return { ...item, size: sizes[nextIndex] };
      }
      return item;
    });

    onChange(newItems);
  };

  const getSizeClasses = (size?: string) => {
    switch (size) {
      case 'small':
        return 'col-span-1 row-span-1';
      case 'large':
        return 'col-span-2 row-span-2';
      default:
        return 'col-span-1 row-span-1';
    }
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap: `${gap}px`
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* 工具栏 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setLayout('grid')}
            className={cn(
              'p-2 rounded-md transition-colors',
              layout === 'grid'
                ? 'bg-cyber-cyan text-cyber-dark'
                : 'bg-cyber-card text-cyber-muted hover:text-cyber-cyan'
            )}
          >
            <Grid3x3 className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setLayout('list')}
            className={cn(
              'p-2 rounded-md transition-colors',
              layout === 'list'
                ? 'bg-cyber-cyan text-cyber-dark'
                : 'bg-cyber-card text-cyber-muted hover:text-cyber-cyan'
            )}
          >
            <List className="w-4 h-4" />
          </motion.button>
        </div>

        {onAdd && (
          <Button
            variant="outline"
            size="sm"
            onClick={onAdd}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            添加
          </Button>
        )}
      </div>

      {/* 网格内容 */}
      {items.length === 0 ? (
        <Card className="p-12 text-center text-cyber-muted">
          <Grid3x3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>暂无项目</p>
        </Card>
      ) : (
        <div
          style={gridStyle}
          className={layout === 'list' ? 'grid grid-cols-1 gap-4' : ''}
        >
          {items.map((item) => (
            <motion.div
              key={item.id}
              draggable
              onDragStart={(e) => handleDragStart(e, item.id)}
              onDragOver={(e) => handleDragOver(e, item.id)}
              onDragEnd={handleDragEnd}
              onDrop={(e) => handleDrop(e, item.id)}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className={cn(
                'relative',
                layout === 'grid' && getSizeClasses(item.size),
                draggedItem === item.id && 'opacity-50',
                dragOverItem === item.id && 'ring-2 ring-cyber-cyan'
              )}
            >
              <Card
                className={cn(
                  'h-full transition-all hover:shadow-lg',
                  draggedItem === item.id && 'cursor-grabbing shadow-xl'
                )}
                style={{
                  backgroundColor: item.color ? `${item.color}20` : undefined,
                  border: item.color ? `2px solid ${item.color}` : undefined
                }}
              >
                <div className="p-4 h-full flex flex-col">
                  {/* 头部 */}
                  <div className="flex items-center justify-between mb-3">
                    {showHandles && (
                      <motion.div
                        className="cursor-grab active:cursor-grabbing"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <GripVertical className="w-5 h-5 text-cyber-muted" />
                      </motion.div>
                    )}

                    {allowResize && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleResize(item.id)}
                        className="ml-auto"
                      >
                        {item.size === 'small' ? 'S' : item.size === 'large' ? 'L' : 'M'}
                      </Button>
                    )}

                    {showRemove && onRemove && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleRemove(item.id)}
                        className="ml-2 p-1 rounded hover:bg-red-500/20 transition-colors"
                      >
                        <X className="w-4 h-4 text-red-500" />
                      </motion.button>
                    )}
                  </div>

                  {/* 内容 */}
                  <div className="flex-1 overflow-auto">
                    {typeof item.content === 'string' ? (
                      <p className="text-sm whitespace-pre-wrap">{item.content}</p>
                    ) : (
                      item.content
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
