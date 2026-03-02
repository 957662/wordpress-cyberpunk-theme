/**
 * Tabs - 标签页组件
 */

'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: TabItem[];
  defaultTab?: string;
  variant?: 'default' | 'pills' | 'underline';
  fullWidth?: boolean;
  className?: string;
  onChange?: (tabId: string) => void;
}

const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTab,
  variant = 'default',
  fullWidth = false,
  className,
  onChange,
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabChange = useCallback((tabId: string) => {
    const tab = tabs.find(t => t.id === tabId);
    if (tab && !tab.disabled) {
      setActiveTab(tabId);
      onChange?.(tabId);
    }
  }, [tabs, onChange]);

  const activeTabData = tabs.find(tab => tab.id === activeTab);

  const renderTabs = () => {
    const tabVariants = {
      default: {
        base: 'relative text-gray-400 hover:text-white',
        active: 'text-cyan-400',
        indicator: (
          <motion.div
            layoutId="activeTab"
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-500"
          />
        ),
      },
      pills: {
        base: 'rounded-lg text-gray-400 hover:text-white hover:bg-gray-800',
        active: 'bg-cyan-500 text-white',
        indicator: null,
      },
      underline: {
        base: 'text-gray-400 hover:text-white border-b-2 border-transparent',
        active: 'text-cyan-400 border-cyan-500',
        indicator: null,
      },
    };

    const currentVariant = tabVariants[variant];

    return (
      <div className={cn('flex gap-2', fullWidth && 'w-full', className)}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              disabled={tab.disabled}
              onClick={() => handleTabChange(tab.id)}
              className={cn(
                'relative inline-flex items-center gap-2 px-4 py-2 font-medium transition-all',
                'focus:outline-none focus:ring-2 focus:ring-cyan-500/50',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                fullWidth && 'flex-1',
                currentVariant.base,
                isActive && currentVariant.active
              )}
            >
              <span className="relative z-10 flex items-center gap-2">
                {tab.icon}
                <span>{tab.label}</span>
              </span>
              {isActive && variant === 'default' && currentVariant.indicator}
            </button>
          );
        })}
      </div>
    );
  };

  const renderContent = () => {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mt-6"
        >
          {activeTabData?.content}
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <div className="w-full">
      {renderTabs()}
      {renderContent()}
    </div>
  );
};

export default Tabs;

// 垂直标签页
export function VerticalTabs(props: TabsProps) {
  return (
    <div className="flex gap-6">
      <div className="flex flex-col gap-2">
        {props.tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => props.onChange?.(tab.id)}
            className={cn(
              'text-left px-4 py-2 rounded-lg transition-colors',
              props.defaultTab === tab.id ? 'bg-cyan-500 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="flex-1">
        {props.tabs.find(t => t.id === props.defaultTab)?.content}
      </div>
    </div>
  );
}
