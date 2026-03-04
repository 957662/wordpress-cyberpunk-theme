'use client';

/**
 * Magnetic Button Component
 * 磁性按钮 - 带有鼠标跟随磁性效果的按钮组件
 */

import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * 磁性强度
   * @default 0.3
   */
  strength?: number;

  /**
   * 磁性范围
   * @default 100
   */
  range?: number;

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
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

const variantClasses = {
  primary: 'bg-cyber-cyan text-cyber-dark hover:bg-cyber-cyan/90',
  secondary: 'bg-cyber-purple text-white hover:bg-cyber-purple/90',
  outline: 'border-2 border-cyber-cyan text-cyber-cyan hover:bg-cyber-cyan/10',
  ghost: 'text-cyber-cyan hover:bg-cyber-cyan/10',
};

export const MagneticButton = ({
  strength = 0.3,
  range = 100,
  variant = 'primary',
  size = 'md',
  children,
  className,
  ...props
}: MagneticButtonProps) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 300 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;

    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (distance < range) {
      x.set(deltaX);
      y.set(deltaY);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      className={cn(
        'relative rounded-lg',
        'font-semibold',
        'transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-cyber-cyan/50',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default MagneticButton;
