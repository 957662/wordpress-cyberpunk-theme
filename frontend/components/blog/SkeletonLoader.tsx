'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

/**
 * Skeleton - 骨架屏基础组件
 */
export function Skeleton({
  className,
  variant = 'rectangular',
  width,
  height,
  animation = 'pulse',
}: SkeletonProps) {
  const variantStyles = {
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-sm',
    rounded: 'rounded-lg',
  };

  const animationStyles = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer',
    none: '',
  };

  return (
    <div
      className={cn(
        'bg-gray-200 dark:bg-gray-800',
        variantStyles[variant],
        animationStyles[animation],
        className
      )}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}

/**
 * BlogCardSkeleton - 博客卡片骨架屏
 */
export function BlogCardSkeleton({ variant = 'list' }: { variant?: 'list' | 'grid' }) {
  const isGrid = variant === 'grid';

  return (
    <div
      className={cn(
        'bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-sm',
        isGrid ? 'h-full' : 'flex flex-col md:flex-row gap-6'
      )}
    >
      {/* 图片骨架 */}
      <Skeleton
        variant={isGrid ? 'rectangular' : 'rounded'}
        className={isGrid ? 'w-full h-48' : 'w-full md:w-64 h-48 flex-shrink-0'}
      />

      {/* 内容骨架 */}
      <div className={cn('p-6 space-y-4', isGrid && 'p-4')}>
        {/* 分类标签 */}
        <div className="flex gap-2">
          <Skeleton width={60} height={24} variant="rounded" />
        </div>

        {/* 标题 */}
        <Skeleton
          width="100%"
          height={isGrid ? 24 : 32}
          className="mb-2"
        />
        {!isGrid && <Skeleton width="80%" height={32} />}

        {/* 摘要 */}
        {Array.from({ length: isGrid ? 2 : 3 }).map((_, i) => (
          <Skeleton key={i} width="100%" height={16} />
        ))}

        {/* 元信息 */}
        <div className="flex gap-4 pt-2">
          <Skeleton width={80} height={16} />
          <Skeleton width={60} height={16} />
          <Skeleton width={70} height={16} />
        </div>
      </div>
    </div>
  );
}

/**
 * BlogListSkeleton - 博客列表骨架屏
 */
export function BlogListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-6">
      {Array.from({ length: count }).map((_, i) => (
        <BlogCardSkeleton key={i} variant="list" />
      ))}
    </div>
  );
}

/**
 * BlogGridSkeleton - 博客网格骨架屏
 */
export function BlogGridSkeleton({ count = 6, columns = 3 }: { count?: number; columns?: 2 | 3 | 4 }) {
  const gridColumns = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={cn('grid gap-6', gridColumns[columns])}>
      {Array.from({ length: count }).map((_, i) => (
        <BlogCardSkeleton key={i} variant="grid" />
      ))}
    </div>
  );
}

/**
 * BlogDetailSkeleton - 博客详情页骨架屏
 */
export function BlogDetailSkeleton() {
  return (
    <article className="max-w-4xl mx-auto">
      {/* 头部 */}
      <div className="mb-8">
        <Skeleton width={100} height={32} className="mb-4" />
        <Skeleton width="100%" height={48} className="mb-2" />
        <Skeleton width="80%" height={48} className="mb-6" />

        {/* 元信息 */}
        <div className="flex gap-4 mb-6">
          <Skeleton width={120} height={40} variant="circular" />
          <div className="space-y-2">
            <Skeleton width={150} height={20} />
            <Skeleton width={100} height={16} />
          </div>
        </div>
      </div>

      {/* 特色图片 */}
      <Skeleton
        variant="rectangular"
        width="100%"
        height={400}
        className="mb-8"
      />

      {/* 内容 */}
      <div className="prose prose-lg dark:prose-invert max-w-none space-y-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} width="100%" height={16} />
        ))}
      </div>
    </article>
  );
}

/**
 * SidebarSkeleton - 侧边栏骨架屏
 */
export function SidebarSkeleton() {
  return (
    <aside className="space-y-6">
      {/* 搜索框 */}
      <Skeleton height={48} variant="rounded" />

      {/* 分类 */}
      <div>
        <Skeleton height={24} width={100} className="mb-4" />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} height={32} width="100%" />
          ))}
        </div>
      </div>

      {/* 热门文章 */}
      <div>
        <Skeleton height={24} width={120} className="mb-4" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <Skeleton width={60} height={60} variant="rounded" />
              <div className="flex-1 space-y-2">
                <Skeleton width="100%" height={16} />
                <Skeleton width={60} height={14} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

/**
 * CommentSkeleton - 评论骨架屏
 */
export function CommentSkeleton() {
  return (
    <div className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      {/* 头像 */}
      <Skeleton width={48} height={48} variant="circular" />

      {/* 内容 */}
      <div className="flex-1 space-y-3">
        <div className="flex items-center gap-2">
          <Skeleton width={100} height={16} />
          <Skeleton width={80} height={14} />
        </div>
        <Skeleton width="100%" height={16} />
        <Skeleton width="90%" height={16} />
        <Skeleton width="70%" height={16} />
      </div>
    </div>
  );
}

export default Skeleton;
