'use client';

/**
 * CyberPress Badge Component
 * 赛博朋克风格徽章组件
 */

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface CyberBadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'neon';
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  glow?: boolean;
  dot?: boolean;
  className?: string;
  onClick?: () => void;
}

export function CyberBadge({
  children,
  variant = 'default',
  size = 'md',
  color,
  glow = false,
  dot = false,
  className,
  onClick,
}: CyberBadgeProps) {
  const baseStyles = 'inline-flex items-center justify-center font-mono font-medium transition-all duration-300';

  const variantStyles = {
    default: 'bg-gray-500/20 text-gray-300 border-gray-500/40',
    success: 'bg-green-500/20 text-green-300 border-green-500/40',
    warning: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
    error: 'bg-red-500/20 text-red-300 border-red-500/40',
    info: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    neon: 'bg-cyber-cyan/20 text-cyber-cyan border-cyber-cyan/40',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs rounded',
    md: 'px-3 py-1 text-sm rounded-md',
    lg: 'px-4 py-1.5 text-base rounded-lg',
  };

  const glowStyles = glow
    ? 'shadow-lg shadow-cyber-cyan/50 hover:shadow-cyber-cyan/70'
    : '';

  const customColorStyle = color
    ? {
        backgroundColor: `${color}20`,
        color: color,
        borderColor: `${color}40`,
      }
    : {};

  const Component = onClick ? motion.button : motion.span;

  return (
    <Component
      whileHover={onClick ? { scale: 1.05 } : {}}
      whileTap={onClick ? { scale: 0.95 } : {}}
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        glowStyles,
        'border',
        !color && variantStyles[variant],
        onClick && 'cursor-pointer hover:opacity-80',
        className
      )}
      style={customColorStyle}
      onClick={onClick}
    >
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 animate-pulse" />}
      {children}
    </Component>
  );
}

export default CyberBadge;
