'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  description?: string;
  color?: 'cyan' | 'purple' | 'pink' | 'green' | 'yellow';
  className?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  description,
  color = 'cyan',
  className,
  onClick
}) => {
  const colorClasses = {
    cyan: {
      bg: 'bg-cyber-cyan/10',
      border: 'border-cyber-cyan/30',
      text: 'text-cyber-cyan',
      iconBg: 'bg-cyber-cyan/20'
    },
    purple: {
      bg: 'bg-cyber-purple/10',
      border: 'border-cyber-purple/30',
      text: 'text-cyber-purple',
      iconBg: 'bg-cyber-purple/20'
    },
    pink: {
      bg: 'bg-cyber-pink/10',
      border: 'border-cyber-pink/30',
      text: 'text-cyber-pink',
      iconBg: 'bg-cyber-pink/20'
    },
    green: {
      bg: 'bg-cyber-green/10',
      border: 'border-cyber-green/30',
      text: 'text-cyber-green',
      iconBg: 'bg-cyber-green/20'
    },
    yellow: {
      bg: 'bg-cyber-yellow/10',
      border: 'border-cyber-yellow/30',
      text: 'text-cyber-yellow',
      iconBg: 'bg-cyber-yellow/20'
    }
  };

  const colors = colorClasses[color];

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        'relative p-6 rounded-xl border backdrop-blur-sm',
        colors.bg,
        colors.border,
        'hover:shadow-lg hover:shadow-cyber-cyan/10',
        'transition-all duration-200',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {/* 头部 */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm text-gray-400 mb-1">{title}</p>
          <h3 className={cn('text-3xl font-bold', colors.text)}>
            {value}
          </h3>
        </div>

        {Icon && (
          <div className={cn('p-3 rounded-lg', colors.iconBg)}>
            <Icon className={cn('w-6 h-6', colors.text)} />
          </div>
        )}
      </div>

      {/* 趋势 */}
      {trend && (
        <div className="flex items-center gap-2 mb-2">
          {trend.isPositive ? (
            <TrendingUp className={cn('w-4 h-4', colors.text)} />
          ) : (
            <TrendingDown className="w-4 h-4 text-cyber-pink" />
          )}
          <span
            className={cn(
              'text-sm font-semibold',
              trend.isPositive ? colors.text : 'text-cyber-pink'
            )}
          >
            {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
          </span>
          <span className="text-xs text-gray-500">vs 上月</span>
        </div>
      )}

      {/* 描述 */}
      {description && (
        <p className="text-xs text-gray-500">{description}</p>
      )}

      {/* 装饰线 */}
      <div className={cn('absolute bottom-0 left-0 h-1', colors.bg, 'rounded-b-xl')} style={{ width: `${Math.min(100, Math.max(0, typeof trend?.value === 'number' ? trend.value : 50))}%` }} />
    </motion.div>
  );
};

// 小型统计卡片
export const StatCardMini: React.FC<{
  label: string;
  value: string | number;
  icon?: LucideIcon;
  color?: 'cyan' | 'purple' | 'pink' | 'green';
  trend?: number;
  className?: string;
}> = ({ label, value, icon: Icon, color = 'cyan', trend, className }) => {
  const colorClasses = {
    cyan: 'text-cyber-cyan border-cyber-cyan/30',
    purple: 'text-cyber-purple border-cyber-purple/30',
    pink: 'text-cyber-pink border-cyber-pink/30',
    green: 'text-cyber-green border-cyber-green/30'
  };

  const colors = colorClasses[color];

  return (
    <div className={cn(
      'p-4 rounded-lg border bg-cyber-dark/50',
      colors,
      className
    )}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500 mb-1">{label}</p>
          <p className={cn('text-xl font-bold', colors.split(' ')[0])}>
            {value}
          </p>
          {trend !== undefined && (
            <p className={cn(
              'text-xs mt-1',
              trend >= 0 ? 'text-cyber-green' : 'text-cyber-pink'
            )}>
              {trend >= 0 ? '+' : ''}{trend}%
            </p>
          )}
        </div>
        {Icon && (
          <Icon className={cn('w-8 h-8 opacity-50', colors.split(' ')[0])} />
        )}
      </div>
    </div>
  );
};

// 统计卡片网格
export const StatCardGrid: React.FC<{
  stats: Array<{
    title: string;
    value: string | number;
    icon?: LucideIcon;
    trend?: number;
    color?: 'cyan' | 'purple' | 'pink' | 'green';
  }>;
  columns?: 2 | 3 | 4;
  className?: string;
}> = ({ stats, columns = 4, className }) => {
  return (
    <div className={cn(
      'grid gap-4',
      columns === 2 && 'grid-cols-2',
      columns === 3 && 'grid-cols-3',
      columns === 4 && 'grid-cols-4',
      className
    )}>
      {stats.map((stat, index) => (
        <StatCardMini
          key={index}
          {...stat}
          color={stat.color || 'cyan'}
        />
      ))}
    </div>
  );
};

export default StatCard;
