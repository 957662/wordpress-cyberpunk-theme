/**
 * Skeleton Component
 *
 * Loading skeleton placeholders for content
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

const variantStyles = {
  text: 'rounded',
  circular: 'rounded-full',
  rectangular: 'rounded-md',
};

export function Skeleton({
  variant = 'text',
  width,
  height,
  animation = 'pulse',
  className,
  ...props
}: SkeletonProps) {
  const style: React.CSSProperties = {
    width,
    height,
  };

  const baseStyles = 'bg-cyber-muted';
  const animationStyles = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer',
    none: '',
  };

  return (
    <motion.div
      className={cn(
        baseStyles,
        variantStyles[variant],
        animationStyles[animation],
        className
      )}
      style={style}
      {...props}
    />
  );
}

export interface SkeletonTextProps {
  lines?: number;
  className?: string;
}

export function SkeletonText({ lines = 3, className }: SkeletonTextProps) {
  return (
    <div className={cn('space-y-2', className)}>
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

export interface SkeletonCardProps {
  showAvatar?: boolean;
  showTitle?: boolean;
  showText?: boolean;
  textLines?: number;
  className?: string;
}

export function SkeletonCard({
  showAvatar = true,
  showTitle = true,
  showText = true,
  textLines = 3,
  className,
}: SkeletonCardProps) {
  return (
    <div className={cn('cyber-card p-6', className)}>
      {showAvatar && (
        <div className="flex items-center space-x-4 mb-4">
          <Skeleton variant="circular" width={40} height={40} />
          <div className="flex-1">
            <Skeleton variant="text" width="60%" height={16} />
          </div>
        </div>
      )}

      {showTitle && (
        <Skeleton variant="text" width="80%" height={24} className="mb-4" />
      )}

      {showText && <SkeletonText lines={textLines} />}
    </div>
  );
}
