/**
 * Skeleton 骨架屏组件
 * 用于在内容加载时显示占位符
 */

'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface SkeletonProps {
  className?: string;
  variant?: 'default' | 'circular' | 'rounded';
  width?: string | number;
  height?: string | number;
}

export function Skeleton({
  className,
  variant = 'default',
  width,
  height,
}: SkeletonProps) {
  const variantClasses = {
    default: 'rounded',
    circular: 'rounded-full',
    rounded: 'rounded-lg',
  };

  return (
    <motion.div
      className={cn(
        'bg-gray-800',
        variantClasses[variant],
        className
      )}
      style={{ width, height }}
      animate={{
        opacity: [0.4, 0.8, 0.4],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
}

/**
 * 文本骨架屏
 */
export interface SkeletonTextProps {
  lines?: number;
  className?: string;
}

export function SkeletonText({ lines = 3, className }: SkeletonTextProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          className={cn(
            index === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full'
          )}
          height="1rem"
        />
      ))}
    </div>
  );
}

/**
 * 标题骨架屏
 */
export interface SkeletonTitleProps {
  width?: string | number;
  className?: string;
}

export function SkeletonTitle({ width = '60%', className }: SkeletonTitleProps) {
  return <Skeleton width={width} height="2rem" className={cn('mb-4', className)} />;
}

/**
 * 段落骨架屏
 */
export interface SkeletonParagraphProps {
  lines?: number;
  className?: string;
}

export function SkeletonParagraph({ lines = 4, className }: SkeletonParagraphProps) {
  return (
    <div className={cn('space-y-3', className)}>
      <SkeletonTitle />
      <SkeletonText lines={lines} />
    </div>
  );
}

/**
 * 头像骨架屏
 */
export interface SkeletonAvatarProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function SkeletonAvatar({ size = 'md', className }: SkeletonAvatarProps) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  return <Skeleton variant="circular" className={cn(sizes[size], className)} />;
}

/**
 * 按钮骨架屏
 */
export interface SkeletonButtonProps {
  width?: string | number;
  height?: string | number;
  className?: string;
}

export function SkeletonButton({
  width = '120px',
  height = '40px',
  className,
}: SkeletonButtonProps) {
  return <Skeleton variant="rounded" width={width} height={height} className={className} />;
}

/**
 * 卡片骨架屏
 */
export interface SkeletonCardProps {
  showAvatar?: boolean;
  showTitle?: boolean;
  lines?: number;
  className?: string;
}

export function SkeletonCard({
  showAvatar = false,
  showTitle = true,
  lines = 3,
  className,
}: SkeletonCardProps) {
  return (
    <div className={cn('p-4 bg-gray-900 border border-gray-800 rounded-lg space-y-3', className)}>
      {showAvatar && (
        <div className="flex items-center gap-3">
          <SkeletonAvatar />
          <div className="flex-1">
            <Skeleton width="60%" height="1rem" />
            <Skeleton width="40%" height="0.875rem" className="mt-2" />
          </div>
        </div>
      )}
      {showTitle && <SkeletonTitle width="80%" />}
      <SkeletonText lines={lines} />
    </div>
  );
}

/**
 * 列表项骨架屏
 */
export interface SkeletonListItemProps {
  showAvatar?: boolean;
  className?: string;
}

export function SkeletonListItem({ showAvatar = true, className }: SkeletonListItemProps) {
  return (
    <div className={cn('flex items-center gap-3 p-3', className)}>
      {showAvatar && <SkeletonAvatar size="sm" />}
      <div className="flex-1 space-y-2">
        <Skeleton width="40%" height="1rem" />
        <Skeleton width="60%" height="0.875rem" />
      </div>
    </div>
  );
}

/**
 * 表格骨架屏
 */
export interface SkeletonTableProps {
  rows?: number;
  columns?: number;
  showHeader?: boolean;
  className?: string;
}

