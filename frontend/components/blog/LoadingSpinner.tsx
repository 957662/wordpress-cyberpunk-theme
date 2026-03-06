/**
 * 博客加载动画组件
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// ============================================================================
// Types
// ============================================================================

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'cyan' | 'purple' | 'pink' | 'green';
  className?: string;
}

// ============================================================================
// Components
// ============================================================================

/**
 * 赛博朋克风格加载动画
 */
export function LoadingSpinner({
  size = 'md',
  color = 'cyan',
  className,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const colorClasses = {
    cyan: 'border-cyber-cyan',
    purple: 'border-cyber-purple',
    pink: 'border-cyber-pink',
    green: 'border-cyber-green',
  };

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <motion.div
        className={cn(
          'rounded-full border-2 border-t-transparent',
          sizeClasses[size],
          colorClasses[color]
        )}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  );
}

// ============================================================================
// 文章骨架屏组件
// ============================================================================

export interface ArticleSkeletonProps {
  showImage?: boolean;
  className?: string;
}

/**
 * 文章卡片骨架屏
 */
export function ArticleSkeleton({
  showImage = true,
  className,
}: ArticleSkeletonProps) {
  return (
    <div className={cn('rounded-lg border border-gray-800 bg-cyber-dark/50 p-4', className)}>
      {showImage && (
        <div className="aspect-video w-full overflow-hidden rounded bg-gray-800">
          <motion.div
            className="h-full w-full bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800"
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </div>
      )}
      <div className="mt-4 space-y-3">
        {/* 分类标签骨架 */}
        <div className="h-4 w-20 rounded bg-gray-800" />

        {/* 标题骨架 */}
        <div className="space-y-2">
          <div className="h-6 w-3/4 rounded bg-gray-800" />
          <div className="h-6 w-1/2 rounded bg-gray-800" />
        </div>

        {/* 摘要骨架 */}
        <div className="space-y-2">
          <div className="h-4 w-full rounded bg-gray-800" />
          <div className="h-4 w-5/6 rounded bg-gray-800" />
          <div className="h-4 w-4/6 rounded bg-gray-800" />
        </div>

        {/* 元信息骨架 */}
        <div className="flex items-center gap-4">
          <div className="h-4 w-24 rounded bg-gray-800" />
          <div className="h-4 w-20 rounded bg-gray-800" />
        </div>
      </div>
    </div>
  );
}

/**
 * 文章列表骨架屏
 */
export function ArticleListSkeleton({
  count = 6,
  showImage = true,
}: {
  count?: number;
  showImage?: boolean;
}) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <ArticleSkeleton key={i} showImage={showImage} />
      ))}
    </div>
  );
}

// ============================================================================
// 全屏加载组件
// ============================================================================

export interface FullPageLoadingProps {
  message?: string;
  showLogo?: boolean;
}

/**
 * 全屏加载页面
 */
export function FullPageLoading({
  message = '加载中...',
  showLogo = true,
}: FullPageLoadingProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cyber-dark">
      <div className="flex flex-col items-center gap-6">
        {showLogo && (
          <motion.div
            className="text-4xl font-bold text-cyber-cyan"
            animate={{
              textShadow: [
                '0 0 10px rgba(0, 240, 255, 0.5)',
                '0 0 20px rgba(0, 240, 255, 0.8)',
                '0 0 10px rgba(0, 240, 255, 0.5)',
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            CYBERPRESS
          </motion.div>
        )}
        <LoadingSpinner size="lg" color="cyan" />
        {message && (
          <motion.p
            className="text-sm text-gray-400"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {message}
          </motion.p>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// 按钮加载状态
// ============================================================================

export interface ButtonLoadingProps {
  loading?: boolean;
  children: React.ReactNode;
  className?: string;
}

/**
 * 带加载状态的按钮
 */
export function ButtonLoading({
  loading = false,
  children,
  className,
}: ButtonLoadingProps) {
  return (
    <button
      disabled={loading}
      className={cn(
        'relative inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
    >
      {loading && <LoadingSpinner size="sm" color="cyan" />}
      <span className={loading ? 'opacity-0' : 'opacity-100'}>{children}</span>
    </button>
  );
}

export default LoadingSpinner;
