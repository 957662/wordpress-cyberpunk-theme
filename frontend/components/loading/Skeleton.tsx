'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export function Skeleton({
  className = '',
  variant = 'rectangular',
  width,
  height,
  animation = 'pulse'
}: SkeletonProps) {
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-lg'
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer',
    none: ''
  };

  const style: React.CSSProperties = {
    width: width || '100%',
    height: height || (variant === 'text' ? '1em' : '100%')
  };

  return (
    <motion.div
      className={`bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
      style={style}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    />
  );
}

// 文本骨架屏
interface TextSkeletonProps {
  lines?: number;
  className?: string;
}

export function TextSkeleton({ lines = 3, className = '' }: TextSkeletonProps) {
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

// 卡片骨架屏
export function CardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-gray-900/50 border border-gray-800 rounded-lg p-6 ${className}`}>
      <div className="flex items-start gap-4 mb-4">
        <Skeleton variant="circular" width={48} height={48} />
        <div className="flex-1">
          <Skeleton variant="text" width="60%" height={24} className="mb-2" />
          <Skeleton variant="text" width="40%" />
        </div>
      </div>
      <TextSkeleton lines={2} />
    </div>
  );
}

// 博客卡片骨架屏
export function BlogCardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-gray-900/50 border border-gray-800 rounded-lg overflow-hidden ${className}`}>
      <Skeleton variant="rectangular" width="100%" height={200} />
      <div className="p-6">
        <div className="flex gap-2 mb-3">
          <Skeleton variant="rounded" width={60} height={24} />
          <Skeleton variant="rounded" width={60} height={24} />
        </div>
        <Skeleton variant="text" width="80%" height={28} className="mb-3" />
        <TextSkeleton lines={2} />
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-800">
          <div className="flex items-center gap-2">
            <Skeleton variant="circular" width={32} height={32} />
            <Skeleton variant="text" width={100} />
          </div>
          <Skeleton variant="text" width={60} />
        </div>
      </div>
    </div>
  );
}

// 列表骨架屏
export function ListSkeleton({ items = 5, className = '' }: { items?: number; className?: string }) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 bg-gray-900/30 border border-gray-800 rounded-lg">
          <Skeleton variant="circular" width={40} height={40} />
          <div className="flex-1">
            <Skeleton variant="text" width="60%" className="mb-1" />
            <Skeleton variant="text" width="40%" />
          </div>
          <Skeleton variant="rounded" width={80} height={32} />
        </div>
      ))}
    </div>
  );
}

// 表格骨架屏
export function TableSkeleton({ rows = 5, columns = 4, className = '' }: { rows?: number; columns?: number; className?: string }) {
  return (
    <div className={`bg-gray-900/50 border border-gray-800 rounded-lg overflow-hidden ${className}`}>
      {/* 表头 */}
      <div className="grid grid-cols-4 gap-4 p-4 bg-gray-800/50 border-b border-gray-700">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} variant="text" width="70%" height={20} />
        ))}
      </div>

      {/* 表体 */}
      <div className="divide-y divide-gray-800">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="grid grid-cols-4 gap-4 p-4">
            {Array.from({ length: columns }).map((_, j) => (
              <Skeleton key={j} variant="text" width="60%" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// 仪表板骨架屏
export function DashboardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
            <Skeleton variant="text" width="40%" className="mb-2" />
            <Skeleton variant="text" width="60%" height={32} />
          </div>
        ))}
      </div>

      {/* 图表区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
          <Skeleton variant="text" width="30%" className="mb-4" />
          <Skeleton variant="rectangular" width="100%" height={300} />
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
          <Skeleton variant="text" width="30%" className="mb-4" />
          <Skeleton variant="rectangular" width="100%" height={300} />
        </div>
      </div>

      {/* 列表区域 */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
        <Skeleton variant="text" width="20%" className="mb-4" />
        <ListSkeleton items={5} />
      </div>
    </div>
  );
}

// 个人资料骨架屏
export function ProfileSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-gray-900/50 border border-gray-800 rounded-lg p-6 ${className}`}>
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        <Skeleton variant="circular" width={120} height={120} />
        <div className="flex-1 text-center md:text-left">
          <Skeleton variant="text" width="40%" height={32} className="mb-2" />
          <Skeleton variant="text" width="30%" className="mb-4" />
          <TextSkeleton lines={2} />

          <div className="flex flex-wrap gap-3 mt-4 justify-center md:justify-start">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} variant="rounded" width={80} height={32} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// 评论骨架屏
export function CommentSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-gray-900/30 border border-gray-800 rounded-lg p-4 ${className}`}>
      <div className="flex items-start gap-3">
        <Skeleton variant="circular" width={40} height={40} />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Skeleton variant="text" width={100} />
            <Skeleton variant="text" width={80} />
          </div>
          <TextSkeleton lines={2} />
        </div>
      </div>
    </div>
  );
}

// 加载状态包装器
interface LoadingWrapperProps {
  loading: boolean;
  children: React.ReactNode;
  skeleton?: React.ReactNode;
}

export function LoadingWrapper({ loading, children, skeleton }: LoadingWrapperProps) {
  if (loading) {
    return <>{skeleton || <DashboardSkeleton />}</>;
  }
  return <>{children}</>;
}

// 带动画的加载指示器
export function LoadingSpinner({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <motion.div
        className={`${sizeClasses[size]} border-4 border-cyan-500/30 border-t-cyan-500 rounded-full`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
}

// 进度条骨架屏
export function ProgressSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`space-y-2 ${className}`}>
      <Skeleton variant="text" width="20%" />
      <Skeleton variant="rectangular" width="100%" height={8} />
    </div>
  );
}

// 导出所有组件
export default {
  Skeleton,
  TextSkeleton,
  CardSkeleton,
  BlogCardSkeleton,
  ListSkeleton,
  TableSkeleton,
  DashboardSkeleton,
  ProfileSkeleton,
  CommentSkeleton,
  LoadingWrapper,
  LoadingSpinner,
  ProgressSkeleton
};
