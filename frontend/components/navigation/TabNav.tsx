'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: number | string;
  disabled?: boolean;
  content?: React.ReactNode;
}

interface TabNavProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underlined';
  className?: string;
  fullWidth?: boolean;
}

/**
 * TabNav - 标签页导航组件
 * 用于切换不同的内容区域
 */
export const TabNav: React.FC<TabNavProps> = ({
  tabs,
  activeTab,
  onTabChange,
  variant = 'default',
  className,
  fullWidth = false,
}) => {
  const activeTabData = tabs.find(tab => tab.id === activeTab);

  const variants = {
    default: {
      container: 'bg-gray-900/50 p-1 rounded-lg border border-gray-800',
      button: (isActive: boolean) => cn(
        'px-4 py-2 rounded-md transition-all',
        'flex items-center space-x-2',
        isActive
          ? 'bg-cyan-600 text-white shadow-lg'
          : 'text-gray-400 hover:text-white hover:bg-gray-800'
      ),
    },
    pills: {
      container: 'space-x-2',
      button: (isActive: boolean) => cn(
        'px-4 py-2 rounded-full transition-all',
        'flex items-center space-x-2',
        isActive
          ? 'bg-cyan-600 text-white'
          : 'text-gray-400 hover:text-white hover:bg-gray-800'
      ),
    },
    underlined: {
      container: 'border-b border-gray-800',
      button: (isActive: boolean) => cn(
        'px-4 py-2 border-b-2 transition-all -mb-px',
        'flex items-center space-x-2',
        isActive
          ? 'border-cyan-500 text-cyan-500'
          : 'text-gray-400 hover:text-white border-transparent'
      ),
    },
  };

  const selectedVariant = variants[variant];

  return (
    <div className={className}>
      <div className={cn(
        'flex',
        selectedVariant.container,
        fullWidth && 'w-full'
      )}>
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;

          return (
            <button
              key={tab.id}
              onClick={() => !tab.disabled && onTabChange(tab.id)}
              disabled={tab.disabled}
              className={cn(
                selectedVariant.button(isActive),
                tab.disabled && 'opacity-50 cursor-not-allowed',
                fullWidth && 'flex-1 justify-center'
              )}
            >
              {tab.icon && <span>{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={cn(
                  'px-2 py-0.5 text-xs rounded-full',
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-cyan-500/20 text-cyan-500'
                )}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {activeTabData?.content && (
        <div className="mt-4">
          {activeTabData.content}
        </div>
      )}
    </div>
  );
};

export default TabNav;
