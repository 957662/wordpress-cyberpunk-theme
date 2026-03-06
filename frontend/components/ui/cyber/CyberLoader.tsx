'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface CyberLoaderProps {
  variant?: 'spinner' | 'dots' | 'pulse' | 'scan';
  size?: 'sm' | 'md' | 'lg';
  color?: 'cyan' | 'purple' | 'pink' | 'green';
  className?: string;
}

export function CyberLoader({
  variant = 'spinner',
  size = 'md',
  color = 'cyan',
  className,
}: CyberLoaderProps) {
  const colors = {
    cyan: 'border-cyan-500 border-t-transparent',
    purple: 'border-purple-500 border-t-transparent',
    pink: 'border-pink-500 border-t-transparent',
    green: 'border-green-500 border-t-transparent',
  };

  const bgColors = {
    cyan: 'bg-cyan-500',
    purple: 'bg-purple-500',
    pink: 'bg-pink-500',
    green: 'bg-green-500',
  };

  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  if (variant === 'spinner') {
    return (
      <motion.div
        className={cn(
          'rounded-full border-2 animate-spin',
          sizes[size],
          colors[color],
          className
        )}
      />
    );
  }

  if (variant === 'dots') {
    return (
      <div className={cn('flex gap-2', className)}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className={cn(
              'rounded-full',
              size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : 'w-4 h-4',
              bgColors[color]
            )}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={cn('relative', sizes[size], className)}>
        <motion.div
          className={cn(
            'absolute inset-0 rounded-full opacity-50',
            bgColors[color]
          )}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
          }}
        />
        <motion.div
          className={cn(
            'relative rounded-full',
            sizes[size],
            bgColors[color]
          )}
          animate={{
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
          }}
        />
      </div>
    );
  }

  if (variant === 'scan') {
    return (
      <div className={cn('relative overflow-hidden', sizes[size], className)}>
        <div className={cn('w-full h-full bg-gray-900 rounded', bgColors[color])}>
          <motion.div
            className={cn('h-full w-1', bgColors[color], 'shadow-lg')}
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </div>
      </div>
    );
  }

  return null;
}

export default CyberLoader;