export function SkeletonTable({
  rows = 5,
  columns = 4,
  showHeader = true,
  className,
}: SkeletonTableProps) {
  return (
    <div className={cn('w-full', className)}>
      {showHeader && (
        <div className="flex gap-4 mb-4 pb-2 border-b border-gray-800">
          {Array.from({ length: columns }).map((_, index) => (
            <Skeleton key={index} width="120px" height="1.5rem" />
          ))}
        </div>
      )}
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex gap-4">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton
                key={colIndex}
                width={colIndex === 0 ? '40%' : '20%'}
                height="2rem"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * 博客文章骨架屏
 */
export interface SkeletonBlogPostProps {
  showImage?: boolean;
  className?: string;
}

export function SkeletonBlogPost({ showImage = true, className }: SkeletonBlogPostProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {showImage && (
        <Skeleton width="100%" height="200px" className="rounded-lg" />
      )}
      <div className="space-y-2">
        <Skeleton width="30%" height="1rem" />
        <SkeletonTitle width="90%" />
        <SkeletonParagraph lines={4} />
      </div>
      <div className="flex items-center gap-4">
        <SkeletonAvatar size="sm" />
        <div className="flex-1">
          <Skeleton width="20%" height="1rem" />
          <Skeleton width="15%" height="0.875rem" className="mt-1" />
        </div>
      </div>
    </div>
  );
}

/**
 * 评论骨架屏
 */
export interface SkeletonCommentProps {
  showAvatar?: boolean;
  className?: string;
}

export function SkeletonComment({ showAvatar = true, className }: SkeletonCommentProps) {
  return (
    <div className={cn('flex gap-3', className)}>
      {showAvatar && <SkeletonAvatar size="sm" />}
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton width="100px" height="1rem" />
          <Skeleton width="80px" height="0.75rem" />
        </div>
        <SkeletonText lines={2} />
      </div>
    </div>
  );
}

/**
 * 仪表盘统计骨架屏
 */
export interface SkeletonStatsProps {
  count?: number;
  className?: string;
}

export function SkeletonStats({ count = 4, className }: SkeletonStatsProps) {
  return (
    <div className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4', className)}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="p-4 bg-gray-900 border border-gray-800 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <Skeleton variant="circular" width="40px" height="40px" />
            <Skeleton width="60px" height="1rem" />
          </div>
          <Skeleton width="50%" height="2rem" className="mb-2" />
          <Skeleton width="70%" height="0.875rem" />
        </div>
      ))}
    </div>
  );
}

/**
 * 代码块骨架屏
 */
export interface SkeletonCodeProps {
  lines?: number;
  className?: string;
}

export function SkeletonCode({ lines = 10, className }: SkeletonCodeProps) {
  return (
    <div className={cn('p-4 bg-gray-950 border border-gray-800 rounded-lg overflow-x-auto', className)}>
      <div className="space-y-1">
        {Array.from({ length: lines }).map((_, index) => (
          <div key={index} className="flex items-center gap-2">
            <span className="text-gray-700 text-xs w-8 flex-shrink-0">{index + 1}</span>
            <Skeleton
              width={`${Math.random() * 40 + 60}%`}
              height="1rem"
              className="flex-1"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * 加载状态组合
 */
export interface LoadingStateProps {
  type?: 'card' | 'list' | 'table' | 'blog' | 'stats' | 'code';
  count?: number;
  className?: string;
}

export function LoadingState({
  type = 'card',
  count = 3,
  className,
}: LoadingStateProps) {
  const skeletons = {
    card: <SkeletonCard />,
    list: <SkeletonListItem />,
    table: <SkeletonTable rows={count} />,
    blog: <SkeletonBlogPost />,
    stats: <SkeletonStats count={count} />,
    code: <SkeletonCode />,
  };

  return (
    <div className={cn('space-y-4', className)}>
      {Array.from({ length: type === 'table' || type === 'stats' ? 1 : count }).map((_, index) => (
        <div key={index}>{skeletons[type]}</div>
      ))}
    </div>
  );
}
