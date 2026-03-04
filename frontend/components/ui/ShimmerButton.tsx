'use client';

/**
 * Shimmer Button Component
 * 闪光按钮 - 带有闪光动画效果的按钮组件
 */

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * 闪光颜色
   * @default "rgba(255, 255, 255, 0.3)"
   */
  shimmerColor?: string;

  /**
   * 闪光速度（秒）
   * @default 2
   */
  shimmerDuration?: number;

  /**
   * 按钮变体
   */
  variant?: 'primary' | 'secondary' | 'gradient';

  /**
   * 按钮大小
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * 子元素
   */
  children: React.ReactNode;

  /**
   * 自定义类名
   */
  className?: string;
}

const sizeClasses = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

const variantClasses = {
  primary: 'bg-cyber-cyan text-cyber-dark',
  secondary: 'bg-cyber-purple text-white',
  gradient: 'bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-pink text-white',
};

export const ShimmerButton = ({
  shimmerColor = 'rgba(255, 255, 255, 0.3)',
  shimmerDuration = 2,
  variant = 'primary',
  size = 'md',
  children,
  className,
  ...props
}: ShimmerButtonProps) => {
  return (
    <motion.button
      className={cn(
        'relative overflow-hidden',
        'rounded-lg',
        'font-semibold',
        'focus:outline-none focus:ring-2 focus:ring-cyber-cyan/50',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {/* 闪光效果 */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={false}
        animate={{
          x: ['-100%', '200%'],
        }}
        transition={{
          duration: shimmerDuration,
          repeat: Infinity,
          repeatDelay: 1,
          ease: 'easeInOut',
        }}
      >
        <div
          className="absolute top-0 bottom-0 w-full"
          style={{
            background: `linear-gradient(90deg, transparent, ${shimmerColor}, transparent)`,
          }}
        />
      </motion.div>

      {/* 内容 */}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};

export default ShimmerButton;
