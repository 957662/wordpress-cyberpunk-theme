'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface CyberSkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  count?: number;
  animation?: 'pulse' | 'wave' | 'none';
  color?: 'cyan' | 'purple' | 'pink' | 'green' | 'yellow';
  className?: string;
}

const colorClasses = {
  cyan: 'from-cyan-500/20 to-blue-500/20',
  purple: 'from-purple-500/20 to-pink-500/20',
  pink: 'from-pink-500/20 to-rose-500/20',
  green: 'from-green-500/20 to-emerald-500/20',
  yellow: 'from-yellow-500/20 to-orange-500/20'
};

const sizeClasses = {
  text: {
    small: 'h-3 w-3/4',
    medium: 'h-4 w-full',
    large: 'h-5 w-full'
  },
  circular: {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  },
  rectangular: {
    small: 'h-16 w-full',
    medium: 'h-24 w-full',
    large: 'h-32 w-full'
  },
  rounded: {
    small: 'h-8 w-full rounded-lg',
    medium: 'h-12 w-full rounded-xl',
    large: 'h-16 w-full rounded-2xl'
  }
};

export const CyberSkeleton: React.FC<CyberSkeletonProps> = ({
  variant = 'rectangular',
  width,
  height,
  count = 1,
  animation = 'pulse',
  color = 'cyan',
  className
}) => {
  const colorClass = colorClasses[color];

  // 动画配置
  const animationVariants = {
    pulse: {
      animate: {
        opacity: [0.4, 0.8, 0.4]
      },
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    },
    wave: {
      animate: {
        x: ['-100%', '200%']
      },
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: 'linear'
      }
    },
    none: {}
  };

  // 渲染单个骨架
  const renderSkeleton = (index: number) => {
    const baseClasses = cn(
      'bg-gradient-to-r relative overflow-hidden',
      colorClass,
      variant === 'circular' && 'rounded-full',
      variant === 'rounded' && 'rounded-xl',
      variant === 'rectangular' && 'rounded-none',
      variant === 'text' && 'rounded-sm',
      className
    );

    const style: React.CSSProperties = {};
    if (width) style.width = typeof width === 'number' ? `${width}px` : width;
    if (height) style.height = typeof height === 'number' ? `${height}px` : height;

    return (
      <motion.div
        key={index}
        className={baseClasses}
        style={style}
        {...(animation !== 'none' && animationVariants[animation])}
      >
        {/* 波浪效果 */}
        {animation === 'wave' && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{
              x: ['-100%', '200%']
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'linear'
            }}
          />
        )}
      </motion.div>
    );
  };

  return (
    <>
      {Array.from({ length: count }).map((_, index) => renderSkeleton(index))}
    </>
  );
};

/**
 * 文本骨架屏组件
 */
export const SkeletonText: React.FC<{
  lines?: number;
  className?: string;
}> = ({ lines = 3, className }) => {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <CyberSkeleton
          key={index}
          variant="text"
          width={index === lines - 1 ? '70%' : '100%'}
        />
      ))}
    </div>
  );
};

/**
 * 头像骨架屏组件
 */
export const SkeletonAvatar: React.FC<{
  size?: 'small' | 'medium' | 'large';
  className?: string;
}> = ({ size = 'medium', className }) => {
  return (
    <CyberSkeleton
      variant="circular"
      className={cn(sizeClasses.circular[size], className)}
    />
  );
};

/**
 * 卡片骨架屏组件
 */
export const SkeletonCard: React.FC<{
  className?: string;
}> = ({ className }) => {
  return (
    <div className={cn('space-y-4 p-4 rounded-xl border border-gray-800', className)}>
      <div className="flex items-start gap-4">
        <SkeletonAvatar size="medium" />
        <div className="flex-1 space-y-2">
          <CyberSkeleton variant="text" width="60%" height={20} />
          <CyberSkeleton variant="text" width="40%" />
        </div>
      </div>
      <SkeletonText lines={2} />
    </div>
  );
};

/**
 * 列表骨架屏组件
 */
export const SkeletonList: React.FC<{
  count?: number;
  className?: string;
}> = ({ count = 3, className }) => {
  return (
    <div className={cn('space-y-4', className)}>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
};

/**
 * 表格骨架屏组件
 */
export const SkeletonTable: React.FC<{
  rows?: number;
  columns?: number;
  className?: string;
}> = ({ rows = 5, columns = 4, className }) => {
  return (
    <div className={cn('w-full space-y-2', className)}>
      {/* 表头 */}
      <div className="flex gap-4 pb-2 border-b border-gray-800">
        {Array.from({ length: columns }).map((_, index) => (
          <CyberSkeleton
            key={`header-${index}`}
            variant="text"
            width={100 / columns}
          />
        ))}
      </div>
      {/* 表体 */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="flex gap-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <CyberSkeleton
              key={`cell-${rowIndex}-${colIndex}`}
              variant="text"
              width={100 / columns}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default CyberSkeleton;
