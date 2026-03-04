'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export type ProgressColor = 'cyan' | 'purple' | 'pink' | 'green' | 'yellow';
export type ProgressSize = 'sm' | 'md' | 'lg';

export interface CyberProgressProps {
  value: number;
  max?: number;
  color?: ProgressColor;
  size?: ProgressSize;
  glow?: boolean;
  striped?: boolean;
  animated?: boolean;
  showLabel?: boolean;
  labelFormat?: (value: number, max: number) => string;
  className?: string;
}

const colorClasses = {
  cyan: {
    bg: 'bg-cyan-500',
    shadow: 'shadow-cyan-500/50',
    gradient: 'from-cyan-400 to-cyan-600',
  },
  purple: {
    bg: 'bg-purple-500',
    shadow: 'shadow-purple-500/50',
    gradient: 'from-purple-400 to-purple-600',
  },
  pink: {
    bg: 'bg-pink-500',
    shadow: 'shadow-pink-500/50',
    gradient: 'from-pink-400 to-pink-600',
  },
  green: {
    bg: 'bg-green-500',
    shadow: 'shadow-green-500/50',
    gradient: 'from-green-400 to-green-600',
  },
  yellow: {
    bg: 'bg-yellow-500',
    shadow: 'shadow-yellow-500/50',
    gradient: 'from-yellow-400 to-yellow-600',
  },
};

const sizeClasses = {
  sm: {
    container: 'h-1',
    label: 'text-xs',
  },
  md: {
    container: 'h-2',
    label: 'text-sm',
  },
  lg: {
    container: 'h-3',
    label: 'text-base',
  },
};

export const CyberProgress: React.FC<CyberProgressProps> = ({
  value,
  max = 100,
  color = 'cyan',
  size = 'md',
  glow = false,
  striped = false,
  animated = false,
  showLabel = false,
  labelFormat,
  className,
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const colorClass = colorClasses[color];
  const sizeClass = sizeClasses[size];

  return (
    <div className={cn('w-full', className)}>
      {/* 标签 */}
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className={cn('font-medium', sizeClass.label)}>
            {labelFormat ? labelFormat(value, max) : `${value} / ${max}`}
          </span>
          <span className={cn('text-muted-foreground', sizeClass.label)}>
            {percentage.toFixed(0)}%
          </span>
        </div>
      )}

      {/* 进度条容器 */}
      <div
        className={cn(
          'relative w-full overflow-hidden rounded-full bg-white/10 border border-white/20',
          sizeClass.container
        )}
      >
        {/* 进度条 */}
        <motion.div
          className={cn(
            'h-full rounded-full',
            'bg-gradient-to-r',
            colorClass.gradient,
            glow && `shadow-lg ${colorClass.shadow}`,
            'relative overflow-hidden'
          )}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {/* 条纹效果 */}
          {striped && (
            <div
              className={cn(
                'absolute inset-0',
                'bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_25%,rgba(255,255,255,0.2)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.2)_75%,rgba(255,255,255,0.2)_100%)]',
                'bg-[length:1rem_1rem]',
                animated && 'animate-[progress-stripes_1s_linear_infinite]'
              )}
            />
          )}

          {/* 光晕效果 */}
          {glow && (
            <motion.div
              className={cn(
                'absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent',
                '-translate-x-full'
              )}
              animate={{
                x: ['0%', '200%'],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          )}
        </motion.div>

        {/* 装饰线 */}
        <div className="absolute left-0 top-0 h-full w-[2px] bg-white/30" />
        <div className="absolute right-0 top-0 h-full w-[2px] bg-white/30" />
      </div>
    </div>
  );
};

// 环形进度条组件
export interface CircularProgressProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  color?: ProgressColor;
  glow?: boolean;
  showLabel?: boolean;
  labelFormat?: (value: number, max: number) => string;
  className?: string;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  max = 100,
  size = 120,
  strokeWidth = 8,
  color = 'cyan',
  glow = false,
  showLabel = true,
  labelFormat,
  className,
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const colorClass = colorClasses[color];

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* 背景圆 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth={strokeWidth}
        />

        {/* 进度圆 */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#gradient-${color})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={glow ? `drop-shadow-lg ${colorClass.shadow}` : ''}
        />

        {/* 渐变定义 */}
        <defs>
          <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color === 'cyan' ? '#22d3ee' : color === 'purple' ? '#a855f7' : color === 'pink' ? '#ec4899' : color === 'green' ? '#22c55e' : '#eab308'} />
            <stop offset="100%" stopColor={color === 'cyan' ? '#0891b2' : color === 'purple' ? '#7c3aed' : color === 'pink' ? '#be185d' : color === 'green' ? '#16a34a' : '#ca8a04'} />
          </linearGradient>
        </defs>
      </svg>

      {/* 标签 */}
      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold">
            {labelFormat ? labelFormat(value, max) : percentage.toFixed(0)}
          </span>
          <span className="text-xs text-muted-foreground">%</span>
        </div>
      )}
    </div>
  );
};

export default CyberProgress;
