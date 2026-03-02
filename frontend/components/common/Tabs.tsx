/**
 * 标签页组件
 * 支持垂直和水平布局
 */

'use client';

import React, { useState, Children, cloneElement, ReactElement } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface TabsProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  variant?: 'default' | 'pills' | 'underline';
}

/**
 * 标签页容器组件
 */
export function Tabs({
  defaultValue,
  value: controlledValue,
  onValueChange,
  children,
  className,
  orientation = 'horizontal',
  variant = 'default'
}: TabsProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue || '');

  const value = controlledValue !== undefined ? controlledValue : uncontrolledValue;

  const handleValueChange = (newValue: string) => {
    if (controlledValue === undefined) {
      setUncontrolledValue(newValue);
    }
    onValueChange?.(newValue);
  };

  // 过滤并克隆 TabList 和 TabPanels
  const tabList = Children.toArray(children).find(
    (child) => (child as ReactElement).type === TabsList
  );

  const tabPanels = Children.toArray(children).filter(
    (child) => (child as ReactElement).type === TabsPanel
  );

  return (
    <div className={cn('cyber-tabs', className)}>
      {tabList &&
        cloneElement(tabList as ReactElement, {
          value,
          onValueChange: handleValueChange,
          orientation,
          variant
        })}
      <AnimatePresence mode="wait">
        {tabPanels.map((panel) =>
          cloneElement(panel as ReactElement, {
            key: (panel as ReactElement).props.value,
            value,
            orientation
          })
        )}
      </AnimatePresence>
    </div>
  );
}

export interface TabsListProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  variant?: 'default' | 'pills' | 'underline';
}

/**
 * 标签列表组件
 */
export function TabsList({
  value,
  onValueChange,
  children,
  className,
  orientation = 'horizontal',
  variant = 'default'
}: TabsListProps) {
  const isHorizontal = orientation === 'horizontal';

  const listStyles = cn(
    'flex',
    isHorizontal ? 'flex-row' : 'flex-col',
    {
      'default': 'border-b border-cyber-muted/30',
      'pills': 'gap-2',
      'underline': 'border-b border-cyber-muted/30'
    }[variant],
    className
  );

  return (
    <div className={listStyles}>
      {Children.map(children, (child) =>
        cloneElement(child as ReactElement, {
          value,
          onValueChange,
          orientation,
          variant
        })
      )}
    </div>
  );
}

export interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

/**
 * 标签触发器组件
 */
export function TabsTrigger({
  value: triggerValue,
  children,
  className,
  disabled = false,
  icon
}: TabsTriggerProps) {
  // 这些 props 会从 TabsList 传递过来
  const { value, onValueChange, orientation, variant } = (TabsTrigger as any).__context || {
    value: '',
    onValueChange: () => {},
    orientation: 'horizontal',
    variant: 'default'
  };

  const isActive = value === triggerValue;

  const baseStyles = cn(
    'relative px-4 py-2 text-sm font-medium transition-colors',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'flex items-center gap-2'
  );

  const variantStyles = {
    default: cn(
      'text-gray-400 hover:text-white',
      isActive && 'text-cyber-cyan',
      isActive && 'border-b-2 border-cyber-cyan'
    ),
    pills: cn(
      'rounded-lg',
      isActive ? 'bg-cyber-cyan text-cyber-dark' : 'text-gray-400 hover:bg-cyber-muted/30'
    ),
    underline: cn(
      'text-gray-400 hover:text-white',
      isActive && 'text-cyber-cyan',
      isActive && 'border-b-2 border-cyber-cyan -mb-px'
    )
  };

  const handleClick = () => {
    if (!disabled) {
      onValueChange(triggerValue);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={cn(baseStyles, variantStyles[variant as keyof typeof variantStyles], className)}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>
  );
}

export interface TabsPanelProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * 标签面板组件
 */
export function TabsPanel({
  value: panelValue,
  children,
  className
}: TabsPanelProps) {
  // 这些 props 会从 Tabs 传递过来
  const { value } = (TabsPanel as any).__context || { value: '' };

  const isActive = value === panelValue;

  if (!isActive) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * 快速使用组件 - 简化版本
 */
export interface QuickTabsProps {
  tabs: Array<{
    value: string;
    label: string;
    icon?: React.ReactNode;
    content: React.ReactNode;
    disabled?: boolean;
  }>;
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  variant?: 'default' | 'pills' | 'underline';
}

export function QuickTabs({
  tabs,
  defaultValue,
  value,
  onChange,
  className,
  variant = 'default'
}: QuickTabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue || tabs[0]?.value || '');
  const activeValue = value !== undefined ? value : internalValue;

  return (
    <div className={className}>
      {/* 标签列表 */}
      <div
        className={cn(
          'flex',
          {
            'default': 'border-b border-cyber-muted/30',
            'pills': 'gap-2',
            'underline': 'border-b border-cyber-muted/30'
          }[variant]
        )}
      >
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => {
              if (!tab.disabled) {
                setInternalValue(tab.value);
                onChange?.(tab.value);
              }
            }}
            disabled={tab.disabled}
            className={cn(
              'relative px-4 py-2 text-sm font-medium transition-colors flex items-center gap-2',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              {
                'default': cn(
                  'text-gray-400 hover:text-white',
                  activeValue === tab.value && 'text-cyber-cyan border-b-2 border-cyber-cyan'
                ),
                'pills': cn(
                  'rounded-lg',
                  activeValue === tab.value
                    ? 'bg-cyber-cyan text-cyber-dark'
                    : 'text-gray-400 hover:bg-cyber-muted/30'
                ),
                'underline': cn(
                  'text-gray-400 hover:text-white',
                  activeValue === tab.value && 'text-cyber-cyan border-b-2 border-cyber-cyan -mb-px'
                )
              }[variant]
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* 内容区域 */}
      <div className="mt-4">
        {tabs.map((tab) => (
          <div
            key={tab.value}
            className={activeValue === tab.value ? 'block' : 'hidden'}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
}
