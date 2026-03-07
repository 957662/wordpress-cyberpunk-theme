'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CyberButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'neon' | 'glitch' | 'hologram' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const CyberButton: React.FC<CyberButtonProps> = ({
  children,
  variant = 'neon',
  size = 'md',
  loading = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  className,
  disabled,
  ...props
}) => {
  const baseStyles = 'relative overflow-hidden rounded font-mono font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantStyles = {
    neon: 'bg-transparent border-2 border-cyber-cyan text-cyber-cyan hover:bg-cyber-cyan/10 hover:shadow-[0_0_20px_rgba(0,240,255,0.5)]',
    glitch: 'bg-cyber-pink/20 border-2 border-cyber-pink text-cyber-pink hover:bg-cyber-pink/30',
    hologram: 'bg-gradient-to-r from-cyber-purple/20 to-cyber-cyan/20 border border-cyber-purple/50 text-white hover:from-cyber-purple/30 hover:to-cyber-cyan/30',
    minimal: 'bg-gray-800/50 border border-gray-700 text-gray-300 hover:border-gray-600 hover:text-white',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const iconSize = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {/* Scanlines effect */}
      <div className="absolute inset-0 bg-[url('/public/patterns/scanlines.svg')] opacity-10 pointer-events-none" />

      {/* Glowing border effect */}
      <div className={cn(
        'absolute inset-0 rounded opacity-0 transition-opacity duration-300',
        'bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-pink',
        variant === 'neon' && 'group-hover:opacity-20'
      )} />

      <span className="relative flex items-center justify-center gap-2">
        {loading ? (
          <Loader2 className={cn('animate-spin', iconSize[size])} />
        ) : (
          <>
            {icon && iconPosition === 'left' && (
              <span className={iconSize[size]}>{icon}</span>
            )}
            {children}
            {icon && iconPosition === 'right' && (
              <span className={iconSize[size]}>{icon}</span>
            )}
          </>
        )}
      </span>
    </motion.button>
  );
};

export default CyberButton;
