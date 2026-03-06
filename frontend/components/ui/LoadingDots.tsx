/**
 * LoadingDots - 加载动画组件
 *
 * 显示三个跳动的点作为加载指示器
 */

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LoadingDotsProps {
  /**
   * 尺寸：sm, md, lg
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * 颜色
   */
  color?: string;

  /**
   * 额外的类名
   */
  className?: string;

  /**
   * 是否显示在屏幕中央
   */
  centered?: boolean;
}

const sizeStyles = {
  sm: {
    dot: 'w-1.5 h-1.5',
    container: 'gap-1',
  },
  md: {
    dot: 'w-2 h-2',
    container: 'gap-1.5',
  },
  lg: {
    dot: 'w-3 h-3',
    container: 'gap-2',
  },
};

export const LoadingDots: React.FC<LoadingDotsProps> = ({
  size = 'md',
  color = 'currentColor',
  className,
  centered = false,
}) => {
  const styles = sizeStyles[size];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const dotVariants = {
    hidden: {
      y: 0,
      opacity: 0.3,
    },
    visible: {
      y: [-10, 0, -10],
      opacity: [0.3, 1, 0.3],
      transition: {
        duration: 0.8,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <div
      className={cn(
        'flex items-center justify-center',
        styles.container,
        centered && 'fixed inset-0 z-50 bg-background/80 backdrop-blur-sm',
        className
      )}
    >
      <motion.div
        className="flex items-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className={cn('rounded-full bg-current', styles.dot)}
            style={{ color }}
            variants={dotVariants}
            custom={i}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default LoadingDots;
