'use client';

/**
 * Pressable Component
 * 可按压组件 - 支持按压交互效果的可复用组件
 */

import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface PressableProps extends HTMLMotionProps<'button'> {
  /**
   * 按压缩放比例
   * @default 0.95
   */
  scaleOnPress?: number;

  /**
   * 是否禁用
   */
  disabled?: boolean;

  /**
   * 子元素
   */
  children: React.ReactNode;

  /**
   * 自定义类名
   */
  className?: string;

  /**
   * 按压时的回调
   */
  onPress?: () => void;

  /**
   * 释放时的回调
   */
  onRelease?: () => void;
}

export const Pressable = ({
  scaleOnPress = 0.95,
  disabled = false,
  children,
  className,
  onPress,
  onRelease,
  ...props
}: PressableProps) => {
  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02 } : undefined}
      whileTap={!disabled ? { scale: scaleOnPress } : undefined}
      onTapStart={!disabled ? onPress : undefined}
      onTapCancel={!disabled ? onRelease : undefined}
      onTap={!disabled ? onRelease : undefined}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center',
        'focus:outline-none focus:ring-2 focus:ring-cyber-cyan/50',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'transition-all duration-200',
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Pressable;
