'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface CyberButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'cyan' | 'purple' | 'pink' | 'green' | 'yellow';
  glow?: boolean;
  fullWidth?: boolean;
  loading?: boolean;
}

const colorClasses = {
  cyan: {
    primary: 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white',
    secondary: 'bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20',
    outline: 'border-cyan-500 text-cyan-400 hover:bg-cyan-500/10',
    ghost: 'text-cyan-400 hover:bg-cyan-500/10',
    danger: 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-400 hover:to-pink-400 text-white'
  },
  purple: {
    primary: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white',
    secondary: 'bg-purple-500/10 text-purple-400 hover:bg-purple-500/20',
    outline: 'border-purple-500 text-purple-400 hover:bg-purple-500/10',
    ghost: 'text-purple-400 hover:bg-purple-500/10',
    danger: 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-400 hover:to-pink-400 text-white'
  },
  pink: {
    primary: 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white',
    secondary: 'bg-pink-500/10 text-pink-400 hover:bg-pink-500/20',
    outline: 'border-pink-500 text-pink-400 hover:bg-pink-500/10',
    ghost: 'text-pink-400 hover:bg-pink-500/10',
    danger: 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-400 hover:to-pink-400 text-white'
  },
  green: {
    primary: 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white',
    secondary: 'bg-green-500/10 text-green-400 hover:bg-green-500/20',
    outline: 'border-green-500 text-green-400 hover:bg-green-500/10',
    ghost: 'text-green-400 hover:bg-green-500/10',
    danger: 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-400 hover:to-pink-400 text-white'
  },
  yellow: {
    primary: 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white',
    secondary: 'bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20',
    outline: 'border-yellow-500 text-yellow-400 hover:bg-yellow-500/10',
    ghost: 'text-yellow-400 hover:bg-yellow-500/10',
    danger: 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-400 hover:to-pink-400 text-white'
  }
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
  xl: 'px-8 py-4 text-xl'
};

export const CyberButton = forwardRef<HTMLButtonElement, CyberButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      color = 'cyan',
      glow = false,
      fullWidth = false,
      loading = false,
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const MotionButton = motion.button;
    const colorClass = colorClasses[color][variant];
    const sizeClass = sizeClasses[size];

    return (
      <MotionButton
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'relative inline-flex items-center justify-center gap-2 font-semibold rounded-lg',
          'transition-all duration-200',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900',
          variant === 'outline' && 'border-2',
          variant === 'ghost' && 'bg-transparent',
          glow && 'shadow-lg',
          fullWidth && 'w-full',
          colorClass,
          sizeClass,
          glow && variant === 'primary' && `shadow-${color}-500/50 hover:shadow-${color}-500/75`,
          className
        )}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin h-5 w-5"
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
          </svg>
        )}
        {children}
      </MotionButton>
    );
  }
);

CyberButton.displayName = 'CyberButton';
