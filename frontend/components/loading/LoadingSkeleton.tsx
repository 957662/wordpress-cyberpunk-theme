'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface LoadingSkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  className?: string;
  animation?: 'pulse' | 'wave' | 'none';
}

/**
 * LoadingSkeleton Component
 *
 * Skeleton placeholder for content that is loading.
 * Provides visual feedback during data fetching.
 */
export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  variant = 'text',
  width,
  height,
  className = '',
  animation = 'pulse',
}) => {
  const baseClasses = 'bg-gray-200 dark:bg-gray-700';

  const variantClasses = {
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-sm',
    rounded: 'rounded-md',
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer',
    none: '',
  };

  const style = {
    width: width || (variant === 'text' ? '100%' : '40px'),
    height: height || (variant === 'text' ? '1rem' : '40px'),
  };

  return (
    <motion.div
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
      style={style}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    />
  );
};

/**
 * BlogCardSkeleton - Skeleton loader for blog cards
 */
export const BlogCardSkeleton: React.FC = () => {
  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden bg-white dark:bg-gray-900 p-4">
      {/* Image */}
      <LoadingSkeleton variant="rectangular" width="100%" height="200px" className="mb-4" />

      {/* Category */}
      <LoadingSkeleton variant="text" width="80px" className="mb-3" />

      {/* Title */}
      <LoadingSkeleton variant="text" width="100%" height="24px" className="mb-2" />
      <LoadingSkeleton variant="text" width="70%" height="24px" className="mb-4" />

      {/* Meta */}
      <div className="flex gap-4 mb-4">
        <LoadingSkeleton variant="text" width="60px" />
        <LoadingSkeleton variant="text" width="60px" />
        <LoadingSkeleton variant="text" width="60px" />
      </div>

      {/* Excerpt */}
      <LoadingSkeleton variant="text" width="100%" className="mb-2" />
      <LoadingSkeleton variant="text" width="100%" className="mb-2" />
      <LoadingSkeleton variant="text" width="60%" className="mb-4" />

      {/* Tags */}
      <div className="flex gap-2">
        <LoadingSkeleton variant="rounded" width="40px" height="24px" />
        <LoadingSkeleton variant="rounded" width="40px" height="24px" />
        <LoadingSkeleton variant="rounded" width="40px" height="24px" />
      </div>
    </div>
  );
};

/**
 * BlogListSkeleton - Multiple blog card skeletons
 */
export const BlogListSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <BlogCardSkeleton key={i} />
      ))}
    </div>
  );
};

/**
 * PostDetailSkeleton - Skeleton for blog post detail page
 */
export const PostDetailSkeleton: React.FC = () => {
  return (
    <article className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <LoadingSkeleton variant="text" width="120px" className="mb-4" />
        <LoadingSkeleton variant="text" width="100%" height="48px" className="mb-4" />
        <LoadingSkeleton variant="text" width="70%" height="48px" className="mb-6" />

        <div className="flex items-center gap-6">
          <LoadingSkeleton variant="circular" width="48px" height="48px" />
          <div>
            <LoadingSkeleton variant="text" width="150px" className="mb-2" />
            <LoadingSkeleton variant="text" width="100px" />
          </div>
        </div>
      </div>

      {/* Featured Image */}
      <LoadingSkeleton variant="rectangular" width="100%" height="400px" className="mb-8" />

      {/* Content */}
      <div className="space-y-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <LoadingSkeleton key={i} variant="text" width="100%" />
        ))}
      </div>
    </article>
  );
};

/**
 * TableSkeleton - Skeleton for table data
 */
export const TableSkeleton: React.FC<{ rows?: number; columns?: number }> = ({
  rows = 5,
  columns = 4,
}) => {
  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-full">
        {/* Header */}
        <div className="flex gap-4 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
          {Array.from({ length: columns }).map((_, i) => (
            <LoadingSkeleton key={i} variant="text" width="120px" />
          ))}
        </div>

        {/* Rows */}
        <div className="space-y-4">
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="flex gap-4">
              {Array.from({ length: columns }).map((_, j) => (
                <LoadingSkeleton key={j} variant="text" width="100px" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;
