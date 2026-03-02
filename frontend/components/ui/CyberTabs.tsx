'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils/classname';

export interface CyberTab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface CyberTabsProps {
  tabs: CyberTab[];
  defaultTab?: string;
  variant?: 'default' | 'glow' | 'neon' | 'hologram';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const CyberTabs: React.FC<CyberTabsProps> = ({
  tabs,
  defaultTab,
  variant = 'default',
  size = 'md',
  className,
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const variantStyles = {
    default: {
      tab: 'border-cyan-500/30 text-gray-400 hover:text-cyan-400',
      active: 'border-cyan-500 text-cyan-400 bg-cyan-500/10',
      indicator: 'bg-cyan-500',
    },
    glow: {
      tab: 'border-fuchsia-500/30 text-gray-400 hover:text-fuchsia-400',
      active: 'border-fuchsia-500 text-fuchsia-400 bg-fuchsia-500/10',
      indicator: 'bg-fuchsia-500',
    },
    neon: {
      tab: 'border-pink-500/30 text-gray-400 hover:text-pink-400',
      active: 'border-pink-500 text-pink-400 bg-pink-500/10',
      indicator: 'bg-pink-500',
    },
    hologram: {
      tab: 'border-purple-500/30 text-gray-400 hover:text-purple-400',
      active: 'border-purple-500 text-purple-400 bg-purple-500/10',
      indicator: 'bg-purple-500',
    },
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const styles = variantStyles[variant];

  const activeTabData = tabs.find((tab) => tab.id === activeTab);

  return (
    <div className={cn('w-full', className)}>
      <div className="relative border-b border-gray-700">
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => !tab.disabled && setActiveTab(tab.id)}
              disabled={tab.disabled}
              className={cn(
                'relative flex items-center gap-2 border-b-2 transition-all duration-300',
                'focus:outline-none focus:ring-2 focus:ring-cyan-500/50',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                sizeStyles[size],
                tab.id === activeTab ? styles.active : styles.tab
              )}
            >
              {tab.icon && <span>{tab.icon}</span>}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
        <div
          className={cn(
            'absolute bottom-0 h-0.5 transition-all duration-300',
            styles.indicator
          )}
          style={{
            left: `${tabs.findIndex((t) => t.id === activeTab) * (100 / tabs.length)}%`,
            width: `${100 / tabs.length}%`,
          }}
        />
      </div>
      <div className="mt-4">
        {activeTabData?.content}
      </div>
    </div>
  );
};

export default CyberTabs;
