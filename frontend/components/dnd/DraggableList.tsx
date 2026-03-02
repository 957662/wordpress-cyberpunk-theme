/**
 * 可拖拽排序列表组件
 * 支持拖拽排序、动画效果、自定义渲染
 */

'use client';

import React, { useState } from 'react';
import { motion, Reorder } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import {
  GripVertical,
  Trash2,
  Plus,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

export interface DraggableItem {
  id: string;
  content: React.ReactNode;
  metadata?: Record<string, any>;
}

export interface DraggableListProps {
  items: DraggableItem[];
  onChange?: (items: DraggableItem[]) => void;
  onRemove?: (id: string) => void;
  onAdd?: () => void;
  showHandles?: boolean;
  showRemove?: boolean;
  showArrows?: boolean;
  placeholder?: string;
  className?: string;
  renderItem?: (item: DraggableItem, index: number) => React.ReactNode;
}

export function DraggableList({
  items,
  onChange,
  onRemove,
  onAdd,
  showHandles = true,
  showRemove = true,
  showArrows = false,
  placeholder = '拖拽排序',
  className,
  renderItem
}: DraggableListProps) {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const handleReorder = (newItems: DraggableItem[]) => {
    if (onChange) {
      onChange(newItems);
    }
  };

  const handleMoveUp = (index: number) => {
    if (index > 0 && onChange) {
      const newItems = [...items];
      [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
      onChange(newItems);
    }
  };

  const handleMoveDown = (index: number) => {
    if (index < items.length - 1 && onChange) {
      const newItems = [...items];
      [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
      onChange(newItems);
    }
  };

  const handleRemove = (id: string) => {
    if (onRemove) {
      onRemove(id);
    }
  };

  return (
    <div className={cn('space-y-2', className)}>
      {items.length === 0 ? (
        <Card className="p-8 text-center text-cyber-muted">
          {placeholder}
        </Card>
      ) : (
        <Reorder.Group
          axis="y"
          values={items}
          onReorder={handleReorder}
          className="space-y-2"
        >
          {items.map((item, index) => (
            <Reorder.Item
              key={item.id}
              value={item}
              id={item.id}
              onDragStart={() => setDraggedItem(item.id)}
              onDragEnd={() => setDraggedItem(null)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              whileDrag={{ scale: 1.02, boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}
              className="relative"
            >
              <Card
                className={cn(
                  'p-4 cursor-grab active:cursor-grabbing transition-shadow',
                  draggedItem === item.id && 'shadow-lg'
                )}
              >
                <div className="flex items-center gap-3">
                  {/* 拖拽手柄 */}
                  {showHandles && (
                    <motion.div
                      className="flex-shrink-0 cursor-grab active:cursor-grabbing"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <GripVertical className="w-5 h-5 text-cyber-muted" />
                    </motion.div>
                  )}

                  {/* 内容 */}
                  <div className="flex-1 min-w-0">
                    {renderItem ? (
                      renderItem(item, index)
                    ) : (
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{item.content}</span>
                        <span className="text-xs text-cyber-muted">
                          #{index + 1}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex items-center gap-1">
                    {showArrows && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMoveUp(index)}
                          disabled={index === 0}
                          leftIcon={<ChevronUp className="w-4 h-4" />}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMoveDown(index)}
                          disabled={index === items.length - 1}
                          leftIcon={<ChevronDown className="w-4 h-4" />}
                        />
                      </>
                    )}

                    {showRemove && onRemove && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemove(item.id)}
                        leftIcon={<Trash2 className="w-4 h-4 text-red-500" />}
                      />
                    )}
                  </div>
                </div>
              </Card>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      )}

      {/* 添加按钮 */}
      {onAdd && (
        <motion.div
          className="flex justify-center mt-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Button
            variant="outline"
            onClick={onAdd}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            添加项目
          </Button>
        </motion.div>
      )}
    </div>
  );
}
