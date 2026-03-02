/**
 * Tabs - 标签页组件
 */

'use client';

import { useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface Tab {
  id: string;
  label: string;
  icon?: ReactNode;
  content: ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  variant?: 'line' | 'enclosed' | 'soft-rounded' | 'solid-rounded';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onChange?: (tabId: string) => void;
}

export function Tabs({
  tabs,
  defaultTab,
  variant = 'line',
  size = 'md',
  className,
  onChange,
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabChange = (tabId: string) => {
    if (tabs.find((t) => t.id === tabId)?.disabled) return;
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  const activeTabData = tabs.find((t) => t.id === activeTab);

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const variantStyles = {
    line: {
      tab: cn(
        'relative text-gray-400 hover:text-cyber-cyan transition-colors',
        'after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5',
        'after:bg-cyber-cyan after:transition-all',
        'data-[active=true]:text-cyber-cyan data-[active=true]:after:scale-x-100',
        'data-[active=true]:after:scale-x-100'
      ),
      panel: 'mt-4',
    },
    enclosed: {
      tab: cn(
        'border border-cyber-cyan/30 rounded-t-lg',
        'text-gray-400 hover:text-cyber-cyan hover:bg-cyber-cyan/10',
        'transition-all',
        'data-[active=true]:text-cyber-cyan data-[active=true]:bg-cyber-dark/50',
        'data-[active=true]:border-b-transparent'
      ),
      panel: 'mt-1 border border-cyber-cyan/30 rounded-lg p-4',
    },
    'soft-rounded': {
      tab: cn(
        'rounded-lg text-gray-400 hover:text-cyber-cyan',
        'hover:bg-cyber-cyan/10 transition-all',
        'data-[active=true]:text-cyber-cyan data-[active=true]:bg-cyber-cyan/20'
      ),
      panel: 'mt-4',
    },
    'solid-rounded': {
      tab: cn(
        'rounded-lg text-gray-400 hover:text-white',
        'bg-cyber-dark/50 hover:bg-cyber-purple transition-all',
        'data-[active=true]:bg-cyber-purple data-[active=true]:text-white'
      ),
      panel: 'mt-4',
    },
  };

  return (
    <div className={cn('w-full', className)}>
      {/* 标签导航 */}
      <div
        className={cn(
          'flex',
          variant === 'line' && 'border-b border-cyber-cyan/20',
          variant === 'enclosed' && 'border-b border-cyber-cyan/30',
          (variant === 'soft-rounded' || variant === 'solid-rounded') && 'gap-2'
        )}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            data-active={activeTab === tab.id}
            disabled={tab.disabled}
            onClick={() => handleTabChange(tab.id)}
            className={cn(
              variantStyles[variant].tab,
              sizeStyles[size],
              'flex items-center gap-2 font-medium outline-none',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              variant === 'enclosed' && activeTab !== tab.id && 'border-b-cyber-cyan/30'
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* 标签内容 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className={variantStyles[variant].panel}
        >
          {activeTabData?.content}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// 垂直标签页
export interface VerticalTabsProps {
  tabs: Tab[];
  defaultTab?: string;
  className?: string;
  onChange?: (tabId: string) => void;
}

export function VerticalTabs({
  tabs,
  defaultTab,
  className,
  onChange,
}: VerticalTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  const activeTabData = tabs.find((t) => t.id === activeTab);

  return (
    <div className={cn('flex gap-4', className)}>
      {/* 标签列表 */}
      <div className="flex flex-col gap-1 w-48">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={cn(
              'text-left px-4 py-2 rounded-lg transition-all',
              'flex items-center gap-2',
              activeTab === tab.id
                ? 'bg-cyber-purple text-white shadow-lg shadow-cyber-purple/50'
                : 'text-gray-400 hover:text-cyber-cyan hover:bg-cyber-cyan/10'
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* 标签内容 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="flex-1"
        >
          {activeTabData?.content}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
