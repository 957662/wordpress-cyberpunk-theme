/**
 * DotLoader - 点阵加载器
 * 波浪式动画的点阵加载效果
 */

'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

export interface DotLoaderProps {
  size?: number;
  color?: 'cyan' | 'purple' | 'pink' | 'yellow' | 'green';
  className?: string;
  count?: number;
}

export function DotLoader({
  size = 12,
  color = 'cyan',
  className,
  count = 3,
}: DotLoaderProps) {
  const colors = {
    cyan: 'bg-cyber-cyan',
    purple: 'bg-cyber-purple',
    pink: 'bg-cyber-pink',
    yellow: 'bg-cyber-yellow',
    green: 'bg-cyber-green',
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          className={cn('rounded-full', colors[color])}
          style={{
            width: size,
            height: size,
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: index * 0.15,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
