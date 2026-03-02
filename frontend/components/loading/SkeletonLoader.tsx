'use client';

/**
 * CyberPress Platform - SkeletonLoader Component
 * 骨架屏加载组件
 */

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
  animation = 'pulse',
}: SkeletonProps) {
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-md',
  };

  const baseClasses = 'bg-cyber-border/30';

  if (animation === 'pulse') {
    return (
      <motion.div
        className={`${baseClasses} ${variantClasses[variant]} ${className}`}
        style={{ width, height }}
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    );
  }

  if (animation === 'wave') {
    return (
      <div className={`relative overflow-hidden ${className}`} style={{ width, height }}>
        <div
          className={`${baseClasses} ${variantClasses[variant]} w-full h-full`}
        />
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-cyber-cyan/20 to-transparent"
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
    );
  }

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={{ width, height }}
    />
  );
}

interface SkeletonTextProps {
  lines?: number;
  className?: string;
}

export function SkeletonText({ lines = 3, className = '' }: SkeletonTextProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          height={16}
          width={i === lines - 1 ? '60%' : '100%'}
        />
      ))}
    </div>
  );
}

interface SkeletonCardProps {
  className?: string;
  showAvatar?: boolean;
  showImage?: boolean;
  lines?: number;
}

export function SkeletonCard({
  className = '',
  showAvatar = false,
  showImage = false,
  lines = 3,
}: SkeletonCardProps) {
  return (
    <div className={`p-4 border border-cyber-border rounded-lg ${className}`}>
      {showImage && (
        <Skeleton variant="rectangular" height={200} className="mb-4 w-full" />
      )}

      <div className="flex items-start gap-4">
        {showAvatar && (
          <Skeleton variant="circular" width={48} height={48} className="flex-shrink-0" />
        )}

        <div className="flex-1 space-y-3">
          <Skeleton variant="text" height={24} width="70%" />
          <SkeletonText lines={lines} />
        </div>
      </div>
    </div>
  );
}

interface SkeletonListProps {
  items?: number;
  className?: string;
}

export function SkeletonList({ items = 5, className = '' }: SkeletonListProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: items }).map((_, i) => (
        <SkeletonCard key={i} showAvatar />
      ))}
    </div>
  );
}

export default Skeleton;
