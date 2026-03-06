'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CyberStatCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'cyan' | 'purple' | 'pink' | 'green' | 'yellow';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  glow?: boolean;
}

/**
 * CyberStatCard Component
 * 赛博朋克风格的统计卡片
 */
export function CyberStatCard({
  title,
  value,
  icon: Icon,
  trend,
  color = 'cyan',
  size = 'md',
  className,
  glow = true,
}: CyberStatCardProps) {
  const colorStyles = {
    cyan: {
      bg: 'from-cyan-500/10 to-cyan-500/5',
      border: 'border-cyan-500/30',
      iconBg: 'bg-cyan-500/20',
      icon: 'text-cyan-400',
      trend: 'text-cyan-400',
      glow: glow ? 'shadow-[0_0_20px_rgba(6,182,212,0.3)]' : '',
    },
    purple: {
      bg: 'from-purple-500/10 to-purple-500/5',
      border: 'border-purple-500/30',
      iconBg: 'bg-purple-500/20',
      icon: 'text-purple-400',
      trend: 'text-purple-400',
      glow: glow ? 'shadow-[0_0_20px_rgba(168,85,247,0.3)]' : '',
    },
    pink: {
      bg: 'from-pink-500/10 to-pink-500/5',
      border: 'border-pink-500/30',
      iconBg: 'bg-pink-500/20',
      icon: 'text-pink-400',
      trend: 'text-pink-400',
      glow: glow ? 'shadow-[0_0_20px_rgba(236,72,153,0.3)]' : '',
    },
    green: {
      bg: 'from-green-500/10 to-green-500/5',
      border: 'border-green-500/30',
      iconBg: 'bg-green-500/20',
      icon: 'text-green-400',
      trend: 'text-green-400',
      glow: glow ? 'shadow-[0_0_20px_rgba(34,197,94,0.3)]' : '',
    },
    yellow: {
      bg: 'from-yellow-500/10 to-yellow-500/5',
      border: 'border-yellow-500/30',
      iconBg: 'bg-yellow-500/20',
      icon: 'text-yellow-400',
      trend: 'text-yellow-400',
      glow: glow ? 'shadow-[0_0_20px_rgba(234,179,8,0.3)]' : '',
    },
  };

  const sizeStyles = {
    sm: {
      card: 'p-4',
      icon: 'w-8 h-8',
      title: 'text-xs',
      value: 'text-lg',
    },
    md: {
      card: 'p-6',
      icon: 'w-10 h-10',
      title: 'text-sm',
      value: 'text-2xl',
    },
    lg: {
      card: 'p-8',
      icon: 'w-12 h-12',
      title: 'text-base',
      value: 'text-3xl',
    },
  };

  const styles = colorStyles[color];
  const sizes = sizeStyles[size];

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-lg border bg-gradient-to-br backdrop-blur-sm',
        styles.bg,
        styles.border,
        styles.glow,
        sizes.card,
        className
      )}
    >
      {/* 扫描线效果 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(6,182,212,0.03)_50%,transparent_100%)] bg-[length:100%_4px] animate-scan" />
      </div>

      <div className="relative flex items-start justify-between">
        {/* 左侧: 内容 */}
        <div className="space-y-2">
          <p className={cn('font-medium text-gray-600 dark:text-gray-400', sizes.title)}>
            {title}
          </p>
          <p className={cn('font-bold text-gray-900 dark:text-white', sizes.value)}>
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {trend && (
            <div className="flex items-center gap-1">
              <span className={cn('text-sm font-medium', styles.trend)}>
                {trend.isPositive ? '+' : '-'}
                {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-gray-500">vs last month</span>
            </div>
          )}
        </div>

        {/* 右侧: 图标 */}
        {Icon && (
          <div className={cn('rounded-lg flex items-center justify-center', styles.iconBg, sizes.icon)}>
            <Icon className={cn('shrink-0', styles.icon, size === 'sm' ? 'w-4 h-4' : 'w-6 h-6')} />
          </div>
        )}
      </div>

      {/* 装饰性边角 */}
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 rounded-tr-lg opacity-50 border-current text-gray-400" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 rounded-bl-lg opacity-50 border-current text-gray-400" />
    </div>
  );
}

/**
 * 统计卡片网格
 */
export function CyberStatGrid({
  children,
  columns = 4,
  className,
}: {
  children: React.ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}) {
  const gridStyles = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={cn('grid gap-4', gridStyles[columns], className)}>
      {children}
    </div>
  );
}

export default CyberStatCard;
