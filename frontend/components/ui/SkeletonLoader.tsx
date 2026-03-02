'use client';

import React from 'react';
import { motion } from 'framer-motion';

export interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

/**
 * 单个骨架屏组件
 */
export function Skeleton({
  className = '',
  variant = 'text',
  width,
  height,
  animation = 'pulse',
}: SkeletonProps) {
  const baseClasses = 'bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800';

  const variantClasses: Record<string, string> = {
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-lg',
  };

  const animationClasses: Record<string, string> = {
    pulse: 'animate-pulse',
    wave: 'relative overflow-hidden',
    none: '',
  };

  const style: React.CSSProperties = {
    width: width || undefined,
    height: height || undefined,
  };

  if (animation === 'wave') {
    return (
      <div
        className={`${baseClasses} ${variantClasses[variant]} ${className} relative overflow-hidden`}
        style={style}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>
    );
  }

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
      style={style}
    />
  );
}

/**
 * 文本骨架屏
 */
export function TextSkeleton({
  lines = 3,
  className = '',
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          width={i === lines - 1 ? '70%' : '100%'}
        />
      ))}
    </div>
  );
}

/**
 * 卡片骨架屏
 */
export function CardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-gray-900/50 border border-gray-800 rounded-xl p-4 ${className}`}>
      <div className="flex items-start gap-4">
        <Skeleton variant="circular" width={48} height={48} />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="100%" />
          <Skeleton variant="text" width="80%" />
        </div>
      </div>
    </div>
  );
}

/**
 * 博客文章骨架屏
 */
export function BlogPostSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-gray-900/30 border border-gray-800/50 rounded-xl overflow-hidden ${className}`}>
      {/* 图片占位 */}
      <Skeleton variant="rectangular" width="100%" height={200} className="!rounded-t-xl" />

      <div className="p-6 space-y-4">
        {/* 标题 */}
        <Skeleton variant="text" width="80%" height={28} className="!h-7" />

        {/* 元数据 */}
        <div className="flex items-center gap-4">
          <Skeleton variant="circular" width={24} height={24} />
          <Skeleton variant="text" width={120} />
          <Skeleton variant="text" width={100} />
        </div>

        {/* 摘要 */}
        <TextSkeleton lines={3} />

        {/* 标签 */}
        <div className="flex gap-2">
          <Skeleton variant="rounded" width={80} height={28} />
          <Skeleton variant="rounded" width={80} height={28} />
          <Skeleton variant="rounded" width={80} height={28} />
        </div>
      </div>
    </div>
  );
}

/**
 * 列表骨架屏
 */
export function ListSkeleton({
  count = 5,
  itemClassName = '',
}: {
  count?: number;
  itemClassName?: string;
}) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} className={itemClassName} />
      ))}
    </div>
  );
}

/**
 * 表格骨架屏
 */
export function TableSkeleton({
  rows = 5,
  columns = 4,
  className = '',
}: {
  rows?: number;
  columns?: number;
  className?: string;
}) {
  return (
    <div className={`w-full overflow-x-auto ${className}`}>
      <div className="min-w-full">
        {/* 表头 */}
        <div className="flex gap-4 pb-4 border-b border-gray-800">
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={i} variant="text" width={120} />
          ))}
        </div>

        {/* 表格内容 */}
        <div className="py-4 space-y-3">
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="flex gap-4">
              {Array.from({ length: columns }).map((_, j) => (
                <Skeleton key={j} variant="text" width={120} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * 仪表板骨架屏
 */
export function DashboardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <Skeleton variant="circular" width={40} height={40} />
              <Skeleton variant="text" width={60} />
            </div>
            <Skeleton variant="text" width="40%" height={32} className="!h-8" />
            <Skeleton variant="text" width="60%" className="mt-2" />
          </div>
        ))}
      </div>

      {/* 图表区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
          <Skeleton variant="text" width={120} className="mb-4" />
          <Skeleton variant="rectangular" width="100%" height={300} />
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
          <Skeleton variant="text" width={120} className="mb-4" />
          <Skeleton variant="rectangular" width="100%" height={300} />
        </div>
      </div>
    </div>
  );
}

/**
 * 个人资料骨架屏
 */
export function ProfileSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-gray-900/50 border border-gray-800 rounded-xl p-6 ${className}`}>
      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* 头像 */}
        <Skeleton variant="circular" width={120} height={120} />

        {/* 信息 */}
        <div className="flex-1 space-y-3 w-full">
          <Skeleton variant="text" width="40%" height={32} className="!h-8 mx-auto sm:mx-0" />
          <Skeleton variant="text" width="60%" className="mx-auto sm:mx-0" />
          <Skeleton variant="text" width="80%" className="mx-auto sm:mx-0" />
          <div className="flex gap-2 justify-center sm:justify-start">
            <Skeleton variant="rounded" width={80} height={32} />
            <Skeleton variant="rounded" width={80} height={32} />
          </div>
        </div>
      </div>

      {/* 统计信息 */}
      <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-gray-800">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="text-center">
            <Skeleton variant="text" width={60} height={32} className="!h-8 mx-auto" />
            <Skeleton variant="text" width={80} className="mx-auto mt-2" />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * 评论骨架屏
 */
export function CommentSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-gray-900/30 border border-gray-800/50 rounded-xl p-4 ${className}`}>
      <div className="flex gap-4">
        {/* 头像 */}
        <Skeleton variant="circular" width={40} height={40} />

        {/* 内容 */}
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton variant="text" width={100} />
            <Skeleton variant="text" width={80} />
          </div>
          <TextSkeleton lines={2} />
        </div>
      </div>
    </div>
  );
}

/**
 * 画廊骨架屏
 */
export function GallerySkeleton({
  items = 6,
  className = '',
}: {
  items?: number;
  className?: string;
}) {
  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 gap-4 ${className}`}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="aspect-square">
          <Skeleton
            variant="rectangular"
            width="100%"
            height="100%"
            className="!rounded-lg"
          />
        </div>
      ))}
    </div>
  );
}

/**
 * 加载状态包装器
 */
export function SkeletonLoader({
  loading,
  children,
  skeleton,
  className = '',
}: {
  loading: boolean;
  children: React.ReactNode;
  skeleton: React.ReactNode;
  className?: string;
}) {
  if (loading) {
    return <div className={className}>{skeleton}</div>;
  }
  return <>{children}</>;
}

export default Skeleton;
