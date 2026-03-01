/**
 * 徽章组件
 */

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  glow?: boolean;
}

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  className,
  glow = false,
}: BadgeProps) {
  const variants = {
    default: 'bg-cyber-muted text-gray-300 border border-cyber-border',
    primary: 'bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan',
    secondary: 'bg-cyber-purple/20 text-cyber-purple border border-cyber-purple',
    success: 'bg-cyber-green/20 text-cyber-green border border-cyber-green',
    warning: 'bg-cyber-yellow/20 text-cyber-yellow border border-cyber-yellow',
    danger: 'bg-cyber-pink/20 text-cyber-pink border border-cyber-pink',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  const glowStyles = glow
    ? {
        primary: 'shadow-neon-cyan',
        secondary: 'shadow-neon-purple',
        success: 'shadow-[0_0_10px_#00ff88]',
        warning: 'shadow-neon-yellow',
        danger: 'shadow-neon-pink',
      }[variant]
    : '';

  return (
    <motion.span
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={cn(
        'inline-flex items-center justify-center rounded-full font-mono font-medium whitespace-nowrap',
        variants[variant],
        sizes[size],
        glowStyles,
        className
      )}
    >
      {children}
    </motion.span>
  );
}
