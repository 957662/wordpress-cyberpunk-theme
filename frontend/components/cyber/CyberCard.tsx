'use client';

import { HTMLAttributes, forwardRef } from 'react';
import { motion, MotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface CyberCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outline' | 'filled';
  color?: 'cyan' | 'purple' | 'pink' | 'green' | 'yellow';
  glow?: boolean;
  interactive?: boolean;
}

const colorClasses = {
  cyan: {
    default: 'border-cyan-500/30 hover:border-cyan-500/50',
    outline: 'border-cyan-500/50',
    filled: 'bg-cyan-500/10 border-cyan-500/30'
  },
  purple: {
    default: 'border-purple-500/30 hover:border-purple-500/50',
    outline: 'border-purple-500/50',
    filled: 'bg-purple-500/10 border-purple-500/30'
  },
  pink: {
    default: 'border-pink-500/30 hover:border-pink-500/50',
    outline: 'border-pink-500/50',
    filled: 'bg-pink-500/10 border-pink-500/30'
  },
  green: {
    default: 'border-green-500/30 hover:border-green-500/50',
    outline: 'border-green-500/50',
    filled: 'bg-green-500/10 border-green-500/30'
  },
  yellow: {
    default: 'border-yellow-500/30 hover:border-yellow-500/50',
    outline: 'border-yellow-500/50',
    filled: 'bg-yellow-500/10 border-yellow-500/30'
  }
};

export const CyberCard = forwardRef<HTMLDivElement, CyberCardProps>(
  (
    {
      variant = 'default',
      color = 'cyan',
      glow = false,
      interactive = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const MotionDiv = motion.div;
    const colorClass = colorClasses[color][variant];

    return (
      <MotionDiv
        ref={ref}
        className={cn(
          'relative p-6 rounded-xl border backdrop-blur-sm',
          'bg-gray-900/50',
          'transition-all duration-300',
          glow && `shadow-lg shadow-${color}-500/20`,
          interactive && 'cursor-pointer hover:scale-[1.02]',
          colorClass,
          className
        )}
        whileHover={interactive ? { y: -4 } : {}}
        {...props}
      >
        {/* Glow effect */}
        {glow && (
          <div
            className={cn(
              'absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100',
              'transition-opacity duration-300',
              `bg-gradient-to-r from-${color}-500/10 to-transparent`,
              '-z-10 blur-xl'
            )}
          />
        )}

        {children}
      </MotionDiv>
    );
  }
);

CyberCard.displayName = 'CyberCard';
