/**
 * Skeleton Component
 * 骨架屏组件
 *
 * 用于数据加载时的占位显示
 */

'use client';

import { cn } from '@/lib/utils';

// ==================== 基础骨架屏 ====================

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export function Skeleton({
  className,
  variant = 'rectangular',
  width,
  height,
  animation = 'pulse',
  ...props
}: SkeletonProps) {
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-md',
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer',
    none: '',
  };

  return (
    <div
      className={cn(
        'bg-cyber-dark/50',
        variantClasses[variant],
        animationClasses[animation],
        className
      )}
      style={{ width, height }}
      {...props}
    />
  );
}

// ==================== 文章卡片骨架屏 ====================

export function ArticleCardSkeleton() {
  return (
    <div className="cyber-card p-6 space-y-4">
      {/* 头像和标题 */}
      <div className="flex items-center space-x-4">
        <Skeleton variant="circular" width={40} height={40} />
        <div className="space-y-2 flex-1">
          <Skeleton variant="text" height={16} width="60%" />
          <Skeleton variant="text" height={12} width="40%" />
        </div>
      </div>

      {/* 标题 */}
      <Skeleton variant="text" height={24} width="80%" className="mb-2" />
      <Skeleton variant="text" height={24} width="60%" />

      {/* 摘要 */}
      <div className="space-y-2">
        <Skeleton variant="text" height={16} />
        <Skeleton variant="text" height={16} />
        <Skeleton variant="text" height={16} width="70%" />
      </div>

      {/* 底部元数据 */}
      <div className="flex items-center justify-between pt-4 border-t border-cyber-cyan/20">
        <div className="flex items-center space-x-4">
          <Skeleton variant="text" height={14} width={60} />
          <Skeleton variant="text" height={14} width={60} />
        </div>
        <Skeleton variant="text" height={14} width={80} />
      </div>
    </div>
  );
}

// ==================== 博客列表骨架屏 ====================

export function BlogListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ArticleCardSkeleton key={i} />
      ))}
    </div>
  );
}

// ==================== 文章详情骨架屏 ====================

export function ArticleDetailSkeleton() {
  return (
    <article className="max-w-4xl mx-auto">
      {/* 文章头部 */}
      <div className="mb-8">
        <Skeleton variant="text" height={40} width="80%" className="mb-4" />
        <div className="flex items-center space-x-4 mb-4">
          <Skeleton variant="circular" width={48} height={48} />
          <div className="space-y-2">
            <Skeleton variant="text" height={16} width={120} />
            <Skeleton variant="text" height={14} width={80} />
          </div>
        </div>
        <div className="flex items-center space-x-6">
          <Skeleton variant="text" height={14} width={100} />
          <Skeleton variant="text" height={14} width={100} />
          <Skeleton variant="text" height={14} width={100} />
        </div>
      </div>

      {/* 特色图片 */}
      <Skeleton variant="rectangular" height={400} className="w-full mb-8" />

      {/* 文章内容 */}
      <div className="prose prose-invert max-w-none space-y-4">
        <Skeleton variant="text" height={20} />
        <Skeleton variant="text" height={20} />
        <Skeleton variant="text" height={20} width="60%" />

        <Skeleton variant="text" height={20} />
        <Skeleton variant="text" height={20} />
        <Skeleton variant="text" height={20} />
        <Skeleton variant="text" height={20} width="70%" />

        <Skeleton variant="text" height={20} />
        <Skeleton variant="text" height={20} />
        <Skeleton variant="text" height={20} />
      </div>

      {/* 文章底部 */}
      <div className="mt-12 pt-8 border-t border-cyber-cyan/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Skeleton variant="circular" width={32} height={32} />
            <Skeleton variant="text" height={16} width={80} />
            <Skeleton variant="text" height={16} width={80} />
          </div>
          <Skeleton variant="rectangular" height={36} width={120} />
        </div>
      </div>
    </article>
  );
}

// ==================== 评论骨架屏 ====================

export function CommentSkeleton() {
  return (
    <div className="flex space-x-4 p-4 border-b border-cyber-cyan/10">
      <Skeleton variant="circular" width={40} height={40} />
      <div className="flex-1 space-y-2">
        <div className="flex items-center space-x-2">
          <Skeleton variant="text" height={16} width={100} />
          <Skeleton variant="text" height={14} width={80} />
        </div>
        <Skeleton variant="text" height={16} />
        <Skeleton variant="text" height={16} />
        <Skeleton variant="text" height={16} width="60%" />
        <div className="flex items-center space-x-4 pt-2">
          <Skeleton variant="text" height={14} width={60} />
          <Skeleton variant="text" height={14} width={60} />
        </div>
      </div>
    </div>
  );
}

export function CommentListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <CommentSkeleton key={i} />
      ))}
    </div>
  );
}

// ==================== 侧边栏骨架屏 ====================

export function SidebarSkeleton() {
  return (
    <aside className="space-y-6">
      {/* 个人信息卡片 */}
      <div className="cyber-card p-6 space-y-4">
        <Skeleton variant="circular" width={80} height={80} className="mx-auto" />
        <Skeleton variant="text" height={20} width="60%" className="mx-auto" />
        <Skeleton variant="text" height={14} />
        <div className="flex justify-center space-x-8 pt-4">
          <div className="text-center">
            <Skeleton variant="text" height={20} width={40} className="mx-auto" />
            <Skeleton variant="text" height={12} width={30} className="mx-auto mt-1" />
          </div>
          <div className="text-center">
            <Skeleton variant="text" height={20} width={40} className="mx-auto" />
            <Skeleton variant="text" height={12} width={30} className="mx-auto mt-1" />
          </div>
          <div className="text-center">
            <Skeleton variant="text" height={20} width={40} className="mx-auto" />
            <Skeleton variant="text" height={12} width={30} className="mx-auto mt-1" />
          </div>
        </div>
      </div>

      {/* 热门文章 */}
      <div className="cyber-card p-6 space-y-3">
        <Skeleton variant="text" height={24} width="40%" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton variant="text" height={16} />
            <Skeleton variant="text" height={12} width="60%" />
          </div>
        ))}
      </div>

      {/* 分类标签 */}
      <div className="cyber-card p-6 space-y-3">
        <Skeleton variant="text" height={24} width="40%" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} variant="rounded" height={28} width={60} />
          ))}
        </div>
      </div>
    </aside>
  );
}

// ==================== 加载状态组合 ====================

export function LoadingState({ type = 'list' }: { type?: 'list' | 'detail' | 'sidebar' | 'comment' }) {
  switch (type) {
    case 'list':
      return <BlogListSkeleton />;
    case 'detail':
      return <ArticleDetailSkeleton />;
    case 'sidebar':
      return <SidebarSkeleton />;
    case 'comment':
      return <CommentListSkeleton />;
    default:
      return <BlogListSkeleton />;
  }
}

// ==================== 占位符文本 ====================

export function LoadingPlaceholder({ text = '加载中...' }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative w-16 h-16 mb-4">
        <div className="absolute inset-0 border-4 border-cyber-cyan/20 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-cyber-cyan border-t-transparent rounded-full animate-spin"></div>
      </div>
      <p className="text-cyber-muted text-sm">{text}</p>
    </div>
  );
}

// ==================== 空状态 ====================

export function EmptyState({
  icon,
  title,
  description,
  action
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {icon && (
        <div className="w-16 h-16 mb-4 flex items-center justify-center text-cyber-cyan/50">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-cyber-cyan mb-2">{title}</h3>
      {description && (
        <p className="text-cyber-muted text-sm mb-4 max-w-md">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
