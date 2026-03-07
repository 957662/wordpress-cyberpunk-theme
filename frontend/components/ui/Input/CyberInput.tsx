'use client';

import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface CyberInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'glow' | 'underline';
}

export const CyberInput = forwardRef<HTMLInputElement, CyberInputProps>(
  (
    {
      label,
      error,
      helperText,
      icon,
      variant = 'default',
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'w-full px-4 py-2 bg-deep-black/80 border rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-200';
    
    const variantStyles = {
      default: 'border-cyber-cyan/30 focus:border-cyber-cyan focus:ring-cyber-cyan/50',
      glow: 'border-cyber-cyan/50 shadow-[0_0_10px_rgba(0,240,255,0.2)] focus:shadow-[0_0_20px_rgba(0,240,255,0.4)] focus:border-cyber-cyan focus:ring-cyber-cyan/50',
      underline: 'border-0 border-b-2 border-cyber-cyan/30 rounded-none focus:border-cyber-cyan focus:ring-0 px-0',
    };
    
    const errorStyles = error
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50'
      : '';

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            {label}
          </label>
        )}
        
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              {icon}
            </div>
          )}
          
          <motion.input
            ref={ref}
            className={cn(
              baseStyles,
              variantStyles[variant],
              errorStyles,
              icon && 'pl-10',
              disabled && 'opacity-50 cursor-not-allowed',
              className
            )}
            disabled={disabled}
            whileFocus={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
            {...props}
          />
        </div>
        
        {(error || helperText) && (
          <div className="mt-1.5">
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-500"
              >
                {error}
              </motion.p>
            )}
            {!error && helperText && (
              <p className="text-sm text-gray-500">{helperText}</p>
            )}
          </div>
        )}
      </div>
    );
  }
);

CyberInput.displayName = 'CyberInput';

export default CyberInput;
