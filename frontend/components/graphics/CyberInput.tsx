'use client';

import React, { InputHTMLAttributes, forwardRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface CyberInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  neonBorder?: boolean;
  glowFocus?: boolean;
}

export const CyberInput = forwardRef<HTMLInputElement, CyberInputProps>(
  (
    {
      className,
      type = 'text',
      label,
      error,
      icon,
      neonBorder = true,
      glowFocus = true,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    const inputStyles = cn(
      'w-full px-4 py-3 bg-white/5 border-2 rounded-lg',
      'text-white placeholder:text-white/40',
      'transition-all duration-300',
      'focus:outline-none',
      error
        ? 'border-cyber-pink/50 focus:border-cyber-pink'
        : neonBorder
        ? 'border-white/20 focus:border-cyber-cyan/50'
        : 'border-white/20',
      glowFocus && !error && 'focus:shadow-[0_0_20px_rgba(0,240,255,0.3)]',
      error && 'focus:shadow-[0_0_20px_rgba(255,0,128,0.3)]',
      className
    );

    return (
      <div className="relative">
        {label && (
          <label className="block mb-2 text-sm font-medium text-white/80">
            {label}
          </label>
        )}

        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60">
              {icon}
            </div>
          )}

          <motion.input
            ref={ref}
            type={type}
            className={cn(inputStyles, icon && 'pl-10')}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            animate={
              isFocused
                ? { scale: 1.01, borderColor: error ? 'rgba(255, 0, 128, 0.5)' : 'rgba(0, 240, 255, 0.5)' }
                : { scale: 1, borderColor: 'rgba(255, 255, 255, 0.2)' }
            }
            transition={{ duration: 0.2 }}
            {...props}
          />

          {isFocused && !error && (
            <motion.div
              className="absolute inset-0 rounded-lg pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                boxShadow: '0 0 20px rgba(0, 240, 255, 0.3)',
              }}
            />
          )}
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1 text-sm text-cyber-pink"
          >
            {error}
          </motion.p>
        )}
      </div>
    );
  }
);

CyberInput.displayName = 'CyberInput';
