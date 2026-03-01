/**
 * 故障艺术文字效果
 */

'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface GlitchTextProps {
  text: string;
  className?: string;
  speed?: 'slow' | 'normal' | 'fast';
}

export function GlitchText({ text, className, speed = 'normal' }: GlitchTextProps) {
  const durations = {
    slow: 0.4,
    normal: 0.2,
    fast: 0.1,
  };

  return (
    <div className={cn('relative inline-block', className)}>
      {/* 主文字 */}
      <motion.span
        className="relative z-10"
        animate={{
          x: [0, -2, 2, -1, 1, 0],
        }}
        transition={{
          duration: durations[speed],
          repeat: Infinity,
          repeatDelay: 3,
        }}
      >
        {text}
      </motion.span>

      {/* 青色故障层 */}
      <motion.span
        className="absolute top-0 left-0 text-cyber-cyan opacity-0 mix-blend-screen z-0"
        style={{ clipPath: 'polygon(0 0, 100% 0, 100% 35%, 0 35%)' }}
        animate={{
          x: [0, -5, 5, -3, 3, 0],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: durations[speed],
          repeat: Infinity,
          repeatDelay: 3,
        }}
        aria-hidden
      >
        {text}
      </motion.span>

      {/* 粉色故障层 */}
      <motion.span
        className="absolute top-0 left-0 text-cyber-pink opacity-0 mix-blend-screen z-0"
        style={{ clipPath: 'polygon(0 65%, 100% 65%, 100% 100%, 0 100%)' }}
        animate={{
          x: [0, 5, -5, 3, -3, 0],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: durations[speed],
          repeat: Infinity,
          repeatDelay: 3,
        }}
        aria-hidden
      >
        {text}
      </motion.span>
    </div>
  );
}
