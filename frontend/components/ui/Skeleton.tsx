/**
 * 骨架屏组件
 * 内容加载时的占位符
 */

'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface SkeletonProps {
  /** 自定义类名 */
  className?: string;
  /** 是否动画 */
  animated?: boolean;
}

export function Skeleton({ className, animated = true }: SkeletonProps) {
  return (
    <motion.div
      className={cn(
        'bg-cyber-muted rounded',
        animated && 'animate-pulse',
        className
      )}
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
    />
  );
}

export interface SkeletonTextProps {
  /** 行数 */
  lines?: number;
  /** 每行宽度 */
  widths?: (string | number)[];
  /** 自定义类名 */
  className?: string;
}

export function SkeletonText({
  lines = 3,
  widths,
  className,
}: SkeletonTextProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-4"
          style={{
            width: widths?.[i] || (i === lines - 1 ? '60%' : '100%'),
          }}
        />
      ))}
    </div>
  );
}

export interface SkeletonCardProps {
  /** 是否显示头像 */
  showAvatar?: boolean;
  /** 是否显示标题 */
  showTitle?: boolean;
  /** 文本行数 */
  textLines?: number;
  /** 自定义类名 */
  className?: string;
}

export function SkeletonCard({
  showAvatar = true,
  showTitle = true,
  textLines = 3,
  className,
}: SkeletonCardProps) {
  return (
    <div className={cn('cyber-card space-y-4', className)}>
      {showAvatar && (
        <div className="flex items-center space-x-3">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-1/4" />
          </div>
        </div>
      )}

      {showTitle && <Skeleton className="h-6 w-3/4" />}

      <SkeletonText lines={textLines} />
    </div>
  );
}

export interface SkeletonListProps {
  /** 项目数量 */
  count?: number;
  /** 自定义类名 */
  className?: string;
}

export function SkeletonList({ count = 5, className }: SkeletonListProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
