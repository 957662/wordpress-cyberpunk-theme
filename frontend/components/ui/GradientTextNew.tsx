'use client';

/**
 * Gradient Text Component
 * 渐变文字 - 带有渐变色彩的文字组件
 */

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface GradientTextNewProps {
  /**
   * 文字内容
   */
  children: React.ReactNode;

  /**
   * 渐变颜色
   * @default "from-cyber-cyan via-cyber-purple to-cyber-pink"
   */
  gradient?: string;

  /**
   * 是否启用动画
   * @default true
   */
  animate?: boolean;

  /**
   * 动画方向
   * @default 300
   */
  bgSize?: number;

  /**
   * 自定义类名
   */
  className?: string;

  /**
   * 文字大小
   */
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
}

const sizeClasses = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
  '4xl': 'text-4xl',
  '5xl': 'text-5xl',
  '6xl': 'text-6xl',
};

export const GradientTextNew = ({
  children,
  gradient = 'from-cyber-cyan via-cyber-purple to-cyber-pink',
  animate = true,
  bgSize = 300,
  className,
  size = 'md',
}: GradientTextNewProps) => {
  return (
    <motion.span
      className={cn(
        'bg-clip-text text-transparent font-bold',
        `bg-gradient-to-r ${gradient}`,
        sizeClasses[size],
        className
      )}
      style={{
        backgroundSize: animate ? `${bgSize}%` : '200%',
      }}
      animate={
        animate
          ? {
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }
          : {}
      }
      transition={
        animate
          ? {
              duration: 5,
              repeat: Infinity,
              ease: 'linear',
            }
          : {}
      }
    >
      {children}
    </motion.span>
  );
};

export default GradientTextNew;
