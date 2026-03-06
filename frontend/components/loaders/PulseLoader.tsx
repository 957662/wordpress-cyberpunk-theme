/**
 * PulseLoader - 脉冲加载器
 * 呼吸式脉冲效果的加载动画
 */

'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

export interface PulseLoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'cyan' | 'purple' | 'pink' | 'yellow' | 'green';
  className?: string;
}

export function PulseLoader({
  size = 'md',
  color = 'cyan',
  className,
}: PulseLoaderProps) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const colors = {
    cyan: 'bg-cyber-cyan shadow-neon-cyan',
    purple: 'bg-cyber-purple shadow-neon-purple',
    pink: 'bg-cyber-pink shadow-neon-pink',
    yellow: 'bg-cyber-yellow shadow-neon-yellow',
    green: 'bg-cyber-green shadow-[0_0_10px_#00ff88]',
  };

  return (
    <div className={cn('flex items-center justify-center', className)}>
      {/* 中心点 */}
      <motion.div
        className={cn('rounded-full', sizes[size], colors[color])}
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* 外围波纹 */}
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className={cn(
            'absolute rounded-full border-2',
            sizes[size],
            colors[color].split(' ')[0].replace('bg', 'border')
          )}
          animate={{
            scale: [1, 2.5],
            opacity: [0.6, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: index * 0.5,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
}
