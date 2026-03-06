/**
 * StatCard - 统计卡片组件
 * 用于展示数据统计信息
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface StatCardProps {
  /**
   * 标题
   */
  title: string;
  /**
   * 数值
   */
  value: string | number;
  /**
   * 图标
   */
  icon?: LucideIcon;
  /**
   * 变化趋势
   */
  trend?: {
    value: number;
    label?: string;
  };
  /**
   * 描述
   */
  description?: string;
  /**
   * 颜色主题
   */
  color?: 'cyan' | 'purple' | 'pink' | 'green' | 'yellow' | 'orange';
  /**
   * 自定义样式
   */
  className?: string;
  /**
   * 点击事件
   */
  onClick?: () => void;
  /**
   * 是否加载中
   */
  loading?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  description,
  color = 'cyan',
  className,
  onClick,
  loading = false,
}) => {
  const colorStyles = {
    cyan: {
      bg: 'bg-cyber-cyan/10',
      border: 'border-cyber-cyan/30',
      text: 'text-cyber-cyan',
      gradient: 'from-cyber-cyan/20 to-cyber-cyan/5',
    },
    purple: {
      bg: 'bg-cyber-purple/10',
      border: 'border-cyber-purple/30',
      text: 'text-cyber-purple',
      gradient: 'from-cyber-purple/20 to-cyber-purple/5',
    },
    pink: {
      bg: 'bg-cyber-pink/10',
      border: 'border-cyber-pink/30',
      text: 'text-cyber-pink',
      gradient: 'from-cyber-pink/20 to-cyber-pink/5',
    },
    green: {
      bg: 'bg-cyber-green/10',
      border: 'border-cyber-green/30',
      text: 'text-cyber-green',
      gradient: 'from-cyber-green/20 to-cyber-green/5',
    },
    yellow: {
      bg: 'bg-cyber-yellow/10',
      border: 'border-cyber-yellow/30',
      text: 'text-cyber-yellow',
      gradient: 'from-cyber-yellow/20 to-cyber-yellow/5',
    },
    orange: {
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/30',
      text: 'text-orange-500',
      gradient: 'from-orange-500/20 to-orange-500/5',
    },
  };

  const styles = colorStyles[color];

  const getTrendIcon = () => {
    if (!trend) return null;
    if (trend.value > 0) return <TrendingUp className="w-4 h-4" />;
    if (trend.value < 0) return <TrendingDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  const getTrendColor = () => {
    if (!trend) return '';
    if (trend.value > 0) return 'text-cyber-green';
    if (trend.value < 0) return 'text-cyber-pink';
    return 'text-gray-400';
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        'relative overflow-hidden rounded-xl border bg-gradient-to-br p-6 transition-all duration-300',
        styles.border,
        styles.gradient,
        onClick && 'cursor-pointer hover:shadow-lg',
        className
      )}
    >
      {/* 背景装饰 */}
      <div className={cn(
        'absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20',
        styles.bg
      )} />

      {/* 内容 */}
      <div className="relative">
        {/* 标题和图标 */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm text-gray-400 mb-1">{title}</p>
            {loading ? (
              <div className="h-8 w-24 bg-dark-bg/50 rounded animate-pulse" />
            ) : (
              <h3 className="text-3xl font-bold text-white">
                {value}
              </h3>
            )}
          </div>

          {Icon && (
            <div className={cn(
              'p-3 rounded-lg',
              styles.bg
            )}>
              <Icon className={cn('w-6 h-6', styles.text)} />
            </div>
          )}
        </div>

        {/* 趋势 */}
        {trend && (
          <div className={cn(
            'flex items-center gap-1 text-sm',
            getTrendColor()
          )}>
            {getTrendIcon()}
            <span className="font-medium">
              {trend.value > 0 ? '+' : ''}{trend.value}%
            </span>
            {trend.label && (
              <span className="text-gray-500 ml-1">{trend.label}</span>
            )}
          </div>
        )}

        {/* 描述 */}
        {description && (
          <p className="text-xs text-gray-500 mt-2">{description}</p>
        )}
      </div>
    </motion.div>
  );
};

/**
 * 统计卡片网格
 */
export interface StatCardGridProps {
  cards: Omit<StatCardProps, 'loading'>[];
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export const StatCardGrid: React.FC<StatCardGridProps> = ({
  cards,
  columns = 4,
  className,
}) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={cn('grid gap-4', gridCols[columns], className)}>
      {cards.map((card, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <StatCard {...card} />
        </motion.div>
      ))}
    </div>
  );
};

/**
 * 迷你统计卡片
 */
export interface MiniStatCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  color?: 'cyan' | 'purple' | 'pink' | 'green';
  onClick?: () => void;
}

export const MiniStatCard: React.FC<MiniStatCardProps> = ({
  label,
  value,
  icon: Icon,
  color = 'cyan',
  onClick,
}) => {
  const colorStyles = {
    cyan: 'text-cyber-cyan border-cyber-cyan/30 bg-cyber-cyan/10',
    purple: 'text-cyber-purple border-cyber-purple/30 bg-cyber-purple/10',
    pink: 'text-cyber-pink border-cyber-pink/30 bg-cyber-pink/10',
    green: 'text-cyber-green border-cyber-green/30 bg-cyber-green/10',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-lg border transition-all duration-200 cursor-pointer',
        colorStyles[color]
      )}
    >
      {Icon && <Icon className="w-5 h-5" />}
      <div className="flex-1">
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-lg font-bold">{value}</p>
      </div>
    </motion.div>
  );
};

export default StatCard;
