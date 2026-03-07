/**
 * Tabs Component
 *
 * Tab navigation with cyberpunk styling
 */

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  variant?: 'line' | 'enclosed' | 'soft';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const variantStyles = {
  line: {
    container: 'border-b border-cyber-border',
    tab: 'border-b-2 border-transparent hover:border-cyber-cyan/30',
    activeTab: 'border-cyber-cyan text-cyber-cyan',
    indicator: 'bottom',
  },
  enclosed: {
    container: 'bg-cyber-muted p-1 rounded-lg',
    tab: 'rounded hover:bg-cyber-card',
    activeTab: 'bg-cyber-card text-cyber-cyan shadow-neon',
    indicator: 'background',
  },
  soft: {
    container: '',
    tab: 'rounded hover:bg-cyber-muted',
    activeTab: 'bg-cyber-muted text-cyber-cyan',
    indicator: 'background',
  },
};

const sizeStyles = {
  sm: 'text-sm px-3 py-1.5',
  md: 'text-base px-4 py-2',
  lg: 'text-lg px-6 py-3',
};

export function Tabs({
  tabs,
  defaultTab,
  variant = 'line',
  size = 'md',
  className,
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const styles = variantStyles[variant];

  return (
    <div className={className}>
      {/* Tab Headers */}
      <div className={cn('flex gap-2', styles.container)}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => !tab.disabled && setActiveTab(tab.id)}
            disabled={tab.disabled}
            className={cn(
              'relative flex items-center gap-2 font-medium transition-colors',
              sizeStyles[size],
              styles.tab,
              activeTab === tab.id && styles.activeTab,
              tab.disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            {tab.icon && <span>{tab.icon}</span>}
            <span>{tab.label}</span>
            
            {variant === 'line' && activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyber-cyan"
                initial={false}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {tabs.find((tab) => tab.id === activeTab)?.content}
      </div>
    </div>
  );
}

/**
 * Vertical Tabs Component
 */
export interface VerticalTabsProps {
  tabs: Tab[];
  defaultTab?: string;
  className?: string;
}

export function VerticalTabs({
  tabs,
  defaultTab,
  className,
}: VerticalTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  return (
    <div className={cn('flex gap-4', className)}>
      {/* Tab Headers */}
      <div className="flex flex-col gap-2 w-48">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => !tab.disabled && setActiveTab(tab.id)}
            disabled={tab.disabled}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-left font-medium transition-colors',
              activeTab === tab.id
                ? 'bg-cyber-card text-cyber-cyan border border-cyber-cyan/30'
                : 'text-gray-400 hover:bg-cyber-muted',
              tab.disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            {tab.icon && <span>{tab.icon}</span>}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1">
        {tabs.find((tab) => tab.id === activeTab)?.content}
      </div>
    </div>
  );
}
