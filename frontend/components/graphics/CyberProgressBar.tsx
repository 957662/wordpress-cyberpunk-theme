'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface CyberProgressBarProps {
  value: number;
  max?: number;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'neon';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  animated?: boolean;
  glow?: boolean;
  className?: string;
}

export const CyberProgressBar: React.FC<CyberProgressBarProps> = ({
  value,
  max = 100,
  variant = 'default',
  size = 'md',
  showLabel = false,
  animated = true,
  glow = true,
  className,
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const variantStyles = {
    default: 'from-cyber-cyan to-cyber-purple',
    success: 'from-cyber-green to-cyber-green/80',
    warning: 'from-cyber-yellow to-cyber-yellow/80',
    error: 'from-cyber-pink to-cyber-pink/80',
    neon: 'from-cyber-cyan via-cyber-purple to-cyber-pink',
  };

  const sizeStyles = {
    sm: 'h-2',
    md: 'h-4',
    lg: 'h-6',
  };

  const glowStyles = {
    default: 'shadow-[0_0_10px_rgba(0,240,255,0.5)]',
    success: 'shadow-[0_0_10px_rgba(0,255,136,0.5)]',
    warning: 'shadow-[0_0_10px_rgba(240,255,0,0.5)]',
    error: 'shadow-[0_0_10px_rgba(255,0,128,0.5)]',
    neon: 'shadow-[0_0_15px_rgba(0,240,255,0.5)]',
  };

  const MotionDiv = motion.div;

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-white/80">Progress</span>
          <span className="text-sm font-semibold text-cyber-cyan">
            {Math.round(percentage)}%
          </span>
        </div>
      )}

      <div
        className={cn(
          'relative overflow-hidden rounded-full',
          'bg-white/10 border border-white/20',
          sizeStyles[size]
        )}
      >
        <MotionDiv
          className={cn(
            'h-full rounded-full',
            'bg-gradient-to-r',
            variantStyles[variant],
            glow && glowStyles[variant]
          )}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={animated ? { duration: 0.8, ease: 'easeOut' } : {}}
        >
          {/* Animated shimmer effect */}
          {animated && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          )}
        </MotionDiv>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full" style={{
            backgroundImage: `
              linear-gradient(90deg, transparent 50%, rgba(0,0,0,0.1) 50%)
            `,
            backgroundSize: '4px 100%'
          }} />
        </div>
      </div>
    </div>
  );
};
