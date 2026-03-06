/**
 * GlitchLoader - 故障加载器
 * 赛博朋克风格的故障效果加载器
 */

'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

export interface GlitchLoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  className?: string;
}

export function GlitchLoader({
  size = 'md',
  text = 'LOADING',
  className,
}: GlitchLoaderProps) {
  const sizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
    xl: 'text-6xl',
  };

  return (
    <div className={cn('relative', className)}>
      {/* 主文本 */}
      <motion.span
        className={cn(
          'font-display font-bold text-cyber-cyan',
          sizes[size]
        )}
        animate={{
          opacity: [1, 0.8, 1],
        }}
        transition={{
          duration: 0.1,
          repeat: Infinity,
          repeatDelay: 0.5,
        }}
      >
        {text}
      </motion.span>

      {/* 故障效果 - 红色偏移 */}
      <motion.span
        className={cn(
          'absolute inset-0 font-display font-bold text-cyber-pink mix-blend-screen',
          sizes[size]
        )}
        style={{
          clipPath: 'polygon(0 0, 100% 0, 100% 35%, 0 35%)',
        }}
        animate={{
          x: [-2, 2, -2],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 0.3,
          repeat: Infinity,
          repeatDelay: 1,
        }}
      >
        {text}
      </motion.span>

      {/* 故障效果 - 青色偏移 */}
      <motion.span
        className={cn(
          'absolute inset-0 font-display font-bold text-cyber-yellow mix-blend-screen',
          sizes[size]
        )}
        style={{
          clipPath: 'polygon(0 65%, 100% 65%, 100% 100%, 0 100%)',
        }}
        animate={{
          x: [2, -2, 2],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 0.3,
          repeat: Infinity,
          repeatDelay: 1,
          delay: 0.15,
        }}
      >
        {text}
      </motion.span>
    </div>
  );
}
