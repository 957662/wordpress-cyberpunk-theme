'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/clsx';

export interface SkeletonProps {
  className?: string;
  variant?: 'default' | 'circular' | 'rounded' | 'text';
  width?: string;
  height?: string;
  count?: number;
}

export const Skeleton = ({
  className,
  variant = 'default',
  width,
  height,
  count = 1,
}: SkeletonProps) => {
  const variantStyles = {
    default: 'rounded',
    circular: 'rounded-full',
    rounded: 'rounded-lg',
    text: 'rounded h-4',
  };

  const skeletons = Array.from({ length: count }, (_, i) => (
    <motion.div
      key={i}
      className={cn(
        'bg-cyber-muted animate-pulse',
        variantStyles[variant],
        className
      )}
      style={{ width, height }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: i * 0.1 }}
    />
  ));

  return <div className="space-y-2">{skeletons}</div>;
};

export const CardSkeleton = () => (
  <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 space-y-4">
    <Skeleton variant="circular" width={48} height={48} />
    <Skeleton height={24} width="70%" />
    <Skeleton height={16} count={3} />
    <div className="flex gap-2">
      <Skeleton height={32} width={80} />
      <Skeleton height={32} width={80} />
    </div>
  </div>
);

export const PostSkeleton = () => (
  <div className="bg-cyber-card border border-cyber-border rounded-xl overflow-hidden">
    <Skeleton height={200} className="w-full" />
    <div className="p-6 space-y-4">
      <Skeleton height={20} width={120} />
      <Skeleton height={32} width="90%" />
      <Skeleton height={16} count={3} />
    </div>
  </div>
);

export const ListSkeleton = ({ count = 5 }: { count?: number }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="flex items-center gap-4 p-4 bg-cyber-card border border-cyber-border rounded-lg">
        <Skeleton variant="circular" width={48} height={48} />
        <div className="flex-1 space-y-2">
          <Skeleton height={20} width="60%" />
          <Skeleton height={14} width="40%" />
        </div>
      </div>
    ))}
  </div>
);

export const TableSkeleton = ({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) => (
  <div className="space-y-2">
    {/* Header */}
    <div className="flex gap-4 p-4 bg-cyber-muted border border-cyber-border rounded-lg">
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton key={i} height={20} width={`${100 / columns}%`} />
      ))}
    </div>
    {/* Rows */}
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex gap-4 p-4 bg-cyber-card border border-cyber-border rounded-lg">
        {Array.from({ length: columns }).map((_, j) => (
          <Skeleton key={j} height={16} width={`${100 / columns}%`} />
        ))}
      </div>
    ))}
  </div>
);
