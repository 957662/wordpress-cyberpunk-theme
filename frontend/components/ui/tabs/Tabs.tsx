'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface Tab {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  content: React.ReactNode;
  disabled?: boolean;
  badge?: string | number;
}

export interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  variant?: 'line' | 'pill' | 'card';
  size?: 'sm' | 'md' | 'lg';
  orientation?: 'horizontal' | 'vertical';
  onChange?: (tabId: string) => void;
  className?: string;
}

export function Tabs({
  tabs,
  defaultTab,
  variant = 'line',
  size = 'md',
  orientation = 'horizontal',
  onChange,
  className,
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const tabsRef = useRef<HTMLDivElement>(null);

  const handleTabChange = (tabId: string) => {
    const tab = tabs.find((t) => t.id === tabId);
    if (tab && !tab.disabled) {
      setActiveTab(tabId);
      onChange?.(tabId);
    }
  };

  useEffect(() => {
    if (variant === 'line' && tabsRef.current) {
      const activeTabElement = tabsRef.current.querySelector(
        `[data-tab="\${activeTab}"]`
      ) as HTMLElement;
      if (activeTabElement) {
        setIndicatorStyle({
          left: activeTabElement.offsetLeft,
          width: activeTabElement.offsetWidth,
        });
      }
    }
  }, [activeTab, variant, tabs]);

  const sizes = {
    sm: 'text-xs px-3 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-6 py-3',
  };

  const activeTabData = tabs.find((t) => t.id === activeTab);

  return (
    <div className={cn('space-y-4', className)}>
      <div
        ref={tabsRef}
        className={cn(
          'relative flex',
          orientation === 'horizontal' ? 'flex-row' : 'flex-col',
          variant === 'line' && 'border-b border-cyber-cyan/20',
          variant === 'pill' && 'bg-cyber-darker rounded-lg p-1 gap-1',
          variant === 'card' && 'gap-2'
        )}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              data-tab={tab.id}
              onClick={() => handleTabChange(tab.id)}
              disabled={tab.disabled}
              className={cn(
                'relative flex items-center gap-2 font-medium transition-all duration-200',
                sizes[size],
                variant === 'line' &&
                  'text-gray-400 hover:text-white border-b-2 border-transparent -mb-px',
                variant === 'line' &&
                  isActive &&
                  'text-cyber-cyan border-cyber-cyan',
                variant === 'pill' &&
                  'rounded-lg text-gray-400 hover:text-white hover:bg-cyber-cyan/10',
                variant === 'pill' && isActive && 'bg-cyber-cyan text-black',
                variant === 'card' &&
                  'rounded-lg border text-gray-400 hover:text-white hover:border-cyber-cyan/50',
                variant === 'card' &&
                  isActive &&
                  'bg-cyber-cyan/10 border-cyber-cyan text-cyber-cyan',
                tab.disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              {Icon && <Icon className="w-4 h-4" />}
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={cn(
                    'text-xs px-1.5 py-0.5 rounded-full',
                    isActive
                      ? 'bg-white text-black'
                      : 'bg-cyber-cyan/20 text-cyber-cyan'
                  )}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* 滑动指示器 (仅 line variant) */}
        {variant === 'line' && (
          <motion.div
            className="absolute bottom-0 h-0.5 bg-gradient-to-r from-cyber-cyan to-cyber-purple"
            initial={false}
            animate={indicatorStyle}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        )}
      </div>

      <div className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTabData?.content}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Tabs;
