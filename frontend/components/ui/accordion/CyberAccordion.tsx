'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export type AccordionColor = 'cyan' | 'purple' | 'pink' | 'green' | 'yellow';
export type AccordionSize = 'sm' | 'md' | 'lg';

export interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface CyberAccordionProps {
  items: AccordionItem[];
  color?: AccordionColor;
  size?: AccordionSize;
  allowMultiple?: boolean;
  defaultOpen?: string[];
  collapsible?: boolean;
  glow?: boolean;
  className?: string;
  itemClassName?: string;
}

const colorClasses = {
  cyan: {
    header: 'text-cyan-400 hover:bg-cyan-500/10 border-cyan-500/30',
    icon: 'text-cyan-400',
    content: 'bg-cyan-500/5 border-cyan-500/20',
    glow: 'shadow-[0_0_15px_rgba(0,240,255,0.3)]',
  },
  purple: {
    header: 'text-purple-400 hover:bg-purple-500/10 border-purple-500/30',
    icon: 'text-purple-400',
    content: 'bg-purple-500/5 border-purple-500/20',
    glow: 'shadow-[0_0_15px_rgba(157,0,255,0.3)]',
  },
  pink: {
    header: 'text-pink-400 hover:bg-pink-500/10 border-pink-500/30',
    icon: 'text-pink-400',
    content: 'bg-pink-500/5 border-pink-500/20',
    glow: 'shadow-[0_0_15px_rgba(255,0,128,0.3)]',
  },
  green: {
    header: 'text-green-400 hover:bg-green-500/10 border-green-500/30',
    icon: 'text-green-400',
    content: 'bg-green-500/5 border-green-500/20',
    glow: 'shadow-[0_0_15px_rgba(0,255,136,0.3)]',
  },
  yellow: {
    header: 'text-yellow-400 hover:bg-yellow-500/10 border-yellow-500/30',
    icon: 'text-yellow-400',
    content: 'bg-yellow-500/5 border-yellow-500/20',
    glow: 'shadow-[0_0_15px_rgba(240,255,0,0.3)]',
  },
};

const sizeClasses = {
  sm: {
    header: 'px-3 py-2 text-sm',
    content: 'px-3 py-2 text-sm',
  },
  md: {
    header: 'px-4 py-3 text-base',
    content: 'px-4 py-3 text-base',
  },
  lg: {
    header: 'px-6 py-4 text-lg',
    content: 'px-6 py-4 text-lg',
  },
};

export const CyberAccordion: React.FC<CyberAccordionProps> = ({
  items,
  color = 'cyan',
  size = 'md',
  allowMultiple = false,
  defaultOpen = [],
  collapsible = true,
  glow = false,
  className,
  itemClassName,
}) => {
  const [openItems, setOpenItems] = useState<string[]>(defaultOpen);

  const toggleItem = (id: string) => {
    setOpenItems((prev) => {
      const isOpen = prev.includes(id);

      if (!allowMultiple) {
        // 单选模式：关闭其他所有项
        return isOpen && collapsible ? [] : [id];
      } else {
        // 多选模式
        if (isOpen) {
          return collapsible ? prev.filter((item) => item !== id) : prev;
        } else {
          return [...prev, id];
        }
      }
    });
  };

  const colorClass = colorClasses[color];
  const sizeClass = sizeClasses[size];

  return (
    <div className={cn('w-full space-y-2', className)}>
      {items.map((item) => {
        const isOpen = openItems.includes(item.id);

        return (
          <div
            key={item.id}
            className={cn(
              'overflow-hidden rounded-lg border-2 transition-all duration-200',
              isOpen && colorClass.glow,
              glow && isOpen && colorClass.glow,
              itemClassName
            )}
          >
            {/* 标题 */}
            <button
              onClick={() => !item.disabled && toggleItem(item.id)}
              disabled={item.disabled}
              className={cn(
                'flex items-center justify-between w-full',
                'border-2 transition-all duration-200',
                'focus:outline-none focus:ring-2 focus:ring-cyan-500/50',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                sizeClass.header,
                isOpen ? colorClass.header : 'text-gray-400 hover:bg-white/5 border-white/10'
              )}
            >
              <div className="flex items-center gap-3">
                {/* 图标 */}
                {item.icon && (
                  <span className={cn('flex-shrink-0', colorClass.icon)}>
                    {item.icon}
                  </span>
                )}

                {/* 标题 */}
                <span className="font-semibold">{item.title}</span>
              </div>

              {/* 箭头图标 */}
              <motion.div
                animate={{ rotate: isOpen ? 90 : 0 }}
                transition={{ duration: 0.2 }}
                className={cn('flex-shrink-0', colorClass.icon)}
              >
                <ChevronRight className="h-5 w-5" />
              </motion.div>
            </button>

            {/* 内容 */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div
                    className={cn(
                      'border-t-2',
                      sizeClass.content,
                      colorClass.content
                    )}
                  >
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 装饰线 */}
            {isOpen && (
              <motion.div
                className={cn(
                  'absolute left-0 top-0 h-full w-[2px]',
                  colorClass.icon.replace('text-', 'bg-')
                )}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

// 手风琴项（单独使用）
export interface AccordionItemProps {
  item: AccordionItem;
  isOpen: boolean;
  onToggle: () => void;
  color?: AccordionColor;
  size?: AccordionSize;
  glow?: boolean;
  className?: string;
}

export const AccordionItem: React.FC<AccordionItemProps> = ({
  item,
  isOpen,
  onToggle,
  color = 'cyan',
  size = 'md',
  glow = false,
  className,
}) => {
  const colorClass = colorClasses[color];
  const sizeClass = sizeClasses[size];

  return (
    <div
      className={cn(
        'overflow-hidden rounded-lg border-2 transition-all duration-200',
        isOpen && colorClass.glow,
        glow && isOpen && colorClass.glow,
        className
      )}
    >
      <button
        onClick={() => !item.disabled && onToggle()}
        disabled={item.disabled}
        className={cn(
          'flex items-center justify-between w-full',
          'border-2 transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-cyan-500/50',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          sizeClass.header,
          isOpen ? colorClass.header : 'text-gray-400 hover:bg-white/5 border-white/10'
        )}
      >
        <div className="flex items-center gap-3">
          {item.icon && (
            <span className={cn('flex-shrink-0', colorClass.icon)}>
              {item.icon}
            </span>
          )}
          <span className="font-semibold">{item.title}</span>
        </div>

        <motion.div
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.2 }}
          className={cn('flex-shrink-0', colorClass.icon)}
        >
          <ChevronRight className="h-5 w-5" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div
              className={cn(
                'border-t-2',
                sizeClass.content,
                colorClass.content
              )}
            >
              {item.content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CyberAccordion;
