/**
 * TypingLoader - 打字加载器
 * 模拟打字效果的加载动画
 */

'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

export interface TypingLoaderProps {
  text?: string;
  speed?: number;
  color?: 'cyan' | 'purple' | 'pink' | 'yellow' | 'green';
  className?: string;
  showCursor?: boolean;
}

export function TypingLoader({
  text = '正在加载',
  speed = 3,
  color = 'cyan',
  className,
  showCursor = true,
}: TypingLoaderProps) {
  const colors = {
    cyan: 'text-cyber-cyan border-cyber-cyan',
    purple: 'text-cyber-purple border-cyber-purple',
    pink: 'text-cyber-pink border-cyber-pink',
    yellow: 'text-cyber-yellow border-cyber-yellow',
    green: 'text-cyber-green border-cyber-green',
  };

  return (
    <div className={cn('flex items-center gap-2 font-mono', className)}>
      {/* 打字文本 */}
      <motion.span
        className={cn(colors[color].split(' ')[0])}
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {text}
      </motion.span>

      {/* 省略号 */}
      <span className={cn('flex gap-1', colors[color].split(' ')[0])}>
        {[0, 1, 2].map((index) => (
          <motion.span
            key={index}
            animate={{
              opacity: [0.2, 1, 0.2],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: index * 0.2,
              ease: 'easeInOut',
            }}
          >
            .
          </motion.span>
        ))}
      </span>

      {/* 光标 */}
      {showCursor && (
        <motion.span
          className={cn(
            'inline-block w-0.5 h-4 bg-current border-r-2',
            colors[color]
          )}
          animate={{ opacity: [1, 0, 1] }}
          transition={{
            duration: speed / 10,
            repeat: Infinity,
            ease: 'stepEnd',
          }}
        />
      )}
    </div>
  );
}
