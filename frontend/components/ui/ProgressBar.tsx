/**
 * ProgressBar - 进度条组件
 * 支持多种样式和动画效果
 */

'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface ProgressBarProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'cyan' | 'purple' | 'pink' | 'yellow' | 'gradient';
  showLabel?: boolean;
  showPercentage?: boolean;
  animated?: boolean;
  striped?: boolean;
  color?: string;
  className?: string;
  labelClassName?: string;
}

export function ProgressBar({
  value,
  max = 100,
  size = 'md',
  variant = 'default',
  showLabel = false,
  showPercentage = true,
  animated = true,
  striped = false,
  color,
  className,
  labelClassName,
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const sizeStyles = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const variantStyles = {
    default: 'bg-cyber-cyan',
    cyan: 'bg-cyber-cyan',
    purple: 'bg-cyber-purple',
    pink: 'bg-cyber-pink',
    yellow: 'bg-cyber-yellow',
    gradient: 'bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-pink',
  };

  const barStyle = color ? { backgroundColor: color } : undefined;

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className={cn('flex justify-between mb-2 text-sm', labelClassName)}>
          <span className="text-gray-300">进度</span>
          {showPercentage && (
            <span className="text-cyber-cyan font-semibold">{percentage.toFixed(0)}%</span>
          )}
        </div>
      )}

      <div
        className={cn(
          'relative w-full bg-cyber-dark/80 rounded-full overflow-hidden border border-cyber-cyan/20',
          sizeStyles[size]
        )}
      >
        <motion.div
          initial={animated ? { width: 0 } : false}
          animate={{ width: `${percentage}%` }}
          transition={animated ? { duration: 0.8, ease: 'easeOut' } : undefined}
          className={cn(
            'h-full rounded-full relative overflow-hidden',
            variantStyles[variant],
            striped && 'striped'
          )}
          style={barStyle}
        >
          {striped && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          )}

          {animated && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{
                x: ['-100%', '200%'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          )}
        </motion.div>
      </div>

      {!showLabel && showPercentage && (
        <div className="mt-1 text-right text-xs text-cyber-cyan font-semibold">
          {percentage.toFixed(0)}%
        </div>
      )}
    </div>
  );
}

export interface CircularProgressProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  variant?: 'default' | 'cyan' | 'purple' | 'pink' | 'yellow' | 'gradient';
  showPercentage?: boolean;
  animated?: boolean;
  className?: string;
}

export function CircularProgress({
  value,
  max = 100,
  size = 120,
  strokeWidth = 8,
  variant = 'default',
  showPercentage = true,
  animated = true,
  className,
}: CircularProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const colors = {
    default: '#06b6d4',
    cyan: '#06b6d4',
    purple: '#a855f7',
    pink: '#ec4899',
    yellow: '#eab308',
  };

  const color = colors[variant];
  const center = size / 2;

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="rgba(34, 211, 238, 0.1)"
          strokeWidth={strokeWidth}
        />

        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          initial={animated ? { strokeDashoffset: circumference } : false}
          animate={{ strokeDashoffset: offset }}
          transition={animated ? { duration: 0.8, ease: 'easeOut' } : undefined}
          style={{
            strokeDasharray: circumference,
          }}
        />
      </svg>

      {showPercentage && (
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            initial={animated ? { opacity: 0, scale: 0.5 } : false}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-2xl font-bold text-white"
          >
            {percentage.toFixed(0)}%
          </motion.span>
        </div>
      )}
    </div>
  );
}

export interface ProgressStepsProps {
  steps: { label: string; completed?: boolean }[];
  currentStep: number;
  className?: string;
}

export function ProgressSteps({ steps, currentStep, className }: ProgressStepsProps) {
  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex-1">
            <div className="flex items-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={cn(
                  'relative z-10 flex items-center justify-center w-8 h-8 rounded-full font-semibold text-sm transition-all',
                  index <= currentStep
                    ? 'bg-cyber-cyan text-cyber-dark'
                    : 'bg-cyber-dark/50 border-2 border-gray-600 text-gray-400'
                )}
              >
                {step.completed || index < currentStep ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  index + 1
                )}
              </motion.div>

              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'flex-1 h-0.5 mx-2 transition-all',
                    index < currentStep ? 'bg-cyber-cyan' : 'bg-gray-700'
                  )}
                />
              )}
            </div>

            <div className="mt-2 text-xs text-center">
              <p
                className={cn(
                  'font-medium',
                  index <= currentStep ? 'text-cyber-cyan' : 'text-gray-500'
                )}
              >
                {step.label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
