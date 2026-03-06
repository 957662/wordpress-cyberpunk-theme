'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon?: React.ReactNode;
  description?: string;
  trend?: number[];
  size?: 'sm' | 'md' | 'lg';
  color?: 'cyan' | 'purple' | 'pink' | 'green' | 'orange' | 'blue';
  className?: string;
}

const colorStyles = {
  cyan: {
    bg: 'from-cyan-500/20 to-blue-500/20',
    border: 'border-cyan-500/30',
    text: 'text-cyan-400',
    glow: 'shadow-cyan-500/20',
  },
  purple: {
    bg: 'from-purple-500/20 to-pink-500/20',
    border: 'border-purple-500/30',
    text: 'text-purple-400',
    glow: 'shadow-purple-500/20',
  },
  pink: {
    bg: 'from-pink-500/20 to-rose-500/20',
    border: 'border-pink-500/30',
    text: 'text-pink-400',
    glow: 'shadow-pink-500/20',
  },
  green: {
    bg: 'from-green-500/20 to-emerald-500/20',
    border: 'border-green-500/30',
    text: 'text-green-400',
    glow: 'shadow-green-500/20',
  },
  orange: {
    bg: 'from-orange-500/20 to-amber-500/20',
    border: 'border-orange-500/30',
    text: 'text-orange-400',
    glow: 'shadow-orange-500/20',
  },
  blue: {
    bg: 'from-blue-500/20 to-indigo-500/20',
    border: 'border-blue-500/30',
    text: 'text-blue-400',
    glow: 'shadow-blue-500/20',
  },
};

export function StatCard({
  title,
  value,
  change,
  changeType,
  icon,
  description,
  trend,
  size = 'md',
  color = 'cyan',
  className,
}: StatCardProps) {
  const styles = colorStyles[color];

  const sizeClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const valueSizeClasses = {
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-4xl',
  };

  const renderTrendIcon = () => {
    if (changeType === 'increase') {
      return <TrendingUp className="w-4 h-4 text-green-400" />;
    }
    if (changeType === 'decrease') {
      return <TrendingDown className="w-4 h-4 text-red-400" />;
    }
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const renderMiniChart = () => {
    if (!trend || trend.length < 2) return null;

    const max = Math.max(...trend);
    const min = Math.min(...trend);
    const range = max - min || 1;

    const points = trend
      .map((value, index) => {
        const x = (index / (trend.length - 1)) * 100;
        const y = 100 - ((value - min) / range) * 100;
        return `${x},${y}`;
      })
      .join(' ');

    return (
      <svg
        viewBox="0 0 100 100"
        className="w-full h-16 opacity-50"
        preserveAspectRatio="none"
      >
        <polyline
          points={points}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={styles.text}
        />
      </svg>
    );
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      className={cn(
        'relative overflow-hidden rounded-xl border',
        'bg-gradient-to-br',
        styles.bg,
        styles.border,
        styles.glow,
        'shadow-lg hover:shadow-xl transition-all duration-300',
        sizeClasses[size],
        className
      )}
    >
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full" style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
        }} />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className="text-sm text-gray-400 mb-1">{title}</p>
            <motion.h3
              className={cn('font-bold text-white', valueSizeClasses[size])}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            >
              {value}
            </motion.h3>
          </div>

          {icon && (
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className={cn('p-3 rounded-lg bg-white/10', styles.text)}
            >
              {icon}
            </motion.div>
          )}
        </div>

        {/* Change Indicator */}
        {change !== undefined && (
          <div className="flex items-center gap-2 mb-3">
            {renderTrendIcon()}
            <span
              className={cn(
                'text-sm font-medium',
                changeType === 'increase' && 'text-green-400',
                changeType === 'decrease' && 'text-red-400',
                changeType === 'neutral' && 'text-gray-400'
              )}
            >
              {change > 0 ? '+' : ''}{change}%
            </span>
            <span className="text-xs text-gray-400">vs 上个月</span>
          </div>
        )}

        {/* Trend Chart */}
        {trend && trend.length > 1 && (
          <div className="mb-3">
            {renderMiniChart()}
          </div>
        )}

        {/* Description */}
        {description && (
          <p className="text-xs text-gray-400 mt-3">{description}</p>
        )}
      </div>

      {/* Glow Effect */}
      <div className={cn(
        'absolute -bottom-4 -right-4 w-24 h-24 rounded-full blur-2xl opacity-30',
        styles.bg.replace('/20', '/40')
      )} />
    </motion.div>
  );
}

interface StatGridProps {
  stats: StatCardProps[];
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export function StatGrid({ stats, columns = 4, className }: StatGridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={cn('grid gap-4', gridCols[columns], className)}>
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <StatCard {...stat} />
        </motion.div>
      ))}
    </div>
  );
}

interface StatProgressProps {
  title: string;
  current: number;
  total: number;
  size?: 'sm' | 'md' | 'lg';
  color?: 'cyan' | 'purple' | 'pink' | 'green' | 'orange' | 'blue';
  showPercentage?: boolean;
  className?: string;
}

export function StatProgress({
  title,
  current,
  total,
  size = 'md',
  color = 'cyan',
  showPercentage = true,
  className,
}: StatProgressProps) {
  const styles = colorStyles[color];
  const percentage = Math.round((current / total) * 100);

  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-400">{title}</span>
        {showPercentage && (
          <span className={cn('text-sm font-medium', styles.text)}>
            {percentage}%
          </span>
        )}
      </div>

      <div className={cn('w-full bg-gray-700/50 rounded-full overflow-hidden', sizeClasses[size])}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={cn('h-full rounded-full', styles.bg.replace('/20', ''))}
        />
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{current.toLocaleString()}</span>
        <span>总计 {total.toLocaleString()}</span>
      </div>
    </div>
  );
}
