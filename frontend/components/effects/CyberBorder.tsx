'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface CyberBorderProps {
  children: ReactNode;
  variant?: 'simple' | 'corner' | 'animated' | 'glow';
  color?: 'cyan' | 'purple' | 'pink' | 'yellow';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function CyberBorder({
  children,
  variant = 'simple',
  color = 'cyan',
  size = 'md',
  className = '',
}: CyberBorderProps) {
  const colorMap = {
    cyan: {
      border: 'border-cyber-cyan',
      glow: 'shadow-neon-cyan',
      text: 'text-cyber-cyan',
    },
    purple: {
      border: 'border-cyber-purple',
      glow: 'shadow-neon-purple',
      text: 'text-cyber-purple',
    },
    pink: {
      border: 'border-cyber-pink',
      glow: 'shadow-neon-pink',
      text: 'text-cyber-pink',
    },
    yellow: {
      border: 'border-cyber-yellow',
      glow: 'shadow-neon-yellow',
      text: 'text-cyber-yellow',
    },
  };

  const sizeMap = {
    sm: 'border-2 p-2',
    md: 'border-2 p-4',
    lg: 'border-4 p-6',
  };

  const colors = colorMap[color];

  if (variant === 'corner') {
    return (
      <div className={cn('relative inline-block', className)}>
        {/* 内容 */}
        <div className="p-4">{children}</div>

        {/* 角落边框 */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {/* 左上角 */}
          <path
            d="M 0 15 L 0 0 L 15 0"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={colors.text}
          />
          {/* 右上角 */}
          <path
            d="M 85 0 L 100 0 L 100 15"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={colors.text}
          />
          {/* 右下角 */}
          <path
            d="M 100 85 L 100 100 L 85 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={colors.text}
          />
          {/* 左下角 */}
          <path
            d="M 15 100 L 0 100 L 0 85"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={colors.text}
          />
        </svg>
      </div>
    );
  }

  if (variant === 'animated') {
    return (
      <motion.div
        className={cn(
          'relative inline-block border rounded-lg',
          colors.border,
          sizeMap[size],
          className
        )}
        animate={{
          boxShadow: [
            `0 0 5px ${color === 'cyan' ? '#00f0ff' : color === 'purple' ? '#9d00ff' : color === 'pink' ? '#ff0080' : '#f0ff00'}`,
            `0 0 20px ${color === 'cyan' ? '#00f0ff' : color === 'purple' ? '#9d00ff' : color === 'pink' ? '#ff0080' : '#f0ff00'}`,
            `0 0 5px ${color === 'cyan' ? '#00f0ff' : color === 'purple' ? '#9d00ff' : color === 'pink' ? '#ff0080' : '#f0ff00'}`,
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {children}
      </motion.div>
    );
  }

  if (variant === 'glow') {
    return (
      <div
        className={cn(
          'relative inline-block border rounded-lg',
          colors.border,
          colors.glow,
          sizeMap[size],
          className
        )}
      >
        {children}
      </div>
    );
  }

  // simple variant
  return (
    <div
      className={cn(
        'relative inline-block border rounded-lg',
        colors.border,
        sizeMap[size],
        className
      )}
    >
      {children}
    </div>
  );
}

export default CyberBorder;
