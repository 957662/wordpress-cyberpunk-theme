'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

export interface PostSkeletonProps {
  count?: number;
  className?: string;
}

export function PostSkeleton({ count = 6, className }: PostSkeletonProps) {
  return (
    <div className={cn('grid md:grid-cols-2 lg:grid-cols-3 gap-6', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.1 }}
          className="cyber-card p-6"
        >
          {/* Image Skeleton */}
          <div className="aspect-video bg-cyber-muted rounded-lg mb-4 animate-pulse" />

          {/* Category Skeleton */}
          <div className="h-6 w-20 bg-cyber-muted rounded-full mb-3 animate-pulse" />

          {/* Title Skeleton */}
          <div className="space-y-2 mb-3">
            <div className="h-6 bg-cyber-muted rounded animate-pulse" />
            <div className="h-6 w-3/4 bg-cyber-muted rounded animate-pulse" />
          </div>

          {/* Excerpt Skeleton */}
          <div className="space-y-2 mb-4">
            <div className="h-4 bg-cyber-muted rounded animate-pulse" />
            <div className="h-4 bg-cyber-muted rounded animate-pulse" />
            <div className="h-4 w-2/3 bg-cyber-muted rounded animate-pulse" />
          </div>

          {/* Meta Skeleton */}
          <div className="flex items-center gap-4">
            <div className="h-4 w-24 bg-cyber-muted rounded animate-pulse" />
            <div className="h-4 w-20 bg-cyber-muted rounded animate-pulse" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export function PostDetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Header Skeleton */}
      <div className="mb-8">
        <div className="h-8 w-24 bg-cyber-muted rounded-full mb-4 animate-pulse" />
        <div className="space-y-3 mb-6">
          <div className="h-10 bg-cyber-muted rounded animate-pulse" />
          <div className="h-10 w-3/4 bg-cyber-muted rounded animate-pulse" />
        </div>
        <div className="flex items-center gap-6">
          <div className="h-5 w-32 bg-cyber-muted rounded animate-pulse" />
          <div className="h-5 w-28 bg-cyber-muted rounded animate-pulse" />
          <div className="h-5 w-24 bg-cyber-muted rounded animate-pulse" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="space-y-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 bg-cyber-muted rounded animate-pulse" />
            <div className="h-4 bg-cyber-muted rounded animate-pulse" />
            <div className="h-4 w-4/5 bg-cyber-muted rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default PostSkeleton;
