'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface CyberProgressProps {
  value: number;
  max?: number;
  variant?: 'default' | 'neon' | 'glitch' | 'scan';
  size?: 'sm' | 'md' | 'lg';
  color?: 'cyan' | 'purple' | 'pink' | 'green' | 'yellow';
  showLabel?: boolean;
  label?: string;
  animated?: boolean;
  glow?: boolean;
  className?: string;
}

export function CyberProgress({
  value,
  max = 100,
  variant = 'default',
  size = 'md',
  color = 'cyan',
  showLabel = false,
  label,
  animated = true,
  glow = false,
  className,
}: CyberProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizes = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  const colors = {
    cyan: 'bg-cyan-500',
    purple: 'bg-purple-500',
    pink: 'bg-pink-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
  };

  const glowColors = {
    cyan: 'shadow-[0_0_20px_rgba(6,182,212,0.8)]',
    purple: 'shadow-[0_0_20px_rgba(168,85,247,0.8)]',
    pink: 'shadow-[0_0_20px_rgba(236,72,153,0.8)]',
    green: 'shadow-[0_0_20px_rgba(34,197,94,0.8)]',
    yellow: 'shadow-[0_0_20px_rgba(234,179,8,0.8)]',
  };

  const variants = {
    default: 'bg-gray-800',
    neon: 'bg-black border-2 border-cyan-500',
    glitch: 'bg-purple-900/30 border border-purple-500',
    scan: 'bg-gray-900',
  };

  return (
    <div className={cn('w-full', className)}>
      {(label || showLabel) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <span className="text-sm font-mono text-gray-300">{label}</span>
          )}
          {showLabel && (
            <span className="text-sm font-mono text-cyan-400">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}

      <div
        className={cn(
          'relative overflow-hidden rounded-full',
          variants[variant],
          sizes[size],
          variant === 'neon' && 'p-0.5'
        )}
      >
        {/* Background track */}
        <div
          className={cn(
            'absolute inset-0 rounded-full',
            variant === 'neon' ? 'bg-black' : 'bg-gray-800'
          )}
        />

        {/* Progress bar */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: animated ? 0.5 : 0 }}
          className={cn(
            'h-full rounded-full relative overflow-hidden',
            colors[color],
            glow && glowColors[color]
          )}
        >
          {/* Scanline effect for scan variant */}
          {variant === 'scan' && (
            <motion.div
              className="absolute inset-0 bg-white/30"
              animate={{
                x: ['-100%', '200%'],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          )}

          {/* Glitch effect */}
          {variant === 'glitch' && (
            <>
              <motion.div
                className="absolute inset-0 bg-pink-500/30"
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3,
                }}
              />
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default CyberProgress;
