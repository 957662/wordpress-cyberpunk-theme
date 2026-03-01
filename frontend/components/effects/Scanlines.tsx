/**
 * 扫描线效果
 * CRT 显示器风格的扫描线
 */

'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface ScanlinesProps {
  /** 扫描线颜色 */
  color?: string;
  /** 扫描线大小 */
  size?: number;
  /** 不透明度 */
  opacity?: number;
  /** 是否启用动画 */
  animated?: boolean;
  /** 自定义类名 */
  className?: string;
}

export function Scanlines({
  color = 'rgba(0, 240, 255, 0.03)',
  size = 2,
  opacity = 1,
  animated = true,
  className,
}: ScanlinesProps) {
  return (
    <div
      className={cn('absolute inset-0 pointer-events-none', className)}
      style={{
        opacity,
        background: `repeating-linear-gradient(
          0deg,
          transparent,
          transparent ${size}px,
          ${color} ${size}px,
          ${color} ${size * 2}px
        )`,
      }}
    >
      {animated && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-transparent via-cyber-cyan/5 to-transparent"
          animate={{
            y: ['-100%', '100%'],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      )}
    </div>
  );
}
