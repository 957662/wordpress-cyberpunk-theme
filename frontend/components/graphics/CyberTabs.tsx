'use client';

import React, { createContext, useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

const useTabsContext = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs components must be used within a Tabs provider');
  }
  return context;
};

export interface CyberTabsProps {
  defaultValue: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  variant?: 'default' | 'neon' | 'pill';
  className?: string;
}

export const CyberTabs: React.FC<CyberTabsProps> = ({
  defaultValue,
  value: controlledValue,
  onValueChange,
  children,
  variant = 'default',
  className,
}) => {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const value = controlledValue ?? uncontrolledValue;
  const setActiveTab = (newValue: string) => {
    if (controlledValue === undefined) {
      setUncontrolledValue(newValue);
    }
    onValueChange?.(newValue);
  };

  const variantStyles = {
    default: 'bg-white/5 border border-white/10',
    neon: 'bg-cyber-cyan/10 border border-cyber-cyan/30',
    pill: 'bg-transparent gap-2',
  };

  return (
    <TabsContext.Provider value={{ activeTab: value, setActiveTab }}>
      <div className={cn('flex flex-col', className)}>
        <div
          className={cn(
            'inline-flex p-1 rounded-lg',
            variantStyles[variant]
          )}
        >
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child) && child.type === CyberTabsList) {
              return child;
            }
            return null;
          })}
        </div>

        <div className="mt-4">
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child) && child.type === CyberTabsContent) {
              return child;
            }
            return null;
          })}
        </div>
      </div>
    </TabsContext.Provider>
  );
};

export interface CyberTabsListProps {
  children: React.ReactNode;
  className?: string;
}

export const CyberTabsList: React.FC<CyberTabsListProps> = ({ children, className }) => {
  return <div className={cn('flex items-center', className)}>{children}</div>;
};

export interface CyberTabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export const CyberTabsTrigger: React.FC<CyberTabsTriggerProps> = ({
  value,
  children,
  className,
}) => {
  const { activeTab, setActiveTab } = useTabsContext();
  const isActive = activeTab === value;

  return (
    <motion.button
      onClick={() => setActiveTab(value)}
      className={cn(
        'relative px-4 py-2 rounded-md font-medium transition-all',
        'text-sm',
        isActive
          ? 'text-white'
          : 'text-white/60 hover:text-white/80',
        className
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {isActive && (
        <motion.div
          layoutId="activeTab"
          className="absolute inset-0 bg-gradient-to-r from-cyber-cyan/20 to-cyber-purple/20 rounded-md border border-cyber-cyan/30"
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      )}

      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};

export interface CyberTabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export const CyberTabsContent: React.FC<CyberTabsContentProps> = ({
  value,
  children,
  className,
}) => {
  const { activeTab } = useTabsContext();
  const isActive = activeTab === value;

  if (!isActive) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
