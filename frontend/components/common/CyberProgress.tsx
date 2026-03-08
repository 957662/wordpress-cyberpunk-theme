'use client';

/**
 * CyberPress Progress Component
 * 赛博朋克风格进度条组件
 */

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface CyberProgressProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: 'cyan' | 'purple' | 'pink' | 'green' | 'yellow' | 'red';
  variant?: 'default' | 'neon' | 'glow' | 'striped';
  showLabel?: boolean;
  showPercentage?: boolean;
  animated?: boolean;
  className?: string;
}

export function CyberProgress({
  value,
  max = 100,
  size = 'md',
  color = 'cyan',
  variant = 'default',
  showLabel = false,
  showPercentage = false,
  animated = true,
  className,
}: CyberProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const sizeStyles = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-4',
  };

  const colorStyles = {
    cyan: 'bg-cyber-cyan',
    purple: 'bg-cyber-purple',
    pink: 'bg-cyber-pink',
    green: 'bg-green-400',
    yellow: 'bg-yellow-400',
    red: 'bg-red-400',
  };

  const variantStyles = {
    default: '',
    neon: 'shadow-[0_0_10px_currentColor]',
    glow: 'shadow-lg',
    striped: 'bg-[length:20px_20px] bg-[linear-gradient(45deg,rgba(255,255,255,.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,.15)_50%,rgba(255,255,255,.15)_75%,transparent_75%,transparent)]',
  };

  return (
    <div className={cn('w-full', className)}>
      {(showLabel || showPercentage) && (
        <div className="flex items-center justify-between mb-2">
          {showLabel && (
            <span className="text-sm font-medium text-gray-300">{value}</span>
          )}
          {showPercentage && (
            <span className="text-sm font-mono text-cyber-cyan">
              {percentage.toFixed(0)}%
            </span>
          )}
        </div>
      )}
      <div
        className={cn(
          'relative w-full bg-cyber-dark/80 rounded-full overflow-hidden border border-cyber-border/50',
          sizeStyles[size]
        )}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: animated ? 0.5 : 0, ease: 'easeOut' }}
          className={cn(
            'h-full rounded-full',
            colorStyles[color],
            variantStyles[variant],
            animated && 'animate-pulse'
          )}
        />
      </div>
    </div>
  );
}

/**
 * 圆形进度条
 */
export interface CircularProgressProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  color?: 'cyan' | 'purple' | 'pink' | 'green' | 'yellow' | 'red';
  showPercentage?: boolean;
  animated?: boolean;
  className?: string;
}

export function CircularProgress({
  value,
  max = 100,
  size = 120,
  strokeWidth = 8,
  color = 'cyan',
  showPercentage = true,
  animated = true,
  className,
}: CircularProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const colorMap = {
    cyan: '#00f0ff',
    purple: '#9d00ff',
    pink: '#ff0080',
    green: '#4ade80',
    yellow: '#facc15',
    red: '#f87171',
  };

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* 背景圆 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(0, 240, 255, 0.1)"
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
          transition={{ duration: animated ? 0.5 : 0, ease: 'easeOut' }}
          style={{
            strokeDasharray: circumference,
          }}
        />
      </svg>
      {showPercentage && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-cyber-cyan font-mono">
            {percentage.toFixed(0)}%
          </span>
        </div>
      )}
    </div>
  );
}

/**
 * 步骤进度条
 */
export interface StepProgressProps {
  steps: Array<{
    label: string;
    description?: string;
  }>;
  currentStep: number;
  className?: string;
}

export function StepProgress({ steps, currentStep, className }: StepProgressProps) {
  return (
    <div className={cn('w-full', className)}>
      <div className="relative">
        {/* 进度线 */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-cyber-border -translate-y-1/2" />
        <div
          className="absolute top-1/2 left-0 h-0.5 bg-cyber-cyan -translate-y-1/2 transition-all duration-300"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        />

        {/* 步骤 */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;

            return (
              <div key={index} className="flex flex-col items-center">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: isCurrent ? 1.1 : 1 }}
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center border-2 z-10 transition-all duration-300',
                    isCompleted
                      ? 'bg-cyber-cyan border-cyber-cyan text-cyber-dark'
                      : isCurrent
                      ? 'bg-cyber-dark border-cyber-cyan text-cyber-cyan shadow-lg shadow-cyber-cyan/50'
                      : 'bg-cyber-dark/80 border-cyber-border text-gray-500'
                  )}
                >
                  {isCompleted ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span className="text-sm font-semibold">{index + 1}</span>
                  )}
                </motion.div>
                <div className="mt-2 text-center">
                  <div
                    className={cn(
                      'text-sm font-medium',
                      isCurrent ? 'text-cyber-cyan' : isCompleted ? 'text-gray-300' : 'text-gray-500'
                    )}
                  >
                    {step.label}
                  </div>
                  {step.description && (
                    <div className="text-xs text-gray-500 mt-0.5">{step.description}</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default CyberProgress;
