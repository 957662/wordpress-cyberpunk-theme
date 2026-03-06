'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface LoadingStateProps {
  variant?: 'list' | 'grid' | 'card' | 'skeleton';
  count?: number;
  className?: string;
}

/**
 * 加载状态组件
 * 用于博客列表、网格等场景的加载占位
 */
export function LoadingState({
  variant = 'list',
  count = 6,
  className,
}: LoadingStateProps) {
  const skeletonItem = () => (
    <div className="animate-pulse">
      {/* 图片占位 */}
      <div className="bg-gray-200 dark:bg-gray-800 rounded-lg h-48 mb-4" />
      
      {/* 内容占位 */}
      <div className="space-y-3">
        {/* 标题 */}
        <div className="bg-gray-200 dark:bg-gray-800 rounded h-6 w-3/4" />
        
        {/* 摘要 */}
        <div className="space-y-2">
          <div className="bg-gray-200 dark:bg-gray-800 rounded h-4 w-full" />
          <div className="bg-gray-200 dark:bg-gray-800 rounded h-4 w-5/6" />
          <div className="bg-gray-200 dark:bg-gray-800 rounded h-4 w-4/6" />
        </div>
        
        {/* 元信息 */}
        <div className="flex items-center gap-4">
          <div className="bg-gray-200 dark:bg-gray-800 rounded h-4 w-20" />
          <div className="bg-gray-200 dark:bg-gray-800 rounded h-4 w-24" />
        </div>
      </div>
    </div>
  );

  if (variant === 'grid') {
    return (
      <div className={cn('grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3', className)}>
        {Array.from({ length: count }).map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white dark:bg-gray-900 rounded-lg p-4 shadow-sm"
          >
            {skeletonItem()}
          </motion.div>
        ))}
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={cn('flex items-center justify-center min-h-[400px]', className)}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          {/* 赛博朋克风格加载动画 */}
          <div className="relative w-24 h-24 mx-auto mb-6">
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-cyan-500/30"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              className="absolute inset-2 rounded-full border-4 border-purple-500/50"
              animate={{ rotate: -360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              className="absolute inset-4 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500"
              animate={{ scale: [1, 0.8, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </div>
          
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            加载中...
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            正在获取最新内容
          </p>
        </motion.div>
      </div>
    );
  }

  // 默认列表模式
  return (
    <div className={cn('space-y-6', className)}>
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm"
        >
          {skeletonItem()}
        </motion.div>
      ))}
    </div>
  );
}

/**
 * 骨架屏组件 - 简化版本
 */
export interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export function Skeleton({
  className,
  variant = 'text',
  width,
  height,
}: SkeletonProps) {
  const variantStyles = {
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-md',
  };

  return (
    <div
      className={cn(
        'animate-pulse bg-gray-200 dark:bg-gray-800',
        variantStyles[variant],
        className
      )}
      style={{ width, height }}
    />
  );
}

export default LoadingState;
