'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DashboardCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
  };
  description?: string;
  color?: 'cyan' | 'purple' | 'pink' | 'green' | 'yellow' | 'red';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

const colorClasses = {
  cyan: {
    bg: 'from-cyan-500/10 to-cyan-500/5',
    border: 'border-cyan-500/30',
    text: 'text-cyan-400',
    glow: 'hover:shadow-cyan-500/20'
  },
  purple: {
    bg: 'from-purple-500/10 to-purple-500/5',
    border: 'border-purple-500/30',
    text: 'text-purple-400',
    glow: 'hover:shadow-purple-500/20'
  },
  pink: {
    bg: 'from-pink-500/10 to-pink-500/5',
    border: 'border-pink-500/30',
    text: 'text-pink-400',
    glow: 'hover:shadow-pink-500/20'
  },
  green: {
    bg: 'from-green-500/10 to-green-500/5',
    border: 'border-green-500/30',
    text: 'text-green-400',
    glow: 'hover:shadow-green-500/20'
  },
  yellow: {
    bg: 'from-yellow-500/10 to-yellow-500/5',
    border: 'border-yellow-500/30',
    text: 'text-yellow-400',
    glow: 'hover:shadow-yellow-500/20'
  },
  red: {
    bg: 'from-red-500/10 to-red-500/5',
    border: 'border-red-500/30',
    text: 'text-red-400',
    glow: 'hover:shadow-red-500/20'
  }
};

const sizeClasses = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8'
};

export function DashboardCard({
  title,
  value,
  icon,
  trend,
  description,
  color = 'cyan',
  size = 'md',
  className,
  onClick
}: DashboardCardProps) {
  const colors = colorClasses[color];

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        'relative overflow-hidden rounded-xl border-2 bg-gradient-to-br backdrop-blur-sm',
        'transition-all duration-300',
        colors.bg,
        colors.border,
        colors.glow,
        sizeClasses[size],
        onClick && 'cursor-pointer',
        className
      )}
    >
      {/* 背景装饰 */}
      <div className={cn(
        'absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-10 blur-2xl',
        color === 'cyan' && 'bg-cyan-500',
        color === 'purple' && 'bg-purple-500',
        color === 'pink' && 'bg-pink-500',
        color === 'green' && 'bg-green-500',
        color === 'yellow' && 'bg-yellow-500',
        color === 'red' && 'bg-red-500'
      )} />

      {/* 内容 */}
      <div className="relative">
        {/* 标题和图标 */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className="text-sm text-gray-400 mb-1">{title}</p>
            <h3 className="text-3xl font-bold text-white">{value}</h3>
          </div>
          
          {icon && (
            <div className={cn(
              'p-3 rounded-lg bg-gradient-to-br',
              color === 'cyan' && 'from-cyan-500/20 to-blue-500/20 text-cyan-400',
              color === 'purple' && 'from-purple-500/20 to-pink-500/20 text-purple-400',
              color === 'pink' && 'from-pink-500/20 to-rose-500/20 text-pink-400',
              color === 'green' && 'from-green-500/20 to-emerald-500/20 text-green-400',
              color === 'yellow' && 'from-yellow-500/20 to-orange-500/20 text-yellow-400',
              color === 'red' && 'from-red-500/20 to-pink-500/20 text-red-400'
            )}>
              {icon}
            </div>
          )}
        </div>

        {/* 趋势和描述 */}
        <div className="space-y-2">
          {trend && (
            <div className="flex items-center gap-2">
              {trend.direction === 'up' && <TrendingUp className="text-green-500" size={16} />}
              {trend.direction === 'down' && <TrendingDown className="text-red-500" size={16} />}
              {trend.direction === 'neutral' && <Minus className="text-gray-500" size={16} />}
              
              <span className={cn(
                'text-sm font-medium',
                trend.direction === 'up' && 'text-green-400',
                trend.direction === 'down' && 'text-red-400',
                trend.direction === 'neutral' && 'text-gray-400'
              )}>
                {trend.value > 0 ? '+' : ''}{trend.value}%
              </span>
              
              <span className="text-xs text-gray-500">较上周</span>
            </div>
          )}

          {description && (
            <p className="text-xs text-gray-500">{description}</p>
          )}
        </div>
      </div>

      {/* 发光效果 */}
      <motion.div
        className={cn(
          'absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity',
          'bg-gradient-to-r from-transparent via-white/5 to-transparent'
        )}
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%']
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: 'reverse'
        }}
      />
    </motion.div>
  );
}
