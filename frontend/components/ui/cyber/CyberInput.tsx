'use client';

import React, { forwardRef, InputHTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface CyberInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'neon' | 'glitch';
  className?: string;
}

export const CyberInput = forwardRef<HTMLInputElement, CyberInputProps>(
  (
    {
      label,
      error,
      icon,
      variant = 'default',
      className,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    const variants = {
      default: 'bg-gray-900/50 border-gray-700 focus:border-cyan-500',
      neon: 'bg-black border-2 border-cyan-500 focus:shadow-[0_0_20px_rgba(6,182,212,0.5)]',
      glitch: 'bg-purple-900/20 border-purple-500 focus:border-pink-500',
    };

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-mono font-medium text-cyan-400 mb-2"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}
          <motion.input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full px-4 py-2.5 font-mono text-white rounded-lg border outline-none transition-all duration-300',
              'placeholder:text-gray-500',
              'focus:ring-2 focus:ring-cyan-500/50',
              icon && 'pl-10',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500/50',
              variants[variant],
              className
            )}
            whileFocus={{ scale: 1.01 }}
            {...props}
          />
        </div>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1 text-sm text-red-500 font-mono"
          >
            {error}
          </motion.p>
        )}
      </div>
    );
  }
);

CyberInput.displayName = 'CyberInput';

export default CyberInput;
