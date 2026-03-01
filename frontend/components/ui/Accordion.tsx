/**
 * 手风琴组件
 * 可折叠的内容区域
 */

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon } from '@/components/icons';
import { cn } from '@/lib/utils';

export interface AccordionItem {
  /** 唯一标识 */
  id: string;
  /** 标题 */
  title: string;
  /** 内容 */
  content: React.ReactNode;
  /** 是否禁用 */
  disabled?: boolean;
  /** 图标 */
  icon?: React.ReactNode;
}

export interface AccordionProps {
  /** 手风琴项目 */
  items: AccordionItem[];
  /** 是否允许多个展开 */
  multiple?: boolean;
  /** 默认展开的项目 */
  defaultExpanded?: string[];
  /** 边框颜色 */
  color?: 'cyan' | 'purple' | 'pink' | 'yellow';
  /** 自定义类名 */
  className?: string;
}

const colorStyles = {
  cyan: 'border-cyber-cyan text-cyber-cyan',
  purple: 'border-cyber-purple text-cyber-purple',
  pink: 'border-cyber-pink text-cyber-pink',
  yellow: 'border-cyber-yellow text-cyber-yellow',
};

export function Accordion({
  items,
  multiple = false,
  defaultExpanded = [],
  color = 'cyan',
  className,
}: AccordionProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>(defaultExpanded);

  const toggleItem = (itemId: string) => {
    if (multiple) {
      setExpandedItems(prev =>
        prev.includes(itemId)
          ? prev.filter(id => id !== itemId)
          : [...prev, itemId]
      );
    } else {
      setExpandedItems(prev =>
        prev.includes(itemId) ? [] : [itemId]
      );
    }
  };

  return (
    <div className={cn('space-y-2', className)}>
      {items.map((item) => {
        const isExpanded = expandedItems.includes(item.id);

        return (
          <motion.div
            key={item.id}
            className="cyber-card overflow-hidden"
            initial={false}
          >
            {/* 触发按钮 */}
            <motion.button
              whileHover={{ scale: item.disabled ? 1 : 1.01 }}
              whileTap={{ scale: item.disabled ? 1 : 0.99 }}
              onClick={() => !item.disabled && toggleItem(item.id)}
              disabled={item.disabled}
              className={cn(
                'w-full flex items-center justify-between p-4',
                'text-left transition-colors',
                item.disabled && 'opacity-50 cursor-not-allowed',
                !item.disabled && 'hover:text-cyber-cyan'
              )}
            >
              <div className="flex items-center gap-3">
                {item.icon && (
                  <span className={cn(
                    'flex-shrink-0',
                    colorStyles[color]
                  )}>
                    {item.icon}
                  </span>
                )}
                <span className="font-medium text-white">{item.title}</span>
              </div>

              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className={cn(
                  'flex-shrink-0',
                  colorStyles[color]
                )}
              >
                <ChevronDownIcon className="w-5 h-5" />
              </motion.div>
            </motion.button>

            {/* 内容区域 */}
            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 pt-0 text-gray-400">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
