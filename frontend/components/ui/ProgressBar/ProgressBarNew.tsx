/**
 * CyberPress Platform - ProgressBar Component
 * 进度条组件 - 赛博朋克风格
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export interface ProgressBarProps {
  value: number;
  max?: number;
  min?: number;
  label?: string;
  showValue?: boolean;
  unit?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'neon' | 'gradient' | 'cyber';
  color?: 'cyan' | 'purple' | 'pink' | 'green' | 'yellow';
  animated?: boolean;
  striped?: boolean;
  showPercentage?: boolean;
  className?: string;
}

const sizeStyles = {
  sm: 'h-2',
  md: 'h-3',
  lg: 'h-4',
};

const colorMap = {
  cyan: {
    from: '#00f0ff',
    to: '#00a8b3',
    shadow: 'shadow-neon-cyan',
  },
  purple: {
    from: '#9d00ff',
    to: '#6a00b3',
    shadow: 'shadow-neon-purple',
  },
  pink: {
    from: '#ff0080',
    to: '#b30058',
    shadow: 'shadow-neon-pink',
  },
  green: {
    from: '#00ff88',
    to: '#00b35f',
    shadow: 'shadow-neon-green',
  },
  yellow: {
    from: '#f0ff00',
    to: '#a8b300',
    shadow: 'shadow-neon-yellow',
  },
};

export function ProgressBar({
  value,
  max = 100,
  min = 0,
  label,
  showValue = false,
  unit = '',
  size = 'md',
  variant = 'default',
  color = 'cyan',
  animated = false,
  striped = false,
  showPercentage = false,
  className,
}: ProgressBarProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const range = max - min;
  const percentage = Math.min(100, Math.max(0, ((value - min) / range) * 100));
  const displayValue = Math.round(value);
  const colors = colorMap[color];

  const getBarVariant = () => {
    switch (variant) {
      case 'neon':
        return (
          <motion.div
            className={cn('h-full rounded-full', colors.shadow)}
            style={{
              width: `${percentage}%`,
              backgroundColor: colors.from,
            }}
            animate={animated ? { opacity: [1, 0.8, 1] } : {}}
            transition={animated ? { duration: 1.5, repeat: Infinity } : {}}
          />
        );

      case 'gradient':
        return (
          <motion.div
            className="h-full rounded-full"
            style={{
              width: `${percentage}%`,
              background: `linear-gradient(90deg, ${colors.from}, ${colors.to})`,
            }}
            animate={animated ? { scale: [1, 1.02, 1] } : {}}
            transition={animated ? { duration: 2, repeat: Infinity } : {}}
          />
        );

      case 'cyber':
        return (
          <motion.div
            className="relative h-full rounded-full overflow-hidden"
            style={{ width: `${percentage}%` }}
          >
            <div
              className="absolute inset-0"
              style={{
                background: `
                  repeating-linear-gradient(
                    45deg,
                    ${colors.from},
                    ${colors.from} 10px,
                    ${colors.to} 10px,
                    ${colors.to} 20px
                  )
                `,
              }}
            />
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            />
          </motion.div>
        );

      default:
        return (
          <motion.div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${percentage}%`,
              backgroundColor: colors.from,
            }}
            animate={animated ? { scale: [1, 1.01, 1] } : {}}
            transition={animated ? { duration: 2, repeat: Infinity } : {}}
          />
        );
    }
  };

  return (
    <div className={cn('w-full', className)}>
      {/* 标签和值 */}
      {(label || showValue || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && <span className="text-sm font-medium text-gray-300">{label}</span>}
          <div className="flex items-center space-x-2">
            {showValue && (
              <span className="text-sm text-cyber-cyan">
                {displayValue}
                {unit}
              </span>
            )}
            {showPercentage && (
              <span className="text-sm font-bold text-cyber-cyan">
                {Math.round(percentage)}%
              </span>
            )}
          </div>
        </div>
      )}

      {/* 进度条容器 */}
      <div
        className={cn(
          'relative bg-cyber-darker rounded-full overflow-hidden border border-cyber-border',
          sizeStyles[size]
        )}
      >
        {/* 进度条 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={value}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            exit={{ width: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="absolute top-0 left-0 h-full"
          >
            {getBarVariant()}
          </motion.div>
        </AnimatePresence>

        {/* 条纹效果 */}
        {striped && (
          <motion.div
            className="absolute inset-0 opacity-20"
            style={{
              background: `
                repeating-linear-gradient(
                  45deg,
                  transparent,
                  transparent 10px,
                  rgba(0, 0, 0, 0.1) 10px,
                  rgba(0, 0, 0, 0.1) 20px
                )
              `,
            }}
            animate={{ x: [0, 20] }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        )}

        {/* 发光效果 */}
        {variant === 'neon' && (
          <motion.div
            className="absolute top-0 bottom-0 w-1 rounded-full blur-sm"
            style={{
              left: `${percentage}%`,
              backgroundColor: colors.from,
              boxShadow: `0 0 10px ${colors.from}, 0 0 20px ${colors.from}`,
            }}
            animate={animated ? { opacity: [1, 0.5, 1] } : {}}
            transition={animated ? { duration: 1.5, repeat: Infinity } : {}}
          />
        )}
      </div>

      {/* 刻度 */}
      {size === 'lg' && (
        <div className="flex justify-between mt-1 text-xs text-cyber-muted">
          <span>{min}</span>
          <span>{Math.round((min + max) / 2)}</span>
          <span>{max}</span>
        </div>
      )}
    </div>
  );
}

// 圆形进度条
export interface CircularProgressProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  color?: 'cyan' | 'purple' | 'pink' | 'green' | 'yellow';
  showValue?: boolean;
  label?: string;
  className?: string;
}

export function CircularProgress({
  value,
  max = 100,
  size = 120,
  strokeWidth = 8,
  color = 'cyan',
  showValue = true,
  label,
  className,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const offset = circumference - (percentage / 100) * circumference;
  const colors = colorMap[color];

  return (
    <div className={cn('relative flex items-center justify-center', className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* 背景圆 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#1a1a2e"
          strokeWidth={strokeWidth}
        />

        {/* 进度圆 */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colors.from}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{
            filter: `drop-shadow(0 0 4px ${colors.from})`,
          }}
        />
      </svg>

      {/* 中心内容 */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {showValue && (
          <span className="text-2xl font-bold text-cyber-cyan">{Math.round(percentage)}%</span>
        )}
        {label && <span className="text-sm text-cyber-muted">{label}</span>}
      </div>
    </div>
  );
}
