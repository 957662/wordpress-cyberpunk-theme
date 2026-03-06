/**
 * BarLoader - 进度条加载器
 * 赛博朋克风格的进度条加载动画
 */

'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

export interface BarLoaderProps {
  width?: number | string;
  height?: number;
  color?: 'cyan' | 'purple' | 'pink' | 'yellow' | 'green';
  className?: string;
  progress?: number; // 0-100, 如果提供则显示实际进度
}

export function BarLoader({
  width = '100%',
  height = 4,
  color = 'cyan',
  className,
  progress,
}: BarLoaderProps) {
  const colors = {
    cyan: 'bg-cyber-cyan',
    purple: 'bg-cyber-purple',
    pink: 'bg-cyber-pink',
    yellow: 'bg-cyber-yellow',
    green: 'bg-cyber-green',
  };

  const glowColors = {
    cyan: 'shadow-neon-cyan',
    purple: 'shadow-neon-purple',
    pink: 'shadow-neon-pink',
    yellow: 'shadow-neon-yellow',
    green: 'shadow-[0_0_10px_#00ff88]',
  };

  return (
    <div
      className={cn('relative overflow-hidden rounded-full bg-cyber-border/50', className)}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: `${height}px`,
      }}
    >
      <motion.div
        className={cn(
          'absolute inset-y-0 left-0 rounded-full',
          colors[color],
          glowColors[color]
        )}
        style={{
          width: progress !== undefined ? `${progress}%` : '30%',
        }}
        animate={
          progress === undefined
            ? {
                x: ['-100%', '100%'],
              }
            : {}
        }
        transition={
          progress === undefined
            ? {
                duration: 1.5,
                repeat: Infinity,
                ease: 'linear',
              }
            : {
                duration: 0.3,
              }
        }
      />

      {/* 扫描线效果 */}
      {progress === undefined && (
        <motion.div
          className={cn(
            'absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent',
            colors[color]
          )}
          animate={{
            x: ['-100%', '400%'],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      )}
    </div>
  );
}
