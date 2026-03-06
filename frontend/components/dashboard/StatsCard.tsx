'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  period?: string;
  icon?: React.ReactNode;
  color?: 'cyan' | 'purple' | 'pink' | 'green' | 'yellow' | 'orange';
  className?: string;
  onClick?: () => void;
}

const colorStyles = {
  cyan: {
    bg: 'bg-cyber-cyan/10',
    border: 'border-cyber-cyan/30',
    text: 'text-cyber-cyan',
    glow: 'shadow-[0_0_20px_rgba(0,240,255,0.3)]',
  },
  purple: {
    bg: 'bg-cyber-purple/10',
    border: 'border-cyber-purple/30',
    text: 'text-cyber-purple',
    glow: 'shadow-[0_0_20px_rgba(157,0,255,0.3)]',
  },
  pink: {
    bg: 'bg-cyber-pink/10',
    border: 'border-cyber-pink/30',
    text: 'text-cyber-pink',
    glow: 'shadow-[0_0_20px_rgba(255,0,128,0.3)]',
  },
  green: {
    bg: 'bg-cyber-green/10',
    border: 'border-cyber-green/30',
    text: 'text-cyber-green',
    glow: 'shadow-[0_0_20px_rgba(0,255,136,0.3)]',
  },
  yellow: {
    bg: 'bg-cyber-yellow/10',
    border: 'border-cyber-yellow/30',
    text: 'text-cyber-yellow',
    glow: 'shadow-[0_0_20px_rgba(240,255,0,0.3)]',
  },
  orange: {
    bg: 'bg-cyber-orange/10',
    border: 'border-cyber-orange/30',
    text: 'text-cyber-orange',
    glow: 'shadow-[0_0_20px_rgba(255,165,0,0.3)]',
  },
};

const changeIcons = {
  increase: TrendingUp,
  decrease: TrendingDown,
  neutral: Minus,
};

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  changeType = 'neutral',
  period,
  icon,
  color = 'cyan',
  className,
  onClick,
}) => {
  const styles = colorStyles[color];
  const ChangeIcon = changeType ? changeIcons[changeType] : Minus;
  const changeColor = changeType === 'increase' ? 'text-cyber-green' :
                     changeType === 'decrease' ? 'text-cyber-pink' :
                     'text-gray-400';

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        'relative overflow-hidden rounded-lg border bg-deep-black/80 backdrop-blur-sm p-6',
        styles.border,
        styles.glow,
        onClick && 'cursor-pointer',
        className
      )}
    >
      {/* Background decoration */}
      <div className={cn('absolute inset-0 opacity-5', styles.bg)} />

      {/* Content */}
      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className={cn('p-2 rounded-lg', styles.bg)}>
            {icon}
          </div>
          {change !== undefined && (
            <div className={cn('flex items-center gap-1 text-sm font-medium', changeColor)}>
              <ChangeIcon className="w-4 h-4" />
              <span>{Math.abs(change)}%</span>
            </div>
          )}
        </div>

        {/* Value */}
        <div className="mb-1">
          <h3 className={cn('text-3xl font-bold', styles.text)}>
            {value}
          </h3>
        </div>

        {/* Title */}
        <p className="text-sm text-gray-400 mb-1">{title}</p>

        {/* Period */}
        {period && (
          <p className="text-xs text-gray-500">{period}</p>
        )}
      </div>

      {/* Decorative line */}
      <div className={cn('absolute bottom-0 left-0 h-0.5', styles.bg, 'w-full')} />
    </motion.div>
  );
};

// 统计卡片网格组件
export const StatsGrid: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4', className)}>
      {children}
    </div>
  );
};

// 预设的统计卡片配置
export const statsCardPresets = {
  totalViews: {
    title: '总浏览量',
    value: '12.5K',
    change: 12.5,
    changeType: 'increase' as const,
    period: '本周',
    color: 'cyan' as const,
    icon: <TrendingUp className="w-6 h-6 text-cyber-cyan" />,
  },
  totalLikes: {
    title: '总点赞数',
    value: '3.2K',
    change: 8.3,
    changeType: 'increase' as const,
    period: '本周',
    color: 'pink' as const,
    icon: <TrendingUp className="w-6 h-6 text-cyber-pink" />,
  },
  totalComments: {
    title: '总评论数',
    value: '856',
    change: -2.4,
    changeType: 'decrease' as const,
    period: '本周',
    color: 'purple' as const,
    icon: <TrendingDown className="w-6 h-6 text-cyber-purple" />,
  },
  totalShares: {
    title: '总分享数',
    value: '423',
    change: 0,
    changeType: 'neutral' as const,
    period: '本周',
    color: 'green' as const,
    icon: <Minus className="w-6 h-6 text-cyber-green" />,
  },
};

export default StatsCard;
