'use client';

import { HTMLAttributes, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface CyberBadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'solid' | 'outline' | 'glow';
  color?: 'cyan' | 'purple' | 'pink' | 'green' | 'yellow' | 'red';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
}

const colorClasses = {
  cyan: {
    solid: 'bg-cyan-500 text-white',
    outline: 'border-cyan-500 text-cyan-400',
    glow: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50 shadow-lg shadow-cyan-500/50'
  },
  purple: {
    solid: 'bg-purple-500 text-white',
    outline: 'border-purple-500 text-purple-400',
    glow: 'bg-purple-500/20 text-purple-400 border-purple-500/50 shadow-lg shadow-purple-500/50'
  },
  pink: {
    solid: 'bg-pink-500 text-white',
    outline: 'border-pink-500 text-pink-400',
    glow: 'bg-pink-500/20 text-pink-400 border-pink-500/50 shadow-lg shadow-pink-500/50'
  },
  green: {
    solid: 'bg-green-500 text-white',
    outline: 'border-green-500 text-green-400',
    glow: 'bg-green-500/20 text-green-400 border-green-500/50 shadow-lg shadow-green-500/50'
  },
  yellow: {
    solid: 'bg-yellow-500 text-white',
    outline: 'border-yellow-500 text-yellow-400',
    glow: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50 shadow-lg shadow-yellow-500/50'
  },
  red: {
    solid: 'bg-red-500 text-white',
    outline: 'border-red-500 text-red-400',
    glow: 'bg-red-500/20 text-red-400 border-red-500/50 shadow-lg shadow-red-500/50'
  }
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-1.5 text-base'
};

export const CyberBadge = forwardRef<HTMLDivElement, CyberBadgeProps>(
  (
    {
      variant = 'solid',
      color = 'cyan',
      size = 'md',
      dot = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const MotionDiv = motion.div;
    const colorClass = colorClasses[color][variant];
    const sizeClass = sizeClasses[size];

    return (
      <MotionDiv
        ref={ref}
        className={cn(
          'inline-flex items-center gap-2 rounded-full font-medium',
          'transition-all duration-200',
          variant === 'outline' && 'border',
          colorClass,
          sizeClass,
          className
        )}
        whileHover={{ scale: 1.05 }}
        {...props}
      >
        {dot && (
          <span
            className={cn(
              'w-2 h-2 rounded-full',
              variant === 'solid' ? 'bg-white' : 'bg-current'
            )}
          />
        )}
        {children}
      </MotionDiv>
    );
  }
);

CyberBadge.displayName = 'CyberBadge';
