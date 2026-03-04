'use client';

/**
 * ChartCard - 赛博朋克风格图表卡片组件
 * 用于展示数据统计和可视化图表
 */

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';

export interface ChartCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeType?: 'absolute' | 'percentage';
  icon?: LucideIcon;
  chart?: React.ReactNode;
  description?: string;
  trend?: 'up' | 'down' | 'neutral';
  variant?: 'cyan' | 'purple' | 'pink' | 'green' | 'yellow';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  glow?: boolean;
  animated?: boolean;
}

const trendIcons = {
  up: TrendingUp,
  down: TrendingDown,
  neutral: Minus,
};

const variantColors = {
  cyan: {
    bg: 'from-cyber-cyan/10 to-transparent',
    border: 'border-cyber-cyan/30',
    text: 'text-cyber-cyan',
    glow: 'shadow-neon-cyan',
  },
  purple: {
    bg: 'from-cyber-purple/10 to-transparent',
    border: 'border-cyber-purple/30',
    text: 'text-cyber-purple',
    glow: 'shadow-neon-purple',
  },
  pink: {
    bg: 'from-cyber-pink/10 to-transparent',
    border: 'border-cyber-pink/30',
    text: 'text-cyber-pink',
    glow: 'shadow-neon-pink',
  },
  green: {
    bg: 'from-cyber-green/10 to-transparent',
    border: 'border-cyber-green/30',
    text: 'text-cyber-green',
    glow: 'shadow-neon-green',
  },
  yellow: {
    bg: 'from-cyber-yellow/10 to-transparent',
    border: 'border-cyber-yellow/30',
    text: 'text-cyber-yellow',
    glow: 'shadow-neon-yellow',
  },
};

const sizeStyles = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export function ChartCard({
  title,
  value,
  change = 0,
  changeType = 'percentage',
  icon: Icon,
  chart,
  description,
  trend = 'neutral',
  variant = 'cyan',
  size = 'md',
  className,
  glow = true,
  animated = true,
}: ChartCardProps) {
  const colors = variantColors[variant];
  const TrendIcon = trendIcons[trend];
  const sizeClass = sizeStyles[size];

  const changeDisplay = changeType === 'percentage' ? `${change > 0 ? '+' : ''}${change}%` : change;
  const trendColor = trend === 'up' ? 'text-cyber-green' : trend === 'down' ? 'text-cyber-pink' : 'cyber-muted';

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial={animated ? 'hidden' : false}
      animate={animated ? 'visible' : false}
      variants={cardVariants}
      transition={{ duration: 0.3 }}
      whileHover={animated ? { scale: 1.02, y: -2 } : undefined}
      className={cn(
        'relative overflow-hidden rounded-lg border bg-gradient-to-br backdrop-blur-sm',
        colors.bg,
        colors.border,
        glow && colors.glow,
        sizeClass,
        className
      )}
    >
      {/* 背景网格效果 */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-cyber-grid" />
      </div>

      {/* 扫描线动画 */}
      {animated && (
        <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
          <div className="absolute inset-0 animate-scan bg-gradient-to-b from-transparent via-cyber-cyan/5 to-transparent" />
        </div>
      )}

      <div className="relative z-10">
        {/* 头部 */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className={cn('p-2 rounded-lg bg-cyber-dark/50', colors.text)}>
                <Icon className="w-5 h-5" />
              </div>
            )}
            <div>
              <h3 className="text-sm font-display font-medium text-gray-400">{title}</h3>
              <p className="text-2xl font-bold font-display text-white mt-1">{value}</p>
            </div>
          </div>

          {/* 趋势指示器 */}
          {change !== 0 && (
            <div className={cn('flex items-center gap-1 text-sm font-medium', trendColor)}>
              <TrendIcon className="w-4 h-4" />
              <span>{changeDisplay}</span>
            </div>
          )}
        </div>

        {/* 图表区域 */}
        {chart && (
          <div className="my-4 h-32">
            {chart}
          </div>
        )}

        {/* 描述 */}
        {description && (
          <p className="text-xs text-gray-500 mt-2">{description}</p>
        )}
      </div>

      {/* 底部发光线 */}
      <div className={cn('absolute bottom-0 left-0 right-0 h-0.5', colors.bg.replace('to-transparent', 'to-cyber-dark'))} />
    </motion.div>
  );
}

/**
 * MetricCard - 简化版指标卡片
 */
export interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon?: LucideIcon;
  color?: 'cyan' | 'purple' | 'pink' | 'green' | 'yellow';
  trend?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function MetricCard({
  title,
  value,
  unit,
  icon: Icon,
  color = 'cyan',
  trend,
  size = 'md',
  className,
}: MetricCardProps) {
  const colors = variantColors[color];
  const sizeClass = sizeStyles[size];

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      className={cn(
        'relative overflow-hidden rounded-lg border bg-gradient-to-br backdrop-blur-sm',
        colors.bg,
        colors.border,
        sizeClass,
        className
      )}
    >
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-display font-medium text-gray-400">{title}</p>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-3xl font-bold font-display text-white">{value}</span>
              {unit && <span className="text-sm text-gray-500">{unit}</span>}
            </div>
            {trend !== undefined && (
              <div className={cn('flex items-center gap-1 text-sm mt-2', trend >= 0 ? 'text-cyber-green' : 'text-cyber-pink')}>
                {trend >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span>{Math.abs(trend)}%</span>
                <span className="text-gray-500 ml-1">vs last period</span>
              </div>
            )}
          </div>

          {Icon && (
            <div className={cn('p-3 rounded-lg bg-cyber-dark/50', colors.text)}>
              <Icon className="w-6 h-6" />
            </div>
          )}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-current to-transparent opacity-50" />
    </motion.div>
  );
}
