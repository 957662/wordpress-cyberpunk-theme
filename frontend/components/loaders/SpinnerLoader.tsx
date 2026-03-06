/**
 * SpinnerLoader - 旋转加载器
 * 经典的旋转加载动画
 */

'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

export interface SpinnerLoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'cyan' | 'purple' | 'pink' | 'yellow' | 'green';
  thickness?: number;
  className?: string;
}

export function SpinnerLoader({
  size = 'md',
  color = 'cyan',
  thickness = 3,
  className,
}: SpinnerLoaderProps) {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  const colors = {
    cyan: 'border-cyber-cyan',
    purple: 'border-cyber-purple',
    pink: 'border-cyber-pink',
    yellow: 'border-cyber-yellow',
    green: 'border-cyber-green',
  };

  return (
    <div className={cn('relative', sizes[size], className)}>
      {/* 背景圆环 */}
      <div
        className={cn(
          'absolute inset-0 rounded-full border opacity-20',
          colors[color]
        )}
        style={{ borderWidth: thickness }}
      />

      {/* 旋转圆环 */}
      <motion.div
        className={cn(
          'absolute inset-0 rounded-full border-t-transparent border-r-transparent border-b-transparent',
          colors[color]
        )}
        style={{ borderWidth: thickness }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  );
}
