'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, ReactNode } from 'react';

interface CyberButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  color?: 'cyan' | 'purple' | 'pink' | 'yellow';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  className?: string;
  fullWidth?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
}

export function CyberButton({
  variant = 'primary',
  color = 'cyan',
  size = 'md',
  children,
  className = '',
  fullWidth = false,
  icon,
  iconPosition = 'left',
  disabled = false,
  ...props
}: CyberButtonProps) {
  const colorMap = {
    cyan: {
      primary: 'bg-cyber-cyan text-cyber-dark hover:shadow-neon-cyan',
      secondary: 'bg-cyber-muted text-cyber-cyan border border-cyber-cyan hover:bg-cyber-cyan hover:text-cyber-dark',
      outline: 'bg-transparent text-cyber-cyan border-2 border-cyber-cyan hover:bg-cyber-cyan hover:text-cyber-dark',
      ghost: 'bg-transparent text-cyber-cyan hover:bg-cyber-cyan/10',
    },
    purple: {
      primary: 'bg-cyber-purple text-white hover:shadow-neon-purple',
      secondary: 'bg-cyber-muted text-cyber-purple border border-cyber-purple hover:bg-cyber-purple hover:text-white',
      outline: 'bg-transparent text-cyber-purple border-2 border-cyber-purple hover:bg-cyber-purple hover:text-white',
      ghost: 'bg-transparent text-cyber-purple hover:bg-cyber-purple/10',
    },
    pink: {
      primary: 'bg-cyber-pink text-white hover:shadow-neon-pink',
      secondary: 'bg-cyber-muted text-cyber-pink border border-cyber-pink hover:bg-cyber-pink hover:text-white',
      outline: 'bg-transparent text-cyber-pink border-2 border-cyber-pink hover:bg-cyber-pink hover:text-white',
      ghost: 'bg-transparent text-cyber-pink hover:bg-cyber-pink/10',
    },
    yellow: {
      primary: 'bg-cyber-yellow text-cyber-dark hover:shadow-neon-yellow',
      secondary: 'bg-cyber-muted text-cyber-yellow border border-cyber-yellow hover:bg-cyber-yellow hover:text-cyber-dark',
      outline: 'bg-transparent text-cyber-yellow border-2 border-cyber-yellow hover:bg-cyber-yellow hover:text-cyber-dark',
      ghost: 'bg-transparent text-cyber-yellow hover:bg-cyber-yellow/10',
    },
  };

  const sizeMap = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3 text-lg',
  };

  return (
    <motion.button
      className={cn(
        'relative overflow-hidden rounded-lg font-semibold uppercase tracking-wider transition-all duration-300',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        colorMap[color][variant],
        sizeMap[size],
        fullWidth && 'w-full',
        className
      )}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      disabled={disabled}
      {...props}
    >
      {/* 光效动画 */}
      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-shimmer" />

      <span className="relative flex items-center justify-center gap-2">
        {icon && iconPosition === 'left' && icon}
        {children}
        {icon && iconPosition === 'right' && icon}
      </span>
    </motion.button>
  );
}

export default CyberButton;
