/**
 * Tabs 标签页组件
 * 用于分组和组织内容
 */

'use client';

import { useState, createContext, useContext, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (value: string) => void;
  orientation: 'horizontal' | 'vertical';
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs components must be used within Tabs');
  }
  return context;
}

export interface TabsProps {
  defaultValue: string;
  value?: string;
  onValueChange?: (value: string) => void;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  children: React.ReactNode;
}

export function Tabs({
  defaultValue,
  value: controlledValue,
  onValueChange,
  orientation = 'horizontal',
  className,
  children,
}: TabsProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const activeTab = controlledValue ?? uncontrolledValue;

  const setActiveTab = (newValue: string) => {
    if (controlledValue === undefined) {
      setUncontrolledValue(newValue);
    }
    onValueChange?.(newValue);
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab, orientation }}>
      <div className={cn('w-full', className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

export function TabsList({ children, className }: TabsListProps) {
  const { orientation } = useTabsContext();
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const tabsRef = useRef<HTMLDivElement>(null);
  const tabsMapRef = useRef<Map<string, HTMLElement>>(new Map());

  useEffect(() => {
    // 更新指示器位置
    const updateIndicator = () => {
      const { activeTab } = useTabsContext();
      const activeElement = tabsMapRef.current.get(activeTab);
      const containerElement = tabsRef.current;

      if (activeElement && containerElement) {
        if (orientation === 'horizontal') {
          setIndicatorStyle({
            left: activeElement.offsetLeft,
            width: activeElement.offsetWidth,
          });
        } else {
          setIndicatorStyle({
            top: activeElement.offsetTop,
            height: activeElement.offsetHeight,
          });
        }
      }
    };

    updateIndicator();
  }, [useTabsContext().activeTab, orientation]);

  const registerTab = (value: string, element: HTMLElement) => {
    tabsMapRef.current.set(value, element);
  };

  const unregisterTab = (value: string) => {
    tabsMapRef.current.delete(value);
  };

  return (
    <TabsListContext.Provider value={{ registerTab, unregisterTab }}>
      <div
        ref={tabsRef}
        className={cn(
          'relative inline-flex bg-gray-900 border border-gray-800 rounded-lg p-1',
          orientation === 'horizontal' ? 'flex-row' : 'flex-col',
          className
        )}
      >
        {children}
        <motion.div
          className={cn(
            'absolute rounded-md bg-cyan-500/20',
            orientation === 'horizontal' ? 'top-1 bottom-1' : 'left-1 right-1'
          )}
          animate={indicatorStyle}
          transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
        />
      </div>
    </TabsListContext.Provider>
  );
}

const TabsListContext = createContext<{
  registerTab: (value: string, element: HTMLElement) => void;
  unregisterTab: (value: string) => void;
} | null>(null);

export interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export function TabsTrigger({
  value,
  children,
  disabled = false,
  className,
}: TabsTriggerProps) {
  const { activeTab, setActiveTab, orientation } = useTabsContext();
  const context = useContext(TabsListContext);
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (ref.current && context) {
      context.registerTab(value, ref.current);
      return () => context.unregisterTab(value);
    }
  }, [value, context]);

  const isActive = activeTab === value;

  return (
    <button
      ref={ref}
      type="button"
      role="tab"
      aria-selected={isActive}
      disabled={disabled}
      onClick={() => setActiveTab(value)}
      className={cn(
        'relative inline-flex items-center justify-center',
        'px-4 py-2 text-sm font-medium',
        'transition-all duration-200',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'rounded-md',
        'focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900',
        isActive
          ? 'text-cyan-400'
          : 'text-gray-400 hover:text-gray-200',
        className
      )}
    >
      <span className="relative z-10">{children}</span>
    </button>
  );
}

export interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export function TabsContent({ value, children, className }: TabsContentProps) {
  const { activeTab } = useTabsContext();

  if (activeTab !== value) {
    return null;
  }

  return (
    <div
      role="tabpanel"
      className={cn('mt-4 focus:outline-none', className)}
      tabIndex={0}
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/**
 * 带图标的 Tabs Trigger
 */
export interface TabsTriggerIconProps extends Omit<TabsTriggerProps, 'children'> {
  icon: React.ReactNode;
  label: string;
}

export function TabsTriggerIcon({ icon, label, ...props }: TabsTriggerIconProps) {
  return (
    <TabsTrigger {...props}>
      <span className="flex items-center gap-2">
        <span className="w-4 h-4">{icon}</span>
        <span>{label}</span>
      </span>
    </TabsTrigger>
  );
}

/**
 * 垂直 Tabs 组件
 */
export interface VerticalTabsProps {
  defaultValue: string;
  tabs: {
    value: string;
    label: string;
    icon?: React.ReactNode;
    content: React.ReactNode;
  }[];
  className?: string;
}

export function VerticalTabs({ defaultValue, tabs, className }: VerticalTabsProps) {
  return (
    <div className={cn('flex gap-4', className)}>
      <Tabs defaultValue={defaultValue} orientation="vertical" className="flex-shrink-0">
        <TabsList className="flex-col">
          {tabs.map(tab => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.icon && <span className="w-4 h-4 mr-2">{tab.icon}</span>}
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <div className="flex-1">
        {tabs.map(tab => (
          <TabsContent key={tab.value} value={tab.value}>
            {tab.content}
          </TabsContent>
        ))}
      </div>
    </div>
  );
}

/**
 * 简化的 Tabs 组件
 */
export interface SimpleTabsProps {
  tabs: {
    value: string;
    label: string;
    content: React.ReactNode;
  }[];
  defaultValue?: string;
  className?: string;
}

export function SimpleTabs({ tabs, defaultValue, className }: SimpleTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue || tabs[0]?.value);

  return (
    <div className={cn('w-full', className)}>
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          {tabs.map(tab => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map(tab => (
          <TabsContent key={tab.value} value={tab.value}>
            {tab.content}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
