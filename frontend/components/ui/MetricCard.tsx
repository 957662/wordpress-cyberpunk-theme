/**
 * MetricCard Component
 * 指标卡片组件
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';

export interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon?: React.ReactNode;
  description?: string;
  className?: string;
  trend?: 'up' | 'down' | 'neutral';
}

const trendIcons = {
  up: ArrowUp,
  down: ArrowDown,
  neutral: Minus,
};

const trendColors = {
  up: 'text-cyber-green',
  down: 'text-cyber-pink',
  neutral: 'text-gray-400',
};

export function MetricCard({
  title,
  value,
  change,
  changeType = 'neutral',
  icon,
  description,
  className,
  trend = 'neutral',
}: MetricCardProps) {
  const TrendIcon = trendIcons[trend];

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={cn(
        'relative bg-cyber-card border border-cyber-border rounded-xl p-6',
        'hover:border-cyber-cyan/50 transition-colors duration-300',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-400 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-white">{value}</h3>
        </div>
        {icon && (
          <div className="flex-shrink-0 ml-4">
            <div className="w-12 h-12 bg-cyber-muted rounded-lg flex items-center justify-center text-cyber-cyan">
              {icon}
            </div>
          </div>
        )}
      </div>

      {/* Change indicator */}
      {change !== undefined && (
        <div className="flex items-center gap-2 mb-2">
          <TrendIcon className={cn('w-4 h-4', trendColors[trend])} />
          <span className={cn('text-sm font-medium', trendColors[trend])}>
            {change > 0 ? '+' : ''}{change}%
          </span>
          <span className="text-sm text-gray-400">vs last period</span>
        </div>
      )}

      {/* Description */}
      {description && (
        <p className="text-sm text-gray-400 mt-2">{description}</p>
      )}

      {/* Decorative glow */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-cyber-cyan/0 to-cyber-purple/0 rounded-xl group-hover:from-cyber-cyan/10 group-hover:to-cyber-purple/10 transition-opacity duration-300 -z-10" />
    </motion.div>
  );
}

export function MetricCardGroup({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6', className)}>
      {children}
    </div>
  );
}
