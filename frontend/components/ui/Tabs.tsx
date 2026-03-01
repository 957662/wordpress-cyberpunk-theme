/**
 * 标签页组件
 * 支持水平、垂直和图标标签页
 */

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface Tab {
  /** 标签值 */
  value: string;
  /** 标签标题 */
  label: string;
  /** 图标 */
  icon?: React.ReactNode;
  /** 是否禁用 */
  disabled?: boolean;
  /** 徽章 */
  badge?: string | number;
}

export interface TabsProps {
  /** 标签列表 */
  tabs: Tab[];
  /** 当前激活的标签 */
  value?: string;
  /** 值变化回调 */
  onChange?: (value: string) => void;
  /** 标签页方向 */
  orientation?: 'horizontal' | 'vertical';
  /** 变体样式 */
  variant?: 'line' | 'enclosed' | 'soft';
  /** 自定义类名 */
  className?: string;
  /** 内容区域自定义类名 */
  contentClassName?: string;
}

export function Tabs({
  tabs,
  value: controlledValue,
  onChange,
  orientation = 'horizontal',
  variant = 'line',
  className,
  contentClassName,
}: TabsProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState(tabs[0]?.value);
  const activeTab = controlledValue ?? uncontrolledValue;

  const handleTabChange = (tabValue: string) => {
    const tab = tabs.find(t => t.value === tabValue);
    if (tab && !tab.disabled) {
      onChange?.(tabValue);
      if (!controlledValue) {
        setUncontrolledValue(tabValue);
      }
    }
  };

  const variants = {
    line: 'bg-transparent border-b-2 border-transparent',
    enclosed: 'bg-cyber-muted border border-cyber-border',
    soft: 'bg-cyber-dark/50',
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* 标签导航 */}
      <div
        className={cn(
          'flex gap-1',
          orientation === 'horizontal' ? 'flex-row' : 'flex-col'
        )}
        role="tablist"
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.value;

          return (
            <motion.button
              key={tab.value}
              whileHover={{ scale: tab.disabled ? 1 : 1.02 }}
              whileTap={{ scale: tab.disabled ? 1 : 0.98 }}
              onClick={() => handleTabChange(tab.value)}
              disabled={tab.disabled}
              className={cn(
                'relative flex items-center gap-2 px-4 py-2 rounded-lg',
                'font-medium transition-all duration-200',
                'focus:outline-none focus:ring-2 focus:ring-cyber-cyan',
                variants[variant],
                isActive
                  ? 'text-cyber-cyan bg-cyber-cyan/10'
                  : 'text-gray-400 hover:text-gray-300',
                tab.disabled && 'opacity-50 cursor-not-allowed'
              )}
              role="tab"
              aria-selected={isActive}
            >
              {tab.icon && (
                <span className={cn(isActive && 'text-cyber-cyan')}>
                  {tab.icon}
                </span>
              )}
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="px-2 py-0.5 text-xs rounded-full bg-cyber-cyan/20 text-cyber-cyan">
                  {tab.badge}
                </span>
              )}

              {/* 激活指示器 */}
              {isActive && variant === 'line' && (
                <motion.div
                  layoutId="activeTab"
                  className={cn(
                    'absolute bottom-0 left-0 right-0 h-0.5 bg-cyber-cyan',
                    'shadow-neon-cyan'
                  )}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* 标签内容 */}
      <AnimatePresence mode="wait">
        {tabs.map((tab) => {
          if (tab.value !== activeTab) return null;

          return (
            <motion.div
              key={tab.value}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className={contentClassName}
              role="tabpanel"
            >
              {tab.children}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
