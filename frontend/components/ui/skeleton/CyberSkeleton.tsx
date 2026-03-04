'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export type SkeletonColor = 'cyan' | 'purple' | 'pink' | 'gray';
export type SkeletonSize = 'sm' | 'md' | 'lg';

const colorClasses = {
  cyan: 'from-cyan-500/20 to-cyan-400/10 border-cyan-500/30',
  purple: 'from-purple-500/20 to-purple-400/10 border-purple-500/30',
  pink: 'from-pink-500/20 to-pink-400/10 border-pink-500/30',
  gray: 'from-gray-500/20 to-gray-400/10 border-gray-500/30',
};

const sizeClasses = {
  sm: {
    height: 'h-4',
    width: 'w-4',
    circle: 'h-8 w-8',
  },
  md: {
    height: 'h-6',
    width: 'w-6',
    circle: 'h-12 w-12',
  },
  lg: {
    height: 'h-8',
    width: 'w-8',
    circle: 'h-16 w-16',
  },
};

export interface CyberSkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  size?: SkeletonSize;
  color?: SkeletonColor;
  count?: number;
  className?: string;
  animation?: 'pulse' | 'wave' | 'none';
}

export const CyberSkeleton: React.FC<CyberSkeletonProps> = ({
  variant = 'text',
  width,
  height,
  size = 'md',
  color = 'gray',
  count = 1,
  className,
  animation = 'pulse',
}) => {
  const sizeClass = sizeClasses[size];
  const colorClass = colorClasses[color];

  const getVariantStyles = () => {
    switch (variant) {
      case 'text':
        return cn('rounded', sizeClass.height, { width: width || 'w-full' });
      case 'circular':
        return cn('rounded-full', sizeClass.circle);
      case 'rectangular':
        return cn('rounded-none', sizeClass.height, { width: width || 'w-full' });
      case 'rounded':
        return cn('rounded-lg', sizeClass.height, { width: width || 'w-full' });
      default:
        return '';
    }
  };

  const getSkeleton = (index: number) => (
    <motion.div
      key={index}
      className={cn(
        'relative overflow-hidden border',
        'bg-gradient-to-br',
        colorClass,
        getVariantStyles(),
        className
      )}
      style={{
        width: variant === 'text' || variant === 'rectangular' || variant === 'rounded' ? width : undefined,
        height: height,
      }}
      animate={
        animation === 'pulse'
          ? {
              opacity: [0.5, 1, 0.5],
            }
          : animation === 'wave'
          ? {}
          : {}
      }
      transition={
        animation === 'pulse'
          ? {
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }
          : undefined
      }
    >
      {/* 波浪动画 */}
      {animation === 'wave' && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}

      {/* 扫描线效果 */}
      <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] pointer-events-none" />

      {/* 装饰角标 */}
      <div className="absolute left-0 top-0 h-2 w-2 border-l border-t border-current opacity-30" />
      <div className="absolute right-0 bottom-0 h-2 w-2 border-r border-b border-current opacity-30" />
    </motion.div>
  );

  return (
    <>
      {Array.from({ length: count }).map((_, index) => getSkeleton(index))}
    </>
  );
};

// 卡片骨架屏
export interface CardSkeletonProps {
  color?: SkeletonColor;
  showAvatar?: boolean;
  showImage?: boolean;
  lines?: number;
  className?: string;
}

export const CardSkeleton: React.FC<CardSkeletonProps> = ({
  color = 'cyan',
  showAvatar = true,
  showImage = true,
  lines = 3,
  className,
}) => {
  return (
    <div
      className={cn(
        'p-4 rounded-xl border-2 border-dashed',
        'bg-gradient-to-br',
        colorClasses[color],
        className
      )}
    >
      {/* 图片骨架 */}
      {showImage && (
        <CyberSkeleton
          variant="rounded"
          width="100%"
          height={200}
          color={color}
          className="mb-4"
        />
      )}

      {/* 头像骨架 */}
      {showAvatar && (
        <div className="flex items-center gap-3 mb-4">
          <CyberSkeleton variant="circular" size="lg" color={color} />
          <div className="flex-1">
            <CyberSkeleton variant="text" width="60%" color={color} className="mb-2" />
            <CyberSkeleton variant="text" width="40%" size="sm" color={color} />
          </div>
        </div>
      )}

      {/* 标题骨架 */}
      <CyberSkeleton variant="text" width="80%" size="lg" color={color} className="mb-3" />

      {/* 内容骨架 */}
      {Array.from({ length: lines }).map((_, index) => (
        <CyberSkeleton
          key={index}
          variant="text"
          width={index === lines - 1 ? '70%' : '100%'}
          color={color}
          className="mb-2"
        />
      ))}
    </div>
  );
};

// 列表骨架屏
export interface ListSkeletonProps {
  items?: number;
  color?: SkeletonColor;
  showAvatar?: boolean;
  className?: string;
}

export const ListSkeleton: React.FC<ListSkeletonProps> = ({
  items = 5,
  color = 'cyan',
  showAvatar = true,
  className,
}) => {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="flex items-center gap-3 p-3 rounded-lg border border-white/10">
          {showAvatar && (
            <CyberSkeleton variant="circular" size="md" color={color} />
          )}
          <div className="flex-1">
            <CyberSkeleton variant="text" width="70%" color={color} className="mb-2" />
            <CyberSkeleton variant="text" width="50%" size="sm" color={color} />
          </div>
          <CyberSkeleton variant="rectangular" width={60} height={24} color={color} />
        </div>
      ))}
    </div>
  );
};

// 表格骨架屏
export interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  color?: SkeletonColor;
  className?: string;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({
  rows = 5,
  columns = 4,
  color = 'cyan',
  className,
}) => {
  return (
    <div className={cn('w-full', className)}>
      {/* 表头 */}
      <div className="flex gap-4 mb-3 pb-2 border-b border-white/10">
        {Array.from({ length: columns }).map((_, index) => (
          <CyberSkeleton
            key={`header-${index}`}
            variant="text"
            width={index === 0 ? '40%' : '20%'}
            size="lg"
            color={color}
          />
        ))}
      </div>

      {/* 表格内容 */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="flex gap-4 py-3 border-b border-white/5">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <CyberSkeleton
              key={`cell-${rowIndex}-${colIndex}`}
              variant="text"
              width={colIndex === 0 ? '40%' : '20%'}
              color={color}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default CyberSkeleton;
