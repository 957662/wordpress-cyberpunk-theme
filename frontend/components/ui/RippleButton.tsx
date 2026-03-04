'use client';

/**
 * Ripple Button Component
 * 涟漪按钮 - 带有涟漪效果的按钮组件
 */

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface RippleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * 涟漪颜色
   * @default "rgba(255, 255, 255, 0.5)"
   */
  rippleColor?: string;

  /**
   * 按钮变体
   */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';

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
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

const variantClasses = {
  primary: 'bg-cyber-cyan text-cyber-dark hover:bg-cyber-cyan/90',
  secondary: 'bg-cyber-purple text-white hover:bg-cyber-purple/90',
  outline: 'border-2 border-cyber-cyan text-cyber-cyan hover:bg-cyber-cyan/10',
  ghost: 'text-cyber-cyan hover:bg-cyber-cyan/10',
};

export const RippleButton = ({
  rippleColor = 'rgba(255, 255, 255, 0.5)',
  variant = 'primary',
  size = 'md',
  children,
  className,
  ...props
}: RippleButtonProps) => {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const button = event.currentTarget;
      const rect = button.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const newRipple = {
        id: Date.now(),
        x,
        y,
      };

      setRipples((prev) => [...prev, newRipple]);

      // 移除涟漪效果
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, 600);

      props.onClick?.(event);
    },
    [props]
  );

  return (
    <motion.button
      className={cn(
        'relative overflow-hidden',
        'rounded-lg',
        'font-medium',
        'transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-cyber-cyan/50',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      onClick={handleClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {children}

      {/* 涟漪效果 */}
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            backgroundColor: rippleColor,
            left: ripple.x,
            top: ripple.y,
            width: 0,
            height: 0,
          }}
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 4, opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      ))}
    </motion.button>
  );
};

export default RippleButton;
