'use client';

import React from 'react';
import { motion, MotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CyberButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  color?: 'cyan' | 'purple' | 'pink' | 'green' | 'yellow';
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  glow?: boolean;
}

const colorVariants = {
  cyan: {
    primary: 'bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700',
    secondary: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50 hover:bg-cyan-500/30',
    outline: 'border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10',
    ghost: 'text-cyan-400 hover:bg-cyan-500/10',
    danger: 'bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700',
  },
  purple: {
    primary: 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
    secondary: 'bg-purple-500/20 text-purple-400 border-purple-500/50 hover:bg-purple-500/30',
    outline: 'border-purple-500/50 text-purple-400 hover:bg-purple-500/10',
    ghost: 'text-purple-400 hover:bg-purple-500/10',
    danger: 'bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700',
  },
  pink: {
    primary: 'bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700',
    secondary: 'bg-pink-500/20 text-pink-400 border-pink-500/50 hover:bg-pink-500/30',
    outline: 'border-pink-500/50 text-pink-400 hover:bg-pink-500/10',
    ghost: 'text-pink-400 hover:bg-pink-500/10',
    danger: 'bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700',
  },
  green: {
    primary: 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
    secondary: 'bg-green-500/20 text-green-400 border-green-500/50 hover:bg-green-500/30',
    outline: 'border-green-500/50 text-green-400 hover:bg-green-500/10',
    ghost: 'text-green-400 hover:bg-green-500/10',
    danger: 'bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700',
  },
  yellow: {
    primary: 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700',
    secondary: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50 hover:bg-yellow-500/30',
    outline: 'border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10',
    ghost: 'text-yellow-400 hover:bg-yellow-500/10',
    danger: 'bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700',
  },
};

const sizeVariants = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
  icon: 'p-2',
};

export function CyberButton({
  children,
  variant = 'primary',
  size = 'md',
  color = 'cyan',
  loading = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  glow = false,
  className,
  disabled,
  ...props
}: CyberButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-cyber-dark disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantStyles = colorVariants[color][variant];
  const sizeStyles = sizeVariants[size];
  const glowStyles = glow ? 'shadow-lg hover:shadow-cyan-500/50' : '';
  const widthStyles = fullWidth ? 'w-full' : '';

  const buttonContent = (
    <>
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {!loading && icon && iconPosition === 'left' && icon}
      {children}
      {!loading && icon && iconPosition === 'right' && icon}
    </>
  );

  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      className={cn(
        baseStyles,
        variantStyles,
        sizeStyles,
        glowStyles,
        widthStyles,
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {buttonContent}
    </motion.button>
  );
}

// Special Cyber Button with Animated Border
export function CyberButtonAnimated({
  children,
  className,
  ...props
}: CyberButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'relative px-6 py-3 font-medium text-white rounded-lg overflow-hidden',
        'bg-gradient-to-r from-cyan-500 to-purple-500',
        'hover:shadow-lg hover:shadow-cyan-500/50',
        'transition-all',
        className
      )}
      {...props}
    >
      {/* Animated Border */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 animate-gradient" />
      </div>
      
      {/* Content */}
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
    </motion.button>
  );
}

// Glitch Effect Button
export function CyberButtonGlitch({
  children,
  className,
  ...props
}: CyberButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'relative px-6 py-3 font-medium text-white rounded-lg overflow-hidden',
        'bg-cyber-dark border-2 border-cyber-cyan',
        'hover:bg-cyber-cyan/10',
        'transition-all',
        className
      )}
      {...props}
    >
      {/* Glitch Effect Overlay */}
      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 animate-glitch" />
      </div>
      
      {/* Content */}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}

export default CyberButton;
