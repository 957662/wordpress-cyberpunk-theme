'use client';

import React, { useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface TabItem {
  id: string;
  label: string;
  icon?: ReactNode;
  content: ReactNode;
  disabled?: boolean;
  badge?: string | number;
}

export interface TabsProps {
  tabs: TabItem[];
  defaultTab?: string;
  variant?: 'underline' | 'pills' | 'enclosed' | 'cyber';
  size?: 'sm' | 'md' | 'lg';
  color?: 'cyan' | 'purple' | 'pink' | 'green' | 'yellow';
  className?: string;
  onTabChange?: (tabId: string) => void;
}

const colorClasses = {
  cyan: {
    active: 'text-cyan-400 border-cyan-400',
    indicator: 'bg-cyan-400',
    bg: 'bg-cyan-500/10',
  },
  purple: {
    active: 'text-purple-400 border-purple-400',
    indicator: 'bg-purple-400',
    bg: 'bg-purple-500/10',
  },
  pink: {
    active: 'text-pink-400 border-pink-400',
    indicator: 'bg-pink-400',
    bg: 'bg-pink-500/10',
  },
  green: {
    active: 'text-green-400 border-green-400',
    indicator: 'bg-green-400',
    bg: 'bg-green-500/10',
  },
  yellow: {
    active: 'text-yellow-400 border-yellow-400',
    indicator: 'bg-yellow-400',
    bg: 'bg-yellow-500/10',
  },
};

const sizeClasses = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-2.5 text-base',
  lg: 'px-6 py-3 text-lg',
};

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTab,
  variant = 'underline',
  size = 'md',
  color = 'cyan',
  className,
  onTabChange,
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);
  const colors = colorClasses[color];

  const handleTabChange = (tabId: string) => {
    if (tabs.find((tab) => tab.id === tabId)?.disabled) return;
    setActiveTab(tabId);
    onTabChange?.(tabId);
  };

  const activeTabData = tabs.find((tab) => tab.id === activeTab);

  return (
    <div className={cn('w-full', className)}>
      {/* Tab Headers */}
      <div
        className={cn(
          'relative',
          variant === 'underline' && 'border-b border-gray-700',
          variant === 'pills' && 'flex gap-2 p-1 bg-gray-800/50 rounded-lg',
          variant === 'enclosed' && 'flex gap-1',
          variant === 'cyber' && 'flex gap-1 p-1 bg-gray-800/30 rounded-lg border border-white/10'
        )}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;

          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              disabled={tab.disabled}
              className={cn(
                'relative flex items-center gap-2 font-medium transition-all duration-200',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                sizeClasses[size],
                variant === 'underline' && cn(
                  'border-b-2 -mb-px',
                  isActive ? colors.active : 'text-gray-400 border-transparent hover:text-gray-300'
                ),
                variant === 'pills' && cn(
                  'rounded-md',
                  isActive && !tab.disabled ? `${colors.bg} ${colors.active}` : 'text-gray-400 hover:text-gray-300'
                ),
                variant === 'enclosed' && cn(
                  'rounded-t-lg border-t-2 border-x-2',
                  isActive && !tab.disabled ? `${colors.active} bg-gray-800` : 'text-gray-400 border-transparent hover:text-gray-300'
                ),
                variant === 'cyber' && cn(
                  'rounded-lg',
                  isActive && !tab.disabled && `${colors.bg} ${colors.active} shadow-lg`,
                  !isActive && 'text-gray-400 hover:text-gray-300'
                )
              )}
            >
              {tab.icon && (
                <span className="flex-shrink-0">{tab.icon}</span>
              )}
              <span>{tab.label}</span>

              {tab.badge && (
                <span
                  className={cn(
                    'flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-semibold',
                    isActive ? `${colors.active} ${colors.bg}` : 'bg-gray-700 text-gray-400'
                  )}
                >
                  {tab.badge}
                </span>
              )}

              {/* Animated Indicator for Underline Variant */}
              {variant === 'underline' && isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5"
                  style={{ backgroundColor: colors.indicator.replace('bg-', '') }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="mt-4">
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
};

export default Tabs;
