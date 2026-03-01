/**
 * 发光球体效果
 * 背景中的动态发光球体
 */

'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface GlowOrbProps {
  /** 球体颜色 */
  color?: string;
  /** 大小 */
  size?: number;
  /** 模糊程度 */
  blur?: number;
  /** 动画持续时间 (秒) */
  duration?: number;
  /** 自定义类名 */
  className?: string;
}

export function GlowOrb({
  color = 'rgba(0, 240, 255, 0.3)',
  size = 400,
  blur = 100,
  duration = 10,
  className,
}: GlowOrbProps) {
  return (
    <motion.div
      className={cn('absolute rounded-full pointer-events-none', className)}
      style={{
        width: size,
        height: size,
        background: color,
        filter: `blur(${blur}px)`,
      }}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.3, 0.5, 0.3],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
}
