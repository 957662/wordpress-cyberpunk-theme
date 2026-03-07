/**
 * Progress Component
 *
 * Progress bar with cyberpunk styling
 */

'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface ProgressProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: 'cyan' | 'purple' | 'pink' | 'green' | 'yellow';
  showLabel?: boolean;
  label?: string;
  className?: string;
  animated?: boolean;
}

const sizeStyles = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
};

const colorStyles = {
  cyan: 'bg-cyber-cyan',
  purple: 'bg-cyber-purple',
  pink: 'bg-cyber-pink',
  green: 'bg-cyber-green',
  yellow: 'bg-cyber-yellow',
};

export function Progress({
  value,
  max = 100,
  size = 'md',
  color = 'cyan',
  showLabel = false,
  label,
  className,
  animated = true,
}: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn('w-full', className)}>
      {(label || showLabel) && (
        <div className="flex items-center justify-between mb-2">
          {label && <span className="text-sm text-gray-300">{label}</span>}
          {showLabel && (
            <span className="text-sm text-gray-400">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div className={cn('bg-cyber-muted rounded-full overflow-hidden', sizeStyles[size])}>
        <motion.div
          className={cn('h-full', colorStyles[color])}
          initial={animated ? { width: 0 } : false}
          animate={{ width: `${percentage}%` }}
          transition={animated ? { duration: 0.5, ease: 'easeOut' } : {}}
        />
      </div>
    </div>
  );
}

/**
 * Circular Progress Component
 */
export interface CircularProgressProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  color?: 'cyan' | 'purple' | 'pink' | 'green' | 'yellow';
  showLabel?: boolean;
  className?: string;
}

const colorMap = {
  cyan: '#00f0ff',
  purple: '#9d00ff',
  pink: '#ff0080',
  green: '#00ff88',
  yellow: '#f0ff00',
};

export function CircularProgress({
  value,
  max = 100,
  size = 120,
  strokeWidth = 8,
  color = 'cyan',
  showLabel = true,
  className,
}: CircularProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className={cn('relative inline-flex', className)} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="var(--cyber-muted)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
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
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-white">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
    </div>
  );
}
