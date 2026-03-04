'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export type TabColor = 'cyan' | 'purple' | 'pink' | 'green' | 'yellow';
export type TabSize = 'sm' | 'md' | 'lg';
export type TabVariant = 'line' | 'pill' | 'underline' | 'neon';

export interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
  badge?: number | string;
}

export interface CyberTabsProps {
  tabs: Tab[];
  color?: TabColor;
  size?: TabSize;
  variant?: TabVariant;
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  className?: string;
}

const colorClasses = {
  cyan: {
    active: 'text-cyan-400',
    line: 'bg-cyan-400',
    pill: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50',
    neon: 'shadow-[0_0_10px_rgba(0,240,255,0.5)]',
  },
  purple: {
    active: 'text-purple-400',
    line: 'bg-purple-400',
    pill: 'bg-purple-500/20 text-purple-400 border-purple-500/50',
    neon: 'shadow-[0_0_10px_rgba(157,0,255,0.5)]',
  },
  pink: {
    active: 'text-pink-400',
    line: 'bg-pink-400',
    pill: 'bg-pink-500/20 text-pink-400 border-pink-500/50',
    neon: 'shadow-[0_0_10px_rgba(255,0,128,0.5)]',
  },
  green: {
    active: 'text-green-400',
    line: 'bg-green-400',
    pill: 'bg-green-500/20 text-green-400 border-green-500/50',
    neon: 'shadow-[0_0_10px_rgba(0,255,136,0.5)]',
  },
  yellow: {
    active: 'text-yellow-400',
    line: 'bg-yellow-400',
    pill: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
    neon: 'shadow-[0_0_10px_rgba(240,255,0,0.5)]',
  },
};

const sizeClasses = {
  sm: {
    tab: 'px-3 py-1.5 text-sm',
    content: 'p-3 text-sm',
  },
  md: {
    tab: 'px-4 py-2 text-base',
    content: 'p-4 text-base',
  },
  lg: {
    tab: 'px-6 py-3 text-lg',
    content: 'p-6 text-lg',
  },
};

