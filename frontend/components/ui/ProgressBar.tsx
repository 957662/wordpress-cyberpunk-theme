/**
 * 进度条组件
 */

'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface ProgressBarProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: 'cyan' | 'purple' | 'pink' | 'yellow' | 'green';
  showLabel?: boolean;
  label?: string;
  className?: string;
  animate?: boolean;
}

export function ProgressBar({
  value,
  max = 100,
  size = 'md',
  color = 'cyan',
  showLabel = false,
  label,
  className,
  animate = true,
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);

  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  return (
    <div className={cn('w-full', className)}>
      {(showLabel || label) && (
        <div className="flex items-center justify-between mb-2">
          {label && <span className="text-sm text-gray-400">{label}</span>}
          {showLabel && (
            <span className="text-sm font-mono text-cyber-cyan">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}

      <div className={cn('relative bg-cyber-muted rounded-full overflow-hidden', sizes[size])}>
        <motion.div
          initial={animate ? { width: 0 } : false}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={cn(
            'h-full rounded-full',
            `bg-gradient-to-r from-cyber-${color} to-cyber-${color}/50`
          )}
        />
        {/* Glow effect */}
        <motion.div
          initial={animate ? { x: '-100%' } : false}
          animate={{ x: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={cn(
            'absolute top-0 bottom-0 w-2',
            `bg-cyber-${color} shadow-neon-${color}`
          )}
        />
      </div>
    </div>
  );
}
