/**
 * WaveLoader - 波浪加载器
 * 波浪动画效果的加载器
 */

'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

export interface WaveLoaderProps {
  bars?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: 'cyan' | 'purple' | 'pink' | 'yellow' | 'green';
  className?: string;
}

export function WaveLoader({
  bars = 5,
  size = 'md',
  color = 'cyan',
  className,
}: WaveLoaderProps) {
  const sizes = {
    sm: { width: 'w-1', height: 'h-6', gap: 'gap-1' },
    md: { width: 'w-2', height: 'h-8', gap: 'gap-2' },
    lg: { width: 'w-3', height: 'h-12', gap: 'gap-3' },
  };

  const colors = {
    cyan: 'bg-cyber-cyan',
    purple: 'bg-cyber-purple',
    pink: 'bg-cyber-pink',
    yellow: 'bg-cyber-yellow',
    green: 'bg-cyber-green',
  };

  return (
    <div className={cn('flex items-center', sizes[size].gap, className)}>
      {Array.from({ length: bars }).map((_, index) => (
        <motion.div
          key={index}
          className={cn('rounded-full', sizes[size].width, sizes[size].height, colors[color])}
          animate={{
            scaleY: [1, 2, 1],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: index * 0.1,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
