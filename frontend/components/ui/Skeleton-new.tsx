'use client';

/**
 * Skeleton Component
 * Loading placeholder with cyberpunk styling
 */

import { motion } from 'framer-motion';

interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  className?: string;
  animation?: 'pulse' | 'wave' | 'none';
}

export function Skeleton({
  variant = 'rectangular',
  width = '100%',
  height = '1em',
  className = '',
  animation = 'pulse',
}: SkeletonProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'text':
        return 'rounded-sm';
      case 'circular':
        return 'rounded-full';
      case 'rectangular':
        return 'rounded-none';
      case 'rounded':
        return 'rounded-lg';
      default:
        return 'rounded';
    }
  };

  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  const baseClasses = 'bg-gray-800';
  const variantClasses = getVariantClasses();

  return (
    <motion.div
      className={`${baseClasses} ${variantClasses} ${className}`.trim()}
      style={style}
      animate={
        animation === 'pulse'
          ? {
              opacity: [0.4, 0.8, 0.4],
            }
          : undefined
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
          width={i === lines - 1 ? '70%' : '100%'}
        />
      ))}
    </div>
  );
}

interface SkeletonAvatarProps {
  size?: number;
  className?: string;
}

export function SkeletonAvatar({ size = 40, className = '' }: SkeletonAvatarProps) {
  return <Skeleton variant="circular" width={size} height={size} className={className} />;
}

interface SkeletonCardProps {
  className?: string;
}

export function SkeletonCard({ className = '' }: SkeletonCardProps) {
  return (
    <div className={`p-4 space-y-3 ${className}`}>
      <div className="flex items-center gap-3">
        <SkeletonAvatar />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" width="60%" height="1em" />
          <Skeleton variant="text" width="40%" height="0.8em" />
        </div>
      </div>
      <SkeletonText lines={2} />
      <div className="flex gap-2 pt-2">
        <Skeleton variant="rounded" width="60px" height="32px" />
        <Skeleton variant="rounded" width="60px" height="32px" />
      </div>
    </div>
  );
}
