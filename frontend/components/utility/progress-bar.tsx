'use client';

/**
 * Progress Bar Component
 * 进度条组件 - 用于显示任务进度
 */

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export interface ProgressBarProps {
  /** 进度值 (0-100) */
  value?: number;
  /** 是否显示百分比 */
  showPercentage?: boolean;
  /** 是否显示标签 */
  label?: string;
  /** 自定义类名 */
  className?: string;
  /** 样式变体 */
  variant?: 'default' | 'neon' | 'cyber' | 'success' | 'warning' | 'error';
  /** 高度 */
  size?: 'sm' | 'md' | 'lg';
  /** 是否动画 */
  animated?: boolean;
  /** 条纹效果 */
  striped?: boolean;
}

export function ProgressBar({
  value = 0,
  showPercentage = true,
  label,
  className,
  variant = 'default',
  size = 'md',
  animated = true,
  striped = false,
}: ProgressBarProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayValue(value);
    }, 100);
    return () => clearTimeout(timer);
  }, [value]);

  const sizeClasses = {
    sm: 'h-2',
    md: 'h-4',
    lg: 'h-6',
  };

  const variantClasses = {
    default: 'bg-gray-700',
    neon: 'bg-cyan-500 shadow-lg shadow-cyan-500/50',
    cyber: 'bg-green-500 shadow-lg shadow-green-500/50',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
  };

  const barBgClass = variantClasses[variant];

  return (
    <div className={cn('progress-bar w-full', className)}>
      {/* 标签和百分比 */}
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && <span className="text-sm font-medium">{label}</span>}
          {showPercentage && (
            <span className="text-sm font-medium">{Math.round(displayValue)}%</span>
          )}
        </div>
      )}

      {/* 进度条容器 */}
      <div
        className={cn(
          'progress-track w-full bg-gray-800 rounded-full overflow-hidden',
          sizeClasses[size]
        )}
      >
        {/* 进度条 */}
        <div
          className={cn(
            'progress-fill h-full transition-all duration-500 ease-out rounded-full',
            barBgClass,
            animated && 'animate-pulse',
            striped && 'bg-[length:20px_20px] bg-[linear-gradient(45deg,rgba(255,255,255,.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,.15)_50%,rgba(255,255,255,.15)_75%,transparent_75%,transparent)]'
          )}
          style={{
            width: `${Math.min(100, Math.max(0, displayValue))}%`,
          }}
        />
      </div>
    </div>
  );
}
