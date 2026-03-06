/**
 * Progress 进度条组件
 * 用于显示任务进度或加载状态
 */

'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ProgressProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'cyan' | 'purple' | 'pink' | 'green' | 'yellow';
  showLabel?: boolean;
  label?: string;
  showPercentage?: boolean;
  striped?: boolean;
  animated?: boolean;
  className?: string;
}

export function Progress({
  value,
  max = 100,
  size = 'md',
  variant = 'cyan',
  showLabel = false,
  label,
  showPercentage = false,
  striped = false,
  animated = false,
  className,
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const variantClasses = {
    default: 'bg-gray-700',
    cyan: 'bg-cyan-500',
    purple: 'bg-purple-500',
    pink: 'bg-pink-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
  };

  return (
    <div className={cn('w-full', className)}>
      {(showLabel || showPercentage) && (
        <div className="flex items-center justify-between mb-2">
          {showLabel && label && (
            <span className="text-sm font-medium text-gray-300">{label}</span>
          )}
          {showPercentage && (
            <span className="text-sm font-medium text-gray-300">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div
        className={cn(
          'relative overflow-hidden rounded-full bg-gray-800',
          sizeClasses[size]
        )}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={cn(
            'h-full rounded-full',
            variantClasses[variant],
            striped && 'progress-striped',
            animated && 'animate-progress'
          )}
          style={{
            backgroundImage: striped
              ? 'linear-gradient(45deg, rgba(255,255,255,.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,.15) 50%, rgba(255,255,255,.15) 75%, transparent 75%, transparent)'
              : undefined,
            backgroundSize: striped ? '1rem 1rem' : undefined,
          }}
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
  variant?: 'default' | 'cyan' | 'purple' | 'pink' | 'green' | 'yellow';
  showPercentage?: boolean;
  label?: string;
  className?: string;
}

export function CircularProgress({
  value,
  max = 100,
  size = 120,
  strokeWidth = 8,
  variant = 'cyan',
  showPercentage = true,
  label,
  className,
}: CircularProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  const variantColors = {
    default: '#374151',
    cyan: '#00f0ff',
    purple: '#9d00ff',
    pink: '#ff0080',
    green: '#00ff88',
    yellow: '#f0ff00',
  };

  const color = variantColors[variant];

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* 背景圆 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-gray-800"
        />
        {/* 进度圆 */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
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
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {showPercentage && (
          <span className="text-2xl font-bold text-white">
            {Math.round(percentage)}%
          </span>
        )}
        {label && (
          <span className="text-sm text-gray-400 mt-1">{label}</span>
        )}
      </div>
    </div>
  );
}

/**
 * 步骤进度条
 */
export interface Step {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

export interface StepProgressProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (step: number) => void;
  className?: string;
}

export function StepProgress({
  steps,
  currentStep,
  onStepClick,
  className,
}: StepProgressProps) {
  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isFirst = index === 0;
          const isLast = index === steps.length - 1;

          return (
            <div key={step.id} className="flex items-center flex-1">
              {/* 步骤指示器 */}
              <div className="flex flex-col items-center">
                <button
                  onClick={() => onStepClick?.(index)}
                  disabled={!onStepClick || index > currentStep}
                  className={cn(
                    'relative flex items-center justify-center w-10 h-10 rounded-full border-2 font-semibold transition-all duration-200',
                    isCompleted
                      ? 'bg-cyan-500 border-cyan-500 text-white'
                      : isCurrent
                      ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400'
                      : 'bg-gray-800 border-gray-700 text-gray-500',
                    !onStepClick && 'cursor-default',
                    index > currentStep && 'cursor-not-allowed opacity-50'
                  )}
                >
                  {isCompleted ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                  ) : step.icon ? (
                    <span className="w-5 h-5">{step.icon}</span>
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </button>
                {step.label && (
                  <span
                    className={cn(
                      'absolute -bottom-6 text-xs whitespace-nowrap',
                      isCurrent || isCompleted
                        ? 'text-white'
                        : 'text-gray-500'
                    )}
                  >
                    {step.label}
                  </span>
                )}
              </div>

              {/* 连接线 */}
              {!isLast && (
                <div
                  className={cn(
                    'flex-1 h-0.5 mx-2 transition-all duration-200',
                    index < currentStep
                      ? 'bg-cyan-500'
                      : 'bg-gray-800'
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * 加载进度条（不确定进度）
 */
export interface LoadingProgressProps {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingProgress({
  label,
  size = 'md',
  className,
}: LoadingProgressProps) {
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <div className="flex items-center gap-2 mb-2">
          <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
          <span className="text-sm font-medium text-gray-300">{label}</span>
        </div>
      )}
      <div
        className={cn(
          'relative overflow-hidden rounded-full bg-gray-800',
          sizeClasses[size]
        )}
      >
        <motion.div
          className={cn(
            'h-full rounded-full bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500',
            'bg-[length:200%_100%]'
          )}
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>
    </div>
  );
}

/**
 * 文件上传进度
 */
export interface FileUploadProgressProps {
  fileName: string;
  progress: number;
  size?: number;
  onCancel?: () => void;
  className?: string;
}

export function FileUploadProgress({
  fileName,
  progress,
  size,
  onCancel,
  className,
}: FileUploadProgressProps) {
  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className={cn('p-4 bg-gray-900 border border-gray-800 rounded-lg', className)}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Loader2 className="w-4 h-4 animate-spin text-cyan-400 flex-shrink-0" />
          <span className="text-sm font-medium text-gray-300 truncate">{fileName}</span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {size && (
            <span className="text-xs text-gray-500">{formatSize(size)}</span>
          )}
          <span className="text-sm font-medium text-cyan-400">{Math.round(progress)}%</span>
          {onCancel && (
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-red-400 transition-colors"
              aria-label="取消上传"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          )}
        </div>
      </div>
      <Progress value={progress} size="sm" variant="cyan" />
    </div>
  );
}
