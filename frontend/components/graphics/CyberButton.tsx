'use client';

import React, { forwardRef, ButtonHTMLAttributes } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface CyberButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'glitch';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  glowEffect?: boolean;
  neonBorder?: boolean;
}

export const CyberButton = forwardRef<HTMLButtonElement, CyberButtonProps>(
  (
    {
      children,
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      glowEffect = true,
      neonBorder = true,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'relative inline-flex items-center justify-center font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden';

    const variantStyles = {
      primary: 'bg-cyber-cyan/20 text-cyber-cyan border-2 border-cyber-cyan hover:bg-cyber-cyan/30',
      secondary: 'bg-cyber-purple/20 text-cyber-purple border-2 border-cyber-purple hover:bg-cyber-purple/30',
      accent: 'bg-cyber-pink/20 text-cyber-pink border-2 border-cyber-pink hover:bg-cyber-pink/30',
      ghost: 'bg-transparent text-white/80 border-2 border-white/20 hover:bg-white/10',
      glitch: 'bg-cyber-green/20 text-cyber-green border-2 border-cyber-green hover:bg-cyber-green/30',
    };

    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm rounded-md',
      md: 'px-6 py-2.5 text-base rounded-lg',
      lg: 'px-8 py-3 text-lg rounded-xl',
    };

    const glowStyles = glowEffect
      ? 'shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:shadow-[0_0_30px_rgba(0,240,255,0.5)]'
      : '';

    const neonStyles = neonBorder
      ? 'before:absolute before:inset-0 before:rounded-inherit before:border-2 before:border-white/20 before:blur-[2px]'
      : '';

    const MotionButton = motion.button;

    return (
      <MotionButton
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          glowStyles,
          neonStyles,
          className
        )}
        disabled={disabled || isLoading}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        {...props}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            <span>Loading...</span>
          </div>
        ) : (
          children
        )}
        {glowEffect && (
          <div className="absolute inset-0 rounded-inherit bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] animate-[shimmer_2s_infinite]" />
        )}
      </MotionButton>
    );
  }
);

CyberButton.displayName = 'CyberButton';
