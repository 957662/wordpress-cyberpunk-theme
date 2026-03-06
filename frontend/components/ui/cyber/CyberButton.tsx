'use client';

import React, { forwardRef, ButtonHTMLAttributes } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CyberButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'neon' | 'glitch' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const CyberButton = forwardRef<HTMLButtonElement, CyberButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      fullWidth = false,
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const variants = {
      primary: 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600',
      secondary: 'bg-purple-600 text-white hover:bg-purple-700',
      neon: 'bg-black text-cyan-400 border-2 border-cyan-500 hover:bg-cyan-500 hover:text-black shadow-[0_0_20px_rgba(6,182,212,0.5)]',
      glitch: 'bg-pink-600 text-white hover:bg-pink-700',
      outline: 'bg-transparent border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black',
      ghost: 'bg-transparent text-cyan-400 hover:bg-cyan-500/10',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-6 py-2.5 text-base',
      lg: 'px-8 py-3 text-lg',
    };

    const MotionButton = motion.button;

    return (
      <MotionButton
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'relative inline-flex items-center justify-center gap-2 font-mono font-medium rounded-lg transition-all duration-300',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        {...props}
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {children}
      </MotionButton>
    );
  }
);

CyberButton.displayName = 'CyberButton';

export default CyberButton;