export const CyberTabs: React.FC<CyberTabsProps> = ({
  tabs,
  color = 'cyan',
  size = 'md',
  variant = 'line',
  defaultTab,
  onChange,
  className,
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const tabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (tabsRef.current) {
      const activeTabElement = tabsRef.current.querySelector(
        `[data-tab-id="${activeTab}"]`
      ) as HTMLElement;
      if (activeTabElement) {
        setIndicatorStyle({
          left: activeTabElement.offsetLeft,
          width: activeTabElement.offsetWidth,
        });
      }
    }
  }, [activeTab, tabs]);

  const handleTabClick = (tabId: string) => {
    const tab = tabs.find((t) => t.id === tabId);
    if (tab && !tab.disabled) {
      setActiveTab(tabId);
      onChange?.(tabId);
    }
  };

  const currentTab = tabs.find((t) => t.id === activeTab);
  const colorClass = colorClasses[color];
  const sizeClass = sizeClasses[size];

  return (
    <div className={cn('w-full', className)}>
      {/* 标签头 */}
      <div className="relative">
        <div
          ref={tabsRef}
          className={cn(
            'flex items-center gap-1',
            variant === 'line' && 'border-b border-white/10',
            variant === 'underline' && 'border-b-2 border-white/10'
          )}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              data-tab-id={tab.id}
              onClick={() => handleTabClick(tab.id)}
              disabled={tab.disabled}
              className={cn(
                'relative flex items-center gap-2 font-medium transition-all duration-200',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'focus:outline-none focus:ring-2 focus:ring-cyan-500/50',
                sizeClass.tab,
                activeTab === tab.id
                  ? cn(colorClass.active, variant === 'pill' && colorClass.pill)
                  : 'text-gray-400 hover:text-gray-200',
                variant === 'pill' && 'rounded-lg border',
                variant === 'neon' && activeTab === tab.id && colorClass.neon
              )}
            >
              {/* 图标 */}
              {tab.icon && (
                <span className="flex-shrink-0">{tab.icon}</span>
              )}

              {/* 标签 */}
              <span>{tab.label}</span>

              {/* 徽章 */}
              {tab.badge && (
                <span
                  className={cn(
                    'ml-1 px-2 py-0.5 text-xs rounded-full',
                    activeTab === tab.id
                      ? colorClass.pill
                      : 'bg-gray-700 text-gray-300'
                  )}
                >
                  {tab.badge}
                </span>
              )}

              {/* 活跃指示器 */}
              {activeTab === tab.id && variant === 'neon' && (
                <motion.div
                  className="absolute inset-0 rounded-lg border-2 border-current opacity-50"
                  layoutId="activeTab"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* 滑动指示器 */}
        {variant === 'line' && (
          <motion.div
            className={cn(
              'absolute bottom-0 h-0.5',
              colorClass.line
            )}
            initial={false}
            animate={{
              left: indicatorStyle.left,
              width: indicatorStyle.width,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        )}
      </div>

      {/* 内容区 */}
      <div className={cn('mt-4', sizeClass.content)}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {currentTab?.content}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

// 垂直标签
export interface VerticalTabsProps extends Omit<CyberTabsProps, 'className'> {
  className?: string;
}

export const VerticalTabs: React.FC<VerticalTabsProps> = ({
  tabs,
  color = 'cyan',
  size = 'md',
  variant = 'line',
  defaultTab,
  onChange,
  className,
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);
  const [indicatorStyle, setIndicatorStyle] = useState({ top: 0, height: 0 });
  const tabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (tabsRef.current) {
      const activeTabElement = tabsRef.current.querySelector(
        `[data-tab-id="${activeTab}"]`
      ) as HTMLElement;
      if (activeTabElement) {
        setIndicatorStyle({
          top: activeTabElement.offsetTop,
          height: activeTabElement.offsetHeight,
        });
      }
    }
  }, [activeTab, tabs]);

  const handleTabClick = (tabId: string) => {
    const tab = tabs.find((t) => t.id === tabId);
    if (tab && !tab.disabled) {
      setActiveTab(tabId);
      onChange?.(tabId);
    }
  };

  const currentTab = tabs.find((t) => t.id === activeTab);
  const colorClass = colorClasses[color];
  const sizeClass = sizeClasses[size];

  return (
    <div className={cn('flex gap-4', className)}>
      {/* 标签头 */}
      <div className="relative">
        <div
          ref={tabsRef}
          className={cn(
            'flex flex-col gap-1',
            variant === 'line' && 'border-r border-white/10'
          )}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              data-tab-id={tab.id}
              onClick={() => handleTabClick(tab.id)}
              disabled={tab.disabled}
              className={cn(
                'relative flex items-center gap-2 font-medium transition-all duration-200 text-left whitespace-nowrap',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'focus:outline-none focus:ring-2 focus:ring-cyan-500/50',
                sizeClass.tab,
                activeTab === tab.id
                  ? cn(colorClass.active, variant === 'pill' && colorClass.pill)
                  : 'text-gray-400 hover:text-gray-200',
                variant === 'pill' && 'rounded-lg border'
              )}
            >
              {tab.icon && <span className="flex-shrink-0">{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={cn(
                    'ml-auto px-2 py-0.5 text-xs rounded-full',
                    activeTab === tab.id
                      ? colorClass.pill
                      : 'bg-gray-700 text-gray-300'
                  )}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* 滑动指示器 */}
        {variant === 'line' && (
          <motion.div
            className={cn(
              'absolute right-0 w-0.5',
              colorClass.line
            )}
            initial={false}
            animate={{
              top: indicatorStyle.top,
              height: indicatorStyle.height,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        )}
      </div>

      {/* 内容区 */}
      <div className={cn('flex-1', sizeClass.content)}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            {currentTab?.content}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CyberTabs;
