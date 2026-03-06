/**
 * Input 组件 - 表单输入框
 */

'use client';

import { forwardRef, InputHTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'default' | 'filled' | 'outlined';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      variant = 'default',
      className,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    const variants = {
      default: 'bg-cyber-dark/50 border border-cyber-border/50 focus:border-cyber-cyan/50',
      filled: 'bg-cyber-dark/80 border-b-2 border-cyber-border/50 focus:border-cyber-cyan rounded-none',
      outlined: 'bg-transparent border-2 border-cyber-border/50 focus:border-cyber-cyan',
    };

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              {leftIcon}
            </div>
          )}
          <motion.input
            id={inputId}
            ref={ref}
            whileFocus={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'w-full px-4 py-2 rounded-lg text-gray-100 placeholder-gray-500',
              'transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-cyber-cyan/20',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold',
              'file:bg-cyber-cyan/10 file:text-cyber-cyan hover:file:bg-cyber-cyan/20',
              variants[variant],
              error && 'border-cyber-pink/50 focus:border-cyber-pink focus:ring-cyber-pink/20',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
              {rightIcon}
            </div>
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
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
