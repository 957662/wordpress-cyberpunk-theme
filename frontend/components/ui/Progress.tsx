/**
 * 进度条组件
 * 显示任务完成进度
 */

'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface ProgressProps {
  /** 进度值 (0-100) */
  value: number;
  /** 最大值 */
  max?: number;
  /** 进度条颜色 */
  color?: 'cyan' | 'purple' | 'pink' | 'yellow' | 'green';
  /** 大小 */
  size?: 'sm' | 'md' | 'lg';
  /** 是否显示百分比 */
  showPercentage?: boolean;
  /** 是否动画 */
  animated?: boolean;
  /** 自定义类名 */
  className?: string;
}

const colorStyles = {
  cyan: 'bg-cyber-cyan shadow-neon-cyan',
  purple: 'bg-cyber-purple shadow-neon-purple',
  pink: 'bg-cyber-pink shadow-neon-pink',
  yellow: 'bg-cyber-yellow shadow-neon-yellow',
  green: 'bg-cyber-green shadow-neon-green',
};

const sizeStyles = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
};

export function Progress({
  value,
  max = 100,
  color = 'cyan',
  size = 'md',
  showPercentage = false,
  animated = true,
  className,
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={cn('w-full', className)}>
      {showPercentage && (
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-400">进度</span>
          <span className="text-cyber-cyan font-mono">{percentage.toFixed(0)}%</span>
        </div>
      )}
      <div className={cn(
        'w-full bg-cyber-muted rounded-full overflow-hidden',
        sizeStyles[size]
      )}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: animated ? 0.5 : 0, ease: 'easeOut' }}
          className={cn(
            'h-full rounded-full',
            colorStyles[color]
          )}
        />
      </div>
    </div>
  );
}

export interface CircularProgressProps {
  /** 进度值 (0-100) */
  value: number;
  /** 大小 */
  size?: number;
  /** 进度条宽度 */
  strokeWidth?: number;
  /** 进度条颜色 */
  color?: 'cyan' | 'purple' | 'pink' | 'yellow';
  /** 是否显示文字 */
  showText?: boolean;
  /** 自定义类名 */
  className?: string;
}

export function CircularProgress({
  value,
  size = 120,
  strokeWidth = 8,
  color = 'cyan',
  showText = true,
  className,
}: CircularProgressProps) {
  const normalizedValue = Math.min(Math.max(value, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (normalizedValue / 100) * circumference;

  const colorMap = {
    cyan: '#00f0ff',
    purple: '#9d00ff',
    pink: '#ff0080',
    yellow: '#f0ff00',
  };

  return (
    <div className={cn('relative inline-flex', className)} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* 背景圆 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(42, 42, 74, 1)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* 进度圆 */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colorMap[color]}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{
            strokeDasharray: circumference,
          }}
        />
      </svg>

      {showText && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-white font-mono">
            {normalizedValue.toFixed(0)}%
          </span>
        </div>
      )}
    </div>
  );
}
