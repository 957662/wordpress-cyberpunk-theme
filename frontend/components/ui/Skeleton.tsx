/**
 * Skeleton - 骨架屏组件
 */

'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export function Skeleton({
  className,
  variant = 'text',
  width,
  height,
  animation = 'pulse',
}: SkeletonProps) {
  const variantStyles = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-md',
  };

  const baseStyles = cn(
    'bg-cyber-cyan/10',
    variantStyles[variant],
    className
  );

  if (animation === 'none') {
    return (
      <div
        className={baseStyles}
        style={{ width, height }}
      />
    );
  }

  if (animation === 'pulse') {
    return (
      <motion.div
        className={baseStyles}
        style={{ width, height }}
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    );
  }

  // wave animation
  return (
    <div className={baseStyles} style={{ width, height, position: 'relative', overflow: 'hidden' }}>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-cyber-cyan/20 to-transparent"
        animate={{
          x: ['-100%', '200%'],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  );
}

// 文本骨架屏
export interface SkeletonTextProps {
  lines?: number;
  className?: string;
}

export function SkeletonText({ lines = 3, className }: SkeletonTextProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          height="1rem"
          width={i === lines - 1 ? '60%' : '100%'}
        />
      ))}
    </div>
  );
}

// 卡片骨架屏
export interface SkeletonCardProps {
  className?: string;
}

export function SkeletonCard({ className }: SkeletonCardProps) {
  return (
    <div className={cn('bg-cyber-dark/50 border border-cyber-cyan/20 rounded-lg p-4', className)}>
      <div className="flex items-start gap-4">
        <Skeleton variant="circular" width={48} height={48} />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" height="1.5rem" width="60%" />
          <Skeleton variant="text" height="1rem" width="100%" />
          <Skeleton variant="text" height="1rem" width="80%" />
        </div>
      </div>
    </div>
  );
}

// 列表骨架屏
export interface SkeletonListProps {
  items?: number;
  className?: string;
}

export function SkeletonList({ items = 5, className }: SkeletonListProps) {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: items }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

// 表格骨架屏
export interface SkeletonTableProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export function SkeletonTable({ rows = 5, columns = 4, className }: SkeletonTableProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {/* 表头 */}
      <div className="flex gap-2">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={`header-${i}`} variant="text" height="2rem" flex={1} />
        ))}
      </div>

      {/* 表体 */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="flex gap-2">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={`cell-${rowIndex}-${colIndex}`} variant="text" height="2.5rem" flex={1} />
          ))}
        </div>
      ))}
    </div>
  );
}
