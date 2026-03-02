/**
 * CyberStatCard - 赛博朋克风格统计卡片组件
 *
 * 用于展示统计数据和指标的卡片
 */

'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface CyberStatCardProps {
  /** 标题 */
  title: string;
  /** 数值 */
  value: string | number;
  /** 变化率 */
  change?: number;
  /** 图标 */
  icon?: React.ReactNode;
  /** 颜色主题 */
  color?: 'cyan' | 'purple' | 'pink' | 'yellow' | 'green' | 'orange';
  /** 是否加载中 */
  loading?: boolean;
  /** 趋势图 */
  sparkline?: number[];
  /** 额外的类名 */
  className?: string;
}

const colorStyles = {
  cyan: {
    bg: 'bg-cyber-cyan/10',
    text: 'text-cyber-cyan',
    border: 'border-cyber-cyan',
    positive: 'text-cyber-green',
    negative: 'text-cyber-pink',
    glow: 'shadow-neon-cyan',
  },
  purple: {
    bg: 'bg-cyber-purple/10',
    text: 'text-cyber-purple',
    border: 'border-cyber-purple',
    positive: 'text-cyber-green',
    negative: 'text-cyber-pink',
    glow: 'shadow-neon-purple',
  },
  pink: {
    bg: 'bg-cyber-pink/10',
    text: 'text-cyber-pink',
    border: 'border-cyber-pink',
    positive: 'text-cyber-green',
    negative: 'text-cyber-cyan',
    glow: 'shadow-neon-pink',
  },
  yellow: {
    bg: 'bg-cyber-yellow/10',
    text: 'text-cyber-yellow',
    border: 'border-cyber-yellow',
    positive: 'text-cyber-green',
    negative: 'text-cyber-pink',
    glow: 'shadow-neon-yellow',
  },
  green: {
    bg: 'bg-cyber-green/10',
    text: 'text-cyber-green',
    border: 'border-cyber-green',
    positive: 'text-cyber-cyan',
    negative: 'text-cyber-pink',
    glow: 'shadow-glow-green',
  },
  orange: {
    bg: 'bg-cyber-orange/10',
    text: 'text-cyber-orange',
    border: 'border-cyber-orange',
    positive: 'text-cyber-green',
    negative: 'text-cyber-pink',
    glow: 'shadow-glow-orange',
  },
};

export function CyberStatCard({
  title,
  value,
  change,
  icon,
  color = 'cyan',
  loading = false,
  sparkline,
  className,
}: CyberStatCardProps) {
  const styles = colorStyles[color];

  if (loading) {
    return (
      <div className={cn(
        'p-6 rounded-lg border border-cyber-border bg-cyber-card',
        className
      )}>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-cyber-muted rounded w-1/2" />
          <div className="h-8 bg-cyber-muted rounded w-3/4" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className={cn(
        'relative p-6 rounded-lg border bg-cyber-card overflow-hidden',
        styles.border,
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
    >
      {/* 背景光晕 */}
      <motion.div
        className={cn('absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-20', styles.bg)}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* 内容 */}
      <div className="relative">
        {/* 头部 */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className="text-sm text-gray-500 mb-1">{title}</p>
            <h3 className={cn('text-3xl font-bold font-display', styles.text)}>
              {value}
            </h3>
          </div>

          {icon && (
            <div className={cn('p-2 rounded-lg', styles.bg)}>
              <div className={cn('w-6 h-6', styles.text)}>
                {icon}
              </div>
            </div>
          )}
        </div>

        {/* 变化率 */}
        {change !== undefined && (
          <div className="flex items-center gap-2">
            <motion.span
              className={cn(
                'text-sm font-medium flex items-center gap-1',
                change >= 0 ? styles.positive : styles.negative
              )}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {change >= 0 ? '↑' : '↓'}
              {Math.abs(change)}%
            </motion.span>
            <span className="text-xs text-gray-500">vs 上期</span>
          </div>
        )}

        {/* 趋势图 */}
        {sparkline && sparkline.length > 0 && (
          <div className="mt-4">
            <svg
              viewBox="0 0 100 20"
              className="w-full h-12"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={colorStyles[color].text.replace('text-', '').replace('-cyan', '#00f0ff').replace('-purple', '#9d00ff').replace('-pink', '#ff0080').replace('-yellow', '#f0ff00').replace('-green', '#00ff88').replace('-orange', '#ff6600')} stopOpacity="0.3" />
                  <stop offset="100%" stopColor={colorStyles[color].text.replace('text-', '').replace('-cyan', '#00f0ff').replace('-purple', '#9d00ff').replace('-pink', '#ff0080').replace('-yellow', '#f0ff00').replace('-green', '#00ff88').replace('-orange', '#ff6600')} stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d={`M0,${20 - sparkline[0] * 20} ${sparkline.map((val, i) => `L${i * 100 / (sparkline.length - 1)},${20 - val * 20}`).join(' ')}`}
                fill={`url(#gradient-${color})`}
                stroke={colorStyles[color].text.replace('text-', '').replace('-cyan', '#00f0ff').replace('-purple', '#9d00ff').replace('-pink', '#ff0080').replace('-yellow', '#f0ff00').replace('-green', '#00ff88').replace('-orange', '#ff6600')}
                strokeWidth="1.5"
                fillOpacity="0.5"
              />
            </svg>
          </div>
        )}
      </div>
    </motion.div>
  );
}

/**
 * CyberStatGrid - 统计卡片网格
 */
export interface CyberStatGridProps {
  items: Omit<CyberStatCardProps, 'color'>[];
  columns?: 2 | 3 | 4;
  color?: 'cyan' | 'purple' | 'pink' | 'yellow' | 'green' | 'orange';
  className?: string;
}

const colorKeys: Array<'cyan' | 'purple' | 'pink' | 'yellow' | 'green' | 'orange'> = [
  'cyan', 'purple', 'pink', 'yellow', 'green', 'orange'
];

export function CyberStatGrid({
  items,
  columns = 3,
  color,
  className,
}: CyberStatGridProps) {
  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={cn('grid gap-4', gridCols[columns], className)}>
      {items.map((item, index) => (
        <CyberStatCard
          key={index}
          {...item}
          color={color || colorKeys[index % colorKeys.length]}
        />
      ))}
    </div>
  );
}
