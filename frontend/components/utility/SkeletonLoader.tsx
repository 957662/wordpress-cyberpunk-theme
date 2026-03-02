'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'rectangular',
  width,
  height,
  animation = 'pulse',
}) => {
  const variantStyles: Record<string, string> = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-lg',
  };

  const animationComponent = {
    pulse: (
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      />
    ),
    wave: (
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-700/50 to-transparent"
      />
    ),
    none: null,
  };

  return (
    <div
      className={cn(
        'relative overflow-hidden bg-gray-800',
        variantStyles[variant],
        className
      )}
      style={{ width, height }}
    >
      {animationComponent[animation]}
    </div>
  );
};

// 文本骨架屏
export interface TextSkeletonProps {
  lines?: number;
  className?: string;
}

export const TextSkeleton: React.FC<TextSkeletonProps> = ({
  lines = 3,
  className,
}) => {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          variant="text"
          height={16}
          width={index === lines - 1 ? '60%' : '100%'}
        />
      ))}
    </div>
  );
};

// 卡片骨架屏
export interface CardSkeletonProps {
  showAvatar?: boolean;
  showTitle?: boolean;
  showDescription?: boolean;
  lines?: number;
  className?: string;
}

export const CardSkeleton: React.FC<CardSkeletonProps> = ({
  showAvatar = true,
  showTitle = true,
  showDescription = true,
  lines = 3,
  className,
}) => {
  return (
    <div className={cn('p-4 rounded-lg border border-gray-700 bg-gray-800/50', className)}>
      {/* 头部 */}
      <div className="flex items-center gap-3 mb-4">
        {showAvatar && (
          <Skeleton variant="circular" width={40} height={40} />
        )}
        <div className="flex-1">
          {showTitle && (
            <Skeleton variant="text" width="60%" height={20} className="mb-2" />
          )}
          <Skeleton variant="text" width="40%" height={16} />
        </div>
      </div>

      {/* 描述 */}
      {showDescription && <TextSkeleton lines={lines} />}
    </div>
  );
};

// 列表骨架屏
export interface ListSkeletonProps {
  items?: number;
  showAvatar?: boolean;
  className?: string;
}

export const ListSkeleton: React.FC<ListSkeletonProps> = ({
  items = 5,
  showAvatar = true,
  className,
}) => {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="flex items-center gap-3 p-3">
          {showAvatar && (
            <Skeleton variant="circular" width={40} height={40} />
          )}
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" width="70%" height={16} />
            <Skeleton variant="text" width="40%" height={14} />
          </div>
        </div>
      ))}
    </div>
  );
};

// 表格骨架屏
export interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({
  rows = 5,
  columns = 4,
  className,
}) => {
  return (
    <div className={cn('w-full', className)}>
      {/* 表头 */}
      <div className="flex gap-4 mb-4 pb-2 border-b border-gray-700">
        {Array.from({ length: columns }).map((_, index) => (
          <Skeleton key={index} variant="text" width={120} height={20} />
        ))}
      </div>

      {/* 表体 */}
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex gap-4">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton key={colIndex} variant="text" width={100} height={16} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

// 图片卡片骨架屏
export interface ImageCardSkeletonProps {
  aspectRatio?: '16:9' | '4:3' | '1:1' | '3:2';
  showTitle?: boolean;
  showDescription?: boolean;
  className?: string;
}

export const ImageCardSkeleton: React.FC<ImageCardSkeletonProps> = ({
  aspectRatio = '16:9',
  showTitle = true,
  showDescription = true,
  className,
}) => {
  const aspectRatios: Record<string, string> = {
    '16:9': 'aspect-video',
    '4:3': 'aspect-[4/3]',
    '1:1': 'aspect-square',
    '3:2': 'aspect-[3/2]',
  };

  return (
    <div className={cn('rounded-lg overflow-hidden', className)}>
      {/* 图片 */}
      <Skeleton
        variant="rectangular"
        className={cn('w-full', aspectRatios[aspectRatio])}
      />

      {/* 内容 */}
      <div className="p-4 space-y-2">
        {showTitle && <Skeleton variant="text" width="80%" height={20} />}
        {showDescription && <TextSkeleton lines={2} />}
      </div>
    </div>
  );
};

// 评论骨架屏
export interface CommentSkeletonProps {
  showReply?: boolean;
  className?: string;
}

export const CommentSkeleton: React.FC<CommentSkeletonProps> = ({
  showReply = false,
  className,
}) => {
  return (
    <div className={cn('space-y-4', className)}>
      {/* 主评论 */}
      <div className="flex gap-3">
        <Skeleton variant="circular" width={40} height={40} />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" width="30%" height={16} />
          <TextSkeleton lines={2} />
        </div>
      </div>

      {/* 回复 */}
      {showReply && (
        <div className="flex gap-3 ml-12">
          <Skeleton variant="circular" width={32} height={32} />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" width="25%" height={14} />
            <TextSkeleton lines={1} />
          </div>
        </div>
      )}
    </div>
  );
};

// 加载包装器
export interface SkeletonWrapperProps {
  loading: boolean;
  children: React.ReactNode;
  skeleton: React.ReactNode;
  className?: string;
}

export const SkeletonWrapper: React.FC<SkeletonWrapperProps> = ({
  loading,
  children,
  skeleton,
  className,
}) => {
  return (
    <div className={className}>
      {loading ? skeleton : children}
    </div>
  );
};

export default Skeleton;
