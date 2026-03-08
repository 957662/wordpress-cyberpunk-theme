'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded'
  width?: string | number
  height?: string | number
  animation?: 'pulse' | 'wave' | 'none'
}

/**
 * 骨架屏组件
 * 用于在内容加载时显示占位符
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  animation = 'pulse',
  className,
  ...props
}) => {
  const variantStyles = {
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-lg',
  }

  const animationStyles = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer',
    none: '',
  }

  return (
    <motion.div
      className={cn(
        'bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700',
        'bg-[length:200%_100%]',
        variantStyles[variant],
        animationStyles[animation],
        className
      )}
      style={{
        width: width || (variant === 'text' ? '100%' : '40px'),
        height: height || (variant === 'text' ? '1rem' : '40px'),
      }}
      animate={
        animation === 'wave'
          ? {
              backgroundPosition: ['200% 0', '-200% 0'],
            }
          : undefined
      }
      transition={
        animation === 'wave'
          ? {
              duration: 1.5,
              repeat: Infinity,
              ease: 'linear',
            }
          : undefined
      }
      {...props}
    />
  )
}

// 文章列表骨架屏
export const ArticleListSkeleton: React.FC<{ count?: number }> = ({ count = 5 }) => {
  return (
    <div className="space-y-6">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4"
        >
          <div className="flex items-start gap-4">
            <Skeleton variant="rectangular" width={80} height={80} className="flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton width="70%" height={24} />
              <Skeleton width="40%" height={16} />
              <div className="flex gap-2 pt-2">
                <Skeleton width={60} height={20} />
                <Skeleton width={60} height={20} />
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

// 博客详情骨架屏
export const BlogDetailSkeleton: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 头部 */}
      <div className="space-y-4">
        <Skeleton width="30%" height={20} />
        <Skeleton width="80%" height={40} />
        <Skeleton width="60%" height={20} />
        <div className="flex items-center gap-4 pt-4">
          <Skeleton variant="circular" width={40} height={40} />
          <div className="space-y-2">
            <Skeleton width={120} height={16} />
            <Skeleton width={100} height={14} />
          </div>
        </div>
      </div>

      {/* 内容 */}
      <div className="space-y-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} width="100%" height={16} />
        ))}
      </div>
    </div>
  )
}

// 评论列表骨架屏
export const CommentListSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex gap-3">
          <Skeleton variant="circular" width={40} height={40} />
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton width={100} height={16} />
              <Skeleton width={80} height={14} />
            </div>
            <Skeleton width="100%" height={16} />
            <Skeleton width="80%" height={16} />
          </div>
        </div>
      ))}
    </div>
  )
}

// 用户资料骨架屏
export const UserProfileSkeleton: React.FC = () => {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
      <div className="flex flex-col items-center space-y-4">
        <Skeleton variant="circular" width={100} height={100} />
        <Skeleton width={150} height={24} />
        <Skeleton width={200} height={16} />
        <div className="flex gap-8 pt-4">
          <div className="text-center">
            <Skeleton width={50} height={20} />
            <Skeleton width={30} height={14} className="mt-1" />
          </div>
          <div className="text-center">
            <Skeleton width={50} height={20} />
            <Skeleton width={30} height={14} className="mt-1" />
          </div>
          <div className="text-center">
            <Skeleton width={50} height={20} />
            <Skeleton width={30} height={14} className="mt-1" />
          </div>
        </div>
      </div>
    </div>
  )
}

// 卡片骨架屏
export const CardSkeleton: React.FC<{ aspectRatio?: 'square' | 'video' | 'portrait' }> = ({
  aspectRatio = 'square'
}) => {
  const aspectRatios = {
    square: 'aspect-square',
    video: 'aspect-video',
    portrait: 'aspect-[3/4]',
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
      <Skeleton
        variant="rectangular"
        width="100%"
        height={0}
        className={cn('w-full', aspectRatios[aspectRatio])}
      />
      <div className="p-4 space-y-3">
        <Skeleton width="70%" height={20} />
        <Skeleton width="100%" height={14} />
        <Skeleton width="60%" height={14} />
      </div>
    </div>
  )
}

// 表格骨架屏
export const TableSkeleton: React.FC<{ rows?: number; cols?: number }> = ({
  rows = 5,
  cols = 4
}) => {
  return (
    <div className="w-full">
      {/* 表头 */}
      <div className="flex gap-4 pb-3 border-b border-white/10 mb-3">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} width={120} height={20} />
        ))}
      </div>
      {/* 表体 */}
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex gap-4">
            {Array.from({ length: cols }).map((_, colIndex) => (
              <Skeleton key={colIndex} width={100} height={16} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Skeleton
