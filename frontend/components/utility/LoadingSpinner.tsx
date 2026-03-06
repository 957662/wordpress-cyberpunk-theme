'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'cyan' | 'purple' | 'pink' | 'green';
  className?: string;
  text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'cyan',
  className,
  text
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const colorClasses = {
    cyan: 'border-cyber-cyan',
    purple: 'border-cyber-purple',
    pink: 'border-cyber-pink',
    green: 'border-cyber-green'
  };

  return (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-2 border-t-transparent',
          sizeClasses[size],
          colorClasses[color]
        )}
      >
        <span className="sr-only">加载中...</span>
      </div>
      {text && (
        <p className="text-sm text-gray-400 animate-pulse">{text}</p>
      )}
    </div>
  );
};

// 点阵加载动画
export const DotLoader: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn('flex gap-2', className)}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-2 h-2 bg-cyber-cyan rounded-full animate-pulse"
          style={{
            animationDelay: `${i * 0.15}s`,
            animationDuration: '0.6s'
          }}
        />
      ))}
    </div>
  );
};

// 脉冲加载动画
export const PulseLoader: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn('relative w-12 h-12', className)}>
      <div className="absolute inset-0 bg-cyber-cyan rounded-full animate-ping opacity-20" />
      <div className="absolute inset-2 bg-cyber-cyan rounded-full animate-pulse" />
    </div>
  );
};

// 故障加载动画
export const GlitchLoader: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn('relative', className)}>
      <div className="text-2xl font-bold text-cyber-cyan animate-glitch">
        LOADING
      </div>
    </div>
  );
};

// 骨架屏加载
export const SkeletonCard: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn('bg-cyber-dark/50 rounded-lg p-4 border border-cyber-cyan/20', className)}>
      <div className="h-4 bg-cyber-cyan/20 rounded w-3/4 mb-3 animate-pulse" />
      <div className="h-3 bg-cyber-cyan/10 rounded w-full mb-2 animate-pulse" />
      <div className="h-3 bg-cyber-cyan/10 rounded w-5/6 animate-pulse" />
    </div>
  );
};

// 进度条加载器
export const ProgressBar: React.FC<{
  progress: number;
  className?: string;
  color?: 'cyan' | 'purple' | 'pink' | 'green';
}> = ({ progress, className, color = 'cyan' }) => {
  const colorClasses = {
    cyan: 'bg-cyber-cyan',
    purple: 'bg-cyber-purple',
    pink: 'bg-cyber-pink',
    green: 'bg-cyber-green'
  };

  return (
    <div className={cn('w-full h-2 bg-gray-800 rounded-full overflow-hidden', className)}>
      <div
        className={cn(
          'h-full transition-all duration-300 ease-out',
          colorClasses[color]
        )}
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      />
    </div>
  );
};

export default LoadingSpinner;
