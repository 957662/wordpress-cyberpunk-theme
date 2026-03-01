/**
 * Widget 基础组件
 * 所有 Widget 组件的基类
 */

'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { forwardRef, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface WidgetProps extends Omit<HTMLMotionProps<'div'>, 'ref'> {
  /** Widget 标题 */
  title?: string;
  /** Widget 标题旁边的图标 */
  icon?: ReactNode;
  /** Widget 操作按钮区域 */
  actions?: ReactNode;
  /** 是否可折叠 */
  collapsible?: boolean;
  /** 是否默认折叠 */
  defaultCollapsed?: boolean;
  /** 是否可拖拽 */
  draggable?: boolean;
  /** 自定义类名 */
  className?: string;
  /** 子元素 */
  children: ReactNode;
}

export const Widget = forwardRef<HTMLDivElement, WidgetProps>(
  ({
    title,
    icon,
    actions,
    collapsible = false,
    defaultCollapsed = false,
    draggable = false,
    className,
    children,
    ...props
  }, ref) => {
    const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={cn(
          'cyber-card relative',
          draggable && 'cursor-move',
          className
        )}
        {...props}
      >
        {/* Widget Header */}
        {(title || icon || actions || collapsible) && (
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-cyber-border">
            <div className="flex items-center gap-2">
              {icon && (
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="text-cyber-cyan"
                >
                  {icon}
                </motion.div>
              )}
              {title && (
                <h3 className="font-display font-bold text-lg text-white">
                  {title}
                </h3>
              )}
            </div>

            <div className="flex items-center gap-2">
              {actions}
              {collapsible && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="p-1 text-gray-400 hover:text-cyber-cyan transition-colors"
                  aria-label={isCollapsed ? '展开' : '折叠'}
                >
                  <motion.svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    animate={{ rotate: isCollapsed ? -90 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </motion.svg>
                </motion.button>
              )}
            </div>
          </div>
        )}

        {/* Widget Content */}
        <motion.div
          initial={false}
          animate={{
            height: isCollapsed ? 0 : 'auto',
            opacity: isCollapsed ? 0 : 1,
          }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          {children}
        </motion.div>

        {/* 装饰性边框 */}
        <div className="absolute top-0 left-0 w-2 h-2 border-l-2 border-t-2 border-cyber-cyan" />
        <div className="absolute top-0 right-0 w-2 h-2 border-r-2 border-t-2 border-cyber-purple" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-l-2 border-b-2 border-cyber-purple" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-r-2 border-b-2 border-cyber-cyan" />
      </motion.div>
    );
  }
);

Widget.displayName = 'Widget';

function useState<T>(initial: T): [T, (value: T) => void] {
  return React.useState(initial);
}

import React from 'react';
