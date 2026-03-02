/**
 * LoadingSpinner - 加载动画组件
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface LoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'dots' | 'pulse' | 'wave' | 'cyber';
  color?: 'cyan' | 'purple' | 'pink' | 'yellow' | 'white';
  className?: string;
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'default',
  color = 'cyan',
  className,
  text,
}) => {
  const sizes = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  const textColors = {
    cyan: 'text-cyan-400',
    purple: 'text-purple-400',
    pink: 'text-pink-400',
    yellow: 'text-yellow-400',
    white: 'text-white',
  };

  if (variant === 'default') {
    return (
      <div className={cn('flex flex-col items-center gap-4', className)}>
        <div className={cn('relative', sizes[size])}>
          <motion.div
            className={cn('absolute inset-0 rounded-full border-4 border-transparent border-t-current', textColors[color])}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        </div>
        {text && <p className="text-sm text-gray-400">{text}</p>}
      </div>
    );
  }

  if (variant === 'dots') {
    const dotSizes = {
      xs: 'w-1 h-1',
      sm: 'w-1.5 h-1.5',
      md: 'w-2 h-2',
      lg: 'w-3 h-3',
      xl: 'w-4 h-4',
    };

    return (
      <div className={cn('flex flex-col items-center gap-4', className)}>
        <div className="flex items-center gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className={cn('rounded-full', dotSizes[size], textColors[color])}
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
        {text && <p className="text-sm text-gray-400">{text}</p>}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={cn('flex flex-col items-center gap-4', className)}>
        <motion.div
          className={cn('rounded-full', sizes[size], textColors[color])}
          animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        {text && <p className="text-sm text-gray-400">{text}</p>}
      </div>
    );
  }

  if (variant === 'cyber') {
    return (
      <div className={cn('flex flex-col items-center gap-4', className)}>
        <div className={cn('relative', sizes[size])}>
          <motion.div
            className={cn('absolute inset-0 rounded-full border-2 border-dashed border-cyan-500')}
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity }}
          />
          <motion.div
            className={cn('absolute inset-2 rounded-full border-2 border-dotted border-purple-500 opacity-70')}
            animate={{ rotate: -360 }}
            transition={{ duration: 7, repeat: Infinity }}
          />
        </div>
        {text && <p className="text-sm text-gray-400">{text}</p>}
      </div>
    );
  }

  return null;
};

export default LoadingSpinner;
