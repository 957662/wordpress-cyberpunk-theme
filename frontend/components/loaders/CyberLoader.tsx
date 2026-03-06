/**
 * CyberLoader - 赛博朋克风格主加载器
 * 带有霓虹发光效果的旋转加载器
 */

'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

export interface CyberLoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'cyan' | 'purple' | 'pink' | 'yellow' | 'green';
  className?: string;
  text?: string;
}

export function CyberLoader({
  size = 'md',
  color = 'cyan',
  className,
  text,
}: CyberLoaderProps) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  const colors = {
    cyan: 'border-cyber-cyan shadow-neon-cyan',
    purple: 'border-cyber-purple shadow-neon-purple',
    pink: 'border-cyber-pink shadow-neon-pink',
    yellow: 'border-cyber-yellow shadow-neon-yellow',
    green: 'border-cyber-green',
  };

  const glowColors = {
    cyan: 'shadow-cyber-cyan/50',
    purple: 'shadow-cyber-purple/50',
    pink: 'shadow-cyber-pink/50',
    yellow: 'shadow-cyber-yellow/50',
    green: 'shadow-cyber-green/50',
  };

  return (
    <div className={cn('flex flex-col items-center justify-center gap-4', className)}>
      {/* 主加载器 */}
      <div className={cn('relative', sizes[size])}>
        {/* 外圈 */}
        <motion.div
          className={cn(
            'absolute inset-0 rounded-full border-4 border-t-transparent border-b-transparent',
            colors[color]
          )}
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />

        {/* 中圈 */}
        <motion.div
          className={cn(
            'absolute inset-2 rounded-full border-3 border-l-transparent border-r-transparent opacity-70',
            colors[color]
          )}
          animate={{ rotate: -360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />

        {/* 内圈发光核心 */}
        <motion.div
          className={cn(
            'absolute inset-0 m-auto w-1/3 h-1/3 rounded-full bg-current',
            colors[color].split(' ')[0],
            glowColors[color]
          )}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* 加载文本 */}
      {text && (
        <motion.p
          className={cn(
            'text-sm font-display tracking-wider',
            colors[color].split(' ')[0].replace('border', 'text')
          )}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
}
