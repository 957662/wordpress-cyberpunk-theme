'use client';

/**
 * Neon Border Component
 * 霓虹边框 - 带有霓虹发光效果的边框组件
 */

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface NeonBorderProps {
  /**
   * 霓虹颜色
   * @default "#00f0ff"
   */
  color?: string;

  /**
   * 发光强度
   * @default 20
   */
  glowIntensity?: number;

  /**
   * 边框宽度
   * @default 2
   */
  borderWidth?: number;

  /**
   * 子元素
   */
  children: React.ReactNode;

  /**
   * 自定义类名
   */
  className?: string;

  /**
   * 是否启用动画
   * @default true
   */
  animate?: boolean;
}

export const NeonBorder = ({
  color = '#00f0ff',
  glowIntensity = 20,
  borderWidth = 2,
  children,
  className,
  animate = true,
}: NeonBorderProps) => {
  return (
    <motion.div
      className={cn('relative', className)}
      style={{
        padding: borderWidth,
      }}
      animate={
        animate
          ? {
              boxShadow: [
                `0 0 ${glowIntensity}px ${color}`,
                `0 0 ${glowIntensity * 1.5}px ${color}`,
                `0 0 ${glowIntensity}px ${color}`,
              ],
            }
          : {}
      }
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <div
        className="relative z-10"
        style={{
          borderColor: color,
          borderWidth: 1,
        }}
      >
        {children}
      </div>
    </motion.div>
  );
};

export default NeonBorder;
