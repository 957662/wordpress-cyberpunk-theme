/**
 * 加载状态组件
 * 各种加载动画和状态
 */

'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { LoaderIcon } from '@/components/icons';

// 脉冲加载动画
export interface SkeletonProps {
  count?: number;
  className?: string;
}

export function Skeleton({ count = 1, className }: SkeletonProps) {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className="h-4 bg-cyber-muted rounded animate-pulse"
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            repeatType: 'reverse',
            delay: i * 0.1,
          }}
        />
      ))}
    </div>
  );
}

// 卡片骨架屏
export interface CardSkeletonProps {
  showAvatar?: boolean;
  showTitle?: boolean;
  showText?: boolean;
  lines?: number;
  className?: string;
}

export function CardSkeleton({
  showAvatar = true,
  showTitle = true,
  showText = true,
  lines = 3,
  className,
}: CardSkeletonProps) {
  return (
    <div className={cn('p-6 bg-cyber-card rounded-lg border border-cyber-border', className)}>
      {showAvatar && (
        <div className="flex items-center gap-4 mb-4">
          <motion.div
            className="w-12 h-12 rounded-full bg-cyber-muted animate-pulse"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <div className="flex-1">
            <motion.div
              className="h-4 bg-cyber-muted rounded w-32 mb-2 animate-pulse"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.1 }}
            />
            <motion.div
              className="h-3 bg-cyber-muted rounded w-24 animate-pulse"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
            />
          </div>
        </div>
      )}

      {showTitle && (
        <motion.div
          className="h-6 bg-cyber-muted rounded w-3/4 mb-4 animate-pulse"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}

      {showText && (
        <div className="space-y-2">
          {Array.from({ length: lines }).map((_, i) => (
            <motion.div
              key={i}
              className={cn(
                'h-4 bg-cyber-muted rounded animate-pulse',
                i === lines - 1 && 'w-2/3'
              )}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.1,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// 表格骨架屏
export interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export function TableSkeleton({
  rows = 5,
  columns = 4,
  className,
}: TableSkeletonProps) {
  return (
    <div className={cn('space-y-3', className)}>
      {/* 表头 */}
      <div className="flex gap-4 pb-3 border-b border-cyber-border">
        {Array.from({ length: columns }).map((_, i) => (
          <motion.div
            key={`header-${i}`}
            className="h-6 bg-cyber-muted rounded flex-1 animate-pulse"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
          />
        ))}
      </div>

      {/* 表体 */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="flex gap-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <motion.div
              key={`cell-${rowIndex}-${colIndex}`}
              className="h-10 bg-cyber-muted/50 rounded flex-1 animate-pulse"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: (rowIndex * columns + colIndex) * 0.05,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

// 列表骨架屏
export interface ListSkeletonProps {
  items?: number;
  className?: string;
}

export function ListSkeleton({ items = 5, className }: ListSkeletonProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-start gap-4">
          <motion.div
            className="w-16 h-16 bg-cyber-muted rounded-lg animate-pulse flex-shrink-0"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
          />
          <div className="flex-1 space-y-2">
            <motion.div
              className="h-4 bg-cyber-muted rounded w-3/4 animate-pulse"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 + 0.1 }}
            />
            <motion.div
              className="h-3 bg-cyber-muted/50 rounded w-1/2 animate-pulse"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 + 0.2 }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// 加载中覆盖层
export interface LoadingOverlayProps {
  isLoading: boolean;
  text?: string;
  className?: string;
}

export function LoadingOverlay({ isLoading, text = '加载中...', className }: LoadingOverlayProps) {
  if (!isLoading) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 bg-black/80 backdrop-blur-sm z-50',
        'flex items-center justify-center',
        className
      )}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <LoaderIcon className="w-12 h-12 text-cyber-cyan animate-spin mx-auto mb-4" />
        <p className="text-cyber-muted">{text}</p>
      </motion.div>
    </div>
  );
}

// 内联加载指示器
export interface InlineLoadingProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function InlineLoading({ text, size = 'md', className }: InlineLoadingProps) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <LoaderIcon className={cn(sizes[size], 'text-cyber-cyan animate-spin')} />
      {text && <span className="text-sm text-cyber-muted">{text}</span>}
    </div>
  );
}

// 点状加载动画
export interface DotLoadingProps {
  dots?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function DotLoading({ dots = 3, size = 'md', className }: DotLoadingProps) {
  const sizes = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {Array.from({ length: dots }).map((_, i) => (
        <motion.div
          key={i}
          className={cn('rounded-full bg-cyber-cyan', sizes[size])}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.15,
          }}
        />
      ))}
    </div>
  );
}

// 进度条加载
export interface ProgressBarLoadingProps {
  progress?: number;
  text?: string;
  className?: string;
}

export function ProgressBarLoading({ progress, text, className }: ProgressBarLoadingProps) {
  const displayProgress = progress ?? 0;

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex justify-between text-sm text-cyber-muted">
        <span>{text || '加载中...'}</span>
        <span>{Math.round(displayProgress)}%</span>
      </div>
      <div className="h-2 bg-cyber-muted rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-cyber-cyan rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${displayProgress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  );
}

// 赛博朋克风格加载
export interface CyberLoadingProps {
  text?: string;
  className?: string;
}

export function CyberLoading({ text, className }: CyberLoadingProps) {
  return (
    <div className={cn('flex flex-col items-center gap-6', className)}>
      {/* 旋转的圆环 */}
      <div className="relative w-16 h-16">
        <motion.div
          className="absolute inset-0 border-4 border-cyber-cyan rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute inset-2 border-4 border-cyber-purple rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute inset-4 border-4 border-cyber-pink rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      {/* 加载文本 */}
      {text && (
        <motion.p
          className="text-cyber-cyan font-display"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
}
