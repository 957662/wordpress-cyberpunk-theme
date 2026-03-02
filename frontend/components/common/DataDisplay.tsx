'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DataDisplayProps {
  data: Record<string, unknown> | unknown[];
  title?: string;
  collapsible?: boolean;
  defaultExpanded?: boolean;
  copyable?: boolean;
  className?: string;
}

export const DataDisplay: React.FC<DataDisplayProps> = ({
  data,
  title,
  collapsible = true,
  defaultExpanded = true,
  copyable = true,
  className,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const text = JSON.stringify(data, null, 2);
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderValue = (value: unknown, depth = 0): React.ReactNode => {
    if (value === null) return <span className="text-cyber-pink">null</span>;
    if (value === undefined) return <span className="text-cyber-pink">undefined</span>;

    if (typeof value === 'boolean') {
      return (
        <span className={cn(value ? 'text-green-400' : 'text-red-400')}>
          {String(value)}
        </span>
      );
    }

    if (typeof value === 'number') {
      return <span className="text-cyber-cyan">{value}</span>;
    }

    if (typeof value === 'string') {
      return <span className="text-cyber-purple">"{value}"</span>;
    }

    if (Array.isArray(value)) {
      return (
        <div className="ml-4">
          <span className="text-gray-400">[</span>
          <div className="ml-4">
            {value.map((item, index) => (
              <div key={index} className="border-l border-cyber-border pl-2">
                {renderValue(item, depth + 1)}
                {index < value.length - 1 && <span className="text-gray-400">,</span>}
              </div>
            ))}
          </div>
          <span className="text-gray-400">]</span>
        </div>
      );
    }

    if (typeof value === 'object') {
      return (
        <div className="ml-4">
          <span className="text-gray-400">{'{'}</span>
          <div className="ml-4">
            {Object.entries(value as Record<string, unknown>).map(([key, val], index, arr) => (
              <div key={key} className="border-l border-cyber-border pl-2">
                <span className="text-cyber-cyan">{key}</span>
                <span className="text-gray-400">: </span>
                {renderValue(val, depth + 1)}
                {index < arr.length - 1 && <span className="text-gray-400">,</span>}
              </div>
            ))}
          </div>
          <span className="text-gray-400">{'}'}</span>
        </div>
      );
    }

    return String(value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('cyber-card overflow-hidden', className)}
    >
      {/* Header */}
      <div
        className={cn(
          'flex items-center justify-between p-4 bg-cyber-darker border-b border-cyber-border',
          !collapsible && 'cursor-default'
        )}
        onClick={() => collapsible && setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          {collapsible && (
            <motion.div
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight className="w-4 h-4 text-cyber-cyan" />
            </motion.div>
          )}
          {title && (
            <h3 className="text-lg font-display font-bold text-white">{title}</h3>
          )}
        </div>
        {copyable && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              handleCopy();
            }}
            className="p-2 rounded-lg bg-cyber-dark border border-cyber-border hover:border-cyber-cyan transition-colors"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-400" />
            ) : (
              <Copy className="w-4 h-4 text-gray-400" />
            )}
          </motion.button>
        )}
      </div>

      {/* Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <pre className="p-4 bg-cyber-dark/50 font-mono text-sm overflow-x-auto">
              {renderValue(data)}
            </pre>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

interface KeyValueDisplayProps {
  items: Array<{
    key: string;
    value: React.ReactNode;
    label?: string;
  }>;
  columns?: number;
  className?: string;
}

export const KeyValueDisplay: React.FC<KeyValueDisplayProps> = ({
  items,
  columns = 2,
  className,
}) => {
  return (
    <div
      className={cn(
        'grid gap-4',
        columns === 1 && 'grid-cols-1',
        columns === 2 && 'grid-cols-1 md:grid-cols-2',
        columns === 3 && 'grid-cols-1 md:grid-cols-3',
        className
      )}
    >
      {items.map((item) => (
        <motion.div
          key={item.key}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="cyber-card p-4"
        >
          {item.label && (
            <div className="text-xs text-cyber-cyan mb-1">{item.label}</div>
          )}
          <div className="text-sm text-gray-400 mb-1">{item.key}</div>
          <div className="text-lg font-bold text-white">{item.value}</div>
        </motion.div>
      ))}
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon?: React.ComponentType<{ className?: string }>;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  trend = 'neutral',
  className,
}) => {
  const trendColors = {
    up: 'text-green-400',
    down: 'text-red-400',
    neutral: 'text-gray-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('cyber-card p-6', className)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-sm text-gray-400 mb-1">{title}</h3>
          <div className="text-3xl font-display font-bold text-white">{value}</div>
        </div>
        {Icon && (
          <div className="p-3 rounded-lg bg-cyber-dark border border-cyber-border">
            <Icon className="w-6 h-6 text-cyber-cyan" />
          </div>
        )}
      </div>
      {change !== undefined && (
        <div className="flex items-center gap-2">
          <span className={cn('text-sm font-medium', trendColors[trend])}>
            {trend === 'up' && '+'}
            {change}%
          </span>
          <span className="text-xs text-gray-500">较上周</span>
        </div>
      )}
    </motion.div>
  );
};
