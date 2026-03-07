'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface CyberButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'glow' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  glitch?: boolean;
}

export const CyberButton: React.FC<CyberButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  iconPosition = 'left',
  loading = false,
  glitch = false,
  className,
  disabled,
  ...props
}) => {
  const baseStyles = 'relative inline-flex items-center justify-center font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-md overflow-hidden';
  
  const variantStyles = {
    primary: 'bg-cyber-cyan text-deep-black hover:bg-cyber-cyan/90 shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:shadow-[0_0_30px_rgba(0,240,255,0.5)]',
    secondary: 'bg-cyber-purple text-white hover:bg-cyber-purple/90 shadow-[0_0_20px_rgba(157,0,255,0.3)] hover:shadow-[0_0_30px_rgba(157,0,255,0.5)]',
    glow: 'bg-transparent border-2 border-cyber-cyan text-cyber-cyan hover:bg-cyber-cyan hover:text-deep-black shadow-[0_0_10px_rgba(0,240,255,0.5)] hover:shadow-[0_0_20px_rgba(0,240,255,0.8)]',
    outline: 'bg-transparent border-2 border-gray-600 text-gray-300 hover:border-cyber-cyan hover:text-cyber-cyan',
    ghost: 'bg-transparent text-gray-300 hover:bg-cyber-cyan/10 hover:text-cyber-cyan',
  };
  
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-base gap-2',
    lg: 'px-6 py-3 text-lg gap-2.5',
  };
  
  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <motion.button
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled || loading}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      {...props}
    >
      {/* Loading Spinner */}
      {loading && (
        <motion.svg
          className={cn('animate-spin', iconSizes[size])}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </motion.svg>
      )}
      
      {/* Icon */}
      {!loading && icon && iconPosition === 'left' && (
        <span className={iconSizes[size]}>{icon}</span>
      )}
      
      {/* Children */}
      <span>{children}</span>
      
      {/* Icon */}
      {!loading && icon && iconPosition === 'right' && (
        <span className={iconSizes[size]}>{icon}</span>
      )}
      
      {/* Glitch Effect */}
      {glitch && !disabled && !loading && (
        <>
          <span className="absolute inset-0 bg-cyber-cyan/20 translate-x-[-100%] animate-[shimmer_2s_infinite]" />
          <span className="absolute inset-0 bg-cyber-purple/20 translate-x-[-100%] animate-[shimmer_2s_infinite_0.5s]" />
        </>
      )}
      
      {/* Glow Effect */}
      {variant === 'glow' && !disabled && !loading && (
        <span className="absolute inset-0 bg-cyber-cyan/20 blur-xl" />
      )}
    </motion.button>
  );
};

export default CyberButton;
