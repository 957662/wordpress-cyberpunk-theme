/**
 * LoadingSpinner 组件 - 加载动画
 */

'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'cyan' | 'purple' | 'pink' | 'white';
  text?: string;
  className?: string;
}

export function LoadingSpinner({
  size = 'md',
  color = 'cyan',
  text,
  className,
}: LoadingSpinnerProps) {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  const colors = {
    cyan: 'border-cyber-cyan border-t-transparent',
    purple: 'border-cyber-purple border-t-transparent',
    pink: 'border-cyber-pink border-t-transparent',
    white: 'border-white border-t-transparent',
  };

  return (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear',
        }}
        className={cn('rounded-full', sizes[size], colors[color])}
      />
      {text && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-sm text-gray-400"
        >
          {text}
        </motion.p>
      )}
    </div>
  );
}

// Loading Skeleton Component
export interface LoadingSkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export function LoadingSkeleton({
  className,
  variant = 'rectangular',
  width,
  height,
}: LoadingSkeletonProps) {
  const variants = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  return (
    <motion.div
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.8,
        repeat: Infinity,
        reverse: true,
      }}
      className={cn(
        'bg-cyber-border/30',
        variants[variant],
        className
      )}
      style={{ width, height }}
    />
  );
}

// Page Loading Component
export interface PageLoadingProps {
  text?: string;
}

export function PageLoading({ text = '加载中...' }: PageLoadingProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-cyber-dark/80 backdrop-blur-sm">
      <div className="text-center space-y-4">
        <LoadingSpinner size="lg" color="cyan" />
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-gray-400"
        >
          {text}
        </motion.p>
      </div>
    </div>
  );
}
