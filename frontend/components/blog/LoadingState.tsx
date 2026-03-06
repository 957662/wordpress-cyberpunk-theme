/**
 * 博客加载状态组件
 * 提供统一的加载状态显示
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface BlogLoadingSkeletonProps {
  variant?: 'card' | 'list' | 'grid';
  count?: number;
  className?: string;
}

/**
 * 博客卡片骨架屏
 */
export function BlogCardSkeleton({ className }: { className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(
        'group relative overflow-hidden rounded-lg',
        'border border-cyber-cyan/30 bg-deep-black/80 backdrop-blur-sm',
        className
      )}
    >
      {/* 图片骨架 */}
      <div className="relative aspect-video overflow-hidden bg-dark-bg/50">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-800/20 to-transparent"
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

      {/* 内容骨架 */}
      <div className="p-6 space-y-4">
        {/* 分类标签 */}
        <div className="flex gap-2">
          <div className="h-6 w-20 bg-dark-bg/50 rounded-full animate-pulse" />
          <div className="h-6 w-20 bg-dark-bg/50 rounded-full animate-pulse delay-75" />
        </div>

        {/* 标题 */}
        <div className="space-y-2">
          <div className="h-6 bg-dark-bg/50 rounded w-3/4 animate-pulse" />
          <div className="h-6 bg-dark-bg/50 rounded w-1/2 animate-pulse delay-75" />
        </div>

        {/* 摘要 */}
        <div className="space-y-2">
          <div className="h-4 bg-dark-bg/50 rounded w-full animate-pulse" />
          <div className="h-4 bg-dark-bg/50 rounded w-full animate-pulse delay-75" />
          <div className="h-4 bg-dark-bg/50 rounded w-2/3 animate-pulse delay-100" />
        </div>

        {/* 元信息 */}
        <div className="flex items-center gap-4 pt-4 border-t border-dark-border">
          <div className="h-4 w-24 bg-dark-bg/50 rounded animate-pulse" />
          <div className="h-4 w-24 bg-dark-bg/50 rounded animate-pulse delay-75" />
        </div>
      </div>

      {/* 装饰线 */}
      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-cyber-cyan to-cyber-purple" />
    </motion.div>
  );
}

/**
 * 博客列表骨架屏
 */
export function BlogListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <BlogCardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * 博客网格骨架屏（带动画）
 */
export function BlogGridSkeleton({ count = 6, className }: BlogLoadingSkeletonProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6', className)}
    >
      {Array.from({ length: count }).map((_, i) => (
        <motion.div key={i} variants={itemVariants}>
          <BlogCardSkeleton />
        </motion.div>
      ))}
    </motion.div>
  );
}

/**
 * 博客详情页骨架屏
 */
export function BlogDetailSkeleton() {
  return (
    <article className="max-w-4xl mx-auto">
      {/* 标题 */}
      <div className="mb-8 space-y-4">
        <div className="h-12 bg-dark-bg/50 rounded w-3/4 animate-pulse" />
        <div className="h-8 bg-dark-bg/50 rounded w-1/2 animate-pulse delay-75" />
      </div>

      {/* 作者信息 */}
      <div className="flex items-center gap-4 mb-8 p-4 bg-dark-bg/30 rounded-lg">
        <div className="w-12 h-12 bg-dark-bg/50 rounded-full animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-dark-bg/50 rounded w-1/3 animate-pulse" />
          <div className="h-3 bg-dark-bg/50 rounded w-1/4 animate-pulse delay-75" />
        </div>
      </div>

      {/* 特色图片 */}
      <div className="relative aspect-video mb-8 rounded-lg overflow-hidden bg-dark-bg/50">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-800/20 to-transparent"
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

      {/* 内容 */}
      <div className="prose prose-invert max-w-none space-y-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 bg-dark-bg/50 rounded w-full animate-pulse" />
            <div className="h-4 bg-dark-bg/50 rounded w-full animate-pulse delay-75" />
            <div className="h-4 bg-dark-bg/50 rounded w-5/6 animate-pulse delay-100" />
          </div>
        ))}
      </div>
    </article>
  );
}

/**
 * 迷你骨架屏（用于侧边栏等）
 */
export function MiniCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('flex gap-4 p-4 rounded-lg bg-dark-bg/30', className)}>
      {/* 缩略图 */}
      <div className="w-20 h-20 bg-dark-bg/50 rounded-lg animate-pulse flex-shrink-0" />

      {/* 内容 */}
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-dark-bg/50 rounded w-full animate-pulse" />
        <div className="h-4 bg-dark-bg/50 rounded w-2/3 animate-pulse delay-75" />
        <div className="h-3 bg-dark-bg/50 rounded w-1/3 animate-pulse delay-100" />
      </div>
    </div>
  );
}

/**
 * 侧边栏骨架屏
 */
export function SidebarSkeleton() {
  return (
    <aside className="space-y-6">
      {/* 搜索框 */}
      <div className="p-4 bg-dark-bg/30 rounded-lg">
        <div className="h-10 bg-dark-bg/50 rounded animate-pulse" />
      </div>

      {/* 分类 */}
      <div className="p-4 bg-dark-bg/30 rounded-lg">
        <div className="h-6 bg-dark-bg/50 rounded w-1/3 mb-4 animate-pulse" />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-4 bg-dark-bg/50 rounded w-full animate-pulse" />
          ))}
        </div>
      </div>

      {/* 热门文章 */}
      <div className="p-4 bg-dark-bg/30 rounded-lg">
        <div className="h-6 bg-dark-bg/50 rounded w-1/3 mb-4 animate-pulse" />
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <MiniCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </aside>
  );
}

/**
 * 文字加载动画
 */
export function TextLoading({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-dark-bg/50 rounded animate-pulse"
          style={{
            width: `${Math.random() * 40 + 60}%`,
            animationDelay: `${i * 75}ms`,
          }}
        />
      ))}
    </div>
  );
}

export default BlogCardSkeleton;
