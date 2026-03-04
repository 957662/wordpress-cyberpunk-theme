'use client';

/**
 * FloatingToolbar - 浮动工具栏组件
 * 赛博朋克风格的浮动工具栏
 */

import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useState, useRef, useEffect } from 'react';

export interface ToolItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  badge?: string | number;
}

export interface FloatingToolbarProps {
  tools: ToolItem[];
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  orientation?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
  expanded?: boolean;
  onToggle?: () => void;
  showLabel?: boolean;
  className?: string;
}

const positionStyles = {
  'bottom-right': 'bottom-6 right-6',
  'bottom-left': 'bottom-6 left-6',
  'top-right': 'top-6 right-6',
  'top-left': 'top-6 left-6',
};

const sizeStyles = {
  sm: 'p-1.5',
  md: 'p-2',
  lg: 'p-3',
};

const iconSizes = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

export function FloatingToolbar({
  tools,
  position = 'bottom-right',
  orientation = 'vertical',
  size = 'md',
  expanded = false,
  onToggle,
  showLabel = false,
  className,
}: FloatingToolbarProps) {
  const [isExpanded, setIsExpanded] = useState(expanded);
  const [isHovered, setIsHovered] = useState(false);
  const toolbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsExpanded(expanded);
  }, [expanded]);

  const handleToggle = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    onToggle?.();
  };

  const isHorizontal = orientation === 'horizontal';
  const isVertical = orientation === 'vertical';

  return (
    <div
      ref={toolbarRef}
      className={cn('fixed z-50', positionStyles[position], className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 工具栏 */}
      <div
        className={cn(
          'relative flex gap-2 rounded-2xl border border-cyber-cyan/30 bg-cyber-dark/95 backdrop-blur-md shadow-neon-cyan transition-all duration-300',
          isHorizontal ? 'flex-row' : 'flex-col',
          isExpanded && 'p-2',
          !isExpanded && 'p-1'
        )}
      >
        <AnimatePresence mode="wait">
          {isExpanded ? (
            <>
              {/* 工具项 */}
              {tools.map((tool, index) => (
                <motion.button
                  key={tool.id}
                  initial={{ opacity: 0, scale: 0.8, [isHorizontal ? 'x' : 'y']: isHorizontal ? -20 : -20 }}
                  animate={{ opacity: 1, scale: 1, [isHorizontal ? 'x' : 'y']: 0 }}
                  exit={{ opacity: 0, scale: 0.8, [isHorizontal ? 'x' : 'y']: isHorizontal ? -20 : -20 }}
                  transition={{ delay: index * 0.05, duration: 0.2 }}
                  onClick={tool.onClick}
                  disabled={tool.disabled}
                  className={cn(
                    'relative flex items-center gap-2 rounded-xl border border-cyber-cyan/20 bg-cyber-cyan/5 text-cyber-cyan transition-all duration-200 hover:bg-cyber-cyan/10 hover:border-cyber-cyan/40 hover:shadow-neon-cyan disabled:opacity-50 disabled:cursor-not-allowed',
                    sizeStyles[size],
                    isHorizontal ? 'px-3' : 'px-2'
                  )}
                  title={tool.label}
                >
                  {/* 徽章 */}
                  {tool.badge && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-cyber-pink text-[10px] font-bold text-white">
                      {tool.badge}
                    </span>
                  )}

                  {/* 图标 */}
                  <div className={cn(iconSizes[size])}>{tool.icon}</div>

                  {/* 标签 */}
                  {showLabel && (
                    <span className="text-sm font-medium font-display whitespace-nowrap">
                      {tool.label}
                    </span>
                  )}
                </motion.button>
              ))}
            </>
          ) : (
            /* 折叠状态 - 只显示主按钮 */
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={handleToggle}
              className={cn(
                'flex items-center justify-center rounded-xl border border-cyber-cyan/30 bg-cyber-cyan/10 text-cyber-cyan shadow-neon-cyan transition-all duration-200 hover:bg-cyber-cyan/20',
                sizeStyles[size]
              )}
              title="Toggle toolbar"
            >
              <svg
                className={cn(iconSizes[size])}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isHorizontal ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </motion.button>
          )}
        </AnimatePresence>

        {/* 悬停提示 */}
        {isHovered && !isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn(
              'absolute bg-cyber-dark/95 border border-cyber-cyan/30 rounded-lg px-3 py-2 whitespace-nowrap pointer-events-none',
              isHorizontal ? 'bottom-full mb-2 left-1/2 -translate-x-1/2' : 'left-full ml-2 top-1/2 -translate-y-1/2'
            )}
          >
            <p className="text-xs text-gray-400">Click to expand</p>
          </motion.div>
        )}
      </div>

      {/* 发光效果 */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={cn(
              'absolute inset-0 rounded-2xl bg-cyber-cyan/20 blur-xl -z-10',
              isExpanded && 'animate-pulse-glow'
            )}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
