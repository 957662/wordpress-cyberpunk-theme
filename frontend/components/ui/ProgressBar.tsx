/**
 * ProgressBar - 进度条组件
 */

'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface ProgressBarProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'gradient' | 'cyber' | 'glow';
  color?: 'cyan' | 'purple' | 'pink' | 'green';
  showLabel?: boolean;
  showPercentage?: boolean;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  size = 'md',
  variant = 'default',
  color = 'cyan',
  showLabel = false,
  showPercentage = true,
  className,
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    setDisplayValue(value);
  }, [value]);

  const percentage = Math.min(Math.max((displayValue / max) * 100, 0), 100);

  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const colorClasses = {
    cyan: 'bg-cyan-500',
    purple: 'bg-purple-500',
    pink: 'bg-pink-500',
    green: 'bg-green-500',
  };

  const gradientColors = {
    cyan: 'from-cyan-500 to-blue-500',
    purple: 'from-purple-500 to-pink-500',
    pink: 'from-pink-500 to-rose-500',
    green: 'from-green-500 to-emerald-500',
  };

  return (
    <div className={cn('w-full', className)}>
      {(showLabel || showPercentage) && (
        <div className="flex items-center justify-between mb-2">
          {showLabel && <span className="text-sm font-medium text-gray-300">Progress</span>}
          {showPercentage && <span className="text-sm font-medium text-gray-300">{Math.round(percentage)}%</span>}
        </div>
      )}

      <div className={cn('relative w-full rounded-full overflow-hidden bg-gray-800', sizes[size])}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={cn(
            'h-full rounded-full',
            variant === 'default' && colorClasses[color],
            variant === 'gradient' && `bg-gradient-to-r ${gradientColors[color]}`,
            variant === 'cyber' && `bg-gradient-to-r ${gradientColors[color]} relative`
          )}
        />
      </div>
    </div>
  );
};

export default ProgressBar;

// 圆形进度条
export interface CircularProgressBarProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  color?: 'cyan' | 'purple' | 'pink' | 'green';
  showPercentage?: boolean;
  className?: string;
}

export function CircularProgressBar({
  value,
  max = 100,
  size = 120,
  strokeWidth = 8,
  color = 'cyan',
  showPercentage = true,
  className,
}: CircularProgressBarProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const offset = circumference - (percentage / 100) * circumference;

  const colors = {
    cyan: '#06b6d4',
    purple: '#a855f7',
    pink: '#ec4899',
    green: '#22c55e',
  };

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(31, 41, 55, 1)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors[color]}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8 }}
          style={{ strokeDasharray: circumference }}
        />
      </svg>
      {showPercentage && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-white">{Math.round(percentage)}%</span>
        </div>
      )}
    </div>
  );
}
