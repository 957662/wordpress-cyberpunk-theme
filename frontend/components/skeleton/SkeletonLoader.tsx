'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  className?: string;
  animation?: 'pulse' | 'wave' | 'none';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  className,
  animation = 'pulse',
}) => {
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-lg',
  };

  const defaultDimensions = {
    text: { width: '100%', height: '1rem' },
    circular: { width: '40px', height: '40px' },
    rectangular: { width: '100%', height: '100px' },
    rounded: { width: '100%', height: '100px' },
  };

  const dimensions = {
    width: width || defaultDimensions[variant].width,
    height: height || defaultDimensions[variant].height,
  };

  const animationComponent = {
    pulse: (
      <motion.div
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    ),
    wave: (
      <motion.div
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    ),
    none: <div />,
  };

  return (
    <div
      className={cn(
        'relative bg-gray-800 overflow-hidden',
        variantClasses[variant],
        className
      )}
      style={dimensions}
    >
      {animation === 'pulse' && (
        <div className="absolute inset-0">{animationComponent.pulse}</div>
      )}

      {animation === 'wave' && (
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            style={{ width: '200%' }}
          >
            {animationComponent.wave}
          </div>
        </div>
      )}
    </div>
  );
};

// Pre-defined skeleton layouts

export interface SkeletonTextProps {
  lines?: number;
  className?: string;
}

export const SkeletonText: React.FC<SkeletonTextProps> = ({ lines = 3, className }) => (
  <div className={cn('space-y-2', className)}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        variant="text"
        width={i === lines - 1 ? '70%' : '100%'}
      />
    ))}
  </div>
);

export interface SkeletonCardProps {
  showAvatar?: boolean;
  showTitle?: boolean;
  showText?: boolean;
  lines?: number;
  className?: string;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({
  showAvatar = true,
  showTitle = true,
  showText = true,
  lines = 3,
  className,
}) => (
  <div className={cn('p-6 space-y-4', className)}>
    {showAvatar && (
      <div className="flex items-center gap-4">
        <Skeleton variant="circular" width={48} height={48} />
        <div className="flex-1">
          <Skeleton variant="text" width="60%" height="20px" />
          <Skeleton variant="text" width="40%" height="16px" />
        </div>
      </div>
    )}
    {showTitle && <Skeleton variant="text" width="80%" height="24px" />}
    {showText && <SkeletonText lines={lines} />}
  </div>
);

export interface SkeletonListProps {
  items?: number;
  className?: string;
}

export const SkeletonList: React.FC<SkeletonListProps> = ({ items = 5, className }) => (
  <div className={cn('space-y-4', className)}>
    {Array.from({ length: items }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export interface SkeletonTableProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export const SkeletonTable: React.FC<SkeletonTableProps> = ({
  rows = 5,
  columns = 4,
  className,
}) => (
  <div className={cn('space-y-2', className)}>
    {/* Header */}
    <div className="flex gap-4">
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton key={i} variant="text" width={150} height="32px" />
      ))}
    </div>

    {/* Rows */}
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex gap-4">
        {Array.from({ length: columns }).map((_, j) => (
          <Skeleton key={j} variant="text" width={150} />
        ))}
      </div>
    ))}
  </div>
);

export default Skeleton;
