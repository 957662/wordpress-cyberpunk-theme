'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
  badge?: number | string;
}

export interface CyberTabsProps {
  tabs: TabItem[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  color?: 'cyan' | 'purple' | 'pink' | 'green' | 'yellow';
  size?: 'sm' | 'md' | 'lg';
  variant?: 'line' | 'pill' | 'underline' | 'card';
  orientation?: 'horizontal' | 'vertical';
  swipeable?: boolean;
  fullWidth?: boolean;
  animated?: boolean;
  className?: string;
}

const colorClasses = {
  cyan: {
    active: 'text-cyan-400 border-cyan-400',
    inactive: 'text-gray-400 border-transparent hover:text-cyan-300',
    bg: 'bg-cyan-400/10',
    indicator: 'bg-cyan-400'
  },
  purple: {
    active: 'text-purple-400 border-purple-400',
    inactive: 'text-gray-400 border-transparent hover:text-purple-300',
    bg: 'bg-purple-400/10',
    indicator: 'bg-purple-400'
  },
  pink: {
    active: 'text-pink-400 border-pink-400',
    inactive: 'text-gray-400 border-transparent hover:text-pink-300',
    bg: 'bg-pink-400/10',
    indicator: 'bg-pink-400'
  },
  green: {
    active: 'text-green-400 border-green-400',
    inactive: 'text-gray-400 border-transparent hover:text-green-300',
    bg: 'bg-green-400/10',
    indicator: 'bg-green-400'
  },
  yellow: {
    active: 'text-yellow-400 border-yellow-400',
    inactive: 'text-gray-400 border-transparent hover:text-yellow-300',
    bg: 'bg-yellow-400/10',
    indicator: 'bg-yellow-400'
  }
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-4 py-2.5 text-base gap-2',
  lg: 'px-6 py-3 text-lg gap-3'
};

export const CyberTabs: React.FC<CyberTabsProps> = ({
  tabs,
  defaultTab,
  onChange,
  color = 'cyan',
  size = 'md',
  variant = 'line',
  orientation = 'horizontal',
  swipeable = true,
  fullWidth = false,
  animated = true,
  className
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);
  const [dragStart, setDragStart] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const tabsContainerRef = useRef<HTMLDivElement>(null);

  const colors = colorClasses[color];
  const sizeClass = sizeClasses[size];

  // 获取当前活动标签索引
  const activeIndex = tabs.findIndex(tab => tab.id === activeTab);

  // 处理标签切换
  const handleTabChange = (tabId: string) => {
    const tab = tabs.find(t => t.id === tabId);
    if (tab && !tab.disabled) {
      setActiveTab(tabId);
      onChange?.(tabId);
    }
  };

  // 处理滑动
  const handleDragStart = () => {
    setDragStart(0);
  };

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (!swipeable) return;

    const threshold = 50;
    const offset = info.offset.x;

    if (Math.abs(offset) > threshold) {
      if (offset > 0 && activeIndex > 0) {
        // 向右滑动，切换到上一个
        handleTabChange(tabs[activeIndex - 1].id);
      } else if (offset < 0 && activeIndex < tabs.length - 1) {
        // 向左滑动，切换到下一个
        handleTabChange(tabs[activeIndex + 1].id);
      }
    }
  };

  // 渲染标签指示器
  const renderIndicator = () => {
    if (!tabsContainerRef.current || !animated) return null;

    const isHorizontal = orientation === 'horizontal';
    const tabs = Array.from(tabsContainerRef.current.querySelectorAll('[data-tab-button]'));
    const activeTabEl = tabs[activeIndex];

    if (!activeTabEl) return null;

    const rect = activeTabEl.getBoundingClientRect();
    const containerRect = tabsContainerRef.current.getBoundingClientRect();

    const style: React.CSSProperties = {
      position: 'absolute',
      [isHorizontal ? 'left' : 'top']: `${(activeTabEl as HTMLElement).offsetLeft}px`,
      [isHorizontal ? 'width' : 'height']: `${rect[isHorizontal ? 'width' : 'height']}px`,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    };

    if (variant === 'line' || variant === 'underline') {
      style[isHorizontal ? 'bottom' : 'right'] = '0';
      style.height = isHorizontal ? '2px' : '2px';
      style.width = isHorizontal ? `${rect.width}px` : '2px';
    }

    return (
      <motion.div
        className={cn(
          'absolute transition-all duration-300',
          colors.indicator,
          variant === 'pill' && 'rounded-full',
          variant === 'card' && 'rounded-lg'
        )}
        style={style}
        layoutId="tab-indicator"
      />
    );
  };

  // 渲染标签按钮
  const renderTabButton = (tab: TabItem, index: number) => {
    const isActive = tab.id === activeTab;
    const isDisabled = tab.disabled;

    return (
      <motion.button
        key={tab.id}
        data-tab-button
        type="button"
        onClick={() => handleTabChange(tab.id)}
        disabled={isDisabled}
        className={cn(
          'relative flex items-center justify-center font-medium transition-all duration-200',
          'disabled:opacity-40 disabled:cursor-not-allowed',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900',
          sizeClass,
          fullWidth && 'flex-1',
          variant === 'line' && 'border-t-2',
          variant === 'underline' && 'border-b-2',
          variant === 'pill' && 'rounded-full',
          variant === 'card' && 'rounded-lg border-2',
          isActive ? colors.active : colors.inactive,
          isActive && variant === 'card' && colors.bg,
          isActive && `focus:ring-${color}-400`
        )}
        whileHover={{ scale: isDisabled ? 1 : 1.02 }}
        whileTap={{ scale: isDisabled ? 1 : 0.98 }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
      >
        {tab.icon && (
          <motion.span
            className="flex-shrink-0"
            animate={{ rotate: isActive ? 360 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {tab.icon}
          </motion.span>
        )}
        <span className="relative">{tab.label}</span>
        {tab.badge && (
          <span className={cn(
            'flex-shrink-0 px-2 py-0.5 text-xs font-bold rounded-full',
            'bg-gradient-to-r from-red-500 to-pink-500',
            'text-white shadow-lg'
          )}>
            {typeof tab.badge === 'number' && tab.badge > 99 ? '99+' : tab.badge}
          </span>
        )}
      </motion.button>
    );
  };

  return (
    <div className={cn('w-full', className)}>
      {/* 标签栏 */}
      <div
        ref={tabsContainerRef}
        className={cn(
          'relative flex',
          orientation === 'horizontal' ? 'flex-row' : 'flex-col',
          variant === 'card' && 'gap-2'
        )}
        role="tablist"
      >
        {tabs.map((tab, index) => renderTabButton(tab, index))}
        {renderIndicator()}
      </div>

      {/* 内容区域 */}
      <div ref={contentRef} className="relative mt-4">
        <motion.div
          key={activeTab}
          initial={animated ? { opacity: 0, x: 20 } : false}
          animate={{ opacity: 1, x: 0 }}
          exit={animated ? { opacity: 0, x: -20 } : false}
          transition={{ duration: 0.2 }}
          drag={swipeable ? 'x' : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.1}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          className="outline-none"
          role="tabpanel"
        >
          {tabs.find(tab => tab.id === activeTab)?.content}
        </motion.div>
      </div>
    </div>
  );
};

export default CyberTabs;
